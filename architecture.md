# Architecture

## Runtime

The MVP is a Next.js App Router application with Persian-first RTL UI. It currently persists demo/user workflow state in `localStorage` so the full product flow works without external credentials.

## Domains

- `src/domain`: deterministic training, nutrition, progression, adaptation, meal, and reminder logic.
- `src/data`: seed exercises, foods, knowledge, and demo user data.
- `src/features`: route-level product surfaces.
- `src/lib/ai`: AI provider abstraction with a mock provider.
- `src/lib/notifications`: browser notification abstraction.
- `src/lib/health`: future health provider abstraction with manual measurements now.
- `supabase/migrations`: PostgreSQL schema and RLS policies for real deployment.
- `src/domain/coach-methodology.ts`: turns a coach's raw method into structured rules and an optional AI-review result.

## Supabase Path

Supabase Auth should own identity. `profiles.id` references `auth.users(id)`. User-owned tables include `user_id` and RLS policies restrict rows to `(select auth.uid()) = user_id`. Admin authorization is stored in `profiles.role`; production should move high-trust role assignment to server-side/admin-only flows and avoid user-editable JWT metadata.

Supabase changelog context checked on 2026-08-15: new public tables may not be exposed to Data API automatically, and explicit exposure/grants may be needed. RLS is enabled on all public tables.

## AI

AI receives only reduced context needed for the current question: profile summary, program rationale, and nutrition target. Deterministic calculations are never delegated to AI.

Coach methodology review is also modeled as an AI-assisted workflow. Unreviewed raw coaching material is not allowed to directly replace safety rules; it becomes structured rules, receives findings/warnings, and must be approved before activation.

## Notifications

The MVP supports stored reminders, in-app visibility, service worker registration, and browser notification permission. Native push can be added by implementing the existing provider contract.
