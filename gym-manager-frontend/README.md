# Ironsmith — Gym Membership Management System (Frontend)

A production-grade operational frontend for managing gym members. Built for gym
administrators and front-desk staff: a quiet, efficient SaaS console — not a
marketing site.

It connects to an existing Spring Boot microservices backend through an API
Gateway. This repository contains **only the frontend**; it does not modify or
require changes to the backend.

## Tech stack

- **Vue 3** (Composition API, `<script setup>`)
- **TypeScript** (strict mode)
- **Vite**
- **Vue Router** (route guards, lazy routes)
- **Pinia** (auth + member stores)
- **Axios** (dedicated API layer with interceptors)
- **Tailwind CSS** + **shadcn-vue** (reka-ui primitives)
- **lucide-vue-next** icons
- **vue-sonner** toasts
- **Vitest** + **@vue/test-utils** for tests

## Requirements

- Node.js 18.18+ (or 20+)
- npm 9+

## Getting started

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server
npm run dev
```

The app runs at http://localhost:5173.

## Backend connection

All requests go through the API Gateway. The base URL is read from
`VITE_API_BASE_URL`, set differently per mode:

- **`.env.development`** (used by `npm run dev`) sets it to `/`, so `/auth`
  and `/api` requests are handled by the Vite dev server proxy
  (`vite.config.ts`), which forwards them to `http://localhost:4004`. This
  avoids CORS entirely in development.
- **`.env.example`** shows the value to use for a production-style build or
  preview (`npm run build && npm run preview`), where there is no dev proxy:
  copy it to `.env` and set `VITE_API_BASE_URL=http://localhost:4004` (or
  your deployed gateway URL).

Endpoints consumed (the full public contract — nothing else is called):

| Method | Path                  | Purpose                            |
| ------ | --------------------- | ---------------------------------- |
| POST   | `/auth/login`         | Exchange credentials for a JWT     |
| GET    | `/auth/validate`      | Validate the current token         |
| GET    | `/api/members`        | List all members                   |
| POST   | `/api/members`        | Create a member (defaults ACTIVE)  |
| PUT    | `/api/members/{id}`   | Update a member                    |
| DELETE | `/api/members/{id}`   | Delete a member (204)              |

Backend constraints honored by this frontend:

- **No `GET /api/members/{id}`** — detail/edit screens load `GET /api/members`
  and locate the member by ID, showing a not-found state when absent.
- **No server-side search / filter / sort / pagination** — all done client-side.
- **`joinedDate` is immutable** — read-only on edit, never sent in updates.
- **New members default to `ACTIVE`** — `membershipStatus` is omitted on create.
- On update, `membershipStatus` is only sent when it actually changed.
- No registration, forgot-password, refresh-token, payment, check-in, class, or
  trainer calls are made.

## Authentication

- JWT is stored in `sessionStorage`.
- An Axios request interceptor attaches `Authorization: Bearer <token>`.
- The token is validated during app bootstrap (`GET /auth/validate`).
- A Vue Router guard protects every application route.
- A `401` response (except on login) clears the session and redirects to
  `/login`, preserving the intended destination via `?redirect=`.
- Logout is client-side only.

## Scripts

```bash
npm run dev        # start Vite dev server
npm run build      # type-check (vue-tsc) + production build
npm run preview    # preview the production build
npm run test       # run Vitest once
npm run test:watch # watch mode
npm run typecheck  # vue-tsc --noEmit
```

## Tests

Essential Vitest coverage lives in `src/tests/`:

- `router.test.ts` — route protection, redirect preservation, public routes.
- `auth.test.ts` — login persistence, logout, token-expiry bootstrap, and
  API-error mapping (401 + backend field errors).
- `member-filters.test.ts` — client-side search, filtering, sorting,
  pagination, and dashboard metric derivation.
- `member-payload.test.ts` — create/update payload generation (status omitted on
  create, `joinedDate` never sent on update, status preserved when unchanged).

## Project structure

```
src/
├── api/            # Axios instance, interceptors, auth + member clients
├── assets/         # Tailwind entry + theme tokens (light/dark)
├── components/
│   ├── ui/         # shadcn-vue primitives (reka-ui)
│   ├── layout/     # AppShell, sidebar, mobile nav, top bar, theme toggle
│   ├── common/     # PageHeader, MetricCard, Empty/Error/Loading states, FormField
│   ├── members/    # MemberTable, MemberForm, filters, badges, delete dialog
│   └── form/       # DatePicker
├── composables/    # useTheme
├── lib/            # utils, date helpers, filtering + payload logic, nav config
├── router/         # routes + auth guard
├── stores/         # auth + members Pinia stores
├── tests/          # Vitest suites
├── types/          # API contract types
└── views/          # route-level screens
```

## Screens

- `/login` — sign in
- `/dashboard` — client-side metrics + distribution
- `/members` — dense table with search, filters, sort, pagination
- `/members/new` — create member
- `/members/:id` — member detail
- `/members/:id/edit` — edit member (unsaved-changes guard)
- `/system` — Integrations & API (architecture + doc links)
- `*` — 404

## Design notes

- Neutral zinc/white foundation with restrained emerald accents.
- Semantic colors: emerald = active, amber = paused, red = cancelled/destructive,
  blue = Premium, gold = VIP.
- Light and dark themes (persisted).
- Cards use an 8px max radius; no nested cards.
- Desktop sidebar + mobile Sheet navigation; WCAG AA contrast and keyboard support.
