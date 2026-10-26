# SkillForge Learning

A mobile-first, static learning application for Data Analytics, AI, Economics, Quantitative Research, and income generation.

**Live site:** https://skillforge-learning-oluwajuwonade.vercel.app/

## Brand system
See [BRAND.md](./BRAND.md) for the palette and logo usage. Primary colors: Forge Teal `#00E5C4`, Deep Teal `#00B3A4`, Midnight Navy `#0B1320`, Clean Light `#F7FAFC`, and Signal Blue `#3F7CFF`.

The refreshed cap-and-rising-S mark is in `icon.svg`; the full horizontal wordmark is `logo-lockup.svg`.

## Included
- 28-day practical learning challenge with objectives, examples, exercises, deliverables, and knowledge checks.
- Four tracks: Data Analytics & BI, AI & Automation, Economics & Research, and Income & Client Acquisition.
- Browser-local progress, saved lessons, quiz feedback, project milestones, and a quality checklist.
- Built-in 25-minute focus timer with 5-minute and 15-minute break modes.
- Local-calendar-aware learning streaks and a service worker that refreshes page content while preserving an offline fallback.
- Transparent rule-based skill assessment.
- JSON learning-record export and downloadable AI-study prompts.
- Responsive UI and installable progressive-web-app manifest/service worker.

## Run locally
Open `index.html` in a browser. Core lessons and progress features work without a build step or API key. PWA functionality requires HTTPS or localhost.

## Deploy
Deploy this directory as a static site. Relative manifest and service-worker paths support both a domain root and a project subpath.

## Product boundaries
This version does **not** include a live generative AI backend, user accounts, server-side progress sync, payment processing, admin content management, email notifications, or credential issuance. The study-prompt builder creates a prompt to use in an existing AI assistant; it does not call an AI service. No earnings, employment outcomes, or certifications are promised.

## Privacy
Progress and assessment information are saved in local browser storage. The export function creates a downloadable JSON record. The app does not send these records to a server.

## License
MIT. See `LICENSE`.
