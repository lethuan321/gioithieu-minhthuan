(function () {
  const storageKey = "minhthuan-theme";

  function getSavedTheme() {
    const savedTheme = localStorage.getItem(storageKey);
    if (savedTheme) {
      return savedTheme;
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function setTheme(theme, button) {
    document.body.classList.toggle("dark-mode", theme === "dark");
    localStorage.setItem(storageKey, theme);

    if (button) {
      button.textContent = theme === "dark" ? "Sáng" : "Tối";
      button.setAttribute("aria-label", theme === "dark" ? "Chuyển sang giao diện sáng" : "Chuyển sang giao diện tối");
    }
  }

  function setupTools() {
    const tools = document.createElement("div");
    tools.className = "site-tools";

    const themeButton = document.createElement("button");
    themeButton.type = "button";
    themeButton.className = "theme-toggle";

    const topButton = document.createElement("button");
    topButton.type = "button";
    topButton.className = "back-to-top";
    topButton.textContent = "↑";
    topButton.setAttribute("aria-label", "Về đầu trang");

    tools.append(themeButton, topButton);
    document.body.appendChild(tools);

    setTheme(getSavedTheme(), themeButton);

    themeButton.addEventListener("click", function () {
      const nextTheme = document.body.classList.contains("dark-mode") ? "light" : "dark";
      setTheme(nextTheme, themeButton);
    });

    topButton.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    window.addEventListener("scroll", function () {
      topButton.classList.toggle("is-visible", window.scrollY > 420);
    }, { passive: true });
  }

  function setupReveal() {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const targets = document.querySelectorAll(".intro-section, .profile-card, .contact-card, .feedback-card, .project-card, .project-panel, .resume-card, .timeline-item, .gallery-item, .resource-card, .success-box");

    if (reduceMotion || !("IntersectionObserver" in window)) {
      targets.forEach(function (target) {
        target.classList.add("is-visible");
      });
      return;
    }

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.16 });

    targets.forEach(function (target) {
      target.classList.add("reveal-on-scroll");
      observer.observe(target);
    });
  }

  function setupGallery() {
    const galleryItems = document.querySelectorAll(".gallery-item");
    const filterButtons = document.querySelectorAll(".gallery-filter");
    const lightbox = document.getElementById("galleryLightbox");

    if (!galleryItems.length) {
      return;
    }

    function applyFilter(filter) {
      const nextFilter = filter || "all";

      filterButtons.forEach(function (item) {
        item.classList.toggle("is-active", item.dataset.filter === nextFilter);
      });

      galleryItems.forEach(function (item) {
        item.hidden = nextFilter !== "all" && item.dataset.category !== nextFilter;
      });
    }

    filterButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        applyFilter(button.dataset.filter);
        const url = new URL(window.location.href);
        url.searchParams.set("filter", button.dataset.filter);
        window.history.replaceState({}, "", url);
      });
    });

    const initialFilter = new URLSearchParams(window.location.search).get("filter");
    const hasInitialFilter = Array.from(filterButtons).some(function (button) {
      return button.dataset.filter === initialFilter;
    });

    if (hasInitialFilter) {
      applyFilter(initialFilter);
    }

    if (!lightbox) {
      return;
    }

    const lightboxImage = lightbox.querySelector("img");
    const lightboxCaption = lightbox.querySelector(".lightbox-caption");
    const closeButton = lightbox.querySelector(".lightbox-close");

    function closeLightbox() {
      lightbox.hidden = true;
      document.body.style.overflow = "";
    }

    galleryItems.forEach(function (item) {
      item.addEventListener("click", function () {
        const image = item.querySelector("img");
        lightboxImage.src = image.src;
        lightboxImage.alt = image.alt;
        lightboxCaption.textContent = item.dataset.title || image.alt;
        lightbox.hidden = false;
        document.body.style.overflow = "hidden";
      });
    });

    closeButton.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", function (event) {
      if (event.target === lightbox) {
        closeLightbox();
      }
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && !lightbox.hidden) {
        closeLightbox();
      }
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    setupTools();
    setupReveal();
    setupGallery();
  });
}());
