function i18n(key, fallback) {
  return window.VisualShiftI18n?.t?.(key) || fallback;
}

document.addEventListener("DOMContentLoaded", () => {
  initNav();
  initReveal();
  initLightbox();
  initAutoplay();
  initSoundPlay();
  initGalleryPlayback();
  initGalleryAudio();
  initCounter();
  initTimeline();
  initProjectFolders();
});

function initNav() {
  const nav = document.querySelector(".nav");
  const navInner = document.querySelector(".nav__inner");
  const toggle = document.querySelector(".nav__toggle");
  const primary = document.querySelector(".nav__primary");
  const page = document.body.dataset.page;

  document.querySelectorAll(".nav__links a").forEach((link) => {
    if (link.dataset.page === page) link.classList.add("is-active");
  });

  const onScroll = () => {
    if (!nav) return;
    nav.classList.toggle("is-scrolled", window.scrollY > 20);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const setMenuOpen = (open) => {
    if (!navInner || !toggle) return;
    navInner.classList.toggle("is-menu-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    document.body.classList.toggle("nav-menu-open", open);
  };

  if (toggle && navInner) {
    toggle.addEventListener("click", (e) => {
      e.stopPropagation();
      setMenuOpen(!navInner.classList.contains("is-menu-open"));
    });
  }

  primary?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setMenuOpen(false));
  });

  document.addEventListener("click", (e) => {
    if (!navInner?.classList.contains("is-menu-open")) return;
    if (navInner.contains(e.target)) return;
    setMenuOpen(false);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setMenuOpen(false);
  });
}

function initReveal() {
  const els = [...document.querySelectorAll(".reveal")];
  if (!els.length) return;

  const galleryItems = els.filter((el) => el.classList.contains("gallery-item"));
  const otherEls = els.filter((el) => !el.classList.contains("gallery-item"));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;

        if (el.classList.contains("gallery-item")) {
          const col = Number(el.dataset.col || 0);
          el.style.transitionDelay = `${col * 0.15}s`;
          el.classList.add("is-visible");
          // Playback is owned by initGalleryPlayback (pause offscreen)
        } else {
          el.classList.add("is-visible");
          // Contact CTA: keep blur entrance, then unlock snappy hover
          if (el.classList.contains("contact-card__cta")) {
            const delayMs = el.classList.contains("reveal-delay-2") ? 320 : 0;
            window.setTimeout(() => el.classList.add("is-settled"), delayMs + 1350);
          }
        }

        observer.unobserve(el);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  const title = document.querySelector('[data-reveal="title"]');
  const lead = document.querySelector('[data-reveal="lead"]');

  otherEls.forEach((el) => {
    if (title && (el === title || el === lead)) return;
    observer.observe(el);
  });

  const startGallery = () => {
    galleryItems.forEach((el) => observer.observe(el));
  };

  if (title) {
    const titleObserver = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        title.classList.add("is-visible");
        titleObserver.disconnect();

        if (lead) {
          window.setTimeout(() => lead.classList.add("is-visible"), 240);
        }

        window.setTimeout(startGallery, 520);
      },
      { threshold: 0.15 }
    );
    titleObserver.observe(title);
  } else {
    if (lead) observer.observe(lead);
    startGallery();
  }
}

function initLightbox() {
  const lightbox = document.querySelector(".lightbox");
  if (!lightbox) return;

  const lbVideo = lightbox.querySelector("video");
  const closeBtn = lightbox.querySelector(".lightbox__close");
  if (lbVideo) {
    lbVideo.controls = false;
    lbVideo.setAttribute("controlsList", "nodownload noplaybackrate noremoteplayback");
    lbVideo.setAttribute("disablePictureInPicture", "");
    window.VisualShiftGuard?.lock?.(lbVideo);
  }

  document.querySelectorAll('[data-lightbox="true"]').forEach((card) => {
    card.addEventListener("click", async () => {
      const media = card.querySelector("video");
      if (!media) return;
      if (window.VisualShiftGuard?.load) {
        await window.VisualShiftGuard.load(media);
      }
      const src = media.currentSrc || media.src;
      if (!src) return;
      lbVideo.removeAttribute("src");
      lbVideo.querySelectorAll("source").forEach((s) => s.remove());
      lbVideo.src = src;
      lbVideo.controls = false;
      window.VisualShiftGuard?.lock?.(lbVideo);
      lbVideo.load();
      lbVideo.play().catch(() => {});
      lightbox.classList.add("is-open");
      document.body.style.overflow = "hidden";
    });
  });

  function close() {
    lightbox.classList.remove("is-open");
    lbVideo.pause();
    document.body.style.overflow = "";
  }

  closeBtn?.addEventListener("click", close);
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) close();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });
}

function initAutoplay() {
  const videos = document.querySelectorAll("video[autoplay]");

  const playMuted = (video) => {
    video.muted = true;
    video.defaultMuted = true;
    video.volume = 0;
    video.loop = true;
    video.playsInline = true;
    video.setAttribute("playsinline", "");
    video.setAttribute("muted", "");
    const play = () => video.play().catch(() => {});
    play();
    video.addEventListener("canplay", play, { once: true });
  };

  videos.forEach(playMuted);

  document.addEventListener(
    "visibilitychange",
    () => {
      if (!document.hidden) videos.forEach((video) => video.play().catch(() => {}));
    }
  );
}

function initSoundPlay() {
  const cards = [...document.querySelectorAll('[data-play="sound"]')];
  if (!cards.length) return;

  const ICON_PLAY = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z" fill="currentColor"/></svg>`;
  const ICON_PAUSE = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5h3.5v14H7V5zm6.5 0H17v14h-3.5V5z" fill="currentColor"/></svg>`;
  const ICON_MUTED = `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H3v6h3l5 4V5z"/><path d="m16 9 5 5M21 9l-5 5"/></svg>`;
  const ICON_ON = `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H3v6h3l5 4V5z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M18.5 5.5a9 9 0 0 1 0 13"/></svg>`;
  const DEFAULT_VOLUME = 0.85;

  const setOverlayIcon = (card, playing) => {
    const playIcon = card.querySelector(".video-card__play");
    const overlay = card.querySelector(".video-card__overlay");
    if (playIcon) playIcon.innerHTML = playing ? ICON_PAUSE : ICON_PLAY;
    if (overlay) {
      const key = playing ? "video.pause" : "video.play";
      const label = window.VisualShiftI18n?.t?.(key) || (playing ? "Pausar" : "Reproducir");
      overlay.setAttribute("aria-label", label);
      overlay.setAttribute("data-i18n-aria", key);
    }
  };

  const pauseCard = (card) => {
    const video = card.querySelector("video");
    if (video) video.pause();
    card.classList.remove("is-playing");
    setOverlayIcon(card, false);
  };

  const playCard = async (card) => {
    cards.forEach((other) => {
      if (other !== card) pauseCard(other);
    });

    const video = card.querySelector("video");
    const volume = card.querySelector(".video-audio__volume");
    const muteBtn = card.querySelector(".video-audio__toggle");
    if (!video) return;

    if (window.VisualShiftGuard?.load) {
      await window.VisualShiftGuard.load(video);
    }

    video.controls = false;
    video.removeAttribute("controls");
    const vol = volume ? Number(volume.value) : DEFAULT_VOLUME;
    video.volume = Number.isFinite(vol) && vol > 0 ? vol : DEFAULT_VOLUME;
    video.muted = false;
    video.defaultMuted = false;
    video.removeAttribute("muted");
    card.classList.add("is-playing");
    card.classList.add("is-audible");
    setOverlayIcon(card, true);

    if (muteBtn) {
      muteBtn.innerHTML = ICON_ON;
      muteBtn.setAttribute("aria-pressed", "true");
      muteBtn.setAttribute("aria-label", i18n("video.mute", "Silenciar audio"));
      muteBtn.setAttribute("data-i18n-aria", "video.mute");
    }
    if (volume) volume.disabled = false;

    video.play().catch(() => pauseCard(card));
  };

  cards.forEach((card) => {
    const video = card.querySelector("video");
    const overlay = card.querySelector(".video-card__overlay");
    if (!video) return;

    video.controls = false;
    video.removeAttribute("controls");
    video.setAttribute("playsinline", "");
    video.muted = true;
    video.defaultMuted = true;
    video.volume = DEFAULT_VOLUME;
    video.pause();
    card.classList.remove("is-playing");

    card.querySelector(".t-seek")?.remove();

    let audio = card.querySelector(".video-audio");
    if (!audio) {
      audio = document.createElement("div");
      audio.className = "video-audio";
      audio.innerHTML = `
        <button type="button" class="video-audio__toggle" aria-pressed="false" data-i18n-aria="video.unmute" aria-label="${i18n("video.unmute", "Activar audio")}">
          ${ICON_MUTED}
        </button>
        <input type="range" class="video-audio__volume" min="0" max="1" step="0.01" value="${DEFAULT_VOLUME}" disabled data-i18n-aria="video.volume" aria-label="${i18n("video.volume", "Volumen")}">
      `;
      card.appendChild(audio);
    }

    const muteBtn = audio.querySelector(".video-audio__toggle");
    const volume = audio.querySelector(".video-audio__volume");

    setOverlayIcon(card, false);

    overlay?.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (card.classList.contains("is-playing") && !video.paused) {
        pauseCard(card);
      } else {
        playCard(card);
      }
    });

    muteBtn.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (video.muted || video.volume <= 0.001) {
        video.muted = false;
        video.volume = Number(volume.value) || DEFAULT_VOLUME;
        muteBtn.innerHTML = ICON_ON;
        muteBtn.setAttribute("aria-pressed", "true");
        muteBtn.setAttribute("aria-label", i18n("video.mute", "Silenciar audio"));
        muteBtn.setAttribute("data-i18n-aria", "video.mute");
        volume.disabled = false;
        card.classList.add("is-audible");
      } else {
        video.muted = true;
        muteBtn.innerHTML = ICON_MUTED;
        muteBtn.setAttribute("aria-pressed", "false");
        muteBtn.setAttribute("aria-label", i18n("video.unmute", "Activar audio"));
        muteBtn.setAttribute("data-i18n-aria", "video.unmute");
        volume.disabled = true;
        card.classList.remove("is-audible");
      }
    });
    muteBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
    });

    volume.addEventListener("input", () => {
      const vol = Number(volume.value);
      video.volume = vol;
      if (vol <= 0.001) {
        video.muted = true;
        muteBtn.innerHTML = ICON_MUTED;
        muteBtn.setAttribute("aria-pressed", "false");
        card.classList.remove("is-audible");
      } else {
        video.muted = false;
        muteBtn.innerHTML = ICON_ON;
        muteBtn.setAttribute("aria-pressed", "true");
        card.classList.add("is-audible");
      }
    });

    video.addEventListener("ended", () => {
      pauseCard(card);
      video.currentTime = 0;
    });

    audio.addEventListener("click", (e) => e.stopPropagation());
    audio.addEventListener("pointerdown", (e) => e.stopPropagation());
  });
}

/**
 * Gallery performance: play the N videos closest to viewport center.
 * Older rows release slots as soon as a newer row is more centered.
 */
function initGalleryPlayback() {
  const items = [...document.querySelectorAll(".video-gallery .gallery-item")];
  if (!items.length) return;

  const isVertical = !!document.querySelector(".video-gallery--vertical");
  const mq = window.matchMedia("(min-width: 900px)");
  // Cortos (vertical): 3 desktop / 4 mobile. Largos (horizontal): siempre 2 centrados.
  const getMax = () =>
    isVertical ? (mq.matches ? 3 : 4) : 2;

  const ratios = new Map();
  const playing = new Set();
  const loading = new Set();

  const scoreItem = (item) => {
    const ratio = ratios.get(item) || 0;
    if (ratio <= 0) return -Infinity;
    const rect = item.getBoundingClientRect();
    const vh = window.innerHeight || 1;
    const mid = rect.top + rect.height / 2;
    const dist = Math.abs(mid - vh / 2) / vh;
    // Prefer more visible + closer to screen center
    return ratio * 3 - dist;
  };

  const pauseItem = (item) => {
    const video = item.querySelector("video");
    if (video) video.pause();
    playing.delete(item);
  };

  const playItem = async (item) => {
    if (playing.has(item) || loading.has(item)) return;
    const video = item.querySelector("video");
    const card = item.querySelector(".video-card");
    if (!video) return;

    loading.add(item);
    try {
      if (window.VisualShiftGuard?.load) {
        await window.VisualShiftGuard.load(video, { autoplay: false, stream: true });
      }
      // Bail if this item lost the race while loading
      if ((ratios.get(item) || 0) <= 0.02) return;

      if (card?.classList.contains("is-audible")) {
        await video.play().catch(() => {});
      } else {
        video.muted = true;
        video.defaultMuted = true;
        video.setAttribute("muted", "");
        await video.play().catch(() => {});
      }
      playing.add(item);
    } finally {
      loading.delete(item);
    }
  };

  const sync = () => {
    if (document.hidden) {
      [...playing].forEach(pauseItem);
      return;
    }

    const max = getMax();
    const ranked = items
      .filter((item) => (ratios.get(item) || 0) > 0.02)
      .sort((a, b) => scoreItem(b) - scoreItem(a));

    const winners = new Set(ranked.slice(0, max));

    for (const item of [...playing]) {
      if (!winners.has(item)) pauseItem(item);
    }
    for (const item of winners) {
      if (!playing.has(item)) playItem(item);
    }
  };

  let syncTimer = 0;
  const scheduleSync = () => {
    window.clearTimeout(syncTimer);
    syncTimer = window.setTimeout(sync, 50);
  };

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        ratios.set(entry.target, entry.isIntersecting ? entry.intersectionRatio : 0);
      });
      scheduleSync();
    },
    {
      // Fine-grained ratios so half-visible rows still score and win slots
      threshold: [0, 0.05, 0.1, 0.2, 0.35, 0.5, 0.65, 0.8, 1],
      rootMargin: "120px 0px 120px 0px",
    }
  );

  items.forEach((item) => {
    const video = item.querySelector("video");
    if (video) {
      video.muted = true;
      video.defaultMuted = true;
      video.setAttribute("muted", "");
      video.playsInline = true;
      video.preload = "none";
    }
    ratios.set(item, 0);
    io.observe(item);
  });

  window.addEventListener("scroll", scheduleSync, { passive: true });
  window.addEventListener("resize", scheduleSync);

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      [...playing].forEach(pauseItem);
    } else {
      sync();
    }
  });
}

function initGalleryAudio() {
  const cards = [...document.querySelectorAll(".video-gallery .video-card--live")];
  if (!cards.length) return;

  const DEFAULT_VOLUME = 0.75;
  const ICON_MUTED = `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H3v6h3l5 4V5z"/><path d="m16 9 5 5M21 9l-5 5"/></svg>`;
  const ICON_ON = `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H3v6h3l5 4V5z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M18.5 5.5a9 9 0 0 1 0 13"/></svg>`;

  const applyAudibleUi = (card, on) => {
    const toggle = card.querySelector(".video-audio__toggle");
    const slider = card.querySelector(".video-audio__volume");

    if (on) {
      card.classList.add("is-audible");
      if (toggle) {
        toggle.innerHTML = ICON_ON;
        toggle.setAttribute("aria-pressed", "true");
        toggle.setAttribute("aria-label", i18n("video.mute", "Silenciar audio"));
        toggle.setAttribute("data-i18n-aria", "video.mute");
      }
      if (slider) slider.disabled = false;
    } else {
      card.classList.remove("is-audible");
      if (toggle) {
        toggle.innerHTML = ICON_MUTED;
        toggle.setAttribute("aria-pressed", "false");
        toggle.setAttribute("aria-label", i18n("video.unmute", "Activar audio"));
        toggle.setAttribute("data-i18n-aria", "video.unmute");
      }
      if (slider) slider.disabled = true;
    }
  };

  const muteCard = (card) => {
    const video = card.querySelector("video");
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;
    video.setAttribute("muted", "");
    applyAudibleUi(card, false);
  };

  const unmuteCard = (card) => {
    cards.forEach((other) => {
      if (other !== card) muteCard(other);
    });

    const video = card.querySelector("video");
    const slider = card.querySelector(".video-audio__volume");
    if (!video) return;

    const vol = slider ? Number(slider.value) : DEFAULT_VOLUME;
    const safeVol = Number.isFinite(vol) && vol > 0 ? vol : DEFAULT_VOLUME;
    if (slider && (!Number.isFinite(vol) || vol <= 0)) slider.value = String(safeVol);

    video.volume = safeVol;
    video.defaultMuted = false;
    video.muted = false;
    video.removeAttribute("muted");
    applyAudibleUi(card, true);

    const keepUnmuted = () => {
      video.muted = false;
      video.defaultMuted = false;
      video.removeAttribute("muted");
      video.volume = safeVol;
    };

    keepUnmuted();

    const playPromise = video.play();
    if (playPromise && typeof playPromise.then === "function") {
      playPromise
        .then(keepUnmuted)
        .catch(() => {
          keepUnmuted();
          video.play().then(keepUnmuted).catch(() => {});
        });
    }
  };

  cards.forEach((card) => {
    const video = card.querySelector("video");
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;
    video.volume = DEFAULT_VOLUME;
    video.setAttribute("muted", "");

    let bar = card.querySelector(".video-audio");
    if (!bar) {
      bar = document.createElement("div");
      bar.className = "video-audio";
      bar.innerHTML = `
        <button type="button" class="video-audio__toggle" aria-pressed="false" data-i18n-aria="video.unmute" aria-label="${i18n("video.unmute", "Activar audio")}">
          ${ICON_MUTED}
        </button>
        <input
          type="range"
          class="video-audio__volume"
          min="0"
          max="1"
          step="0.01"
          value="${DEFAULT_VOLUME}"
          disabled
          data-i18n-aria="video.volume"
          aria-label="${i18n("video.volume", "Volumen")}"
        >
      `;
      card.appendChild(bar);
    }

    const toggle = bar.querySelector(".video-audio__toggle");
    const slider = bar.querySelector(".video-audio__volume");

    bar.addEventListener("click", (e) => e.stopPropagation());
    bar.addEventListener("pointerdown", (e) => e.stopPropagation());

    const onToggle = (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (card.classList.contains("is-audible")) {
        muteCard(card);
      } else {
        unmuteCard(card);
      }
    };

    toggle.addEventListener("pointerdown", onToggle);
    toggle.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
    });

    slider.addEventListener("input", () => {
      const vol = Number(slider.value);
      video.volume = vol;
      if (vol <= 0.001) {
        muteCard(card);
        return;
      }
      if (!card.classList.contains("is-audible")) {
        unmuteCard(card);
      } else {
        video.muted = false;
        video.defaultMuted = false;
        video.removeAttribute("muted");
      }
    });
  });
}

function initCounter() {
  const section = document.querySelector(".apple-block");
  const root = document.querySelector(".flip-counter[data-counter]");
  if (!root) return;

  const target = Number(root.dataset.counter);
  if (!Number.isFinite(target)) return;

  const formatter = new Intl.NumberFormat("es-AR");
  const easeOutQuint = (t) => 1 - Math.pow(1 - t, 5);
  let current = 0;
  let slots = [];

  const formatValue = (value) => formatter.format(Math.max(0, Math.floor(value)));

  const makeDigit = (char) => {
    const isSep = char === "." || char === "," || char === " ";
    const el = document.createElement("div");
    el.className = isSep ? "flip-digit flip-digit--sep" : "flip-digit";

    if (isSep) {
      el.innerHTML = `<span class="flip-digit__static">${char}</span>`;
      return el;
    }

    el.innerHTML = `
      <div class="flip-digit__card flip-digit__card--top"><span>${char}</span></div>
      <div class="flip-digit__card flip-digit__card--bottom"><span>${char}</span></div>
      <div class="flip-digit__hinge"></div>
      <div class="flip-digit__flap" aria-hidden="true">
        <div class="flip-digit__flap-face"><span>${char}</span></div>
      </div>
    `;
    el.dataset.char = char;
    return el;
  };

  const rebuild = (value) => {
    const text = formatValue(value);
    root.innerHTML = "";
    slots = [];
    [...text].forEach((char) => {
      const digit = makeDigit(char);
      root.appendChild(digit);
      slots.push({ el: digit, char });
    });
    root.setAttribute("aria-label", `${i18n("exp.views", "Vistas generadas")}: ${text}`);
  };

  const setDigitChar = (digit, char, animate) => {
    if (digit.classList.contains("flip-digit--sep")) {
      const staticEl = digit.querySelector(".flip-digit__static");
      if (staticEl) staticEl.textContent = char;
      digit.dataset.char = char;
      return;
    }

    const prev = digit.dataset.char || "0";
    if (prev === char) return;

    const tops = digit.querySelectorAll(".flip-digit__card span");
    const flap = digit.querySelector(".flip-digit__flap");
    const flapSpan = digit.querySelector(".flip-digit__flap-face span");

    if (animate && flap && flapSpan && prev !== char) {
      flapSpan.textContent = prev;
      tops.forEach((span) => {
        span.textContent = char;
      });
      digit.dataset.char = char;
      digit.classList.remove("is-flipping");
      void digit.offsetWidth;
      digit.classList.add("is-flipping");
      window.setTimeout(() => {
        digit.classList.remove("is-flipping");
      }, 580);
    } else {
      tops.forEach((span) => {
        span.textContent = char;
      });
      digit.dataset.char = char;
    }
  };

  const render = (value, animate) => {
    const text = formatValue(value);
    const chars = [...text];

    if (chars.length !== slots.length) {
      rebuild(value);
      return;
    }

    chars.forEach((char, i) => {
      const slot = slots[i];
      if (!slot) return;
      if (slot.char === char) return;
      setDigitChar(slot.el, char, animate);
      slot.char = char;
    });

    root.setAttribute("aria-label", `${i18n("exp.views", "Vistas generadas")}: ${text}`);
  };

  const runClimb = () => {
    rebuild(0);
    const duration = 8200;
    const start = performance.now();
    let lastPaint = 0;

    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const next = Math.round(easeOutQuint(t) * target);

      // Slower cadence; flip only near the end so arrival feels soft
      const interval = t > 0.82 ? 140 : 110;
      const shouldFlip = t > 0.78;

      if (now - lastPaint >= interval || t === 1) {
        current = next;
        render(current, shouldFlip);
        lastPaint = now;
      }

      if (t < 1) {
        requestAnimationFrame(tick);
      } else {
        current = target;
        render(current, true);
        startSlowClimb();
      }
    };

    requestAnimationFrame(tick);
  };

  const startSlowClimb = () => {
    const step = () => {
      current += Math.floor(1 + Math.random() * 4);
      render(current, true);
      const delay = 850 + Math.random() * 1200;
      window.setTimeout(step, delay);
    };
    window.setTimeout(step, 900);
  };

  const io = new IntersectionObserver(
    (entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      io.disconnect();
      window.setTimeout(runClimb, 280);
    },
    { threshold: 0.25 }
  );

  rebuild(0);
  io.observe(section || root);
}

function initTimeline() {
  const root = document.getElementById("edit-timeline");
  if (!root) return;

  const playhead = document.getElementById("timeline-playhead");
  const timecode = document.getElementById("timeline-timecode");
  const clips = [...root.querySelectorAll("[data-clip]")];
  let active = null;
  let startX = 0;
  let startLeft = 0;

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

  const formatTimecode = (ratio) => {
    const totalFrames = Math.round(ratio * 30 * 30);
    const frames = totalFrames % 30;
    const totalSeconds = Math.floor(totalFrames / 30);
    const seconds = totalSeconds % 60;
    const minutes = Math.floor(totalSeconds / 60) % 60;
    const hours = Math.floor(totalSeconds / 3600);
    const pad = (n) => String(n).padStart(2, "0");
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}:${pad(frames)}`;
  };

  const updatePlayheadFromClip = (clip) => {
    if (!playhead || !timecode) return;
    const lane = clip.parentElement;
    if (!lane) return;
    const left = parseFloat(clip.style.left) || 0;
    const width = parseFloat(clip.style.width) || 0;
    const center = left + width / 2;
    playhead.style.left = `${center}%`;
    timecode.textContent = formatTimecode(center / 100);
  };

  clips.forEach((clip) => {
    clip.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      clips.forEach((c) => c.classList.remove("is-selected"));
      clip.classList.add("is-selected", "is-dragging");
      active = clip;
      startX = event.clientX;
      startLeft = parseFloat(clip.style.left) || 0;
      clip.setPointerCapture(event.pointerId);
      updatePlayheadFromClip(clip);
    });

    clip.addEventListener("pointermove", (event) => {
      if (active !== clip) return;
      const lane = clip.parentElement;
      if (!lane) return;
      const laneWidth = lane.getBoundingClientRect().width || 1;
      const deltaPct = ((event.clientX - startX) / laneWidth) * 100;
      const width = parseFloat(clip.style.width) || 20;
      const nextLeft = clamp(startLeft + deltaPct, 0, 100 - width);
      clip.style.left = `${nextLeft}%`;
      updatePlayheadFromClip(clip);
    });

    const endDrag = (event) => {
      if (active !== clip) return;
      clip.classList.remove("is-dragging");
      try {
        clip.releasePointerCapture(event.pointerId);
      } catch (_) {
        /* ignore */
      }
      active = null;
    };

    clip.addEventListener("pointerup", endDrag);
    clip.addEventListener("pointercancel", endDrag);
  });
}

function initProjectFolders() {
  const buttons = [...document.querySelectorAll("[data-folder]")];
  const card = document.getElementById("step-card");
  if (!buttons.length || !card) return;

  const getSteps = () => ({
    1: {
      badge: "01",
      title: i18n("step.1.title", "Envíanos el material"),
      copy: i18n(
        "step.1.copy",
        "Subí tus clips por Drive, Dropbox o WeTransfer. Nosotros organizamos todo y arrancamos sin fricción."
      ),
      chips: ["Drive", "Dropbox", "WeTransfer"],
    },
    2: {
      badge: "02",
      title: i18n("step.2.title", "Asignación de editores"),
      copy: i18n(
        "step.2.copy",
        "Matcheamos tu proyecto con editores según estilo, formato y carga de trabajo para maximizar calidad."
      ),
      chips: ["Reels", "YouTube", "VSL"],
    },
    3: {
      badge: "03",
      title: i18n("step.3.title", "Edición"),
      copy: i18n(
        "step.3.copy",
        "Montaje, color, motion y audio con herramientas pro. Ritmo de plataforma y look cinematográfico."
      ),
      chips: ["Premiere", "After Effects", "DaVinci"],
    },
    4: {
      badge: "04",
      title: i18n("step.4.title", "Feedback"),
      copy: i18n(
        "step.4.copy",
        "Comentarios claros, revisiones ágiles y versiones ordenadas. Sin idas y vueltas eternas."
      ),
      chips: [
        i18n("step.4.chip1", "Revisión"),
        i18n("step.4.chip2", "Notas"),
        i18n("step.4.chip3", "Ajustes"),
      ],
    },
    5: {
      badge: "05",
      title: i18n("step.5.title", "Entrega"),
      copy: i18n(
        "step.5.copy",
        "Exportes listos para publicar en cada red, con naming limpio y archivos master si los necesitás."
      ),
      chips: [
        i18n("step.5.chip1", "Export"),
        i18n("step.5.chip2", "Master"),
        i18n("step.5.chip3", "Publicar"),
      ],
    },
  });

  const renderStep = (id) => {
    const step = getSteps()[id];
    if (!step) return;
    card.dataset.active = id;
    card.querySelector(".step-card__badge").textContent = step.badge;
    const titleEl = card.querySelector(".step-card__title");
    const copyEl = card.querySelector(".step-card__copy");
    if (titleEl) {
      titleEl.textContent = step.title;
      titleEl.setAttribute("data-i18n", `step.${id}.title`);
    }
    if (copyEl) {
      copyEl.textContent = step.copy;
      copyEl.setAttribute("data-i18n", `step.${id}.copy`);
    }
    const visual = card.querySelector(".step-visual");
    if (!visual) return;
    visual.innerHTML = `<span class="step-visual__glow"></span>${step.chips
      .map((chip) => `<span class="step-visual__chip">${chip}</span>`)
      .join("")}`;
  };

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.dataset.folder;
      buttons.forEach((b) => {
        const open = b === button;
        b.classList.toggle("is-open", open);
        b.setAttribute("aria-expanded", open ? "true" : "false");
      });
      renderStep(id);
    });
  });

  window.addEventListener("vs:lang", () => {
    renderStep(card.dataset.active || "1");
  });
}
