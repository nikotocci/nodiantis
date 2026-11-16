/* Nodiantis · animaciones (GSAP + ScrollTrigger + SplitText) y scroll suave (Lenis)
   Si las librerías no cargan o la persona prefiere menos movimiento, la web
   funciona igual con las animaciones básicas de script.js. */
(function () {
  "use strict";

  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !window.gsap || !window.ScrollTrigger) return;

  var gsap = window.gsap;
  var root = document.documentElement;
  gsap.registerPlugin(window.ScrollTrigger);
  if (window.SplitText) gsap.registerPlugin(window.SplitText);
  root.classList.add("motion");

  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var EASE = "power3.out";

  /* ---------- Scroll suave (Lenis) ---------- */
  var lenis = null;
  if (window.Lenis) {
    lenis = new window.Lenis({ duration: 1.1, smoothWheel: true });
    lenis.on("scroll", window.ScrollTrigger.update);
    gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);

    // Enlaces internos: desplazamiento suave descontando el header fijo.
    document.addEventListener("click", function (e) {
      var link = e.target.closest('a[href^="#"]');
      if (!link) return;
      var id = link.getAttribute("href");
      if (id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      var header = document.querySelector(".site-header");
      var offset = header ? -(header.offsetHeight + 12) : 0;
      lenis.scrollTo(target, { offset: offset });
      if (history.replaceState) history.replaceState(null, "", id);
      if (target.tabIndex < 0 && !/^(A|BUTTON|INPUT|SELECT|TEXTAREA)$/.test(target.tagName)) {
        target.setAttribute("tabindex", "-1");
      }
      target.focus({ preventScroll: true });
    });
  }

  /* ---------- Las animaciones de GSAP reemplazan a las de CSS ---------- */
  document.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("is-visible"); });

  /* ---------- Hero: entrada orquestada ---------- */
  var hero = document.querySelector(".hero");
  if (hero) {
    var title = hero.querySelector("h1");
    var heroParts = hero.querySelectorAll(".eyebrow, h1, .lead, .btn-row, .hero-note, .mk, .mk-badge");
    gsap.set(heroParts, { autoAlpha: 0 });

    var playHero = function () {
      if (playHero.done) return;
      playHero.done = true;
      gsap.set(heroParts, { autoAlpha: 1 });
      var words = null;
      if (title && window.SplitText) {
        words = window.SplitText.create(title, { type: "words", wordsClass: "split-word" }).words;
      }
      var tl = gsap.timeline({ defaults: { ease: EASE } });
      tl.from(hero.querySelector(".eyebrow"), { autoAlpha: 0, y: 12, duration: 0.6 });
      if (words) {
        tl.from(words, { autoAlpha: 0, yPercent: 60, filter: "blur(10px)", duration: 0.9, stagger: 0.05 }, "-=0.3");
      } else if (title) {
        tl.from(title, { autoAlpha: 0, y: 20, duration: 0.8 }, "-=0.3");
      }
      tl.from(hero.querySelectorAll(".lead, .btn-row, .hero-note"), { autoAlpha: 0, y: 18, duration: 0.7, stagger: 0.1 }, "-=0.55")
        .from(hero.querySelector(".mk-guide"), { autoAlpha: 0, y: 50, rotation: -14, duration: 1 }, 0.35)
        .from(hero.querySelector(".mk-template"), { autoAlpha: 0, y: 50, rotation: 14, duration: 1 }, 0.5)
        .from(hero.querySelector(".mk-prompt"), { autoAlpha: 0, y: 40, duration: 0.9 }, 0.7)
        .from(hero.querySelector(".mk-badge"), { autoAlpha: 0, y: 10, duration: 0.6 }, 1.05);
    };
    // Espera a las tipografías (máximo 800 ms) para dividir el título con sus medidas reales.
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(playHero);
      setTimeout(playHero, 800);
    } else {
      playHero();
    }

    // Parallax suave del mockup y de las líneas de fondo al hacer scroll.
    var st = { trigger: hero, start: "top top", end: "bottom top", scrub: 0.6 };
    gsap.to(hero.querySelector(".mockup"), { yPercent: -8, ease: "none", scrollTrigger: st });
    gsap.to(hero.querySelector(".hero-lines"), { yPercent: 12, ease: "none", scrollTrigger: st });
  }

  /* ---------- Revelado de secciones al hacer scroll ---------- */
  function revealOnScroll(targets, vars, trigger) {
    var list = gsap.utils.toArray(targets);
    if (!list.length) return;
    gsap.from(list, Object.assign({
      onStart: function () { list.forEach(function (el) { el.style.transition = "none"; }); },
      onComplete: function () { list.forEach(function (el) { el.style.transition = ""; }); },
      autoAlpha: 0,
      clearProps: "transform",
      y: 28,
      duration: 0.8,
      ease: EASE,
      stagger: 0.09,
      scrollTrigger: { trigger: trigger || list[0], start: "top 86%", once: true }
    }, vars || {}));
  }

  document.querySelectorAll("main .section-head").forEach(function (head) {
    revealOnScroll(head.children, { y: 20 }, head);
  });
  revealOnScroll(".cards-3 .card", { y: 36 }, ".cards-3");
  revealOnScroll(".areas-title, .areas-list li, .prompt-index", null, ".areas");
  revealOnScroll(".gallery .shot", { x: 60, y: 0, stagger: 0.07 }, ".gallery-scroller");
  revealOnScroll(".samples", null, ".samples");
  revealOnScroll(".steps .step", { y: 30, stagger: 0.12 }, ".steps");
  revealOnScroll(".about", { y: 24 }, ".about");
  revealOnScroll(".faq details", { y: 14, stagger: 0.05 }, ".faq");

  var closing = document.querySelector(".closing");
  if (closing) {
    gsap.timeline({ scrollTrigger: { trigger: closing, start: "top 80%", once: true }, defaults: { ease: EASE } })
      .from(closing, { autoAlpha: 0, y: 30, scale: 0.98, duration: 0.8 })
      .from(closing.querySelector(".price-amount"), { autoAlpha: 0, scale: 0.85, duration: 0.7 }, "-=0.35")
      .from(closing.querySelectorAll(".price-list li, .price-terms, .btn-row"), { autoAlpha: 0, y: 14, duration: 0.5, stagger: 0.07 }, "-=0.4");
  }

  // Al abrir o cerrar acordeones cambia la altura de la página.
  document.querySelectorAll("details").forEach(function (d) {
    d.addEventListener("toggle", function () { window.ScrollTrigger.refresh(); });
  });
  window.addEventListener("load", function () { window.ScrollTrigger.refresh(); });

  /* ---------- Tarjetas con luz que sigue al cursor ---------- */
  if (finePointer) {
    document.querySelectorAll(".card, .step, .prompt-card, .about").forEach(function (el) {
      el.classList.add("spotlight");
      el.addEventListener("pointermove", function (e) {
        var r = el.getBoundingClientRect();
        el.style.setProperty("--mx", (e.clientX - r.left) + "px");
        el.style.setProperty("--my", (e.clientY - r.top) + "px");
      });
    });

    /* ---------- Botones principales con leve efecto magnético ---------- */
    document.querySelectorAll(".hero .btn-primary, .closing .btn-primary").forEach(function (btn) {
      var xTo = gsap.quickTo(btn, "x", { duration: 0.4, ease: EASE });
      var yTo = gsap.quickTo(btn, "y", { duration: 0.4, ease: EASE });
      btn.addEventListener("pointermove", function (e) {
        var r = btn.getBoundingClientRect();
        xTo((e.clientX - (r.left + r.width / 2)) * 0.18);
        yTo((e.clientY - (r.top + r.height / 2)) * 0.25);
      });
      btn.addEventListener("pointerleave", function () { xTo(0); yTo(0); });
    });
  }
})();
