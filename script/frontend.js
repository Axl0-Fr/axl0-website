document.addEventListener("DOMContentLoaded", () => {
  const navLinks = document.querySelectorAll(
    ".topbar__item, .dropdown--nav .dropdown__item",
  );
  // The full-height sections those links point at, used to tell which one the
  // viewport is currently sitting in. An array, not a NodeList, for .filter().
  const sections = [...document.querySelectorAll(".section")];
  const themeMenu = document.getElementById("themeMenu");
  const themeItems = themeMenu.querySelectorAll("[data-theme-value]");

  // Every dropdown is the same .dropdown panel, driven by its own toggle.
  const dropdowns = [
    {
      btn: document.querySelector(".burger"),
      menu: document.getElementById("navMenu"),
    },
    { btn: document.querySelector(".theme-toggle"), menu: themeMenu },
  ];

  let justClickedUi = false;

  /* BEM states are modifiers of the element's own block, so the modifier
     name is derived from its base class: "topbar__item" -> "topbar__item--active".
     One helper then covers topbar__item, dropdown__item, burger and theme-toggle. */
  function setState(el, state, on) {
    el.classList.toggle(`${el.classList.item(0)}--${state}`, on);
  }

  /* The highlight follows the scroll position, not the URL. The hash only
     changes when a link is clicked, so deriving the state from it left the
     nav frozen while scrolling and left nothing lit at all on a plain load. */
  function setActiveSection(id) {
    navLinks.forEach((link) => {
      const active = link.getAttribute("href") === `#${id}`;
      setState(link, "active", active);
      link.setAttribute("aria-current", String(active));
    });
  }

  /* The last section whose top has passed the line at 40% of the viewport.
     The sections are contiguous and at least a full screen tall, so this
     always resolves to exactly one of them, and scrolling on into the footer
     keeps the last section lit because the footer sits below all of them. */
  function currentSection() {
    const line = window.innerHeight * 0.4;
    return (
      sections.filter((s) => s.getBoundingClientRect().top <= line).pop() ||
      sections[0]
    );
  }

  let queued = false;

  function syncActiveSection() {
    queued = false;
    setActiveSection(currentSection().id);
  }

  // At most one rect read per frame, so a fast flick never queues up work.
  function queueSync() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(syncActiveSection);
  }

  // The dropdowns are fixed overlays, so only one of them is open at a time.
  function setDropdownOpen(dropdown, open) {
    dropdown.menu.classList.toggle("dropdown--open", open);
    setState(dropdown.btn, "active", open);
    dropdown.btn.setAttribute("aria-expanded", String(open));
    if (open) {
      dropdowns.forEach((other) => {
        if (other !== dropdown) setDropdownOpen(other, false);
      });
    }
  }

  const isOpen = (menu) => menu.classList.contains("dropdown--open");

  function closeAllDropdowns() {
    dropdowns.forEach((dropdown) => setDropdownOpen(dropdown, false));
  }

  // A link click is not special-cased: it scrolls, and the spy lands on the
  // section it targeted, so the highlight tracks the jump on its own.
  window.addEventListener("scroll", queueSync, { passive: true });
  window.addEventListener("resize", queueSync);
  queueSync();
  // Late font loading can grow a section past 100vh and shift the tops the
  // spy measures against, so re-check once the metrics settle.
  document.fonts.ready.then(queueSync);

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

  // .dropdown--open toggles display, so the fade is animated with
  // opacity/visibility instead.
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
      setState(item, "active", active);
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
