/* Nodiantis · comportamiento de la landing */
(function () {
  "use strict";

  var root = document.documentElement;
  root.classList.remove("no-js");
  root.classList.add("js");

  var CFG = window.NODIANTIS_CONFIG || {};
  var WA_NUMBER = String(CFG.WHATSAPP_NUMBER || "").replace(/\D/g, "");
  var BUY_MESSAGE = "Hola, me interesa el Pack IA para Inmobiliarias de Nodiantis";
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function trim(v) { return typeof v === "string" ? v.trim() : ""; }

  function waLink(message) {
    var base = "https://wa.me/" + WA_NUMBER;
    return message ? base + "?text=" + encodeURIComponent(message) : base;
  }

  /* ---------- Enlaces de compra y WhatsApp ---------- */
  var mpUrl = trim(CFG.MERCADOPAGO_URL);
  var buyHref = mpUrl || waLink(BUY_MESSAGE);

  document.querySelectorAll("[data-buy]").forEach(function (el) {
    el.setAttribute("href", buyHref);
    el.setAttribute("target", "_blank");
    el.setAttribute("rel", "noopener");
  });

  document.querySelectorAll("[data-whatsapp]").forEach(function (el) {
    el.setAttribute("href", waLink("Hola, quiero hacer una consulta sobre Nodiantis"));
  });

  /* ---------- SITE_URL: canonical y og:url ---------- */
  var siteUrl = trim(CFG.SITE_URL);
  if (siteUrl && !document.querySelector('link[rel="canonical"]')) {
    var canon = document.createElement("link");
    canon.rel = "canonical";
    canon.href = siteUrl;
    document.head.appendChild(canon);
    var ogUrl = document.createElement("meta");
    ogUrl.setAttribute("property", "og:url");
    ogUrl.content = siteUrl;
    document.head.appendChild(ogUrl);
  }

  /* ---------- Datos del responsable y contacto (páginas legales) ---------- */
  var titular = CFG.TITULAR || {};
  var email = trim(CFG.CONTACT_EMAIL);
  var cfgValues = {
    "titular.nombre": trim(titular.nombre),
    "titular.cuit": trim(titular.cuit),
    "titular.domicilio": trim(titular.domicilio),
    "email": email,
    "price": trim(CFG.PRICE),
    "priceNote": trim(CFG.PRICE_NOTE)
  };
  document.querySelectorAll("[data-cfg]").forEach(function (el) {
    var value = cfgValues[el.getAttribute("data-cfg")];
    var row = el.closest("[data-cfg-row]");
    if (value) {
      if (el.tagName === "A") el.href = "mailto:" + value;
      el.textContent = value;
      if (row) row.hidden = false;
    } else if (row) {
      row.hidden = true;
    }
  });
  document.querySelectorAll("[data-wa-text]").forEach(function (el) {
    el.textContent = "+" + WA_NUMBER;
  });
  document.querySelectorAll("[data-whatsapp-delete]").forEach(function (el) {
    el.setAttribute("href", waLink("Hola, solicito el acceso, la rectificación o la eliminación de mis datos personales en Nodiantis."));
  });

  /* ---------- Año del footer ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------- Menú móvil ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  var toggleLabel = toggle ? toggle.querySelector(".visually-hidden") : null;

  function setMenu(open) {
    if (!toggle || !nav) return;
    toggle.setAttribute("aria-expanded", String(open));
    nav.classList.toggle("is-open", open);
    if (toggleLabel) toggleLabel.textContent = open ? "Cerrar menú" : "Abrir menú";
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      setMenu(toggle.getAttribute("aria-expanded") !== "true");
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) setMenu(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        setMenu(false);
        toggle.focus();
      }
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth >= 960) setMenu(false);
    });
  }

  /* ---------- Redes sociales (solo las configuradas) ---------- */
  var SOCIAL_ICONS = {
    instagram: { label: "Instagram", svg: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".6" fill="currentColor"/>' },
    linkedin: { label: "LinkedIn", svg: '<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 10v7M8 7v.01M12 17v-4a2 2 0 0 1 4 0v4M12 10v7"/>' },
    tiktok: { label: "TikTok", svg: '<path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5"/><path d="M14 3c.4 2.6 2.1 4.2 5 4.5"/>' },
    youtube: { label: "YouTube", svg: '<rect x="2.5" y="5.5" width="19" height="13" rx="4"/><path d="M10.5 9.5l4 2.5-4 2.5z" fill="currentColor"/>' }
  };
  var socialList = document.getElementById("social");
  var social = CFG.SOCIAL || {};
  if (socialList) {
    Object.keys(SOCIAL_ICONS).forEach(function (key) {
      var url = trim(social[key]);
      if (!/^https?:\/\//i.test(url)) return;
      var info = SOCIAL_ICONS[key];
      var li = document.createElement("li");
      var a = document.createElement("a");
      a.href = url;
      a.target = "_blank";
      a.rel = "noopener";
      a.setAttribute("aria-label", "Nodiantis en " + info.label);
      a.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">' + info.svg + "</svg>";
      li.appendChild(a);
      socialList.appendChild(li);
    });
    if (socialList.children.length) socialList.hidden = false;
  }

  /* ---------- Aparición al hacer scroll ---------- */
  var reveals = document.querySelectorAll(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    reveals.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    reveals.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Barra fija de compra en móvil ---------- */
  var buyBar = document.getElementById("buy-bar");
  var hero = document.querySelector(".hero");
  if (buyBar && hero && "IntersectionObserver" in window) {
    var buyLink = buyBar.querySelector("a");
    new IntersectionObserver(function (entries) {
      var show = !entries[0].isIntersecting;
      buyBar.classList.toggle("is-visible", show);
      buyBar.setAttribute("aria-hidden", String(!show));
      if (buyLink) buyLink.tabIndex = show ? 0 : -1;
      document.body.classList.toggle("buybar-on", show);
    }, { threshold: 0 }).observe(hero);
  }

  /* ---------- Pestañas de muestras ---------- */
  var tabs = Array.prototype.slice.call(document.querySelectorAll('[role="tab"]'));
  function selectTab(tab, focus) {
    tabs.forEach(function (t) {
      var selected = t === tab;
      t.setAttribute("aria-selected", String(selected));
      t.tabIndex = selected ? 0 : -1;
      var panel = document.getElementById(t.getAttribute("aria-controls"));
      if (panel) panel.hidden = !selected;
    });
    if (focus) tab.focus();
  }
  if (tabs.length) {
    tabs.forEach(function (tab, i) {
      tab.addEventListener("click", function () { selectTab(tab, false); });
      tab.addEventListener("keydown", function (e) {
        var next = null;
        if (e.key === "ArrowRight") next = tabs[(i + 1) % tabs.length];
        else if (e.key === "ArrowLeft") next = tabs[(i - 1 + tabs.length) % tabs.length];
        else if (e.key === "Home") next = tabs[0];
        else if (e.key === "End") next = tabs[tabs.length - 1];
        if (next) { e.preventDefault(); selectTab(next, true); }
      });
    });
    selectTab(tabs[0], false);
  }

  /* ---------- Resaltar variables [entre corchetes] ---------- */
  document.querySelectorAll(".prompt-text").forEach(function (pre) {
    var text = pre.textContent;
    pre.textContent = "";
    var re = /\[[^\]]+\]/g;
    var last = 0, m;
    while ((m = re.exec(text)) !== null) {
      pre.appendChild(document.createTextNode(text.slice(last, m.index)));
      var span = document.createElement("span");
      span.className = "var";
      span.textContent = m[0];
      pre.appendChild(span);
      last = m.index + m[0].length;
    }
    pre.appendChild(document.createTextNode(text.slice(last)));
  });

  /* ---------- Copiar prompts ---------- */
  var copyStatus = document.querySelector(".copy-status");

  function fallbackCopy(text) {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.top = "-1000px";
    document.body.appendChild(ta);
    ta.select();
    var ok = false;
    try { ok = document.execCommand("copy"); } catch (err) { ok = false; }
    document.body.removeChild(ta);
    return ok ? Promise.resolve() : Promise.reject(new Error("copy failed"));
  }

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text).catch(function () { return fallbackCopy(text); });
    }
    return fallbackCopy(text);
  }

  document.querySelectorAll("[data-copy]").forEach(function (btn) {
    var label = btn.querySelector(".btn-copy-label");
    var timer;
    btn.addEventListener("click", function () {
      var source = document.getElementById(btn.getAttribute("data-copy"));
      if (!source) return;
      copyText(source.textContent.trim()).then(function () {
        btn.classList.add("is-copied");
        if (label) label.textContent = "Copiado";
        if (copyStatus) copyStatus.textContent = "Prompt copiado al portapapeles.";
      }, function () {
        if (label) label.textContent = "Selecciona y copia";
        if (copyStatus) copyStatus.textContent = "No se pudo copiar automáticamente. Selecciona el texto y cópialo.";
      }).then(function () {
        clearTimeout(timer);
        timer = setTimeout(function () {
          btn.classList.remove("is-copied");
          if (label) label.textContent = "Copiar";
          if (copyStatus) copyStatus.textContent = "";
        }, 2200);
      });
    });
  });
})();
