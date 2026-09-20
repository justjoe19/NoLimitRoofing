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

  // Nav dropdown ("Services"): <details> has no built-in close-on-outside-
  // click, close-on-link-click or Escape handling — add it here rather than
  // relying on the user clicking the summary again to close it.
  document.querySelectorAll(".nav-dropdown details").forEach(function (details) {
    details.querySelectorAll(".nav-dropdown-panel a").forEach(function (link) {
      link.addEventListener("click", function () { details.open = false; });
    });
  });
  document.addEventListener("click", function (e) {
    document.querySelectorAll(".nav-dropdown details[open]").forEach(function (details) {
      if (!details.contains(e.target)) details.open = false;
    });
  });
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    document.querySelectorAll(".nav-dropdown details[open]").forEach(function (details) {
      details.open = false;
      details.querySelector("summary").focus();
    });
  });

  // Netlify forms: progressive enhancement — submits via fetch, falls back
  // to a normal POST navigation if JS or fetch fails. Handles every
  // data-netlify form on the page (contact page, homepage quick-inspection
  // form) generically, keyed off each form's own field names.
  var commonValidators = {
    name: function (v) { return v.trim().length > 1 ? "" : "Please enter your full name."; },
    phone: function (v) { return /^[\d\s()+.-]{7,}$/.test(v.trim()) ? "" : "Please enter a valid phone number."; },
    email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? "" : "Please enter a valid email address."; },
    message: function (v) { return v.trim().length > 4 ? "" : "Tell us a little about your project."; },
    address: function (v) { return v.trim().length > 4 ? "" : "Please enter your property address."; }
  };

  var setupNetlifyForm = function (form) {
    var status = form.querySelector(".form-status");
    var submitLabel = form.querySelector('button[type="submit"]').textContent;

    var showStatus = function (kind, message) {
      if (!status) return;
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

    // Only validate fields this particular form actually has and marks required.
    var fieldNames = Object.keys(commonValidators).filter(function (name) {
      var field = form.elements[name];
      return field && field.hasAttribute("required");
    });

    var validateField = function (field) {
      var validator = commonValidators[field.name];
      var errorEl = document.getElementById(field.id + "-error");
      if (!validator || !errorEl) return true;
      var msg = validator(field.value);
      errorEl.textContent = msg;
      field.setAttribute("aria-invalid", msg ? "true" : "false");
      return !msg;
    };

    fieldNames.forEach(function (name) {
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
      fieldNames.forEach(function (name) {
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
          if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = submitLabel; }
        });
    });
  };

  document.querySelectorAll('form[data-netlify="true"]').forEach(setupNetlifyForm);

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

  // Testimonial carousel: one review visible at a time, prev/next cycles
  var carousel = document.getElementById("testimonial-carousel");
  if (carousel) {
    var slides = Array.prototype.slice.call(carousel.querySelectorAll(".testimonial-slide"));
    var current = slides.findIndex(function (s) { return s.classList.contains("is-active"); });
    if (current < 0) current = 0;
    var show = function (index) {
      slides[current].classList.remove("is-active");
      current = (index + slides.length) % slides.length;
      slides[current].classList.add("is-active");
    };
    var prevBtn = carousel.querySelector(".carousel-prev");
    var nextBtn = carousel.querySelector(".carousel-next");
    if (prevBtn) prevBtn.addEventListener("click", function () { show(current - 1); });
    if (nextBtn) nextBtn.addEventListener("click", function () { show(current + 1); });
  }
})();
