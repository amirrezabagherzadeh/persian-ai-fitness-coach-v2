# Project Handoff: Persian AI Fitness & Nutrition Coach

Date: 2026-08-16

## One-Line Summary

This is a Persian-first Next.js App Router MVP for an AI-assisted fitness and nutrition coach. It supports onboarding, deterministic training/nutrition generation, workout logging, food logging, reminders, progress tracking, weekly check-ins, AI coach mock responses, and admin coach-methodology ingestion.

## Local Start

```bash
npm install
npm run dev -- -p 3000
```

Open:

```text
http://localhost:3000
```

Useful routes:

- `/` landing page
- `/auth/signup` local mocked signup
- `/onboarding` assessment flow
- `/dashboard` today view
- `/program` generated training program
- `/workout/day-1` active workout flow
- `/nutrition` food logging
- `/nutrition/plan` generated meal plan
- `/progress` charts and progress summary
- `/check-in` weekly check-in
- `/coach` AI coach mock
- `/reminders` reminder manager
- `/admin` admin tools, including coach methodology ingestion

## Verification Commands

```bash
npm run typecheck
npm run test
npm run build
```

Last known verification:

- TypeScript: passed
- Tests: passed, 13 tests
- Production build: passed
- Local smoke checks for `/admin`, `/program`, `/dashboard`: passed

## Tech Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS v4 via global CSS
- Recharts
- Vitest
- Local browser persistence through `localStorage`
- Supabase-ready SQL migration, not connected at runtime yet

## Current Runtime Model

The MVP intentionally works without external credentials.

- Auth is mocked locally.
- User/app state is stored in browser `localStorage`.
- AI review and AI coach are local mock providers.
- Supabase schema exists, but the frontend is not yet wired to Supabase Auth/DB.
- Food/exercise/knowledge data is demo seed data unless explicitly marked otherwise.

## Main Product Workflows

### User Flow

1. User opens `/`.
2. User signs up through `/auth/signup`.
3. User completes `/onboarding`.
4. App generates a training program and meal plan.
5. User lands on `/dashboard`.
6. User can start a workout from `/workout/day-1`.
7. User can log foods from `/nutrition`.
8. User can complete weekly check-ins from `/check-in`.
9. User can ask simple plan questions in `/coach`.

### Admin / Coach Methodology Flow

Route: `/admin`

The admin can:

1. Enter a coach name, method title, target audience, and full programming method.
2. Choose whether AI should review the method.
3. Save the method.
4. Run AI review later if needed.
5. Approve the method.
6. Activate the method and regenerate the user program.

The methodology affects deterministic training generation through:

- preferred split
- volume bias
- RIR/intensity style
- progression style
- exercise-selection bias

Important: the method does not bypass safety/personalization. The engine still filters exercises by user equipment, experience, injury flags, and schedule.

## Code Map

### Routes

Routes live under:

```text
src/app
```

Most route components delegate to:

```text
src/features
```

### UI Shell

```text
src/components/AppShell.tsx
src/components/PageHeader.tsx
src/components/MetricCard.tsx
src/components/MacroProgress.tsx
src/app/globals.css
```

### Local Store

```text
src/store/app-store.tsx
```

This is the main local persistence layer. When wiring Supabase, this should be replaced or backed by server data fetching/mutations.

### Deterministic Domain Logic

```text
src/domain/nutrition.ts
src/domain/training.ts
src/domain/progression.ts
src/domain/adaptation.ts
src/domain/meal-plan.ts
src/domain/reminders.ts
src/domain/coach-methodology.ts
```

### Seed Data

```text
src/data/demo.ts
src/data/exercises.ts
src/data/foods.ts
src/data/knowledge.ts
src/data/coach-methodologies.ts
```

### AI Abstraction

```text
src/lib/ai/provider.ts
```

Currently uses `MockAIProvider`. Real AI should be server-side only and should not expose API keys to the browser.

### Notification Abstraction

```text
src/lib/notifications/provider.ts
```

Currently browser-notification-ready. Native push is not implemented.

### Database Schema

```text
supabase/migrations/20260815000000_initial_schema.sql
```

Includes normalized tables and RLS policies for profiles, measurements, health screening, programs, workouts, nutrition, reminders, check-ins, knowledge, program rules, AI logs, and coach methodologies.

## Important Files For The Next Developer

- `README.md`: setup and current limitations
- `HANDOFF.md`: this operational handoff
- `docs/architecture.md`: system architecture
- `docs/product-logic.md`: recommendation rules
- `.env.example`: environment variables
- `supabase/migrations/20260815000000_initial_schema.sql`: database schema

## Known Limitations

1. Supabase is not wired into the runtime yet.
2. Auth is local/mock only.
3. Admin CRUD is local only.
4. AI coach and AI methodology review are mock implementations.
5. Food and exercise datasets are small demo datasets.
6. Scientific knowledge records are marked demo where not verified.
7. Browser notifications are not native push.
8. Kalameh font support is prepared in CSS, but the provided zip was AES-encrypted and could not be extracted without a password. Put licensed `.woff2` files in `public/fonts` using the names in `public/fonts/README.md`.

## Suggested Next Steps

1. Wire Supabase Auth using server-side session validation.
2. Replace `localStorage` store with Supabase-backed data access.
3. Add real admin CRUD for exercises, foods, knowledge, rules, and coach methodologies.
4. Move AI coach and methodology review to server-only API routes or Server Actions.
5. Add audit logs for AI review and methodology approvals.
6. Expand exercise and food datasets with verified sources.
7. Add robust E2E/browser tests for onboarding, workout logging, food logging, and admin methodology activation.
8. Add deployment configuration once hosting target is chosen.

## Handoff Checklist

Before giving this project to another developer:

1. Give them the full repository, including `package-lock.json`.
2. Do not include `node_modules`, `.next`, or local `.env` files.
3. Tell them to run `npm install`.
4. Tell them to run `npm run dev -- -p 3000`.
5. Tell them to inspect `/admin` and `/dashboard` first.
6. Tell them real secrets must be added in `.env.local`, copied from `.env.example`.

## Current Local URL

```text
http://localhost:3000
```
