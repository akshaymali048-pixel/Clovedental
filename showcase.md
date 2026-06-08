# Clove Dental — Patient Acquisition Platform

A full-stack dental clinic website for **Clove Dental, Pimpri, Pune**. Built to capture leads, support receptionist workflow, earn patient trust, and rank locally on Google.

**Live target:** [Vercel](https://vercel.com) + [Neon PostgreSQL](https://neon.tech)

---

## What this project does

| Audience | Experience |
|----------|------------|
| **Patients** | Browse services, read reviews, book appointments, call or WhatsApp in one tap |
| **Receptionist** | Daily lead triage — scan NEW, call, note, mark BOOKED |
| **Clinic owner** | Dashboard counts, conversion channels, self-service settings |

---

## Tech stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 15 (App Router, TypeScript strict) |
| Styling | Tailwind CSS v4 |
| Database | PostgreSQL via Neon |
| ORM | Prisma 5 |
| Validation | Zod |
| Email | Resend |
| Auth | iron-session + bcryptjs |
| Rate limiting | Upstash Redis |
| Content | MDX files (`gray-matter` + `@mdx-js/mdx`) |

---

## Build slices (1–6)

### Slice 1 — Lead capture
- Homepage with appointment form
- Server action → PostgreSQL → Resend email alert
- UTM + landing page attribution on every lead
- Honeypot + timing anti-spam

### Slice 2 — Admin panel
- Secure login (`/admin/login`)
- Lead list with status filters (50 most recent)
- Lead detail: tap-to-call, notes, status workflow
- Statuses: NEW → IN_PROGRESS → BOOKED → VISITED → CLOSED / SPAM

### Slice 3 — Trust & conversion
- `/doctor` — credentialed dentist profile
- `/services/[slug]` — 8 treatment pages (MDX)
- `/gallery` — before/after + clinic photos
- `/testimonials` — patient reviews with admin moderation
- Conversion CTAs on every trust page

### Slice 4 — Conversion visibility
- Call, WhatsApp, and form event tracking (`EventLog`)
- WhatsApp floating action button
- `/contact` and `/faq` pages
- Rate limiting: 5 form submissions per IP per hour (Upstash)
- Dashboard conversion channel table

### Slice 5 — SEO architecture
- Unique metadata + canonical URLs on all public pages
- JSON-LD: LocalBusiness, MedicalProcedure, FAQPage, Review
- `sitemap.xml` and `robots.txt`
- 16 local landing pages (8 Pune neighbourhoods × 2 templates):
  - Pimpri, Chinchwad, Ravet, Akurdi, Punawale, Wakad, Hinjewadi, Nigdi
  - `/dental-implants-{area}` and `/dentist-{area}`

### Slice 6 — Operational maturity
- `/admin/settings` — edit clinic name, phone, WhatsApp, address, hours, maps URL, alert email
- `/admin/testimonials` — add, approve, hide, feature reviews
- `RESEND_FROM_EMAIL` support for verified sending domains

### Not yet built (Slice 7+)
- `/admin/analytics` with charts and funnel
- Patient / Treatment models for revenue tracking
- Google Analytics
- Lead list pagination beyond 50

---

## Public routes

| Route | Purpose |
|-------|---------|
| `/` | Homepage |
| `/doctor` | Dentist profile |
| `/services/[slug]` | Treatment detail (8 services) |
| `/gallery` | Results gallery |
| `/testimonials` | Patient reviews |
| `/contact` | Address, map, hours, form |
| `/faq` | 16 FAQs with category filter |
| `/dental-implants-{area}` | Local SEO — implants |
| `/dentist-{area}` | Local SEO — general dentist |

## Admin routes

| Route | Purpose |
|-------|---------|
| `/admin/login` | Staff login |
| `/admin/dashboard` | Lead + conversion overview |
| `/admin/leads` | Lead list |
| `/admin/leads/[id]` | Lead detail |
| `/admin/testimonials` | Review moderation |
| `/admin/settings` | Clinic configuration |

---

## Local development

```bash
cd dental-clinic
npm install
cp .env.local.example .env.local
# Fill in real values in .env.local — never commit this file
npm run db:push
npm run db:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Admin: [http://localhost:3000/admin/login](http://localhost:3000/admin/login).

### Required environment variables

See `.env.local.example` for the full list. Secrets stay in `.env.local` or your host's env UI — **never in git**.

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | Neon pooled connection |
| `DIRECT_URL` | Neon direct URL (migrations) |
| `SESSION_SECRET` | Admin session (32+ chars) |
| `RESEND_API_KEY` | Lead alert emails |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Seed admin user |
| `NEXT_PUBLIC_SITE_URL` | Canonical URLs + sitemap |
| `UPSTASH_REDIS_*` | Form rate limiting (production) |
| `RESEND_FROM_EMAIL` | Optional — after domain verification |

---

## Deploy to Vercel

1. Push this repo to GitHub
2. Import project in Vercel
3. Add all environment variables from `.env.local.example`
4. Set `NEXT_PUBLIC_SITE_URL` to your Vercel URL (or custom domain)
5. Run `npx prisma db push` against production Neon (or use Vercel build hook + `db:push` in CI)
6. Seed admin user once: `npm run db:seed`

---

## Security notes

- `.env` and `.env.local` are gitignored
- Admin routes protected server-side via `requireAuth()`
- Session cookie: `httpOnly`, `secure` in production
- Prisma parameterized queries (no raw SQL)
- Form: Zod validation, honeypot, timing check, rate limit

**Before public launch:** rotate any credentials that were ever pasted in chat or example files; use strong `ADMIN_PASSWORD` and unique `SESSION_SECRET` in production.

---

## Project structure

```
dental-clinic/
├── app/
│   ├── (public)/          # Marketing site
│   ├── (admin)/admin/     # Protected admin
│   ├── admin/login/       # Login (public)
│   ├── api/events/        # Click tracking
│   ├── sitemap.ts
│   └── robots.ts
├── actions/               # Server actions
├── components/
│   ├── public/
│   └── admin/
├── content/services/      # MDX service pages
├── lib/                   # DB, session, SEO, local-seo, etc.
└── prisma/                # Schema + seed
```

---

## Clinic

**Clove Dental** — Pimpri, Pune  
Phone: configured in admin settings  
Built as a patient acquisition system — not a full practice management suite.
