# CareTogether

A calm, mobile-first support space for family caregivers.

The current version is an interactive private prototype with:

- A user-selected daily focus list with an unlimited backlog
- Topic-based caregiver conversations
- Consent-based connection requests and private messages
- Gentle rotating encouragement
- Community safety and moderation concepts
- Installable PWA metadata

Prototype changes are stored only in the browser. Supabase schema and
row-level-security policies are included for the production backend, but cloud
authentication and email delivery are intentionally not enabled yet.

## Run locally

```powershell
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The interactive dashboard
is at [http://localhost:3000/home](http://localhost:3000/home).

## Shared prototype

The static website is published from the `docs` folder on the `main` branch:

[https://hyoshis.github.io/caretogether/](https://hyoshis.github.io/caretogether/)

## Validate

```powershell
npm run lint
npm run typecheck
npm test
npm run build
```

## Production configuration

Copy `.env.example` to `.env.local` and add Supabase credentials when moving
beyond the private prototype. The initial database migration is in
`supabase/migrations`.
