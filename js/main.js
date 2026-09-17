(function () {
  "use strict";

  // Mobile nav toggle
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("main-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      nav.classList.toggle("is-open", !open);
      document.body.style.overflow = !open ? "hidden" : "";
    });
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        toggle.setAttribute("aria-expanded", "false");
        nav.classList.remove("is-open");
        document.body.style.overflow = "";
      });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        toggle.setAttribute("aria-expanded", "false");
        nav.classList.remove("is-open");
        document.body.style.overflow = "";
        toggle.focus();
      }
    });
  }

  // Contact form: progressive enhancement — submits via fetch to Netlify,
  // falls back to a normal POST navigation if JS or fetch fails.
  var form = document.getElementById("contact-form");
  if (form) {
    var status = document.getElementById("form-status");

    var showStatus = function (kind, message) {
      status.textContent = message;
      status.classList.remove("success", "error");
      status.classList.add(kind, "is-visible");
      status.setAttribute("role", "status");
      status.scrollIntoView({ behavior: "smooth", block: "nearest" });
    };

    var encode = function (data) {
      return Object.keys(data)
        .map(function (key) {
          return encodeURIComponent(key) + "=" + encodeURIComponent(data[key]);
        })
        .join("&");
    };

    var validators = {
      name: function (v) { return v.trim().length > 1 ? "" : "Please enter your full name."; },
      phone: function (v) { return /^[\d\s()+.-]{7,}$/.test(v.trim()) ? "" : "Please enter a valid phone number."; },
      email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? "" : "Please enter a valid email address."; },
      message: function (v) { return v.trim().length > 4 ? "" : "Tell us a little about your project."; }
    };

    var validateField = function (field) {
      var validator = validators[field.name];
      var errorEl = document.getElementById(field.name + "-error");
      if (!validator || !errorEl) return true;
      var msg = validator(field.value);
      errorEl.textContent = msg;
      field.setAttribute("aria-invalid", msg ? "true" : "false");
      return !msg;
    };

    Object.keys(validators).forEach(function (name) {
      var field = form.elements[name];
      if (field) field.addEventListener("blur", function () { validateField(field); });
    });

    form.addEventListener("submit", function (e) {
      // Honeypot check
      var honey = form.elements["company-website"];
      if (honey && honey.value) {
        e.preventDefault();
        return;
      }

      var valid = true;
      Object.keys(validators).forEach(function (name) {
        var field = form.elements[name];
        if (field && !validateField(field)) valid = false;
      });
      if (!valid) {
        e.preventDefault();
        showStatus("error", "Please fix the highlighted fields and try again.");
        return;
      }

      if (typeof window.fetch !== "function") return; // allow native form POST fallback

      e.preventDefault();
      var submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = "Sending..."; }

      var data = {};
      new FormData(form).forEach(function (value, key) { data[key] = value; });

      fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encode(data)
      })
        .then(function (res) {
          if (!res.ok) throw new Error("Network response was not ok");
          form.reset();
          showStatus("success", "Thanks — your message is in! We'll call or email you back shortly.");
        })
        .catch(function () {
          showStatus("error", "Something went wrong sending your message. Please call us at (574) 360-0525 instead.");
        })
        .finally(function () {
          if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = "Send My Request"; }
        });
    });
  }

  // Footer year
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Header shadow once the page scrolls
  var header = document.querySelector(".site-header");
  if (header) {
    var updateHeaderShadow = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 4);
    };
    updateHeaderShadow();
    window.addEventListener("scroll", updateHeaderShadow, { passive: true });
  }

  // Lite YouTube embed: swap the thumbnail facade for a real iframe on demand
  document.querySelectorAll(".video-facade").forEach(function (facade) {
    facade.addEventListener("click", function () {
      var videoId = facade.getAttribute("data-yt-id");
      if (!videoId) return;
      var iframe = document.createElement("iframe");
      iframe.setAttribute(
        "src",
        "https://www.youtube-nocookie.com/embed/" + videoId + "?autoplay=1&rel=0"
      );
      iframe.setAttribute("title", facade.getAttribute("aria-label") || "YouTube video");
      iframe.setAttribute("allow", "autoplay; encrypted-media; picture-in-picture");
      iframe.setAttribute("allowfullscreen", "");
      facade.replaceWith(iframe);
      iframe.className = "video-facade";
      iframe.style.border = "0";
    });
  });
})();
