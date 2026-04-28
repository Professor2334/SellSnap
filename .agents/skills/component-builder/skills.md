# Component Builder Skill

Load this skill whenever you are creating or modifying a React component in SellSnap. It tells you where the component goes, how it should be structured, and how to wire it up to the design system without reinventing anything.

## Before You Start

Read `.agents/rules/design-system.md` first. Components that do not follow the design system get rejected at review. This skill assumes you already know the tokens, the spacing scale, and the component primitives.

Then ask: does this component already exist? Search `components/` before adding a new one. Two slightly different `Button` components is how codebases rot.

## Where Components Live

```
components/
├── ui/                   primitives: Button, Input, Card, Badge, etc.
├── dashboard/             anything that only exists inside the seller dashboard (OrdersTable, ProductList)
└── checkout/             public-facing checkout components (ProductCard, PayButton)
```

If a component is used exactly once and it is complex, it can live next to the page that uses it in `app/.../_components/`. Promote it to `components/` when a second caller shows up.

## Component File Template

```tsx
// components/<folder>/<ComponentName>.tsx

type <ComponentName>Props = {
  // Props go here. Required props first, optional after.
  children?: React.ReactNode;
};

export function <ComponentName>({ children, ...props }: <ComponentName>Props) {
  return (
    <div className="component-base-class" {...props}>
      {children}
    </div>
  );
}
```

Notes:
- Named export, not default export. Default exports make renaming harder and break auto-imports.
- Do NOT accept `className` prop — use design system classes defined in global CSS.
- Props type goes above the component, named `<ComponentName>Props`.
- Required props come before optional ones in the type definition.

## Server vs. Client Components

Default to server components. A component becomes a client component only when it needs one of these:
- React state (`useState`, `useReducer`)
- Effects (`useEffect`, `useLayoutEffect`)
- Browser-only APIs (`window`, `document`, `localStorage`)
- Event handlers that are more than a simple link (`onClick`, `onChange`)
- Context consumption for interactivity

If you add `"use client"`, put it on the first line of the file. Do not add it defensively.

Keep the client boundary as low in the tree as possible. A page that is mostly static but has one interactive button should not be a client component; the button should be.

## Styling

**Never use Tailwind CSS classes.** All styling comes from the custom design system.

**Use components from `components/ui/` for all UI primitives:**
```tsx
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
```

**For custom styling, use CSS custom properties in your stylesheets:**
```css
/* In your global CSS file */
.badge-pending {
  background-color: var(--color-warning);
  color: white;
}
.badge-paid {
  background-color: var(--color-success);
  color: white;
}
```

Then apply in components:
```tsx
<div className="badge-pending">Pending</div>
```

**Available design tokens (use via var() in CSS or className for predefined classes):**
- Colors: `var(--color-brand)`, `var(--color-ink)`, `var(--color-surface)`, etc.
- Typography: Use classes like `text-display`, `text-h1`, `text-body` defined in global CSS
- Spacing: Use the custom spacing scale via CSS padding/margin properties

## Variants

Components in `components/ui/` already provide their own variant props. Do not recreate variants — use the existing components.

**Example using Button from `components/ui/`:**
```tsx
import { Button } from '@/components/ui/Button';

// Use the variant and size props provided by the component
<Button variant="primary" size="lg">Pay Now</Button>
<Button variant="secondary">Cancel</Button>
<Button variant="danger" size="sm">Delete</Button>
```

**If building a NEW component that needs variants, define CSS classes in your stylesheet:**
```css
/* In your CSS file */
.badge-pending { background-color: var(--color-warning); color: white; }
.badge-paid { background-color: var(--color-success); color: white; }
.badge-failed { background-color: var(--color-danger); color: white; }
```

```tsx
// In your component
type BadgeVariant = 'pending' | 'paid' | 'failed';

const variantClassMap: Record<BadgeVariant, string> = {
  pending: 'badge-pending',
  paid: 'badge-paid',
  failed: 'badge-failed',
};

export function Badge({ variant }: { variant: BadgeVariant }) {
  return <span className={variantClassMap[variant]}>{variant}</span>;
}
```

## Accessibility

Every interactive element needs a keyboard-reachable focus state using `--color-brand` for focus rings.

Buttons without visible text need `aria-label`. Icon-only buttons are the most common offender. Do not let them ship without a label.

Form inputs need associated labels via `htmlFor`/`id`. Error messages are linked via `aria-describedby`.

Images need `alt`. Decorative images use `alt=""`. Do not omit the attribute.

## Props to Avoid

- Do not expose raw color props (`color="red"`). Use variants from `components/ui/`.
- Do not expose raw size values in pixels. Use the size variants from `components/ui/`.
- Do not accept `className` prop for Tailwind-style overrides. Use design system CSS classes.
- Do not accept arbitrary inline styles via a `style` prop unless there is a specific reason.

## Testing a New Component

If the component is a primitive (lives in `ui/`), write a simple manual-check by importing it into `app/_dev/page.tsx` (a dev-only route gated by `NODE_ENV === 'development'`). Verify:
- Default appearance
- Every variant
- Every size
- Disabled state (if applicable)
- Focus state (tab into it)
- Hover state
- On mobile viewport (Chrome DevTools at 360px wide)

Domain components (dashboard, checkout) can be reviewed in place on the relevant page.

## Common Mistakes

- Creating a new primitive when an existing one from `components/ui/` would work. Extend, do not duplicate.
- Accepting `className` prop and using it for Tailwind classes. Use design system CSS classes.
- Making a component a client component because it was easier, when a server component would have worked.
- Using pixel values instead of the spacing scale. Use CSS custom properties.
- Hardcoding colors instead of using design tokens from `--color-*` CSS variables.
- Adding complex logic inside the JSX. Extract to a named constant or helper above the return.
- Using ANY Tailwind CSS classes (like `px-4`, `bg-blue-500`, `hover:bg-red-600`). Use `components/ui/` and design system CSS classes.
