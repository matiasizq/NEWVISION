/**
 * Visual Shift — ES / EN
 * Persistencia: localStorage key "vs-lang"
 */
(function () {
  const STORAGE_KEY = "vs-lang";

  const dict = {
    es: {
      "meta.title.index": "Visual Shift | Agencia de Edición de Video",
      "meta.desc.index":
        "Visual Shift — Agencia de editores de video liderada por ClashiVFX. Reels, YouTube, VSL y más.",
      "meta.title.cortos": "Videos Cortos | Visual Shift",
      "meta.desc.cortos":
        "Reels y videos verticales editados por Visual Shift. Estilo profesional para redes sociales.",
      "meta.title.largos": "Videos Largos | Visual Shift",
      "meta.desc.largos":
        "Videos horizontales, YouTube, VSL y decks editados por Visual Shift.",
      "meta.title.contacto": "Contacto | Visual Shift",
      "meta.desc.contacto":
        "Contactá a Visual Shift por WhatsApp. Agencia de edición de video liderada por ClashiVFX.",

      "nav.home": "Inicio",
      "nav.shorts": "Videos cortos",
      "nav.shortsShort": "Cortos",
      "nav.longs": "Videos largos",
      "nav.longsShort": "Largos",
      "nav.products": "Productos",
      "nav.contact": "Contacto",
      "nav.menu": "Abrir menú",
      "nav.lang": "Idioma",
      "nav.lang.es": "Español",
      "nav.lang.en": "English",

      "hero.badge": "Agencia audiovisual",
      "hero.lead":
        'Agencia de <strong>editores de video</strong> liderada por <strong>ClashiVFX</strong>. Los <strong>mejores editores</strong>, sin complicarte la postproducción.',
      "hero.cta": "Iniciar proyecto",
      "hero.work": "Ver trabajos",
      "hero.scroll": "Seguir scrolleando",
      "hero.who": "Quiénes somos",
      "hero.whoLine": "Agencia de editores para",
      "hero.fast": "Entregas rápidas",
      "hero.cine": "Resultados de cine",
      "hero.led": "Liderado por",

      "exp.eyebrow": "Experiencia",
      "exp.line1": "Años llevando el contenido",
      "exp.line2": "al siguiente nivel.",
      "exp.views": "Vistas generadas",
      "exp.years": "5 años",
      "exp.yearsLabel": "De experiencia",
      "exp.brands": "Marcas satisfechas",
      "exp.videos": "Videos realizados",
      "exp.editors": "Editores a disposición",

      "process.eyebrow": "Cómo lo hacemos",
      "process.line1": "Un sistema ágil pensado para",
      "process.line2": "creadores exigentes.",
      "process.sequence": "Secuencia de trabajo",
      "process.clip.edit": "Montaje",
      "process.clip.cine": "Cinematográfico",
      "process.clip.color": "Colorización",
      "process.clip.audio": "Audio · SFX",
      "process.styles": "Estos son los estilos que manejamos",
      "process.pill.edit": "Montaje",
      "process.pill.cine": "Cinematográfico",
      "process.pill.color": "Colorización",
      "process.pill.vlogs": "Vlogs",
      "process.pill.multicam": "Multi cámara",
      "process.pill.doc": "Documental",
      "process.pill.volume": "Volumen",
      "process.pill.thumbs": "Miniaturas",
      "process.pill.events": "Eventos",
      "process.pill.captions": "Subtítulos",
      "process.project": "Proyecto",

      "folder.1.title": "01 · Envíanos el material",
      "folder.1.sub": "Dropbox · Drive · WeTransfer",
      "folder.2.title": "02 · Asignación de editores",
      "folder.2.sub": "Match por estilo y carga",
      "folder.3.title": "03 · Edición",
      "folder.3.sub": "Premiere · AE · DaVinci",
      "folder.4.title": "04 · Feedback",
      "folder.4.sub": "Revisiones claras y rápidas",
      "folder.5.title": "05 · Entrega",
      "folder.5.sub": "Archivos listos para publicar",

      "step.1.title": "Envíanos el material",
      "step.1.copy":
        "Subí tus clips por Drive, Dropbox o WeTransfer. Nosotros organizamos todo y arrancamos sin fricción.",
      "step.2.title": "Asignación de editores",
      "step.2.copy":
        "Matcheamos tu proyecto con editores según estilo, formato y carga de trabajo para maximizar calidad.",
      "step.3.title": "Edición",
      "step.3.copy":
        "Montaje, color, motion y audio con herramientas pro. Ritmo de plataforma y look cinematográfico.",
      "step.4.title": "Feedback",
      "step.4.copy":
        "Comentarios claros, revisiones ágiles y versiones ordenadas. Sin idas y vueltas eternas.",
      "step.5.title": "Entrega",
      "step.5.copy":
        "Exportes listos para publicar en cada red, con naming limpio y archivos master si los necesitás.",
      "step.4.chip1": "Revisión",
      "step.4.chip2": "Notas",
      "step.4.chip3": "Ajustes",
      "step.5.chip1": "Export",
      "step.5.chip2": "Master",
      "step.5.chip3": "Publicar",

      "test.eyebrow": "Testimonios",
      "test.line1": "Lo que dicen",
      "test.line2": "nuestros clientes.",
      "video.play": "Reproducir",
      "video.pause": "Pausar",
      "video.mute": "Silenciar audio",
      "video.unmute": "Activar audio",
      "video.volume": "Volumen",

      "cta.eyebrow": "Contacto",
      "cta.line1": "Tu proyecto,",
      "cta.line2": "en manos",
      "cta.line3": "profesionales.",
      "cta.f1": "Respuesta en menos de 24h",
      "cta.f2": "Editores especializados",
      "cta.f3": "Cotizaciones a medida",
      "cta.btn": "Contactar Ahora",

      "footer.social": "Redes sociales",
      "lightbox.close": "Cerrar",

      "port.eyebrow": "Portfolio",
      "port.shorts.title": "Videos cortos",
      "port.shorts.lead":
        "Reels y contenido vertical pensado para captar atención en segundos.",
      "port.longs.title": "Videos largos",
      "port.longs.lead":
        "YouTube, VSL y contenido horizontal con narrativa y ritmo profesional.",
      "label.clinic": "Clínica",
      "label.realty": "Inmobiliaria",
      "label.ad": "Publicitario",
      "label.travel": "Viajes",
      "label.docPodcast": "Documental · Podcast",

      "contact.eyebrow": "WhatsApp",
      "contact.lead":
        "Escribinos y empecemos a crear algo cinematográfico juntos.",
      "contact.btn": "Hablá con nosotros",
    },

    en: {
      "meta.title.index": "Visual Shift | Video Editing Agency",
      "meta.desc.index":
        "Visual Shift — Video editing agency led by ClashiVFX. Reels, YouTube, VSL and more.",
      "meta.title.cortos": "Short Videos | Visual Shift",
      "meta.desc.cortos":
        "Reels and vertical videos edited by Visual Shift. Pro style for social media.",
      "meta.title.largos": "Long-form Videos | Visual Shift",
      "meta.desc.largos":
        "Horizontal videos, YouTube, VSL and decks edited by Visual Shift.",
      "meta.title.contacto": "Contact | Visual Shift",
      "meta.desc.contacto":
        "Reach Visual Shift on WhatsApp. Video editing agency led by ClashiVFX.",

      "nav.home": "Home",
      "nav.shorts": "Short videos",
      "nav.shortsShort": "Shorts",
      "nav.longs": "Long videos",
      "nav.longsShort": "Long",
      "nav.products": "Products",
      "nav.contact": "Contact",
      "nav.menu": "Open menu",
      "nav.lang": "Language",
      "nav.lang.es": "Español",
      "nav.lang.en": "English",

      "hero.badge": "Audiovisual agency",
      "hero.lead":
        'Video <strong>editing agency</strong> led by <strong>ClashiVFX</strong>. The <strong>best editors</strong>, without the post-production hassle.',
      "hero.cta": "Start a project",
      "hero.work": "View work",
      "hero.scroll": "Keep scrolling",
      "hero.who": "Who we are",
      "hero.whoLine": "Editors agency for",
      "hero.fast": "Fast delivery",
      "hero.cine": "Cinematic results",
      "hero.led": "Led by",

      "exp.eyebrow": "Experience",
      "exp.line1": "Years taking content",
      "exp.line2": "to the next level.",
      "exp.views": "Views generated",
      "exp.years": "5 years",
      "exp.yearsLabel": "Of experience",
      "exp.brands": "Happy brands",
      "exp.videos": "Videos delivered",
      "exp.editors": "Editors available",

      "process.eyebrow": "How we work",
      "process.line1": "An agile system built for",
      "process.line2": "demanding creators.",
      "process.sequence": "Work sequence",
      "process.clip.edit": "Assembly",
      "process.clip.cine": "Cinematic",
      "process.clip.color": "Color grade",
      "process.clip.audio": "Audio · SFX",
      "process.styles": "These are the styles we handle",
      "process.pill.edit": "Assembly",
      "process.pill.cine": "Cinematic",
      "process.pill.color": "Color grade",
      "process.pill.vlogs": "Vlogs",
      "process.pill.multicam": "Multi-cam",
      "process.pill.doc": "Documentary",
      "process.pill.volume": "Volume",
      "process.pill.thumbs": "Thumbnails",
      "process.pill.events": "Events",
      "process.pill.captions": "Captions",
      "process.project": "Project",

      "folder.1.title": "01 · Send us the footage",
      "folder.1.sub": "Dropbox · Drive · WeTransfer",
      "folder.2.title": "02 · Editor matching",
      "folder.2.sub": "Match by style and workload",
      "folder.3.title": "03 · Editing",
      "folder.3.sub": "Premiere · AE · DaVinci",
      "folder.4.title": "04 · Feedback",
      "folder.4.sub": "Clear, fast revisions",
      "folder.5.title": "05 · Delivery",
      "folder.5.sub": "Files ready to publish",

      "step.1.title": "Send us the footage",
      "step.1.copy":
        "Upload your clips via Drive, Dropbox or WeTransfer. We organize everything and get started with zero friction.",
      "step.2.title": "Editor matching",
      "step.2.copy":
        "We match your project with editors by style, format and workload to maximize quality.",
      "step.3.title": "Editing",
      "step.3.copy":
        "Cut, color, motion and audio with pro tools. Platform pacing and a cinematic look.",
      "step.4.title": "Feedback",
      "step.4.copy":
        "Clear notes, fast revisions and tidy versions. No endless back-and-forth.",
      "step.5.title": "Delivery",
      "step.5.copy":
        "Exports ready to post on every platform, clean naming and master files if you need them.",
      "step.4.chip1": "Review",
      "step.4.chip2": "Notes",
      "step.4.chip3": "Tweaks",
      "step.5.chip1": "Export",
      "step.5.chip2": "Master",
      "step.5.chip3": "Publish",

      "test.eyebrow": "Testimonials",
      "test.line1": "What our",
      "test.line2": "clients say.",
      "video.play": "Play",
      "video.pause": "Pause",
      "video.mute": "Mute audio",
      "video.unmute": "Unmute audio",
      "video.volume": "Volume",

      "cta.eyebrow": "Contact",
      "cta.line1": "Your project,",
      "cta.line2": "in professional",
      "cta.line3": "hands.",
      "cta.f1": "Reply within 24h",
      "cta.f2": "Specialized editors",
      "cta.f3": "Custom quotes",
      "cta.btn": "Contact Now",

      "footer.social": "Social networks",
      "lightbox.close": "Close",

      "port.eyebrow": "Portfolio",
      "port.shorts.title": "Short videos",
      "port.shorts.lead":
        "Reels and vertical content built to grab attention in seconds.",
      "port.longs.title": "Long-form videos",
      "port.longs.lead":
        "YouTube, VSL and horizontal content with pro narrative and pacing.",
      "label.clinic": "Clinic",
      "label.realty": "Real Estate",
      "label.ad": "Commercial",
      "label.travel": "Travel",
      "label.docPodcast": "Documentary · Podcast",

      "contact.eyebrow": "WhatsApp",
      "contact.lead":
        "Message us and let's create something cinematic together.",
      "contact.btn": "Talk to us",
    },
  };

  function getLang() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "en" || saved === "es") return saved;
    return "es";
  }

  function t(key, lang) {
    const L = lang || getLang();
    return (dict[L] && dict[L][key]) || (dict.es && dict.es[key]) || "";
  }

  function applyMeta(lang) {
    const page = document.body?.dataset?.page || "index";
    const map = {
      index: "index",
      cortos: "cortos",
      largos: "largos",
      contacto: "contacto",
    };
    const id = map[page] || "index";
    const title = t(`meta.title.${id}`, lang);
    const desc = t(`meta.desc.${id}`, lang);
    if (title) document.title = title;
    const meta = document.querySelector('meta[name="description"]');
    if (meta && desc) meta.setAttribute("content", desc);
    document.documentElement.lang = lang;
  }

  function applyDom(lang) {
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      const val = t(key, lang);
      if (val) el.textContent = val;
    });

    document.querySelectorAll("[data-i18n-html]").forEach((el) => {
      const key = el.getAttribute("data-i18n-html");
      const val = t(key, lang);
      if (val) el.innerHTML = val;
    });

    document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
      const key = el.getAttribute("data-i18n-aria");
      const val = t(key, lang);
      if (val) el.setAttribute("aria-label", val);
    });

    document.querySelectorAll(".nav__lang-btn").forEach((btn) => {
      const active = btn.dataset.lang === lang;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-pressed", active ? "true" : "false");
    });
  }

  function setLang(lang) {
    if (lang !== "es" && lang !== "en") return;
    localStorage.setItem(STORAGE_KEY, lang);
    applyMeta(lang);
    applyDom(lang);
    window.dispatchEvent(new CustomEvent("vs:lang", { detail: { lang } }));
  }

  function initSwitcher() {
    document.querySelectorAll(".nav__lang-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const lang = btn.dataset.lang;
        if (lang) setLang(lang);
      });
    });
  }

  window.VisualShiftI18n = {
    t,
    getLang,
    setLang,
    apply: () => {
      const lang = getLang();
      applyMeta(lang);
      applyDom(lang);
    },
    dict,
  };

  document.addEventListener("DOMContentLoaded", () => {
    initSwitcher();
    window.VisualShiftI18n.apply();
  });
})();
