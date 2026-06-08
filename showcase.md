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

## Production architecture

This is **not** a demo that talks to the database from the browser. Every data mutation goes through a server boundary first.

```
Browser (React)
    ↓
Next.js Server Actions + API Routes   ← auth, validation, rate limits, business rules
    ↓
Prisma ORM (parameterized queries)
    ↓
Neon PostgreSQL
```

Public patients never receive database credentials. Admin staff never touch Prisma from the client. Secrets (`DATABASE_URL`, `RESEND_API_KEY`, `SESSION_SECRET`) exist only in server environment variables.

---

## Production hardening — mapped to common vibe-coding failures

Most AI-generated apps fail in production because they skip security, authorization, validation, and cost control. This project was built against that checklist deliberately — not as a generic template, but as a **single-clinic, server-gated** system.

| # | Risk | Status | How this project handles it |
|---|------|--------|----------------------------|
| 1 | **IDOR** (accessing another user's records by ID) | ✅ Designed for | No patient accounts or per-user records. Leads belong to the clinic, not individual site visitors. Admin lead pages are staff-only behind `requireAuth()` — not a public `/invoice/123` pattern. |
| 2 | **Authentication without authorization** | ✅ Addressed | Login alone is not enough. Every admin page layout and every mutating server action (`updateLeadStatus`, `addLeadActivity`, settings, testimonials) calls `requireAuth()` before touching data. |
| 3 | **Exposed API keys in frontend** | ✅ Addressed | `RESEND_API_KEY`, `DATABASE_URL`, `SESSION_SECRET`, and Upstash tokens are server-only. The only `NEXT_PUBLIC_*` variable is the site URL for canonical links and sitemap — not a secret. |
| 4 | **No rate limiting** | ✅ Addressed | Appointment form: **5 submissions per IP per hour** via Upstash Redis (`lib/ratelimit.ts`). Spam bots cannot flood lead creation or email alerts indefinitely. |
| 5 | **Prompt injection** | ⚪ N/A | No LLM agents, RAG, or chat features in this codebase. |
| 6 | **Cross-tenant data leakage** | ✅ By design | Single-clinic model (`ClinicSettings` singleton). Not a multi-tenant SaaS — no vector search or shared document store across organizations. |
| 7 | **SQL injection** | ✅ Addressed | All database access through **Prisma ORM** with parameterized queries. No `$queryRaw` or string-built SQL anywhere in the project. |
| 8 | **Cross-site scripting (XSS)** | ✅ Addressed | React escapes rendered user content by default. Testimonials and lead notes render as text nodes, not raw HTML. `dangerouslySetInnerHTML` is used only for **server-generated JSON-LD** (structured data), never for user-submitted input. |
| 9 | **Unsafe file uploads** | ✅ Avoided | No file upload endpoints. Attack surface for malware hosting and storage abuse does not exist. |
| 10 | **Missing row-level security** | ✅ Appropriate scope | Neon RLS is not required here because there are no competing tenants or patient logins. Access control lives in the **application layer** (admin session gate) rather than exposing rows to anonymous clients. |
| 11 | **Sensitive data in logs** | ✅ Addressed | Passwords and API keys are never logged. Failed logins return a generic error. Email and DB failures log error messages only — not credentials or full payloads. |
| 12 | **Hardcoded secrets** | ✅ Addressed | Real secrets live in `.env.local` (gitignored). `.env.local.example` ships **placeholders only**. `SESSION_SECRET` is required at startup — the app refuses to boot without it. |
| 13 | **No input validation** | ✅ Addressed | **Zod** schemas on appointment forms, admin settings, event tracking API, and lead status updates. Field length limits, email format, Indian mobile regex, and enum checks for event types. |
| 14 | **Missing error handling** | ✅ Addressed | Lead creation wrapped in try/catch with a safe user-facing message. Resend email failures are caught and logged — a down email provider does not crash the form. Event analytics API fails silently so tracking never blocks UX. |
| 15 | **Infinite agent loops** | ⚪ N/A | No AI agent orchestration. |
| 16 | **AI cost explosion** | ⚪ N/A | No embeddings, summarization, or per-request LLM billing. |
| 17 | **Hidden UI ≠ security** | ✅ Addressed | Admin buttons are not the security boundary. Even if someone calls a server action or hits an admin URL directly, **`requireAuth()` runs server-side** before any mutation executes. |
| 18 | **Broken session management** | ✅ Addressed | **iron-session** with `httpOnly`, `sameSite: lax`, `secure` in production, and 8-hour `maxAge`. Logout calls `session.destroy()` — not just clearing React state. |
| 19 | **Unprotected admin panels** | ✅ Addressed | `(admin)` route group layout enforces auth on every child page. `/admin/*` disallowed in `robots.txt`. Login uses **bcrypt** password hashes, not plaintext storage. |
| 20 | **Trusting LLM output** | ⚪ N/A | No model-generated JSON parsed at runtime. |
| 21 | **Frontend connected directly to database** | ✅ Avoided | Classic vibe-coding anti-pattern explicitly rejected. Browser → Server Actions/API → Prisma → DB. Business rules (honeypot, timing check, rate limit, email alert, activity logging) run on the server every time. |

### Additional anti-abuse layers (beyond the checklist)

| Layer | Implementation |
|-------|----------------|
| **Honeypot field** | Hidden `website` field — bots that fill it get a fake success response; no DB write |
| **Timing check** | Submissions under 3 seconds after page load are rejected silently (bot-speed) |
| **Spam-safe responses** | Honeypot and timing failures return the same success message attackers expect — no signal to tune attacks |
| **Password storage** | `bcryptjs` hashes in `AdminUser.passwordHash` — seed and login never store plaintext in the database |
| **Audit trail** | Lead status changes and notes record `createdBy` from the authenticated session |
| **Conversion tracking** | `/api/events` validates input with Zod; failures never surface errors to the client |

### Honest gaps (known before full enterprise hardening)

| Area | Current state | Recommended before scale |
|------|---------------|--------------------------|
| Role-based access | Single admin role — all staff see all leads | Add `RECEPTIONIST` / `OWNER` roles if team grows |
| Login rate limiting | Not yet implemented | Add Upstash limit on `/admin/login` to slow brute force |
| Events API rate limit | Tracking endpoint accepts validated POSTs without IP cap | Low risk (no PII written), but can add a limiter |
| Rate limit fallback | Without Upstash env vars, limiter is skipped (dev-friendly) | **Must** set Upstash in production Vercel |
| Lead list cap | 50 most recent leads — no pagination yet | Slice 7+ |

---

## Senior engineer pre-ship checklist

Before shipping any feature in this codebase, these questions were used as a design filter:

1. **Can users access another user's data?** → Public site has no user-owned records; admin is clinic-wide by design.
2. **Can permissions be bypassed?** → Mutations require server-side session, not UI visibility.
3. **Can API keys be exposed?** → Secrets stay server-side; only `NEXT_PUBLIC_SITE_URL` is public.
4. **Can requests be spammed?** → Appointment form rate-limited; honeypot + timing for bots.
5. **Can inputs crash the system?** → Zod validation + bounded string lengths on every write path.
6. **Can sessions be hijacked?** → `httpOnly` encrypted session cookie; destroyed on logout.
7. **Can admin functionality be reached unauthenticated?** → Layout + action-level `requireAuth()`.
8. **Can attackers bypass the frontend?** → Server Actions are the gatekeeper — no direct DB from browser.
9. **Can provider outages break UX?** → Email and analytics failures are isolated; lead save still succeeds.
10. **Can logs leak secrets?** → No credential logging; generic login errors.

**Before public launch:** rotate any credentials that were ever pasted in chat or example files; use a strong `ADMIN_PASSWORD` and unique `SESSION_SECRET` in production; confirm Upstash variables are set on Vercel.

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
