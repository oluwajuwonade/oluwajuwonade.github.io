# AI Reasoning Benchmark — Economics and Statistics

A small evaluation harness for structured economics/statistics questions. It supports exact normalized matching, numeric matching with explicit tolerances, and human review for open-ended answers.

## Run

Install dependencies with pip install -r projects/ai-reasoning-benchmark/requirements.txt.

Run python projects/ai-reasoning-benchmark/src/score_benchmark.py --benchmark projects/ai-reasoning-benchmark/data/economics_reasoning_benchmark.csv --responses projects/ai-reasoning-benchmark/data/demo_model_outputs.csv --output-dir projects/ai-reasoning-benchmark/outputs.

## Evaluation boundary

Only objective items with deterministic scoring are included in automatic accuracy. Open-ended explanations are flagged for human review rather than being scored by a brittle string comparison. The demo response file contains illustrative placeholder responses, not outputs claimed to come from a deployed model.

This is a starter benchmark, not a validated test of general model capability. A credible study would pre-register scoring rules, independently review the answer key, use representative items, compare multiple models and versions, measure confidence intervals, and report inter-rater agreement for human-judged answers.
