# Axl0-Fr.github.io

[![LIVE Branch Status](https://api.netlify.com/api/v1/badges/93905177-a3a3-486f-b3a9-e0e4db214775/deploy-status)](https://app.netlify.com/projects/live-axl0-website/deploys)
[![DEMO Branch Status](https://api.netlify.com/api/v1/badges/d18d5c1a-b16a-47e1-8665-26de1d282c1b/deploy-status)](https://app.netlify.com/projects/demo-axl0-website/deploys)
[![CODE Branch Status](https://api.netlify.com/api/v1/badges/6c373d54-9a5c-48d9-baab-69b11e01d773/deploy-status)](https://app.netlify.com/projects/code-axl0-website/deploys)

---

![License: CC BY-NC-SA 4.0](https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-lightgrey.svg)
[![Visit axl0.fr](https://img.shields.io/badge/Website-axl0.fr-pink?logo=globe)](https://www.axl0.fr)

## What can be found here

This is the repo where all of my website (and subwebsites) are hosted. You can expect to find sourcecode, images, and various resources.

## Site Structure

```
axl0-website/
├─ index.html
├─ favicon.png
├─ LICENSE
├─ README.md
├─ robots.txt
├─ sitemap.xml
├─ assets/
│  ├─ content/
│  │  ├─ frappe_tile.png
│  │  ├─ latte_tile.png
│  │  ├─ macchiato_tile.png
│  │  └─ mocha_tile.png
│  └─ fonts/
│     └─ CartographCF-*.woff2
├─ script/
│  └─ frontend.js
└─ stylesheet/
   ├─ base.css
   ├─ components.css
   ├─ layout.css
   └─ main.css
```

`stylesheet/main.css` is the only stylesheet the page loads. It `@import`s the
three layers in cascade order:

| Layer            | Holds                                                              |
| ---------------- | ------------------------------------------------------------------ |
| `base.css`       | `@font-face`, the Catppuccin theme tokens, bare element defaults    |
| `layout.css`     | the page skeleton: body, the full-height sections, their headings   |
| `components.css` | the reusable blocks, each with its own responsive overrides         |

## Coding conventions

The markup and stylesheets follow [BEM](https://getbem.com/):

- **Block** — a standalone component: `.topbar`, `.dropdown`, `.card`, `.btn`,
  `.socials`, `.footer`, …
- **Element** — a part of a block, named `block__element`: `.topbar__item`,
  `.card__text`, `.socials__item`, …
- **Modifier** — a variant or state, named `block__element--modifier`:
  `.btn--twitter`, `.dropdown--nav`, `.topbar__item--active`, …

A few rules keep the naming honest:

- Only `.main`, `.section` and the `__title`/`__icon`/… elements of the
  structural blocks live in `layout.css`; everything reusable is a component.
- `base.css` holds no block classes at all — just tokens and unclassed elements.
- State classes are always modifiers, never bare `.active`/`.is-open`. The JS in
  `script/frontend.js` derives the modifier from the element's own base class,
  so one helper covers `topbar__item`, `dropdown__item`, `burger` and
  `theme-toggle`.
- `keyframes` are prefixed with their block: `@keyframes dropdown-fade-in`.
- A block's own mobile overrides stay at the bottom of its section, never
  collected into a shared responsive section at the end of the file.
- Blocks are ordered by containment — a container always precedes what it
  contains, matching their order in `index.html`. Shared leaf primitives that
  several containers use (`.btn`) come after all of them.

## Do you want to contribute?

Feel free to help with this project anytime! Comments, bug reports, or any help will be greatly appreciated. Feel free to contact me on any of my [socials](https://www.axl0.fr/#4)

## Legal shenanigans

### Attribution

This project is licensed under [CC BY‑NC‑SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/). If you reuse any part of the code, you must give appropriate credit, provide a link to the license, and indicate if changes were made. Commercial use is not allowed.

### Share-alike

Any modified version of this code must also be distributed under CC BY‑NC‑SA 4.0

### What your license should look like if you use my code

If you just used tidbits of my code in your original project:
Just mention me in the sourcecode with a comment and a link: `// This section of code is made by Axl0 (https://www.axl0.fr/)`

If your code is just a modified version of mine:
`© Your name — Original code by [Axl0](https://www.axl0.fr/)`
