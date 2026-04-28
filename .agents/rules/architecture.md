---
trigger: always_on
---

# Architecture Rules

These rules describe how SellSnap is put together. Every agent building features must follow this architecture. Do not introduce new patterns without discussing them with the developer first.

## The Stack

SellSnap is a Next.js application using the App Router, written in TypeScript, backed by PostgreSQL through Prisma. Payments run through Flutterwave. Styling is handled by a custom design system from `components/ui/` — **Tailwind CSS is not used**. There is no separate backend service. Everything lives in the Next.js app, using server components, server actions, and route handlers.

## Directory Layout

```
app/
├── (auth)/
│   ├── login/
│   └── signup/
├── dashboard/
│   ├── page.tsx              # Seller dashboard home
│   ├── products/             # Product management
│   └── orders/               # Order management
├── p/[slug]/                 # Public product/checkout page - the shareable link target
└── api/
    ├── auth/
    ├── products/
    ├── orders/
    └── payments/
        └── webhook/          # Flutterwave webhook handler

components/
├── ui/                       # Reusable UI primitives (custom design system)
├── dashboard/                # Dashboard-specific components
└── checkout/                 # Public-facing checkout components

lib/
├── db.ts                     # Prisma client singleton
├── auth.ts                   # NextAuth.js session and auth helpers
├── flutterwave.ts            # Flutterwave API helpers
└── slug.ts                   # Unique slug generation

prisma/
├── schema.prisma             # Single source of truth for the database
└── migrations/               # Generated migration files

types/
└── index.ts                  # Shared TypeScript types
```

## Rendering Rules

Product pages at `/p/[slug]` must be server-rendered. They are the single most important page in the product because they are what buyers land on from WhatsApp. They must load fast, work without JavaScript enabled, and produce good Open Graph previews.

The seller dashboard can use client components where interactivity is needed, but data fetching happens on the server. Do not fetch from API routes inside client components when a server component can pass the data down directly.

## Data Flow

There are three kinds of writes in this app:

1. **User-initiated writes from the dashboard** go through server actions. Form submits call a server action, the action validates input with zod, writes to the database through Prisma, and revalidates the relevant cache tags.

2. **Public-facing writes from the checkout** go through route handlers under `app/api/`. The product page is public, so when a buyer hits "Pay Now," the client calls a route handler which creates a pending order and returns a Flutterwave payment link.

3. **Payment confirmations** come in through the Flutterwave webhook at `app/api/payments/webhook/route.ts`. This is the only place that marks an order as paid. The success redirect in the browser is not trusted.

## State Management

There is no global state library. React state and server data are enough. If you feel the urge to add Redux, Zustand, or Jotai, stop and reconsider. The dashboard is simple enough that `useState` and server actions cover every case.

## Database Access

All database access goes through Prisma. Raw SQL is only allowed in migration files. Every query that takes user input must use Prisma's parameterized query builder, never string interpolation.

The Prisma client is imported from `lib/db.ts`, which exports a singleton. Do not instantiate `new PrismaClient()` anywhere else; creating multiple clients exhausts the connection pool in development.

## Authentication

Sessions are handled by NextAuth.js. Cookies are `httpOnly`, `secure` in production, and `sameSite: lax`. The session helper in `lib/auth.ts` exposes `getSession()` for server components and server actions. Client components that need auth state receive it as a prop from their parent server component. All dashboard/seller routes are protected with auth middleware.

## Error Handling

Server actions and route handlers return structured responses. Success is `{ success: true, data: {...} }` and failure is `{ success: false, error: "..." }`. The client never receives raw exception messages, stack traces, or Prisma error objects. Log the full error on the server, return a sanitized message to the user.

## Environments

- `development` runs locally against a local PostgreSQL and Flutterwave test keys.
- `production` runs on Vercel with production Flutterwave keys and the production database.

There is no staging environment yet. When we add one, it will use Flutterwave test keys against a separate production-shaped database.

## What Not to Do

- Do not add GraphQL. REST route handlers and server actions are enough.
- Do not add a separate Node or Express backend. Everything stays in Next.js.
- Do not reach for microservices. This is one app.
- Do not build a custom auth system from scratch. Use NextAuth.js as specified in the tech stack.
- Do not store uploaded product images on the filesystem. Use Cloudinary as specified in the tech stack.
- Do not use Tailwind CSS. Use components from `components/ui/` (custom design system) for all UI primitives.
