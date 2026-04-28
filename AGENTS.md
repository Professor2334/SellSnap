# AGENTS.md — SellSnap

> This file provides context for AI coding agents working on the SellSnap codebase.
> Read this fully before making any changes, generating code, or suggesting architecture decisions.

---

## 1. Product Overview

**SellSnap** is a link-based commerce platform that enables Nigerian small business owners to sell products instantly via shareable payment links — no website required.

**Core selling loop:**
Upload product → Generate unique link → Share via WhatsApp/social → Buyer pays → Seller notified

**Key positioning:** SellSnap is NOT a store builder or full e-commerce suite. It is purely a speed-and-conversion tool — the simplest possible path from product to payment.

---

## 2. Tech Stack

| Layer       | Technology                           |
|-------------|---------------------------------------|
| Frontend    | React + Next.js (App Router)          |
| Backend     | Next.js (API Routes + Server Actions) |
| Database    | PostgreSQL                            |
| ORM         | Prisma (preferred)                    |
| Payments    | Flutterwave (Nigerian market primary) |
| Auth        | NextAuth.js                           |
| Storage     | Cloudinary                            |
| Hosting     | Vercel                                |

---

## 3. Project Structure (Expected)
sellsnap/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── signup/
│   ├── dashboard/
│   │   ├── page.tsx          # Seller dashboard home
│   │   ├── products/         # Product management
│   │   └── orders/           # Order management
│   ├── p/
│   │   └── [slug]/           # Public product/checkout page
│   └── api/
│       ├── auth/
│       ├── products/
│       ├── orders/
│       └── payments/
│           └── webhook/      # Flutterwave webhook handler
├── components/
│   ├── ui/                   # Reusable UI primitives (custom design system)
│   ├── dashboard/            # Dashboard-specific components
│   └── checkout/             # Public-facing checkout components
├── lib/
│   ├── db.ts                 # Prisma client singleton
│   ├── flutterwave.ts        # Flutterwave API helpers
│   └── utils.ts
├── prisma/
│   └── schema.prisma
└── types/
    └── index.ts
---

## 4. Data Models

These are the canonical schemas. Do not add fields without explicit instruction.

```prisma
model User {
  id            String    @id @default(cuid())
  name          String
  email         String    @unique
  businessName  String?
  passwordHash  String
  createdAt     DateTime  @default(now())
  products      Product[]
}

model Product {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  name        String
  description String?
  price       Float
  imageUrl    String?
  uniqueSlug  String   @unique
  createdAt   DateTime @default(now())
  orders      Order[]
}

model Order {
  id                   String      @id @default(cuid())
  productId            String
  product              Product     @relation(fields: [productId], references: [id])
  buyerEmail           String?
  amount               Float
  status               OrderStatus @default(PENDING)
  transactionReference String      @unique
  createdAt            DateTime    @default(now())
  payment              Payment?
}

model Payment {
  id               String    @id @default(cuid())
  orderId          String    @unique
  order            Order     @relation(fields: [orderId], references: [id])
  gatewayReference String
  status           String
  paidAt           DateTime?
}

enum OrderStatus {
  PENDING
  PAID
  FAILED
}
```

---

## 5. Core User Flows

### Seller Flow
1. Sign up / Log in
2. Access dashboard
3. Create product (image + name + price + description)
4. Auto-generate unique product link (`/p/[slug]`)
5. Copy & share link via WhatsApp or social media

### Customer Flow
1. Click product link
2. View product card (image, name, price, description)
3. Click **"Pay Now"**
4. Complete payment via Flutterwave
5. Receive confirmation

### Post-Payment Flow
1. Flutterwave webhook fires → `/api/payments/webhook`
2. Verify transaction reference (prevent duplicates)
3. Update order status → `PAID`
4. Send email notification to seller
5. Dashboard updates in real time (or on next load)

---

## 6. Critical System Rules

- **Unique slugs** — Every product gets a unique, collision-safe slug. Use `nanoid` or `cuid` suffixes.
- **Duplicate payment prevention** — Always check `transactionReference` uniqueness before confirming an order. Reject and log duplicates.
- **Transaction validation** — Never mark an order as PAID without verifying server-side via Flutterwave's `/v3/transactions/:id/verify` endpoint.
- **Input validation** — Validate all inputs (product creation, checkout forms) both client-side and server-side.
- **Expired/deleted products** — If a product is deleted or deactivated, the checkout page must show "Product not available" — never a broken page.
- **Payment failure handling** — Buyer must be able to retry after a failed payment. Do not lock the order.

---

## 7. API Conventions

- All API routes live under `/app/api/`
- Use Next.js Route Handlers (`route.ts`)
- Return consistent JSON responses:
```ts
  { success: true, data: {...} }       // success
  { success: false, error: "..." }     // error
```
- Use HTTP status codes correctly: `200`, `201`, `400`, `401`, `404`, `409`, `500`
- Protect all dashboard/seller routes with auth middleware

---

## 8. Payment Integration (Flutterwave)

- **Initialize payment:** Redirect buyer to Flutterwave's hosted checkout using `@flutterwave/flutterwave-react-v3` or via a direct link to `https://checkout.flutterwave.com/v3/hosted/pay`
- **Verify payment:** GET `https://api.flutterwave.com/v3/transactions/:id/verify` — always verify server-side after redirect or webhook fires
- **Webhook route:** `/api/payments/webhook` — verify the request using the `verif-hash` header matched against `FLW_WEBHOOK_HASH`
- **Always verify** the webhook signature before processing any event
- Store `FLW_SECRET_KEY`, `FLW_PUBLIC_KEY`, and `FLW_WEBHOOK_HASH` in `.env.local` — never hardcode

---

## 9. Notification Logic

| Trigger           | Channel              |
|-------------------|----------------------|
| Payment success   | Dashboard + Email    |
| Payment failure   | Dashboard + Email    |

- Email via Resend or Nodemailer
- Dashboard updates should reflect on the `/dashboard/orders` page
- Do not send notifications for duplicate/blocked transactions

---

## 10. Environment Variables

```env
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=

FLW_SECRET_KEY=
FLW_PUBLIC_KEY=
FLW_WEBHOOK_HASH=

CLOUDINARY_URL=
EMAIL_FROM=
RESEND_API_KEY=
```

---

## 11. Key Product Constraints

- **Mobile-first** — All UI must be fully responsive and optimized for mobile (most users are on Android)
- **Fast load** — Product/checkout pages (`/p/[slug]`) must load fast; use SSR or SSG where possible
- **Simplicity over features** — When in doubt, do less. SellSnap is not a full e-commerce platform
- **Nigerian market** — Currency is NGN (₦). Gateway is Flutterwave. Not Stripe, not USD.
- **No Tailwind CSS** — Project uses a custom design system; never use Tailwind utility classes or configuration files.

---

## 12. Out of Scope (Do Not Build)

- Store/storefront pages (multiple products in one page)
- Discount codes or coupon systems
- Inventory management
- Shipping/logistics integration
- Customer accounts or buyer-side auth
- Multi-currency support (for now)

---

## 13. KPIs (For Context)

- Link-to-payment conversion rate
- Payment success rate
- Checkout completion time
- Number of products created per user
- Daily active sellers

---

## 14. Setup & Development Conventions

### Common Commands
- Start dev server: `npm run dev`
- Prisma migrate: `npx prisma migrate dev --name <migration_name>`
- Prisma generate client: `npx prisma generate`
- Lint: `npm run lint`
- Typecheck: `npm run typecheck`

### Coding Rules
- Never use Tailwind CSS in any component or configuration
- Always use components from `components/ui/` (custom design system) for UI primitives
- Follow existing code style in modified files; do not introduce new linting/formatting patterns
- Run `npm run lint` and `npm run typecheck` after making changes to verify correctness
