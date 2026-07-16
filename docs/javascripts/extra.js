// 让导航栏书籍图标（站点 logo）点击后跳转到 index.html
document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll("a.md-logo").forEach(function (a) {
    a.setAttribute("href", "index.html");
  });
});

// SEO / GEO：注入 Open Graph、Twitter Card 与结构化数据（WebSite + 每页 Article）。
// 说明：Material 9.7.6 不会自动渲染 config.extra_head，故在此用 JS 注入，
// 以覆盖会渲染 JS 的 AI 搜索引擎（GEO 目标）与浏览器。
// 静态已落地的信号：<link rel="canonical">、每页独立 meta description、
// sitemap.xml、robots.txt、llms.txt / llms-full.txt。
document.addEventListener("DOMContentLoaded", function () {
  var SITE = "https://martlet121.github.io/";
  var SITE_NAME = "V2Ray 帮助文档";
  var SITE_DESC = "V2Ray 代理软件完整中文帮助文档与配置教程。";

  // 渲染后的 DOM 语言标记（原始 HTML 为 zh，这里补全为 zh-CN 以利中文 GEO）
  document.documentElement.lang = "zh-CN";

  var pageUrl = location.href.split("#")[0];
  var metaDesc = document.querySelector('meta[name="description"]');
  var desc = (metaDesc && metaDesc.getAttribute("content")) || SITE_DESC;
  var title = document.title || SITE_NAME;

  function setProp(prop, content) {
    if (!content) return;
    var sel = 'meta[property="' + prop + '"]';
    var m = document.head.querySelector(sel);
    if (!m) {
      m = document.createElement("meta");
      m.setAttribute("property", prop);
      document.head.appendChild(m);
    }
    m.setAttribute("content", content);
  }

  function setName(name, content) {
    if (!content) return;
    var sel = 'meta[name="' + name + '"]';
    var m = document.head.querySelector(sel);
    if (!m) {
      m = document.createElement("meta");
      m.setAttribute("name", name);
      document.head.appendChild(m);
    }
    m.setAttribute("content", content);
  }

  function addJSONLD(obj) {
    var s = document.createElement("script");
    s.type = "application/ld+json";
    s.textContent = JSON.stringify(obj);
    document.head.appendChild(s);
  }

  // ---- 站点级 Open Graph / Twitter Card ----
  setProp("og:site_name", SITE_NAME);
  setProp("og:type", "website");
  setProp("og:locale", "zh_CN");
  setProp("og:image", SITE + "assets/images/favicon.png");
  setName("twitter:card", "summary_large_image");

  // ---- 每页动态 Open Graph / Twitter Card ----
  setProp("og:title", title);
  setProp("og:description", desc);
  setProp("og:url", pageUrl);
  setProp("og:type", "article");
  setName("twitter:title", title);
  setName("twitter:description", desc);

  // ---- 结构化数据：WebSite ----
  addJSONLD({
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": SITE_NAME,
    "url": SITE,
    "description": SITE_DESC,
    "inLanguage": "zh-CN"
  });

  // ---- 结构化数据：每页 Article ----
  addJSONLD({
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "description": desc,
    "inLanguage": "zh-CN",
    "mainEntityOfPage": { "@type": "WebPage", "@id": pageUrl },
    "publisher": { "@type": "Organization", "name": SITE_NAME, "url": SITE }
  });
});
