(function () {
  "use strict";

  var navToggle = document.getElementById("nav-toggle");
  var primaryNav = document.getElementById("primary-nav");

  if (navToggle && primaryNav) {
    navToggle.addEventListener("click", function () {
      var isOpen = primaryNav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    primaryNav.addEventListener("click", function (event) {
      if (event.target.tagName === "A" && primaryNav.classList.contains("is-open")) {
        primaryNav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  // Power BI embed URLs are not configured yet (VSD-37/VSD-38). Each embed
  // container shows its loading state until a real embed source is wired in,
  // at which point this list should map data-embed keys to embed src URLs
  // and the fallback link hrefs should point at the corresponding Power BI
  // Service report.
  var EMBED_SOURCES = {};

  document.querySelectorAll(".embed-container").forEach(function (container) {
    var key = container.getAttribute("data-embed");
    var placeholder = container.querySelector(".embed-placeholder");
    var fallback = container.querySelector(".embed-fallback");
    var src = EMBED_SOURCES[key];

    if (!src) {
      return;
    }

    var iframe = document.createElement("iframe");
    iframe.setAttribute("title", key + " Power BI report");
    iframe.setAttribute("loading", "lazy");
    iframe.style.width = "100%";
    iframe.style.height = "100%";
    iframe.style.border = "0";

    iframe.addEventListener("load", function () {
      placeholder.hidden = true;
    });

    iframe.addEventListener("error", function () {
      placeholder.hidden = true;
      fallback.hidden = false;
    });

    iframe.src = src;
    container.appendChild(iframe);
  });

  // Data-attribution values are pending the data pipeline (VSD-17, VSD-18)
  // and Power BI reports (VSD-38, VSD-42). Once those land, populate each
  // section's entry here with real provider, timestamp, feed, and
  // freshness values instead of the "Insufficient data" defaults.
  var DATA_ATTRIBUTION = {};

  document.querySelectorAll(".data-attribution").forEach(function (dl) {
    var key = dl.getAttribute("data-attribution");
    var values = DATA_ATTRIBUTION[key];

    if (!values) {
      return;
    }

    Object.keys(values).forEach(function (field) {
      var target = dl.querySelector('[data-field="' + field + '"]');
      if (target) {
        target.textContent = values[field];
      }
    });
  });
})();
