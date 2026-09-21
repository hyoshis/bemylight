# Be My Light

A calm, mobile-first support space for people navigating health challenges and the people who support them.

The current version is an interactive private prototype with:

- Two separate experiences: one for people living with a condition and one for
  caregivers, with their own posts, connections, conversations, tasks, and copy
- Voice or text task capture that turns a spoken description into a clear task
  list you can keep or hand to someone you trust
- A user-selected daily focus list with an unlimited backlog
- Topic-based community conversations
- Consent-based connection requests and private messages
- Gentle rotating encouragement
- A shared candlelight motif that stays present but quiet across the app
- Community safety and moderation concepts
- Installable PWA metadata

Prototype changes are stored only in the browser. Supabase schema and
row-level-security policies are included for the production backend, but cloud
authentication and email delivery are intentionally not enabled yet.

## Task organizer agent

`azure-functions/task-agent` hosts an Azure Functions endpoint that turns a
free-form description into a task list. The app calls it from the My focus page
using `NEXT_PUBLIC_TASK_AGENT_URL`. Speech is transcribed in the browser with
the Web Speech API where available, and if the endpoint cannot be reached the
app falls back to organizing the text on the device so the flow keeps working.

## Run locally

```powershell
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The interactive dashboard
is at [http://localhost:3000/home](http://localhost:3000/home).

## Shared prototype

The static site is published from the `gh-pages` branch:

[https://hyoshis.github.io/bemylight/](https://hyoshis.github.io/bemylight/)

Build and publish with:

```powershell
$env:GITHUB_ACTIONS="true"; $env:GITHUB_REPOSITORY="hyoshis/bemylight"; npm run build
```

Then copy the contents of `out/` to the `gh-pages` branch root, keeping the
`.nojekyll` file so that GitHub Pages serves the `_next` folder.

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
