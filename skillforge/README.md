# SkillForge Learning

**SkillForge — Learn skills. Build proof. Create options.**

A free-first, mobile-friendly practical learning platform for Data Analytics & BI, Artificial Intelligence & Automation, Economics & Quantitative Research, and Professional Development & Income Generation.

**Live site:** https://skillforge-learning-oluwajuwonade.vercel.app/

## Product architecture

SkillForge preserves the original 28-day practical challenge and adds a structured Academy layer. They are separate learning experiences so the short challenge remains useful while the Academy supports deeper, sequenced study.

### Academy curriculum

The Academy currently contains four independent programmes:

1. **Applied Data Analytics & BI** — analytical problem framing, measurement, data quality, descriptive analysis, relational data, SQL reasoning, visualisation and decision reporting.
2. **Applied AI & Workflow Automation** — generative AI fundamentals, prompt design, source verification, model/workflow evaluation, process mapping, automation controls, Python workflow concepts and responsible AI.
3. **Economics & Quantitative Research** — descriptive statistics, probability, sampling, inference, regression interpretation, economic indicators, forecasting and policy communication.
4. **Professional Analytics & Independent Work** — buyer/problem positioning, service scope, portfolio evidence, market validation, proposal writing, pricing, client communication and delivery operations.

The current structured catalogue contains 8 courses, 16 modules and 32 lessons. Each lesson provides a learning objective, explanation, worked example, guided practice, applied deliverable, one knowledge check and further reading where relevant. Courses require lesson completion and a course assessment (75% pass threshold) before the next course unlocks. This is an informal SkillForge learning assessment, not an accredited examination or validated professional certification.

Each programme includes a target learner, entry guidance, learning outcomes, competency areas, course sequence, external learning resources and a capstone brief.

### Practical learning laboratory

- Local CSV profiler (up to 5 MB): row/column counts, blank cells, exact duplicate rows, basic column-type hints and a five-row preview. File contents are processed in the browser and are not uploaded.
- Business KPI calculator: revenue, gross profit, gross margin and period comparison.
- Economics calculator: midpoint price elasticity from two price/quantity observations.
- Professional planning calculator: minimum billable hourly rate from an income target, operating costs and billable hours.
- SQL reasoning challenge: write and self-review a query. It does not execute SQL.

This release does not execute arbitrary Python code in the browser. Hosted code execution can be integrated later behind a secure, isolated execution service.

### Applied project portfolio

Four progressive project briefs cover foundation, applied, professional and capstone work. Learners can record reflections, save a public artifact URL and self-review against a project rubric. Saving a project records learner-entered evidence; SkillForge does not independently grade or authenticate the work.

### Competency and progression

Competency mapping is derived from linked lesson practice and saved project artifacts. Rules-based recommendations prioritise incomplete lessons and assessment gates inside enrolled programmes. Activity indicators are not presented as proof of mastery. No paid AI API is required.

## Existing 28-day challenge

The original challenge remains available with four tracks, 28 focused lessons, the rules-based diagnostic, lesson knowledge checks, project milestones, weekly progress, a focus timer, local-calendar streaks, downloadable study prompts and a JSON learning-record export.

## Technical architecture

- Static HTML/CSS/JavaScript; no framework build step is required.
- `index.html` contains the original challenge experience.
- `academy.js` contains the Academy curriculum data, rendering, assessments, local progression rules and browser-based lab.
- `sw.js` provides offline caching and network-first page navigation.
- `manifest.webmanifest`, `icon.svg` and `logo-lockup.svg` support the installable PWA identity.
- Brand details and accessibility colour guidance are in [BRAND.md](./BRAND.md).

## Run locally

Open `index.html` in a browser. For service-worker functionality, use HTTPS or localhost. The Academy does not require an API key.

## Deploy

Deploy this directory as a static site. Relative asset, manifest and service-worker paths support a domain root or a project subpath.

## Persistence, privacy and portability

- The original challenge stores its progress under `skillforge:v1:state` in browser local storage.
- The Academy stores its records under `skillforge:academy:v1` in browser local storage.
- Academy programme enrolment, lesson responses/completion, course assessment results and project reflections are device/browser-specific.
- The Academy export/import control packages its own state and the existing challenge state into a JSON record.
- There are no learner accounts or server-side progress synchronisation in this release. Clearing browser storage without an export can remove local records.
- CSV files selected in the data lab are processed locally; do not use confidential or personal data in this exercise.

## Product boundaries

This is an independent, non-accredited learning platform. It does not claim university affiliation, formal accreditation, employment outcomes or guaranteed income.

Not included in this static release: learner accounts, cross-device sync, server-side content management, live generative AI tutoring, hosted Python/SQL execution, email notifications, payments, independent project grading or credential issuance. Study prompts are generated for learners to use in their own preferred AI assistant; SkillForge does not call a generative AI backend.

## License

MIT. See [LICENSE](./LICENSE).