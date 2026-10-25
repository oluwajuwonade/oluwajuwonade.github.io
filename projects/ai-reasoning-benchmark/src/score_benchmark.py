"""Score objective economics/statistics answers and flag subjective items for human review."""
from __future__ import annotations

import argparse
import math
import re
from pathlib import Path

import pandas as pd


def normalize(value: str) -> str:
    value = str(value).strip().lower()
    value = re.sub(r"[^a-z0-9.+%-]+", " ", value)
    return re.sub(r"\s+", " ", value).strip()


def parse_number(value: str):
    match = re.search(r"[-+]?(?:\d+\.?\d*|\.\d+)(?:[eE][-+]?\d+)?", str(value).replace(",", ""))
    return float(match.group()) if match else None


def score_row(row: pd.Series, answer: str) -> dict:
    answer_type = str(row["answer_type"]).lower().strip()
    if not str(answer).strip():
        return {"score": None, "status": "missing_response", "scoring_mode": "none"}
    if answer_type == "manual_review":
        return {"score": None, "status": "manual_review", "scoring_mode": "human_required"}
    if answer_type == "numeric":
        got, expected = parse_number(answer), parse_number(row["reference_answer"])
        if got is None or expected is None:
            return {"score": 0, "status": "unparseable", "scoring_mode": "numeric_tolerance"}
        tolerance = float(row["numeric_tolerance"])
        correct = abs(got - expected) <= tolerance
        return {"score": int(correct), "status": "correct" if correct else "incorrect", "scoring_mode": "numeric_tolerance"}
    if answer_type in {"exact", "categorical", "short_exact"}:
        correct = normalize(answer) == normalize(row["reference_answer"])
        return {"score": int(correct), "status": "correct" if correct else "incorrect", "scoring_mode": "normalized_exact_match"}
    return {"score": None, "status": "manual_review", "scoring_mode": "human_required"}


def wilson_interval(successes: int, total: int, z: float = 1.96):
    if total == 0:
        return None, None
    p = successes / total
    den = 1 + z * z / total
    center = (p + z * z / (2 * total)) / den
    half = z * math.sqrt(p * (1 - p) / total + z * z / (4 * total * total)) / den
    return max(0.0, center - half), min(1.0, center + half)


def evaluate(benchmark: pd.DataFrame, responses: pd.DataFrame) -> pd.DataFrame:
    required_q = {"question_id", "answer_type", "reference_answer", "numeric_tolerance"}
    required_r = {"question_id", "model_name", "model_answer"}
    if not required_q.issubset(benchmark.columns):
        raise ValueError(f"Benchmark is missing: {sorted(required_q - set(benchmark.columns))}")
    if not required_r.issubset(responses.columns):
        raise ValueError(f"Responses are missing: {sorted(required_r - set(responses.columns))}")
    merged = responses.merge(benchmark, on="question_id", how="left", validate="many_to_one")
    if merged["answer_type"].isna().any():
        raise ValueError("Response file contains question_id values missing from the benchmark")
    scores = [score_row(row, answer) for (_, row), answer in zip(merged.iterrows(), merged["model_answer"])]
    score_df = pd.DataFrame(scores)
    return pd.concat([merged, score_df], axis=1)


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--benchmark", required=True)
    parser.add_argument("--responses", required=True)
    parser.add_argument("--output-dir", default="projects/ai-reasoning-benchmark/outputs")
    args = parser.parse_args()
    benchmark = pd.read_csv(args.benchmark).fillna({"reference_answer": ""})
    responses = pd.read_csv(args.responses).fillna({"model_answer": ""})
    detail = evaluate(benchmark, responses)
    out = Path(args.output_dir)
    out.mkdir(parents=True, exist_ok=True)
    detail.to_csv(out / "item_scores.csv", index=False)
    automatic = detail.dropna(subset=["score"])
    summaries = []
    for name, group in detail.groupby("model_name"):
        scored = group.dropna(subset=["score"])
        n, correct = len(scored), int(scored["score"].sum())
        low, high = wilson_interval(correct, n)
        summaries.append({
            "model_name": name,
            "benchmark_items": len(group),
            "automatically_scored_items": n,
            "manual_review_items": int((group["status"] == "manual_review").sum()),
            "missing_items": int((group["status"] == "missing_response").sum()),
            "automatic_accuracy": correct / n if n else None,
            "wilson_95_low": low,
            "wilson_95_high": high,
        })
    pd.DataFrame(summaries).to_csv(out / "model_summary.csv", index=False)
    print(pd.DataFrame(summaries).to_string(index=False))


if __name__ == "__main__":
    main()
