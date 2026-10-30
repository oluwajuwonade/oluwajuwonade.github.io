# Cognitive Compass

Cognitive Compass is a free, browser-based cognitive assessment and development laboratory. It offers original educational tasks across eight cognitive domains, heuristic adaptive difficulty, raw-accuracy reporting, answer explanations, local attempt history and focused practice.

## Live application

https://oluwajuwonade.vercel.app/projects/cognitive-compass/

## Core experience

- Eight domains: fluid reasoning, numerical reasoning, verbal reasoning, pattern recognition, working memory, processing speed, spatial reasoning and critical thinking.
- 24-item assessment with three items per domain and adaptive difficulty routing.
- Immediate answer submission and performance feedback through the final domain dashboard.
- Domain-level raw accuracy, overall raw accuracy, descriptive strengths and development priorities.
- Personal attempt history and print/save-as-PDF report.
- Free development laboratory with original exercises, explanations and unlimited retries.
- Responsive static application; no registration, payment, external scoring API or mandatory subscription.
- Local browser storage for assessment session, history and practice completion.

## Methodology and interpretation

Each item is scored 1 for the keyed answer and 0 otherwise. Overall raw accuracy is correct answers divided by attempted items. Domain raw accuracy is correct answers divided by attempted items in that domain. Domains are reported separately; there is no IQ conversion, age adjustment, norm-referenced standardisation or population percentile.

Adaptive routing begins at target difficulty 2 within each domain. Correct answers raise the next target by one level; incorrect answers lower it by one level, bounded from 1 to 3. The next unused item closest to the target is selected. This is heuristic routing, not calibrated item-response theory.

The item pool has not undergone representative norming, reliability studies, construct validation, criterion validation or independent psychometric review. This is an informal educational self-assessment, not a clinically validated IQ test or diagnostic instrument. Results must not be used for hiring, admissions, diagnosis or other high-stakes decisions. Processing-speed tasks and elapsed time are descriptive only; device latency, reading speed, interruptions and accessibility settings affect performance. Practice feedback supports task-specific learning and does not guarantee general cognitive transfer.

## Privacy

The core assessment runs in the browser. Assessment history, active session and practice completion are stored in local storage on the current device and do not synchronise across devices. No account or personal information is required. Users can clear local data within the app or through browser site settings. Hosting providers may process standard technical request logs.

## Technical structure

The app is a self-contained static HTML document with embedded CSS and JavaScript. No build step, dependency installation, database or environment variables are required. The Vercel-connected GitHub Pages-style portfolio repository deploys the `docs/` tree; the `projects/` copy is kept in sync for source consistency.
