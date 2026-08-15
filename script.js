/* ============================================================
   Signature Events Co. — script.js
   Client-side interactivity only (no server-side code):
     1. Mobile navigation toggle
     2. Gallery category filters
     3. Accessible image lightbox (click, keyboard, Esc)
     4. Contact form validation + user feedback
     5. Auto-updating footer year
   ============================================================ */
"use strict";

document.addEventListener("DOMContentLoaded", function () {
  /* ---------- 1. Mobile navigation toggle ---------- */
  var navToggle = document.querySelector(".nav-toggle");
  var siteNav = document.getElementById("site-nav");

  if (navToggle && siteNav) {
    navToggle.addEventListener("click", function () {
      var isOpen = siteNav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    // Close the menu with Escape and return focus to the toggle
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && siteNav.classList.contains("open")) {
        siteNav.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.focus();
      }
    });
  }

  /* ---------- 2. Gallery category filters ---------- */
  var filterBar = document.querySelector(".filter-bar");
  var galleryItems = Array.prototype.slice.call(
    document.querySelectorAll(".gallery-item")
  );
  var filterStatus = document.getElementById("filter-status");

  if (filterBar && galleryItems.length) {
    filterBar.addEventListener("click", function (e) {
      var btn = e.target.closest(".filter-btn");
      if (!btn) return;

      // Update pressed state on the tab set
      filterBar.querySelectorAll(".filter-btn").forEach(function (b) {
        b.setAttribute("aria-pressed", b === btn ? "true" : "false");
      });

      var category = btn.getAttribute("data-filter");
      var shown = 0;

      galleryItems.forEach(function (item) {
        var match =
          category === "all" ||
          item.getAttribute("data-category") === category;
        item.classList.toggle("is-hidden", !match);
        if (match) shown += 1;
      });

      // Announce the result to screen-reader users
      if (filterStatus) {
        filterStatus.textContent =
          "Showing " + shown + " " +
          (category === "all" ? "moments" : category + " moments") + ".";
      }
    });
  }

  /* ---------- 3. Lightbox ---------- */
  var lightbox = document.getElementById("lightbox");

  if (lightbox && galleryItems.length) {
    var lbImage = lightbox.querySelector(".lightbox-image");
    var lbCaption = lightbox.querySelector(".lightbox-caption");
    var lbClose = lightbox.querySelector(".lightbox-close");
    var lbPrev = lightbox.querySelector(".lightbox-prev");
    var lbNext = lightbox.querySelector(".lightbox-next");
    var currentIndex = 0;
    var lastTrigger = null;

    // Only cycle through items that are currently visible (respects filters)
    function visibleItems() {
      return galleryItems.filter(function (item) {
        return !item.classList.contains("is-hidden");
      });
    }

    function showItem(index) {
      var items = visibleItems();
      if (!items.length) return;
      currentIndex = (index + items.length) % items.length;

      var fig = items[currentIndex];
      var thumb = fig.querySelector("img");
      var full = thumb.getAttribute("data-full") || thumb.getAttribute("src");
      var captionEl = fig.querySelector("figcaption");

      lbImage.setAttribute("src", full);
      lbImage.setAttribute("alt", thumb.getAttribute("alt") || "");
      lbCaption.textContent =
        (captionEl ? captionEl.textContent + " — " : "") +
        (currentIndex + 1) + " of " + items.length;
    }

    function openLightbox(fig, trigger) {
      lastTrigger = trigger || null;
      showItem(visibleItems().indexOf(fig));
      lightbox.classList.add("open");
      document.body.style.overflow = "hidden";
      lbClose.focus();
    }

    function closeLightbox() {
      lightbox.classList.remove("open");
      document.body.style.overflow = "";
      if (lastTrigger) lastTrigger.focus();
    }

    galleryItems.forEach(function (fig) {
      var trigger = fig.querySelector("button");
      if (trigger) {
        trigger.addEventListener("click", function () {
          openLightbox(fig, trigger);
        });
      }
    });

    lbClose.addEventListener("click", closeLightbox);
    lbPrev.addEventListener("click", function () { showItem(currentIndex - 1); });
    lbNext.addEventListener("click", function () { showItem(currentIndex + 1); });

    // Click on the dark backdrop (not the image) also closes
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) closeLightbox();
    });

    // Keyboard support while the lightbox is open
    document.addEventListener("keydown", function (e) {
      if (!lightbox.classList.contains("open")) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") showItem(currentIndex - 1);
      if (e.key === "ArrowRight") showItem(currentIndex + 1);
    });
  }

  /* ---------- 4. Contact form validation ---------- */
  var form = document.getElementById("enquiry-form");

  if (form) {
    var statusBox = document.getElementById("form-status");

    // Earliest selectable event date is tomorrow
    var dateInput = document.getElementById("event-date");
    if (dateInput) {
      var tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      dateInput.min = tomorrow.toISOString().split("T")[0];
    }

    var validators = {
      "full-name": function (v) {
        if (v.trim().length < 2) return "Please enter your name.";
        return "";
      },
      "email": function (v) {
        var pattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        if (!v.trim()) return "Please enter your email address.";
        if (!pattern.test(v.trim())) {
          return "Enter a valid email address, e.g. name@example.com.";
        }
        return "";
      },
      "phone": function (v) {
        // Optional field — validate only when something is typed
        if (v.trim() && !/^[0-9+()\s-]{8,15}$/.test(v.trim())) {
          return "Enter a valid phone number (digits, spaces, + ( ) - only).";
        }
        return "";
      },
      "event-type": function (v) {
        if (!v) return "Please choose the type of event.";
        return "";
      },
      "event-date": function (v) {
        if (!v) return "Please choose a preferred date.";
        var chosen = new Date(v + "T00:00:00");
        var today = new Date();
        today.setHours(0, 0, 0, 0);
        if (chosen <= today) return "Please choose a date in the future.";
        return "";
      },
      "message": function (v) {
        if (v.trim().length < 20) {
          return "Tell us a little more — at least 20 characters.";
        }
        return "";
      }
    };

    function validateField(id) {
      var input = document.getElementById(id);
      if (!input) return true;
      var field = input.closest(".form-field");
      var errorEl = field.querySelector(".error-msg");
      var message = validators[id](input.value);

      field.classList.toggle("invalid", Boolean(message));
      input.setAttribute("aria-invalid", message ? "true" : "false");
      if (errorEl) errorEl.textContent = message;
      return !message;
    }

    // Validate each field as the visitor leaves it
    Object.keys(validators).forEach(function (id) {
      var input = document.getElementById(id);
      if (input) {
        input.addEventListener("blur", function () { validateField(id); });
        input.addEventListener("input", function () {
          if (input.closest(".form-field").classList.contains("invalid")) {
            validateField(id);
          }
        });
      }
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault(); // static site — no server submission

      var allValid = true;
      var firstInvalid = null;

      Object.keys(validators).forEach(function (id) {
        var ok = validateField(id);
        if (!ok && !firstInvalid) firstInvalid = document.getElementById(id);
        allValid = allValid && ok;
      });

      if (!allValid) {
        statusBox.className = "form-status failure";
        statusBox.textContent =
          "Some details need attention — please review the highlighted fields.";
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      var name = document.getElementById("full-name").value.trim();
      statusBox.className = "form-status success";
      statusBox.textContent =
        "Thank you, " + name + "! Your enquiry has been received. " +
        "We reply to every message within one business day.";
      form.reset();
      Array.prototype.forEach.call(
        form.querySelectorAll(".form-field"),
        function (f) { f.classList.remove("invalid"); }
      );
    });
  }

  /* ---------- 5. Footer year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
