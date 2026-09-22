document.addEventListener("DOMContentLoaded", () => {
  /* =========================================
     MOBILE NAVIGATION
  ========================================= */

  const menuToggle = document.querySelector(".menu-toggle");
  const primaryNavigation = document.querySelector(".primary-navigation");

  if (menuToggle && primaryNavigation) {
    menuToggle.addEventListener("click", () => {
      const isOpen = primaryNavigation.classList.toggle("is-open");

      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.classList.toggle("is-active", isOpen);
    });

    // Close the mobile menu when a navigation link is clicked
    const navigationLinks =
      primaryNavigation.querySelectorAll("a");

    navigationLinks.forEach((link) => {
      link.addEventListener("click", () => {
        primaryNavigation.classList.remove("is-open");
        menuToggle.classList.remove("is-active");
        menuToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* =========================================
     HEADER SCROLL STATE
  ========================================= */

  const header = document.querySelector(".site-header");

  if (header) {
    const updateHeader = () => {
      if (window.scrollY > 20) {
        header.classList.add("is-scrolled");
      } else {
        header.classList.remove("is-scrolled");
      }
    };

    updateHeader();
    window.addEventListener("scroll", updateHeader, {
      passive: true,
    });
  }

  /* =========================================
     CURRENT YEAR
  ========================================= */

  const yearElements = document.querySelectorAll("[data-current-year]");

  yearElements.forEach((element) => {
    element.textContent = new Date().getFullYear();
  });

  /* =========================================
     SMOOTH ANCHOR SCROLLING
  ========================================= */

  const anchorLinks = document.querySelectorAll(
    'a[href^="#"]'
  );

  anchorLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") {
        return;
      }

      const target = document.querySelector(targetId);

      if (!target) {
        return;
      }

      event.preventDefault();

      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  });

  /* =========================================
     SIMPLE FADE-IN OBSERVER
  ========================================= */

  const revealElements =
    document.querySelectorAll("[data-reveal]");

  if ("IntersectionObserver" in window && revealElements.length) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.12,
      }
    );

    revealElements.forEach((element) => {
      revealObserver.observe(element);
    });
  } else {
    revealElements.forEach((element) => {
      element.classList.add("is-visible");
    });
  }

  /* =========================================
     CONTACT FORM SUBMISSION
     NOTE: No backend yet, so this opens the visitor's
     email client with a pre-filled message to the firm's
     inbox. Once Lahema has a working inbox + you want a
     no-redirect experience, swap this for a Formspree (or
     similar) endpoint and point the <form action> at it.
  ========================================= */

  const enquiryForm = document.querySelector("#enquiry-form");
  const formStatus = document.querySelector("#form-status");

  // TODO: replace with the firm's real inbox once available
  const LAHEMA_CONTACT_EMAIL = "info@lahemalabour.co.zm";

  if (enquiryForm) {
    enquiryForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const data = new FormData(enquiryForm);
      const fullName = data.get("full_name") || "";
      const organisation = data.get("organisation") || "";
      const email = data.get("email") || "";
      const phone = data.get("phone") || "";
      const service = enquiryForm.querySelector("#service");
      const serviceLabel = service && service.selectedOptions.length
        ? service.selectedOptions[0].text.trim()
        : "";
      const message = data.get("message") || "";

      const subject = `Website enquiry: ${serviceLabel || "General"}`;
      const bodyLines = [
        `Name: ${fullName}`,
        organisation ? `Organisation: ${organisation}` : null,
        `Email: ${email}`,
        phone ? `Phone: ${phone}` : null,
        `Service: ${serviceLabel}`,
        "",
        "Message:",
        message,
      ].filter(Boolean);

      const mailtoUrl =
        `mailto:${LAHEMA_CONTACT_EMAIL}` +
        `?subject=${encodeURIComponent(subject)}` +
        `&body=${encodeURIComponent(bodyLines.join("\n"))}`;

      window.location.href = mailtoUrl;

      if (formStatus) {
        formStatus.textContent =
          "Opening your email app to send this enquiry to Lahema…";
      }
    });
  }
});