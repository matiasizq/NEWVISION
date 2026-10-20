/**
 * Client-side media hardening for Visual Shift.
 * Note: no browser-only method can fully stop a determined user
 * (DevTools Network / screen capture). This layer blocks casual theft.
 */
(function () {
  const blobUrls = new WeakMap();
  const loading = new WeakSet();

  function lockVideoEl(video) {
    if (!video || video.dataset.guardLocked === "1") return;
    video.dataset.guardLocked = "1";

    video.setAttribute("controlsList", "nodownload noplaybackrate noremoteplayback");
    video.setAttribute("disablePictureInPicture", "");
    video.setAttribute("playsinline", "");
    video.disablePictureInPicture = true;
    video.controls = false;

    const block = (e) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    };

    video.addEventListener("contextmenu", block, true);
    video.addEventListener("dragstart", block, true);
    ["copy", "cut"].forEach((evt) => video.addEventListener(evt, block, true));
  }

  function resolveSrc(raw) {
    if (!raw) return "";
    if (raw.startsWith("assets/") || raw.startsWith("/") || raw.startsWith("http")) {
      return raw;
    }
    try {
      const decoded = atob(raw);
      if (decoded.startsWith("assets/") || decoded.startsWith("/")) return decoded;
    } catch (_) {}
    return raw;
  }

  async function materialize(video, opts = {}) {
    if (!video || loading.has(video)) return;
    const src = resolveSrc(video.dataset.guardSrc);
    if (!src) {
      lockVideoEl(video);
      return;
    }
    if (video.dataset.guardReady === "1") return;

    loading.add(video);
    const manual = video.closest('[data-play="sound"]');
    const galleryLive = video.closest(".video-gallery .video-card--live");
    // Gallery streams (lighter). Testimonials still use blob hardening.
    const useStream = !!galleryLive || opts.stream === true;

    try {
      video.querySelectorAll("source").forEach((s) => s.remove());
      video.removeAttribute("src");

      if (useStream) {
        video.src = src;
        video.preload = "metadata";
      } else {
        const res = await fetch(src, {
          credentials: "same-origin",
          cache: "force-cache",
          mode: "same-origin",
        });
        if (!res.ok) throw new Error("fetch failed");
        const blob = await res.blob();
        const prev = blobUrls.get(video);
        if (prev) URL.revokeObjectURL(prev);
        const url = URL.createObjectURL(blob);
        blobUrls.set(video, url);
        video.src = url;
      }

      video.load();
      video.dataset.guardReady = "1";
      video.removeAttribute("data-guard-src");
      lockVideoEl(video);

      // Gallery playback is owned by initGalleryPlayback — never autoplay here.
      // Testimonials stay paused until the user hits play.
      if (manual || galleryLive || opts.autoplay === false) {
        video.pause();
      } else if (
        video.hasAttribute("autoplay") ||
        video.dataset.autoplay === "1" ||
        video.hasAttribute("muted") ||
        video.loop
      ) {
        video.play().catch(() => {});
      }
    } catch (_) {
      // Fallback: set src via JS only (still not in static HTML)
      video.querySelectorAll("source").forEach((s) => s.remove());
      video.src = src;
      video.removeAttribute("data-guard-src");
      video.dataset.guardReady = "1";
      lockVideoEl(video);
      if (manual || galleryLive) video.pause();
    } finally {
      loading.delete(video);
    }
  }

  function observeVideos() {
    const videos = [...document.querySelectorAll("video[data-guard-src], video")];
    videos.forEach(lockVideoEl);

    const guarded = videos.filter((v) => v.dataset.guardSrc);
    if (!guarded.length) return;

    if (!("IntersectionObserver" in window)) {
      guarded.forEach((v) => materialize(v));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          materialize(entry.target);
          io.unobserve(entry.target);
        });
      },
      // Tighter preload window — less RAM / decode pressure while scrolling
      { rootMargin: "80px 0px", threshold: 0.01 }
    );

    guarded.forEach((v) => io.observe(v));
  }

  function installPageGuards() {
    const blockMediaMenu = (e) => {
      const t = e.target;
      if (!t) return;
      if (t.closest?.("video, .video-card, .testimonial-card, .gallery-item")) {
        e.preventDefault();
        return false;
      }
    };

    document.addEventListener("contextmenu", blockMediaMenu, true);
    document.addEventListener(
      "dragstart",
      (e) => {
        if (e.target?.closest?.("video, .video-card")) {
          e.preventDefault();
        }
      },
      true
    );

    document.addEventListener(
      "keydown",
      (e) => {
        const key = e.key?.toLowerCase?.() || "";
        const mod = e.ctrlKey || e.metaKey;
        if (!mod) return;
        // Block common save / open shortcuts while interacting with media
        if ((key === "s" || key === "u" || key === "p") && e.target?.closest?.("video, .video-card")) {
          e.preventDefault();
        }
      },
      true
    );

    // Kill PiP / remote playback attempts
    if (navigator.mediaSession) {
      try {
        navigator.mediaSession.setActionHandler?.("stop", () => {});
      } catch (_) {}
    }
  }

  window.VisualShiftGuard = {
    lock: lockVideoEl,
    load: materialize,
    refresh: observeVideos,
  };

  document.addEventListener("DOMContentLoaded", () => {
    installPageGuards();
    observeVideos();
  });
})();
