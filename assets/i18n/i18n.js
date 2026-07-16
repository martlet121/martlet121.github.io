/*
 * i18n engine for the V2Ray help site.
 * Strategy: inline JS dictionaries keyed by the EXACT original Chinese text
 * of a text node. On switching to a non-default language we walk every text
 * node (skipping <script>/<style>/<code>/<pre>/<input>/<textarea>) and, when
 * its normalized text matches a dictionary key, replace it with the
 * translated value. Switching back to Chinese restores the original text.
 * No extra page files are created.
 */
(function () {
  "use strict";

  var STORAGE_KEY = "site-lang";
  var DEFAULT_LANG = "zh";
  // Per-language dictionary descriptor: { label, src, win }
  var LANGS = {
    ko: { label: "조선어", src: "assets/i18n/ko.js", win: "I18N_KO" },
    ru: { label: "Русский", src: "assets/i18n/ru.js", win: "I18N_RU" },
    fa: { label: "فارسی", src: "assets/i18n/fa.js", win: "I18N_FA" },
    tk: { label: "Türkmençe", src: "assets/i18n/tk.js", win: "I18N_TK" },
    en: { label: "English", src: "assets/i18n/en.js", win: "I18N_EN" }
  };
  var originals = new Map(); // text node -> original Chinese string
  var originalTitle = null;
  var dicts = {}; // lang -> dictionary object

  function getLang() {
    try {
      return localStorage.getItem(STORAGE_KEY) || "zh";
    } catch (e) {
      return "zh";
    }
  }

  function setLang(lang) {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {}
    apply(lang);
  }

  function isTranslatable(node) {
    var el = node.parentElement;
    if (!el) return false;
    var tag = el.tagName;
    if (tag === "SCRIPT" || tag === "STYLE" || tag === "CODE" ||
        tag === "PRE" || tag === "TEXTAREA" || tag === "INPUT" ||
        tag === "NOSCRIPT" || tag === "OPTION") {
      return false;
    }
    // Skip anything nested inside code / pre / script / style.
    var anc = el;
    while (anc) {
      var t = anc.tagName;
      if (t === "CODE" || t === "PRE" || t === "SCRIPT" || t === "STYLE" || t === "NOSCRIPT") {
        return false;
      }
      anc = anc.parentElement;
    }
    return true;
  }

  // Normalize a text node so dictionary keys are insensitive to HTML
  // formatting (whitespace runs) and stray zero-width characters.
  function norm(s) {
    return s
      .replace(/[​\u200b\u200e\u200f\uFEFF]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  // Build a lookup map keyed by the normalized form of each dictionary key,
  // so that internal/leading/trailing whitespace in the source key never
  // prevents a match with a normalized text node.
  function normalizeDict(raw) {
    var m = {};
    Object.keys(raw || {}).forEach(function (k) {
      m[norm(k)] = raw[k];
    });
    return m;
  }

  function apply(lang) {
    // 1) Always restore every recorded node to its original Chinese text
    //    first. This makes ko <-> ru <-> zh switching correct, because the
    //    working text of a node may already be a translation when we switch.
    originals.forEach(function (text, node) {
      if (node && node.nodeValue !== undefined) node.nodeValue = text;
    });
    if (originalTitle !== null) document.title = originalTitle;

    if (lang === DEFAULT_LANG) {
      document.documentElement.setAttribute("lang", "zh");
      return;
    }

    var d = dicts[lang] || {};
    if (Object.keys(d).length === 0) {
      document.documentElement.setAttribute("lang", lang);
      return;
    }

    if (originalTitle === null) originalTitle = document.title;

    var walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );
    var node;
    while ((node = walker.nextNode())) {
      if (!isTranslatable(node)) continue;
      var text = node.nodeValue;
      var key = norm(text);
      if (key === "") continue;
      if (d[key] !== undefined) {
        if (!originals.has(node)) originals.set(node, text);
        node.nodeValue = d[key];
      }
    }

    if (originalTitle !== null) {
      var tKey = norm(originalTitle);
      if (d[tKey] !== undefined) document.title = d[tKey];
    }
    document.documentElement.setAttribute("lang", lang);
  }

  function injectSwitcher() {
    var nav = document.querySelector(".md-header__inner");
    if (!nav || document.getElementById("i18n-lang")) return;

    var GLOBE =
      '<svg viewBox="0 0 24 24" class="i18n-lang__icon" aria-hidden="true">' +
      '<path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm6.93 6h-2.95a15.7 15.7 0 0 0-1.38-3.56A8 8 0 0 1 18.93 8zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14a7.96 7.96 0 0 1 0-4h3.38a16.6 16.6 0 0 0 0 4H4.26zm.82 2h2.95c.42 1.27 1.03 2.46 1.79 3.48A8 8 0 0 1 5.08 16zm2.95-8H5.08a8 8 0 0 1 4.75-3.48A11.6 11.6 0 0 0 8.03 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82A11.6 11.6 0 0 1 12 19.96zM14.34 14H9.66a14.8 14.8 0 0 1 0-4h4.68a14.8 14.8 0 0 1 0 4zm.25 5.34c.76-1.02 1.37-2.2 1.79-3.48h2.95a8 8 0 0 1-4.74 3.48zm1.41-9.87c.4-1.43 1.02-2.62 1.79-3.47A8 8 0 0 0 16 8z"/>' +
      "</svg>";
    var CHEVRON =
      '<svg viewBox="0 0 24 24" class="i18n-lang__chevron" aria-hidden="true">' +
      '<path d="M7 10l5 5 5-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    var CHECK =
      '<svg viewBox="0 0 24 24" class="i18n-lang__check" aria-hidden="true">' +
      '<path d="M5 12l5 5 9-10" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';

    var wrap = document.createElement("div");
    wrap.className = "i18n-lang";
    wrap.id = "i18n-lang";
    wrap.innerHTML =
      '<button type="button" class="i18n-lang__toggle" id="i18n-lang-toggle" ' +
      'aria-haspopup="listbox" aria-expanded="false" aria-label="언어 선택" title="언어 선택 / 选择语言">' +
      GLOBE +
      '<span class="i18n-lang__current"></span>' +
      CHEVRON +
      "</button>" +
      '<ul class="i18n-lang__menu" id="i18n-lang-menu" role="listbox" aria-label="언어 선택">' +
      '<li class="i18n-lang__item" role="option" data-lang="zh" aria-selected="true"><span>简体中文</span>' + CHECK + "</li>" +
      '<li class="i18n-lang__item" role="option" data-lang="ko" aria-selected="false"><span>조선어</span>' + CHECK + "</li>" +
      '<li class="i18n-lang__item" role="option" data-lang="ru" aria-selected="false"><span>Русский</span>' + CHECK + "</li>" +
      '<li class="i18n-lang__item" role="option" data-lang="fa" aria-selected="false"><span>فارسی</span>' + CHECK + "</li>" +
      '<li class="i18n-lang__item" role="option" data-lang="tk" aria-selected="false"><span>Türkmençe</span>' + CHECK + "</li>" +
      '<li class="i18n-lang__item" role="option" data-lang="en" aria-selected="false"><span>English</span>' + CHECK + "</li>" +
      "</ul>";

    nav.appendChild(wrap);

    var toggle = wrap.querySelector("#i18n-lang-toggle");
    var menu = wrap.querySelector("#i18n-lang-menu");
    var items = menu.querySelectorAll(".i18n-lang__item");
    var current = wrap.querySelector(".i18n-lang__current");

    function langLabel(l) {
      if (l === "ko") return "조선어";
      if (l === "ru") return "Русский";
      if (l === "fa") return "فارسی";
      if (l === "tk") return "Türkmençe";
      if (l === "en") return "English";
      return "简体中文";
    }
    function sync(lang) {
      items.forEach(function (it) {
        var sel = it.getAttribute("data-lang") === lang;
        it.setAttribute("aria-selected", sel ? "true" : "false");
      });
      current.textContent = langLabel(lang);
    }
    function open() {
      wrap.classList.add("is-open");
      toggle.setAttribute("aria-expanded", "true");
    }
    function close() {
      wrap.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    }
    function toggleMenu() {
      if (wrap.classList.contains("is-open")) close();
      else open();
    }

    toggle.addEventListener("click", function (e) {
      e.stopPropagation();
      toggleMenu();
    });
    items.forEach(function (it) {
      it.addEventListener("click", function (e) {
        e.stopPropagation();
        var lang = it.getAttribute("data-lang");
        sync(lang);
        setLang(lang);
        close();
      });
    });
    document.addEventListener("click", function () {
      if (wrap.classList.contains("is-open")) close();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") close();
    });

    sync(getLang());
  }

  function injectStyle() {
    if (document.getElementById("i18n-lang-style")) return;
    var css =
      /* container — pushed to the far right of the header inner; anchor for the popup */
      ".i18n-lang{position:relative;display:flex;align-items:center;margin-left:auto;padding-left:.4rem}" +
      /* the pill/button that wraps the globe + current label + chevron */
      ".i18n-lang__toggle{display:inline-flex;align-items:center;gap:.3rem;height:2.4rem;padding:0 .7rem;border:0;border-radius:.4rem;background:transparent;color:var(--md-primary-bg-color,#fff);font:inherit;font-size:.72rem;font-weight:600;letter-spacing:.01em;cursor:pointer;transition:background-color .2s ease, box-shadow .2s ease}" +
      ".i18n-lang__toggle:hover{background:rgba(127,127,127,.2);background:color-mix(in srgb, var(--md-primary-bg-color,#fff) 14%, transparent)}" +
      ".i18n-lang__toggle:focus-visible{outline:none;box-shadow:0 0 0 .1rem color-mix(in srgb, var(--md-primary-bg-color,#fff) 45%, transparent) inset}" +
      ".i18n-lang.is-open .i18n-lang__toggle{background:color-mix(in srgb, var(--md-primary-bg-color,#fff) 18%, transparent)}" +
      ".i18n-lang__icon{width:1.1rem;height:1.1rem;fill:currentColor;flex:0 0 auto;opacity:.92}" +
      ".i18n-lang__current{white-space:nowrap}" +
      /* custom dropdown arrow */
      ".i18n-lang__chevron{width:.9rem;height:.9rem;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;opacity:.85;flex:0 0 auto;transition:transform .2s ease}" +
      ".i18n-lang.is-open .i18n-lang__chevron{transform:rotate(180deg)}" +
      /* the open popup menu — a Material card */
      ".i18n-lang__menu{position:absolute;top:calc(100% + .4rem);right:0;z-index:1000;margin:0;padding:.25rem;list-style:none;min-width:8.5rem;" +
      "background:var(--md-default-bg-color,#fff);color:var(--md-default-fg-color,#000);" +
      "border-radius:.4rem;box-shadow:0 .2rem .5rem rgba(0,0,0,.18),0 0 0 .05rem rgba(0,0,0,.06);" +
      "opacity:0;visibility:hidden;transform:translateY(-.35rem);transition:opacity .18s ease,transform .18s ease,visibility .18s}" +
      ".i18n-lang.is-open .i18n-lang__menu{opacity:1;visibility:visible;transform:translateY(0)}" +
      ".i18n-lang__item{display:flex;align-items:center;justify-content:space-between;gap:.75rem;padding:.5rem .6rem;border-radius:.3rem;cursor:pointer;font-size:.82rem;line-height:1;transition:background-color .15s ease}" +
      ".i18n-lang__item:hover{background:rgba(127,127,127,.14);background:color-mix(in srgb, var(--md-primary-fg-color) 12%, transparent)}" +
      ".i18n-lang__item[aria-selected=true]{color:var(--md-primary-fg-color);font-weight:700}" +
      ".i18n-lang__check{width:1.05rem;height:1.05rem;fill:none;stroke:currentColor;stroke-width:2.4;stroke-linecap:round;stroke-linejoin:round;opacity:0;transition:opacity .15s ease}" +
      ".i18n-lang__item[aria-selected=true] .i18n-lang__check{opacity:1}" +
      "@media screen and (max-width:600px){.i18n-lang__icon{display:none}.i18n-lang__toggle{padding:0 .55rem}}";
    var style = document.createElement("style");
    style.id = "i18n-lang-style";
    style.textContent = css;
    document.head.appendChild(style);
  }

  function loadDicts(cb) {
    var pending = [];
    Object.keys(LANGS).forEach(function (l) {
      if (window[LANGS[l].win]) {
        dicts[l] = normalizeDict(window[LANGS[l].win]);
      } else {
        pending.push(l);
      }
    });
    if (pending.length === 0) {
      cb();
      return;
    }
    var remaining = pending.length;
    function done(l) {
      dicts[l] = normalizeDict(window[LANGS[l].win]);
      remaining--;
      if (remaining === 0) cb();
    }
    pending.forEach(function (l) {
      var s = document.createElement("script");
      s.src = LANGS[l].src;
      s.onload = function () { done(l); };
      s.onerror = function () { done(l); };
      document.head.appendChild(s);
    });
  }

  function init() {
    injectStyle();
    injectSwitcher();
    loadDicts(function () {
      var lang = getLang();
      if (lang !== DEFAULT_LANG) apply(lang);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
