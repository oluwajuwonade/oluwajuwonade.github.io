# Cognitive Compass

Cognitive Compass is a free, browser-first cognitive assessment and development platform. It provides original educational reasoning tasks, an eight-domain performance profile, transparent heuristic routing, item-level explanations, a local progress dashboard and a practical development laboratory.

## Live application

https://oluwajuwonade.vercel.app/projects/cognitive-compass/

## Assessment system

- **Eight domains:** fluid reasoning, numerical reasoning, verbal reasoning, pattern recognition, working memory, processing speed, spatial reasoning and critical thinking.
- **80 original assessment items:** 10 items per domain.
- **40 items per complete run:** five sampled in each domain.
- **Adaptive routing:** each domain starts at target difficulty 2. A correct response raises the next target by one level; an incorrect response lowers it by one, bounded from 1 to 3. The next unused item closest to the target is selected. Ties are random.
- **Scoring:** raw accuracy only; every domain contributes five items to a complete run. Difficulty does not change point weight.
- **Memory interactions:** stimuli are hidden before answer choices appear, supporting a short self-paced recall task.
- **Processing-speed items:** response-time summaries are descriptive and device-specific, not norm-referenced.
- **Feedback:** assessment explanations and correct answers are available in the completed report.

## Development laboratory

- 16 original practice exercises across all eight domains.
- Immediate answer feedback, explanations, unlimited retries and completion tracking.
- Four structured practice pathways: reasoning foundations, quantitative clarity, memory and attention, and patterns and space.
- Suggestions based on the lowest-scoring domain in the latest assessment run.

## Dashboard and privacy

- Eight-domain raw-accuracy profile and a historical performance chart.
- Run-specific relative strength and development focus, with small-sample caveats.
- Answer-by-answer review, printable report and local JSON export.
- No account, subscription, payment flow or paywall.
- Assessment and scoring run in the browser. Session, history and practice completion are stored in local storage on the current device.
- Local data can be exported or cleared. It is not encrypted by the app and does not sync between devices.
- No server-side scoring API or cloud profile is used.

## Architecture

The application is static, dependency-light JavaScript with no framework or package installation required.

- index.html — semantic application shell and script/style loading.
- styles.css — design tokens, original navy/cyan interface and responsive/accessibility styles.
- data.js — eight domain definitions, 80 assessment items and 16 practice exercises.
- engine.js — adaptive selection, answer validation, score calculation and content-integrity checks.
- app.js — app routes, assessment flow, local persistence, dashboard, reports, privacy controls and practice lab.
- tests/assessment.test.mjs — deterministic assessment-engine tests.

The deployed static route is under docs/projects/cognitive-compass/. A mirror is maintained under projects/cognitive-compass/.

## Test commands

From the repository root:

node --test projects/cognitive-compass/tests/assessment.test.mjs

The test suite covers bank integrity, domain balance, complete 40-item selection, adaptive difficulty, raw scoring, memory stimuli and invalid responses.

## Scoring methodology and limitations

Each item contributes one point when the keyed response is selected and zero otherwise. Overall raw accuracy is correct answers divided by attempted items. Domain raw accuracy is correct responses divided by attempted items in that domain. A complete assessment has 40 questions and five questions per domain.

The adaptive selector is a transparent heuristic, not an item-response-theory model or a calibrated computer-adaptive test. Difficulty labels are author-assigned. The item bank has not undergone representative norming, reliability analysis, construct or criterion validation, fairness/bias analysis, or independent psychometric review. Five items per domain is a small sample. The product does not produce IQ scores, population percentiles, diagnoses or high-stakes recommendations.

The working-memory tasks are informal, self-paced hide-and-recall prompts. Processing-speed timing depends on the device, input method, reading speed and environment. Practice feedback supports task-specific learning and familiarity; the product does not claim that exercises increase IQ or cause broad transfer to general intelligence.

Use Cognitive Compass for exploration, reflection and practice—not diagnosis, recruitment, admissions, school placement or other high-stakes decisions.

## Hosting and persistence

The app is deployed as static assets through the existing Vercel-connected repository. No database, account system, build command, environment variables or external scoring service is required. Local progress may be lost if browser site data is cleared, storage is unavailable or the user changes devices.
