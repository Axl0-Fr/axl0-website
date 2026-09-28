document.addEventListener("DOMContentLoaded", () => {
  const links = document.querySelectorAll(
    ".top-bar a, .hamburger-menu a"
  );
  const hamburgerBtn = document.querySelector(".hamburger");
  const hamburgerMenu =
    document.getElementById("hamburgerMenu");
  let hamburgerJustClicked = false;

  function setActiveLink() {
    links.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === window.location.hash) {
        link.classList.add("active");
      }
    });
  }

  setActiveLink();
  window.addEventListener("hashchange", setActiveLink);

  hamburgerBtn.addEventListener("click", () => {
    hamburgerJustClicked = true;
    const willOpen = !hamburgerMenu.classList.contains("open");
    hamburgerMenu.classList.toggle("open");
    hamburgerBtn.classList.toggle("active", willOpen);
  });

  document.addEventListener("click", (e) => {
    if (hamburgerJustClicked) {
      hamburgerJustClicked = false;
      return;
    }
    if (
      hamburgerMenu.classList.contains("open") &&
      !hamburgerMenu.contains(e.target) &&
      !hamburgerBtn.contains(e.target)
    ) {
      hamburgerMenu.classList.remove("open");
      hamburgerBtn.classList.remove("active");
      hamburgerBtn.blur();
    }
  });

  if (hamburgerMenu) {
    hamburgerMenu.style.transition =
      "opacity 0.18s cubic-bezier(1,0,0.2,1), visibility 0.18s cubic-be" +
      "zier(1,0,0.2,1)";
    hamburgerMenu.style.opacity =
      hamburgerMenu.classList.contains("open") ? "1" : "0";
    hamburgerMenu.style.visibility =
      hamburgerMenu.classList.contains("open")
        ? "visible"
        : "hidden";
    const observer = new MutationObserver(() => {
      if (hamburgerMenu.classList.contains("open")) {
        hamburgerMenu.style.opacity = "1";
        hamburgerMenu.style.visibility = "visible";
      } else {
        hamburgerMenu.style.opacity = "0";
        hamburgerMenu.style.visibility = "hidden";
      }
    });
    observer.observe(hamburgerMenu, {
      attributes: true,
      attributeFilter: ["class"],
    });
  }

  if (hamburgerBtn) {
    hamburgerBtn.addEventListener("mousedown", () => {
      hamburgerBtn.style.boxShadow =
        "0 0 0 4px rgba(224, 105, 169, 0.18)";
    });
    hamburgerBtn.addEventListener("mouseup", () => {
      hamburgerBtn.style.boxShadow = "";
    });
    hamburgerBtn.addEventListener("mouseleave", () => {
      hamburgerBtn.style.boxShadow = "";
    });
  }

  // Theme selector: theming lives in CSS ([data-theme] + light-dark()),
  // the JS only syncs the dropdown and stores the choice.
  const themeSelect = document.querySelector(".theme-selector");
  if (themeSelect) {
    themeSelect.value = localStorage.getItem("theme") || "system";

    themeSelect.addEventListener("change", () => {
      const theme = themeSelect.value;
      if (theme === "system") {
        delete document.documentElement.dataset.theme;
        localStorage.removeItem("theme");
      } else {
        document.documentElement.dataset.theme = theme;
        localStorage.setItem("theme", theme);
      }
    });
  }
});
