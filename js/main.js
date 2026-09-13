(function () {
  "use strict";
  document.documentElement.classList.add("js");

  var navToggle = document.getElementById("nav-toggle");
  var primaryNav = document.getElementById("primary-nav");
  function closeNav() {
    primaryNav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  }
  if (navToggle && primaryNav) {
    navToggle.addEventListener("click", function () {
      var open = primaryNav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(open));
    });
    primaryNav.addEventListener("click", function (event) {
      if (event.target.closest("a")) closeNav();
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && primaryNav.classList.contains("is-open")) {
        closeNav();
        navToggle.focus();
      }
    });
    document.addEventListener("click", function (event) {
      if (!event.target.closest(".site-header")) closeNav();
    });
  }

  var navLinks = Array.from(document.querySelectorAll(".primary-nav a"));
  var sections = navLinks.map(function (link) {
    return document.querySelector(link.getAttribute("href"));
  }).filter(Boolean);
  var scheduled = false;
  function updateCurrentSection() {
    var current = null;
    sections.forEach(function (section) {
      if (section.getBoundingClientRect().top <= 160) current = section.id;
    });
    navLinks.forEach(function (link) {
      if (link.hash === "#" + current) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
    scheduled = false;
  }
  window.addEventListener("scroll", function () {
    if (!scheduled) {
      scheduled = true;
      window.requestAnimationFrame(updateCurrentSection);
    }
  }, { passive: true });
  window.addEventListener("resize", updateCurrentSection);
  updateCurrentSection();

  // VSD-37/VSD-38: add approved Power BI embed and direct report URLs here.
  // A source may be a URL string, or { embedUrl: "...", reportUrl: "..." }.
  // Only URLs approved for public portfolio display belong in this public file.
  var EMBED_SOURCES = {};
  function reportUrl(value) {
    if (typeof value !== "string") return null;
    try {
      var url = new URL(value);
      return url.protocol === "https:" && url.hostname === "app.powerbi.com" &&
        !url.username && !url.password ? url.href : null;
    } catch (error) { return null; }
  }
  document.querySelectorAll(".embed-container").forEach(function (container) {
    var key = container.getAttribute("data-embed");
    var config = EMBED_SOURCES[key];
    var src = reportUrl(typeof config === "string" ? config : config && config.embedUrl);
    if (!src) return; // Keep the honest, static "not connected" state.
    var placeholder = container.querySelector(".embed-placeholder");
    var fallback = container.querySelector(".embed-fallback");
    var link = fallback.querySelector(".fallback-link");
    var toolbarStatus = container.previousElementSibling.querySelector(".report-availability");
    var directUrl = reportUrl(config && config.reportUrl) || src;
    link.href = directUrl;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.hidden = false;
    // A cross-origin iframe load cannot prove the report rendered successfully.
    // Keep the direct link available after load as well as on failure.
    fallback.hidden = false;
    fallback.querySelector(".status-badge").hidden = true;
    fallback.querySelector(".embed-fallback-text").textContent = "Having trouble viewing the report? Open it directly in Power BI.";
    placeholder.querySelector(".status-badge").textContent = "Loading report…";
    placeholder.querySelector("h3").textContent = "Opening the published report.";
    placeholder.querySelector("p").textContent = "If the report cannot be displayed here, use the direct Power BI link below.";
    container.classList.add("is-connected");
    container.setAttribute("aria-busy", "true");
    toolbarStatus.textContent = "Loading report";
    var iframe = document.createElement("iframe");
    iframe.title = document.getElementById(key + "-heading").textContent + " — Power BI report";
    iframe.setAttribute("allowfullscreen", "");
    var settled = false;
    function finish(failed) {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);
      placeholder.hidden = true;
      container.setAttribute("aria-busy", "false");
      toolbarStatus.textContent = failed ? "Open report in Power BI" : "Published report";
      if (failed) {
        iframe.hidden = true;
        container.classList.remove("is-connected");
        fallback.querySelector(".status-badge").hidden = false;
        fallback.querySelector(".embed-fallback-text").textContent = "This embedded report did not finish loading. Try opening it directly in Power BI.";
      }
    }
    var timeout = setTimeout(function () { finish(true); }, 20000);
    iframe.addEventListener("load", function () { finish(false); });
    iframe.addEventListener("error", function () { finish(true); });
    iframe.src = src;
    container.appendChild(iframe);
  });

  // VSD-20: fill with verified provider, classification, timing and freshness.
  // Never derive market-data freshness from the site's build/update date.
  var DATA_ATTRIBUTION = {};
  document.querySelectorAll(".data-attribution").forEach(function (dl) {
    var values = DATA_ATTRIBUTION[dl.getAttribute("data-attribution")];
    if (!values) return;
    dl.querySelectorAll("[data-field]").forEach(function (target) {
      var value = values[target.getAttribute("data-field")];
      if (typeof value === "string" && value.trim()) target.textContent = value;
    });
  });
})();
