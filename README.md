# Babies & Todd's Academy Platform

A TypeScript monorepo for the Babies & Todd's Academy public website and private management system. Built for warm classrooms, structured routines, and clear records.

## Stack

- **Frontend:** Next.js 15 (App Router), React 19, Tailwind CSS, Inter + Fraunces (display) + JetBrains Mono
- **Backend:** NestJS 11, Prisma 6
- **Database:** Supabase Postgres, accessed through Prisma
- **Shared:** TypeScript types in `packages/shared`
- **Future:** Cognito, S3, Cloudflare DNS

## Structure

```
apps/
  web/       # Next.js public site + parent / teacher / admin dashboards
  api/       # NestJS REST API backed by Prisma
packages/
  shared/    # Shared TypeScript domain types
docs/SUPABASE.md     # Supabase database setup
```

## First-time setup

```bash
# 1. Install dependencies
npm install

# 2. Copy env files
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local

# 3. Add your Supabase DATABASE_URL to apps/api/.env
# See docs/SUPABASE.md

# 4. Generate Prisma client, push schema to Supabase, and seed
cd apps/api
npm run prisma:generate
npm run prisma:push
npm run seed
cd ../..

# 5. Run both apps
npm run dev
```

Web -> http://localhost:3000  ·  API -> http://localhost:4000/api  ·  Health -> /api/health

## Day-to-day

| Command | What it does |
|---|---|
| `npm run dev` | Web + API concurrently |
| `npm run dev:web` | Web only |
| `npm run dev:api` | API only |
| `npm run build` | Build shared → api → web |
| `npm run lint` | Lint web app |
| `npm run -w @babies-tods/api seed` | Reseed the DB with realistic data |
| `npm run -w @babies-tods/api db:reset` | Reset + reseed (destructive; use carefully on Supabase) |
| `npm run -w @babies-tods/api prisma:studio` | Open Prisma Studio |

## Web app

### Public pages

`/` · `/about` · `/programmes` (+ `/babies` `/toddlers` `/pre-primary` `/aftercare`) · `/admissions` · `/fees` · `/gallery` · `/contact` · `/visit` · `/faq` · `/news` · `/careers` · `/login` · `/privacy` · `/terms` · `/safeguarding`

### Private app

- **Parent** — `dashboard`, `child`, `learning`, `memories`, `messages`, `check-in`, `billing`
- **Teacher** — `dashboard`, `attendance`, `daily-reports`, `messages`
- **Admin** — `dashboard`, `learners` (+ detail), `classrooms`, `staff`, `finance`, `announcements`, `compliance`, `safety`

All dashboard pages are React Server Components that fetch live data from the API via `src/lib/api.ts`. If the API is offline they degrade gracefully (empty states instead of crashes) via `safe()`.

### Design system

- **Foundation:** `src/app/globals.css`, `tailwind.config.ts`
- **UI primitives:** `src/components/ui/` — Button, Card, Badge, Input, Container, Section, StatCard, DataTable, Timeline, ProgressBar
- **Public:** `src/components/public/` — Header, Footer, PublicShell, PageHero, ProgrammeDetail
- **Dashboard:** `src/components/dashboard/` — Shell, Sidebar, Topbar
- **Type:** Inter (sans), Fraunces (display), JetBrains Mono (mono/data)

## API

### Endpoints

| Resource | Method | Path |
|---|---|---|
| Health | GET | `/api/health` |
| Users | GET | `/api/users`, `/api/users/:id` |
| Children | GET | `/api/children`, `/api/children/:id` |
| Parents | GET | `/api/parents`, `/api/parents/:id` |
| Staff | GET | `/api/staff` |
| Classrooms | GET | `/api/classrooms` |
| Attendance | GET | `/api/attendance`, `/api/attendance/child/:id` |
| Daily reports | GET | `/api/daily-reports`, `/api/daily-reports/child/:id` |
| Announcements | GET | `/api/announcements?audience=parent\|teacher\|all` |
| Invoices | GET | `/api/invoices`, `/api/invoices/summary` |
| Payments | GET | `/api/payments` |
| Allergies | GET | `/api/allergies` |
| Incidents | GET | `/api/incidents` |
| Authorized pickups | GET | `/api/authorized-pickups?childId=...` |
| Messages | GET | `/api/messages`, `/api/messages/:threadId` |

All responses are JSON. CORS is open to `WEB_ORIGIN` (defaults to `http://localhost:3000`).

### Seed

`apps/api/prisma/seed.ts` populates the database with realistic Windhoek-flavoured data: users, parents, staff, classrooms, children, today's attendance, daily reports, allergies, incidents, authorized pickups, announcements, invoices, payments, and a sample message thread.

## Account Access Model

Babies & Todd's Academy uses admin-created accounts. Staff and parent/guardian accounts are created, invited, verified, suspended, or archived by an academy admin from `/app/admin/users`.

Parents and staff receive access only after admin approval. Public visitors do not create accounts directly; they use admissions, visit, or contact/enquiry forms.

Future authentication should follow an invite-based flow: admin creates account, invitation email is sent, user accepts, admin verifies the required details, and the account becomes active.

### Invitation email setup

The admin Users & Access page sends invitations through the API email service. In development, missing credentials place invitations in preview mode so the admin workflow still works without sending real email.

To send real invitations, configure `apps/api/.env`:

```env
EMAIL_PROVIDER="resend"
EMAIL_FROM="Babies & Todd's Academy <noreply@yourdomain.com>"
RESEND_API_KEY="your-resend-api-key"
WEB_ORIGIN="http://localhost:3010"
```

The flow is: admin creates staff or parent account, the API creates the user record, an invitation token is generated, email is sent or previewed, and the account appears in the verification queue until admin approval.

## Deferred

Authentication (Cognito), real payments, AI-assisted reports, and S3 media storage are intentionally deferred — the schema and API client are structured to accommodate them.
