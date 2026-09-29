document.addEventListener("DOMContentLoaded", () => {
  const links = document.querySelectorAll(".top-bar a, #hamburgerMenu a");
  const themeBtn = document.querySelector(".theme-toggle");
  const themeMenu = document.getElementById("themeMenu");
  const themeItems = themeMenu.querySelectorAll("[data-theme-value]");

  // Every dropdown is the same .dropdown-menu panel, driven by its own toggle.
  const dropdowns = [
    {
      btn: document.querySelector(".hamburger"),
      menu: document.getElementById("hamburgerMenu"),
    },
    { btn: themeBtn, menu: themeMenu },
  ];

  let justClickedUi = false;

  function setActiveLink() {
    links.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === window.location.hash) {
        link.classList.add("active");
      }
    });
  }

  // The dropdowns are fixed overlays, so only one of them is open at a time.
  function setDropdownOpen(dropdown, open) {
    dropdown.menu.classList.toggle("open", open);
    dropdown.btn.classList.toggle("active", open);
    dropdown.btn.setAttribute("aria-expanded", String(open));
    if (open) {
      dropdowns.forEach((other) => {
        if (other !== dropdown) setDropdownOpen(other, false);
      });
    }
  }

  const isOpen = (menu) => menu.classList.contains("open");

  function closeAllDropdowns() {
    dropdowns.forEach((dropdown) => setDropdownOpen(dropdown, false));
  }

  setActiveLink();
  window.addEventListener("hashchange", setActiveLink);

  dropdowns.forEach((dropdown) => {
    dropdown.btn.addEventListener("click", () => {
      justClickedUi = true;
      setDropdownOpen(dropdown, !isOpen(dropdown.menu));
    });

    // Picking an item (a nav link, a theme) dismisses the menu and hands
    // focus back to the toggle, so the two menus behave the same.
    dropdown.menu.addEventListener("click", (e) => {
      if (!e.target.closest("a, button")) return;
      closeAllDropdowns();
      dropdown.btn.focus();
    });
  });

  document.addEventListener("click", (e) => {
    if (justClickedUi) {
      justClickedUi = false;
      return;
    }
    dropdowns.forEach((dropdown) => {
      if (
        isOpen(dropdown.menu) &&
        !dropdown.menu.contains(e.target) &&
        !dropdown.btn.contains(e.target)
      ) {
        setDropdownOpen(dropdown, false);
        dropdown.btn.blur();
      }
    });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    closeAllDropdowns();
  });

  // .open toggles display, so the fade is animated with opacity/visibility.
  function fadeWithDisplay(menu) {
    if (!menu) return;
    const sync = () => {
      menu.style.opacity = isOpen(menu) ? "1" : "0";
      menu.style.visibility = isOpen(menu) ? "visible" : "hidden";
    };
    menu.style.transition =
      "opacity 0.18s cubic-bezier(1,0,0.2,1), visibility 0.18s cubic-be" +
      "zier(1,0,0.2,1)";
    sync();
    new MutationObserver(sync).observe(menu, {
      attributes: true,
      attributeFilter: ["class"],
    });
  }

  dropdowns.forEach((dropdown) => {
    fadeWithDisplay(dropdown.menu);
  });

  // Theme selector: theming lives in CSS ([data-theme] + light-dark()),
  // the JS only syncs the dropdown and stores the choice.
  function syncThemeWidgets(theme) {
    themeItems.forEach((item) => {
      const active = item.dataset.themeValue === theme;
      item.classList.toggle("active", active);
      item.setAttribute("aria-current", String(active));
    });
  }

  function setTheme(theme) {
    if (theme === "system") {
      delete document.documentElement.dataset.theme;
      localStorage.removeItem("theme");
    } else {
      document.documentElement.dataset.theme = theme;
      localStorage.setItem("theme", theme);
    }
    syncThemeWidgets(theme);
  }

  // The themes are listed directly in the dropdown, one button per theme.
  // Closing the menu is handled generically above.
  themeItems.forEach((item) => {
    item.addEventListener("click", () => setTheme(item.dataset.themeValue));
  });

  syncThemeWidgets(localStorage.getItem("theme") || "system");
});