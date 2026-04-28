---
trigger: always_on
---

# Design System Rules

SellSnap has its own visual language. It is built for Nigerian sellers on mobile phones, not for enterprise SaaS buyers on desktops. The design must feel fast, confident, and trustworthy, because buyers are handing over money to a stranger on WhatsApp and the interface is what earns that trust.

## Design Principles

**Speed first.** If a visual choice slows down the page, it loses. No loading spineners on the product page. No blocking fonts. No animations on the critical path.

**Mobile first.** Design for a 360px-wide screen and scale up. A buyer reading WhatsApp on a $100 Android phone is the default user, not a designer on a 27-inch monitor.

**Trust through clarity.** Clean typography, generous spacing, real product imagery, and obvious call-to-action buttons. Nothing clever that makes the buyer wonder if they are on a scam page.

**Calm over clever.** No shadows stacked on shadows. No gradients for their own sake. No dark patterns around the "Pay Now" button. The interface should feel like it was built by adults who respect the buyer's time.

## Color System

The palette is intentionally small. Adding new colors requires a conversation.

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-bg` | `#FFFFFF` | Default page background |
| `--color-surface` | `#F7F7F5` | Cards, elevated surfaces |
| `--color-ink` | `#0F1115` | Primary text, headlines |
| `--color-ink-muted` | `#5A6270` | Secondary text, labels |
| `--color-ink-subtle` | `#9AA1AD` | Captions, placeholder text |
| `--color-border` | `#E5E7EB` | Dividers, input borders |
| `--color-brand` | `#1A7F3C` | Primary actions, brand accents |
| `--color-brand-hover` | `#16692F` | Hover state for brand actions |
| `--color-success` | `#15803D` | Success states, paid badges |
| `--color-warning` | `#B45309` | Pending states |
| `--color-danger` | `#B91C1C` | Errors, failed payments |

Brand green was chosen deliberately. It reads as money, growth, and trust in the Nigerian context. It is not the Paystack blue or the Flutterwave orange, so SellSnap looks like its own product.

Dark mode is not a launch feature. We will add it later. Do not build two themes now.

## Typography

One typeface: Inter, loaded as a variable font. Fall back to the system sans-serif stack so text is never blank while the font loads.

Type scale:

| Token | Size | Line height | Weight | Usage |
|-------|------|-------------|--------|-------|
| `text-display` | 32px | 38px | 700 | Product name on product page, dashboard page titles |
| `text-h1` | 24px | 30px | 700 | Section headings |
| `text-h2` | 20px | 26px | 600 | Card titles |
| `text-body` | 16px | 24px | 400 | Default body text |
| `text-body-sm` | 14px | 20px | 400 | Secondary text, labels |
| `text-caption` | 12px | 16px | 500 | Tags, metadata, timestamps |

Do not use font sizes outside this scale. If a design asks for something between two sizes, pick the closer one. The scale exists so the app feels consistent.

## Spacing

Use the custom spacing scale based on 4px increments. Spacing values are defined in the design system and applied via component props or CSS custom properties. Be generous with whitespace, especially on mobile. A cramped interface feels cheap. A spacious one feels considered.

Common patterns:
- Page padding on mobile: 16px (var(--space-4))
- Page padding on desktop: 24px (var(--space-6)), max content width 672px for product pages, 1024px for dashboard
- Section spacing: 32px to 48px vertical padding
- Card padding: 16px on mobile, 24px on desktop
- Gap between related items: 12px
- Gap between unrelated sections: 32px or more

## Components

All UI primitives live in `components/ui/`. Compose them, do not replicate them. Never use Tailwind CSS classes — use the props and variants provided by each component.

### Button

Import from `components/ui/Button`. Three variants: `primary`, `secondary`, `ghost`. One destructive variant: `danger`. Three sizes: `sm`, `md`, `lg`. The default is `md`. The "Pay Now" button on the product page is always `primary` and `lg`.

- Primary: filled with `--color-brand`, white text.
- Secondary: `--color-surface` background, `--color-ink` text, `--color-border` border.
- Ghost: transparent, `--color-ink` text, no border until hover.
- Danger: filled with `--color-danger`, white text.

Buttons are full-width on mobile when they are the primary action on a screen. A full-width "Pay Now" button is easier to tap than a centered small one.

### Input

Import from `components/ui/Input`. Single input style. Label sits above the input, not inside it. Placeholder text is never a substitute for a label. Error messages appear below the input in `--color-danger`, with a small icon. Focused state uses a `--color-brand` ring.

Inputs are at least 44px tall on mobile to meet touch target guidelines. Do not shrink them to save space.

### Card

Import from `components/ui/Card`. Rounded corners (12px border-radius), subtle border using `--color-border`, no drop shadow by default. Add shadow only when a card needs to float above a busy background.

### Badge

Import from `components/ui/Badge`. Used for order status. `pending` is warning, `paid` is success, `failed` is danger. Small, rounded-full, uppercase text at 10px.

## Product Page Layout

This is the most important page. Follow the layout exactly:

1. Product image fills the top of the viewport, 1:1 aspect ratio on mobile, 4:3 or 1:1 on desktop depending on the image.
2. Seller's business name sits just below the image in `text-body-sm`, muted.
3. Product name in `text-display`.
4. Price in `text-h1`, bold, with currency symbol (`₦`) and comma grouping.
5. Description in `text-body`.
6. "Pay Now" button, full-width, `primary` variant, `lg` size, anchored to the bottom of the viewport on mobile via sticky positioning.

The total above-the-fold content on mobile should be: image, name, price, Pay Now button. Description sits below the fold but should be reachable with one scroll.

## Dashboard Layout

Left sidebar on desktop with Products, Orders, Settings. Collapses to a top bar on mobile. The main content area is a single column with max-width 1024px. Do not build multi-column dashboards; the data is simple and a single column is easier to scan.

## Iconography

Lucide React via `components/ui/Icon`. One icon library, no mixing. Icons are 20px inside buttons, 24px in nav, 16px inline with text. Icons always have an accessible label via `aria-label` or visible text.

## Motion

Keep it minimal. Use CSS transitions via component props for hover and focus states. Durations under 200ms. No page transitions, no elaborate enter animations. The "Pay Now" button should never have a delay between tap and action.

## Accessibility

Every interactive element is reachable by keyboard. Focus states are visible and use `--color-brand`. Color contrast meets WCAG AA against both light backgrounds.

Form inputs have associated labels. Error messages are linked to their inputs with `aria-describedby`. Buttons have text or an `aria-label`.

Images have `alt` text. Product images use the product name as alt text. Decorative images use `alt=""`.

## What Not to Do

- Do not add skeuomorphic effects, glassmorphism, or neumorphism. They go out of style fast and cost performance.
- Do not use more than two font weights in a single screen (regular and bold is usually enough, plus semibold for headings).
- Do not center-align body text. Left-align everything except buttons and single-line headings.
- Do not build carousels on the product page. One product, one image, one price. Carousels hurt conversion.
- Do not stack multiple modals. If a flow needs two decisions, it needs two pages.
- Do not use Tailwind CSS classes anywhere. Use components from `components/ui/` with their provided props and variants.
