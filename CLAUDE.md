# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static website for **CS Engenharia & Avaliações** (civil engineering firm, São Luís — MA). No build tools, no package manager — pure HTML/CSS/JS served as static files.

## Development

**Preview locally:**
```bash
cd /home/user/AppsWebVER1.0
python3 -m http.server 8080
# Open http://localhost:8080
```

**Git workflow:**
```bash
# Branch for current work
git checkout claude/landing-page-app-selector-clv2G

# Commit and push
git add <files>
git commit -m "type: description"
git push -u origin claude/landing-page-app-selector-clv2G
```

Push goes through a local proxy at `127.0.0.1` — if it returns 403, it's a GitHub App permissions issue, not a code problem.

## File Structure

```
/
├── index.html                        # Landing page
├── css/main.css                      # Landing page styles
├── js/main.js                        # Landing page JS
├── assets/logo.png                   # CS Engenharia logo (800×800px)
└── apps/
    ├── viabilidade-imobiliaria.html  # Financial viability app
    ├── css/viabilidade.css           # App styles
    └── js/viabilidade.js             # App engine
```

## Landing Page Architecture (`index.html` + `css/main.css` + `js/main.js`)

**Design system:** CSS custom properties in `:root` with light/dark theme via `[data-theme]` attribute. Theme is stored in `localStorage` under key `cse-theme`. System preference (`prefers-color-scheme`) is the default fallback.

**Full-screen sections:** Every `section` has `min-height: 100svh` + `display:flex; flex-direction:column; justify-content:center`. Clicking a nav link scrolls to that section and it fills the viewport. `scroll-padding-top: var(--nav-h)` (64px) compensates for the fixed nav.

**Nav:** Fixed, dark background (`var(--nav-bg)`). Mobile: nav links hidden, hamburger button (`#ham`) toggles `nav.open` class which shows links in dropdown. Scroll-spy in `js/main.js` adds `.active` class to the matching nav anchor.

**Reveal animation:** Elements with `.reveal` class start hidden (`opacity:0; transform:translateY(16px)`). `IntersectionObserver` in `js/main.js` adds `.visible` when they enter viewport.

**Logo:** `assets/logo.png` placed in `.logo-box` (36×36px, nav) and `.footer-logo-box` (40×40px, footer) containers with `object-fit:contain` and dark background `#0d1b2e`.

**Sections in order:** hero → serviços → diferenciais → processo → publico → ferramentas → portfolio → sobre → faq → cta → footer.

## Viabilidade Imobiliária App Architecture (`apps/`)

**Engine layers in `viabilidade.js`:**

1. **Data layer** (`TIPOLOGIAS` constant, lines 1–126) — preset templates for 5 empreendimento types (condomínio horizontal, edifício vertical, MCMV, comercial, laje). Each has CUB value, land cost, unit count, area breakdown with equivalence factors, indirect cost percentages, and tax/fee percentages.

2. **Calculation engine** (lines 127–263):
   - `calcularViabilidade(dados, areas, indiretos, impostos)` — main function, returns full financial model
   - `calcularCenario(...)` — runs viability for a delta on CUB/price/land
   - `calcularTIR(fluxos)` — IRR via Newton-Raphson
   - `calcularVPL(fluxos, taxa)` — NPV
   - `gerarFluxoCaixa(r, prazo, vv, finPct)` — monthly cash flow projection

3. **UI layer** (lines 264–633):
   - `getDados()` — reads all form inputs into a data object
   - `render()` — master render, calls all sub-renders
   - `atualizarEntrada()`, `atualizarResultado()` — update input/result panels
   - `renderScenarios()`, `renderFluxo()`, `renderSensib()` — tab panels
   - `atualizarPDF()` — fills the hidden `.pdf-only` report section

4. **UI helpers** (lines 634–786): `showTab()`, `selCUB()`, `carregarTipologia()`, `buildPavTable()`, `buildIndGrid()`, `buildImpGrid()`, `drawPie()` (canvas SVG charts)

**State:** Mutable globals `DADOS`, `AREAS`, `INDIRETOS`, `IMPOSTOS` are initialized from `getDados()` at boot and kept in sync with form inputs. Every input change calls `render()`.

**PDF export:** A `.pdf-only` section (hidden from screen, visible in print) is populated by `atualizarPDF()`. User triggers `window.print()`.

**Norma bar / Tipologia bar:** Horizontally scrollable (`overflow-x: auto; flex-wrap: nowrap`) with `scrollbar-width: none`. Selecting a tipologia calls `carregarTipologia(key)` which deep-copies the template into the mutable globals and re-renders.

## Adding a New App

1. Create `apps/<app-name>.html` — include `<link rel="stylesheet" href="css/<app-name>.css">` and `<script src="js/<app-name>.js"></script>`. Add a back button: `<a href="../index.html">← AppsWeb</a>`.
2. Create `apps/css/<app-name>.css` and `apps/js/<app-name>.js`.
3. Add a `.tool-card.tool-live` card in `index.html` inside `#ferramentas .tools-grid`.

## CSS Conventions

- Use existing CSS custom properties (`var(--gold)`, `var(--bg-dark)`, `var(--txt-mut)`, etc.) — never hardcode colors.
- Typography: `var(--font-d)` (Fraunces serif) for headings/display, `var(--font-b)` (DM Sans) for body.
- Responsive breakpoints: 1024px (tablet), 768px (mobile), 540px (compact mobile).
- iOS inputs must have `font-size: 16px` to prevent auto-zoom.
