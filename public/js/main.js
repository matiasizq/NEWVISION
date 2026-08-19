document.addEventListener("DOMContentLoaded", () => {
  initNav();
  initReveal();
  initLightbox();
  initAutoplay();
  initSoundPlay();
  initCounter();
});

function initNav() {
  const nav = document.querySelector(".nav");
  const toggle = document.querySelector(".nav__toggle");
  const links = document.querySelector(".nav__links");
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

  if (toggle && links) {
    toggle.addEventListener("click", () => {
      links.classList.toggle("is-open");
    });
  }
}

function initReveal() {
  const els = document.querySelectorAll(".reveal");
  if (!els.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  els.forEach((el) => observer.observe(el));
}

function initLightbox() {
  const lightbox = document.querySelector(".lightbox");
  if (!lightbox) return;

  const lbVideo = lightbox.querySelector("video");
  const closeBtn = lightbox.querySelector(".lightbox__close");

  document.querySelectorAll('[data-lightbox="true"]').forEach((card) => {
    card.addEventListener("click", () => {
      const src =
        card.querySelector("video source")?.src ||
        card.querySelector("video")?.src;
      if (!src) return;
      lbVideo.innerHTML = `<source src="${src}" type="video/mp4">`;
      lbVideo.load();
      lbVideo.play();
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
  const cards = document.querySelectorAll('[data-play="sound"]');

  cards.forEach((card) => {
    const video = card.querySelector("video");
    const overlay = card.querySelector(".video-card__overlay");
    if (!video) return;

    const enableSound = () => {
      video.muted = false;
      video.defaultMuted = false;
      video.volume = 1;
      video.removeAttribute("muted");
      video.controls = true;
    };

    const playThis = () => {
      cards.forEach((other) => {
        if (other === card) return;
        const otherVideo = other.querySelector("video");
        if (!otherVideo) return;
        otherVideo.pause();
        other.classList.remove("is-playing");
      });

      enableSound();
      card.classList.add("is-playing");
      video.play().catch(() => {
        card.classList.remove("is-playing");
      });
    };

    overlay?.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      playThis();
    });

    video.addEventListener("play", () => {
      enableSound();
      card.classList.add("is-playing");
    });

    video.addEventListener("ended", () => {
      card.classList.remove("is-playing");
      video.currentTime = 0;
    });
  });
}

function initCounter() {
  const section = document.querySelector(".apple-block");
  const el = document.querySelector("[data-counter]");
  if (!el) return;

  const target = Number(el.dataset.counter);
  if (!Number.isFinite(target)) return;

  const mini = document.querySelector("[data-counter-mini]");
  const duration = 2500;
  const formatter = new Intl.NumberFormat("es-AR");
  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

  const render = (value) => {
    el.textContent = formatter.format(value);
    if (mini) {
      if (value >= 1_000_000_000) mini.textContent = "1B";
      else if (value >= 1_000_000) mini.textContent = `${Math.max(1, Math.round(value / 1_000_000))}M`;
      else mini.textContent = formatter.format(value);
    }
  };

  const run = () => {
    render(0);
    const start = performance.now();

    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      render(Math.round(easeOutCubic(t) * target));
      if (t < 1) requestAnimationFrame(tick);
      else render(target);
    };

    requestAnimationFrame(tick);
  };

  const io = new IntersectionObserver(
    (entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      io.disconnect();
      window.setTimeout(run, 180);
    },
    { threshold: 0.2 }
  );

  io.observe(section || el);
}
