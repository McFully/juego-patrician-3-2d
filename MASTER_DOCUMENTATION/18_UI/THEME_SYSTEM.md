# THEME SYSTEM

**Source files:** `tailwind.config.js`, `src/styles/globals.css`

---

## Overview

The project uses **Tailwind CSS v3** with a fully customized design system. All tokens are defined in `tailwind.config.js` (as Tailwind extensions) and mirrored as CSS custom properties in `globals.css`. The theme is exclusively dark - there is no light mode. Font family is **Montserrat** loaded via CSS variable.

---

## Color Palette

The palette is named after the **Hanseatic Strategos** game identity. It follows Material Design 3 naming conventions adapted for a dark medieval maritime theme.

### Surface Tones (Background Hierarchy)

| Token | Hex | Usage |
|---|---|---|
| `surface` | `#131407` | Base background (near black-green) |
| `surface-dim` | `#131407` | Same as surface (alias) |
| `surface-bright` | `#393a29` | Elevated surface panels |
| `surface-container-lowest` | `#0e0f03` | Deepest background layer |
| `surface-container-low` | `#1b1d0e` | Low elevation containers |
| `surface-container` | `#1f2111` | Standard containers |
| `surface-container-high` | `#2a2b1b` | Slightly raised containers |
| `surface-container-highest` | `#343625` | Highest container elevation |
| `surface-variant` | `#343625` | Alternate surface (same as container-highest) |
| `background` | `#131407` | Root background (same as surface) |

### Text / On-Surface

| Token | Hex | Usage |
|---|---|---|
| `on-surface` | `#e4e4cc` | Primary text (cream white) |
| `on-surface-variant` | `#c4c6cf` | Secondary text (blue-grey) |
| `on-background` | `#e4e4cc` | Body text on background |
| `inverse-surface` | `#e4e4cc` | Light surface for dark text |
| `inverse-on-surface` | `#303221` | Dark text on light surface |

### Primary (Blue Steel - Hanseatic Fleet)

| Token | Hex | Usage |
|---|---|---|
| `primary` | `#afc8f0` | Primary accent (steel blue) |
| `on-primary` | `#163152` | Text on primary |
| `primary-container` | `#001f3f` | Dark navy container |
| `on-primary-container` | `#6f88ad` | Text on primary container |
| `inverse-primary` | `#476083` | Inverse primary |
| `primary-fixed` | `#d4e3ff` | Fixed primary tint |
| `primary-fixed-dim` | `#afc8f0` | Fixed primary dim |
| `on-primary-fixed` | `#001c3a` | Text on fixed primary |
| `on-primary-fixed-variant` | `#2f486a` | Variant text on fixed primary |
| `surface-tint` | `#afc8f0` | Tint overlay for elevation |

### Secondary (Hansa Green - Trade)

| Token | Hex | Usage |
|---|---|---|
| `secondary` | `#77dd6a` | Secondary accent (merchant green) |
| `on-secondary` | `#003a03` | Text on secondary |
| `secondary-container` | `#027910` | Dark green container |
| `on-secondary-container` | `#9dff8d` | Text on secondary container |
| `secondary-fixed` | `#92fa83` | Fixed secondary |
| `secondary-fixed-dim` | `#77dd6a` | Fixed secondary dim |
| `on-secondary-fixed` | `#002201` | Text on fixed secondary |
| `on-secondary-fixed-variant` | `#005307` | Variant text |

### Tertiary (Gold - Wealth & Reputation)

| Token | Hex | Usage |
|---|---|---|
| `tertiary` | `#eac349` | Primary CTA color (Hanseatic gold) |
| `on-tertiary` | `#3c2f00` | Text on tertiary (dark brown) |
| `tertiary-container` | `#cca830` | Amber container |
| `on-tertiary-container` | `#4f3e00` | Text on container |
| `tertiary-fixed` | `#ffe088` | Fixed tertiary (bright gold) |
| `tertiary-fixed-dim` | `#e9c349` | Fixed tertiary dim |
| `on-tertiary-fixed` | `#241a00` | Text on fixed tertiary |
| `on-tertiary-fixed-variant` | `#574500` | Variant text |

### Error

| Token | Hex | Usage |
|---|---|---|
| `error` | `#ffb4ab` | Error text (coral) |
| `on-error` | `#690005` | Text on error |
| `error-container` | `#93000a` | Error background |
| `on-error-container` | `#ffdad6` | Text on error container |

### Outline

| Token | Hex | Usage |
|---|---|---|
| `outline` | `#8e9198` | Borders, dividers |
| `outline-variant` | `#43474e` | Subtle borders |

---

## CSS Custom Properties (`src/styles/globals.css`)

The following variables are declared on `:root` and duplicate the Tailwind tokens for use in plain CSS:

```css
:root {
  --color-surface: #131407;
  --color-surface-dim: #131407;
  --color-surface-bright: #393a29;
  --color-surface-container-lowest: #0e0f03;
  --color-surface-container-low: #1b1d0e;
  --color-surface-container: #1f2111;
  --color-surface-container-high: #2a2b1b;
  --color-surface-container-highest: #343625;
  --color-on-surface: #e4e4cc;
  --color-on-surface-variant: #c4c6cf;
  --color-outline: #8e9198;
  --color-outline-variant: #43474e;
  --color-primary: #afc8f0;
  --color-on-primary: #163152;
  --color-secondary: #77dd6a;
  --color-tertiary: #eac349;
  --color-error: #ffb4ab;
}
```

---

## Typography

### Font Families

| Token | Variable | Fallback | Usage |
|---|---|---|---|
| `montserrat` | `var(--font-main)` | `sans-serif` | All headings and UI text |
| `sans` | `var(--font-main)` | `sans-serif` | Default sans (same as montserrat) |
| `mono` | `var(--font-mono)` | `monospace` | Code / data display |
| `jetbrains-mono` | `var(--font-mono)` | `monospace` | Alias for mono |

> Note: `--font-main` and `--font-mono` CSS variables must be defined externally (e.g., loaded via `index.html` from Google Fonts). The `globals.css` applies them but does not declare the variable values.

### Font Scale (Tailwind `fontSize`)

| Token | Size | Line Height | Letter Spacing | Weight |
|---|---|---|---|---|
| `headline-xl` | 48px | 56px | -0.02em | 700 |
| `headline-lg` | 32px | 40px | - | 700 |
| `headline-lg-mobile` | 24px | 32px | - | 700 |
| `title-md` | 20px | 28px | - | 600 |
| `body-lg` | 18px | 26px | - | 400 |
| `body-md` | 16px | 24px | - | 400 |
| `label-sm` | 12px | 16px | 0.05em | 600 |

### Utility Font Classes (`globals.css` `@layer utilities`)

| Class | Equivalent |
|---|---|
| `.font-label-sm` | Montserrat, `text-xs`, `font-semibold`, `tracking-wider` |
| `.font-headline-sm` | Montserrat, `text-xl`, `font-black`, `tracking-tight` |
| `.font-headline-md` | Montserrat, `text-2xl`, `font-black`, `tracking-tight` |
| `.font-headline-lg` | Montserrat, `text-3xl`, `font-black`, `tracking-tight` |
| `.font-title-sm` | Montserrat, `text-sm`, `font-semibold`, `tracking-normal` |
| `.font-title-md` | Montserrat, `text-base`, `font-semibold`, `tracking-normal` |
| `.font-title-lg` | Montserrat, `text-lg`, `font-semibold`, `tracking-normal` |
| `.font-body-sm` | Montserrat, `text-xs`, `font-normal`, `leading-relaxed` |
| `.font-body-md` | Montserrat, `text-sm`, `font-normal`, `leading-relaxed` |
| `.font-body-lg` | Montserrat, `text-base`, `font-normal`, `leading-relaxed` |

---

## Glass Panel Classes

The glassmorphism system uses three levels of opacity + blur:

### `.glass-panel`
```css
backdrop-blur-xl          /* blur: 24px */
bg-[rgba(0,31,63,0.6)]    /* navy blue at 60% opacity */
border border-white/10    /* white border at 10% opacity */
shadow-[0_8px_32px_rgba(0,0,0,0.3)]
```
**Use:** Standard panels, side drawers, info cards.

### `.glass-panel-heavy`
```css
backdrop-blur-2xl         /* blur: 40px */
bg-[rgba(0,31,63,0.85)]   /* navy blue at 85% opacity */
border border-white/15    /* white border at 15% opacity */
shadow-[0_20px_40px_rgba(0,0,0,0.3)]
```
**Use:** Modal dialogs, overlay menus.

### `.glass-modal`
```css
backdrop-blur-2xl
bg-primary-container/85   /* #001f3f at 85% */
border border-on-surface/10
shadow-[0_20px_40px_rgba(0,0,0,0.3)]
```
**Use:** Full-screen modals and dialog boxes.

---

## Spacing Scale (Tailwind `spacing`)

| Token | Value | Usage |
|---|---|---|
| `xs` | 4px | Tight padding |
| `base` | 8px | Base unit |
| `sm` | 12px | Small padding |
| `md` | 24px | Medium padding / button padding |
| `lg` | 40px | Section gaps |
| `xl` | 64px | Page padding |
| `gutter` | 24px | Column gutter |
| `margin` | 32px | Page margin |

---

## Border Radius Scale

| Token | Value |
|---|---|
| DEFAULT | 0.25rem (4px) |
| `lg` | 0.5rem (8px) |
| `xl` | 0.75rem (12px) |
| `full` | 9999px |

---

## Backdrop Blur Scale

| Token | Blur |
|---|---|
| `xs` | 2px |
| `sm` | 4px |
| DEFAULT | 8px |
| `md` | 12px |
| `lg` | 16px |
| `xl` | 24px |
| `2xl` | 40px |
| `3xl` | 64px |

---

## Component Classes (`@layer components`)

### Buttons

| Class | Description |
|---|---|
| `.btn-primary` | Gold background (`tertiary`), hover scale 1.02 |
| `.btn-secondary` | Transparent, border, hover fill |
| `.btn-ghost` | Text-only, hover gold color |

### Inputs

| Class | Description |
|---|---|
| `.input-field` | Dark navy bg, tertiary focus ring |

### Cards

| Class | Description |
|---|---|
| `.card-base` | Glass base + `p-md rounded-xl` |
| `.card-hover` | Card base with tertiary border on hover |

### Stat Bars

| Class | Description |
|---|---|
| `.stat-bar` | Container: `h-1.5`, rounded, `surface-container` bg |
| `.stat-bar-fill` | Fill: `h-full`, rounded, animated transition |

### Navigation

| Class | Description |
|---|---|
| `.nav-item` | Flex column, hover gold, `px-md py-xs rounded-xl` |
| `.nav-item-active` | `background: var(--tertiary-fixed)`, `color: var(--on-tertiary-fixed)`, scale 1.02 |

---

## Utility Animations

| Class | Animation |
|---|---|
| `.animate-float` | Vertical float ±8px, 3s ease-in-out infinite |
| `.animate-pulse-slow` | Standard pulse, 3s cubic-bezier |

---

## Special Elements

### `.isometric-grid`
Multi-layered CSS gradient creating a golden isometric grid pattern. Used as the background texture in `CityOverview`. Color: `rgba(212, 175, 55, 0.05)` (subtle gold).

### `.building-hover:hover`
```css
filter: drop-shadow(0 0 8px rgba(212, 175, 55, 0.8));
transform: scale(1.05);
transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
```

### `.glyph`
Renders Material Symbols Outlined icons at 20px in **`#eac349`** (tertiary gold). Used for decorative icons in the UI.

### `.material-symbols-outlined`
Full Material Symbols font configuration. **Color is set to `transparent !important`** - only the font ligature glyph is shown, text label is suppressed.

---

## Global Base Reset

```css
html, body, #root {
  height: 100%;
  overflow: hidden;   /* No scroll at any level */
  margin: 0;
  padding: 0;
}

body {
  background: #131407;
  color: #e4e4cc;
  font-family: var(--font-main), sans-serif;
  -webkit-font-smoothing: antialiased;
}

#root {
  display: flex;
  flex-direction: column;
}

::selection {
  background: #eac349;   /* tertiary gold */
  color: #3c2f00;        /* on-tertiary */
}
```

---

## Dark Mode

```js
// tailwind.config.js
darkMode: 'class'
```

Dark mode is class-based (`.dark` on `<html>`), but the application **always runs in dark mode** - there is no light theme defined. The setting exists for potential future toggle support.
