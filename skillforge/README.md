# SkillForge Learning

A mobile-first, static learning application for Data Analytics, AI, Economics, Quantitative Research, and income generation.

**Live site:** https://skillforge-learning-oluwajuwonade.vercel.app/

## Included
- 28-day practical learning challenge with objectives, examples, exercises, deliverables, and knowledge checks.
- Four tracks: Data Analytics & BI, AI & Automation, Economics & Research, and Income & Client Acquisition.
- Browser-local progress, saved lessons, quiz feedback, project milestones, and a quality checklist.
- Transparent rule-based skill assessment.
- JSON learning-record export and downloadable AI-study prompts.
- Responsive UI and progressive-web-app manifest/service worker.

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
