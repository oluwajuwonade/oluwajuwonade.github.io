"""Generate a synthetic transaction demo and evaluate a risk model chronologically."""
from __future__ import annotations

import argparse
import json
from pathlib import Path

import numpy as np
import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    average_precision_score, confusion_matrix, f1_score,
    precision_recall_curve, precision_score, recall_score, roc_auc_score,
)
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler

FEATURES = [
    "amount", "hour", "merchant_risk", "card_not_present", "international",
    "distance_km", "account_age_days", "velocity_1h", "velocity_24h",
]


def make_synthetic_transactions(rows: int = 12000, seed: int = 41) -> pd.DataFrame:
    """Create fictional observations; no bank/customer data is used."""
    if rows < 300:
        raise ValueError("rows must be at least 300 for temporal train/validation/test splits")
    rng = np.random.default_rng(seed)
    timestamps = pd.date_range("2024-01-01", periods=rows, freq="5min", tz="UTC")
    amount = np.clip(rng.lognormal(3.5, 1.0, rows), 1, 5000)
    hour = timestamps.hour.to_numpy()
    merchant_risk = rng.beta(2, 5, rows)
    card_not_present = rng.binomial(1, 0.42, rows)
    international = rng.binomial(1, 0.12, rows)
    distance_km = rng.exponential(85, rows)
    account_age_days = rng.integers(1, 4000, rows)
    velocity_1h = rng.poisson(1.1, rows)
    velocity_24h = rng.poisson(4.0, rows)
    logit = (
        -5.1 + 0.0010 * amount + 2.0 * merchant_risk + 0.9 * card_not_present
        + 0.8 * international + 0.0018 * distance_km
        - 0.00018 * account_age_days + 0.21 * velocity_1h + 0.045 * velocity_24h
        + 0.22 * (hour <= 4)
    )
    probability = 1 / (1 + np.exp(-logit))
    is_fraud = rng.binomial(1, probability)
    return pd.DataFrame({
        "transaction_id": [f"TX{i:07d}" for i in range(rows)],
        "timestamp": timestamps,
        "amount": amount,
        "hour": hour,
        "merchant_risk": merchant_risk,
        "card_not_present": card_not_present,
        "international": international,
        "distance_km": distance_km,
        "account_age_days": account_age_days,
        "velocity_1h": velocity_1h,
        "velocity_24h": velocity_24h,
        "is_fraud": is_fraud,
    })


def choose_threshold(y: np.ndarray, score: np.ndarray) -> float:
    precision, recall, thresholds = precision_recall_curve(y, score)
    if len(thresholds) == 0:
        return 0.5
    f1 = 2 * precision[:-1] * recall[:-1] / (precision[:-1] + recall[:-1] + 1e-12)
    return float(thresholds[int(np.nanargmax(f1))])


def evaluate(y: np.ndarray, score: np.ndarray, threshold: float) -> dict:
    pred = (score >= threshold).astype(int)
    tn, fp, fn, tp = confusion_matrix(y, pred, labels=[0, 1]).ravel()
    return {
        "n_test": int(len(y)),
        "fraud_prevalence": float(y.mean()),
        "threshold": float(threshold),
        "average_precision": float(average_precision_score(y, score)),
        "roc_auc": float(roc_auc_score(y, score)) if len(np.unique(y)) > 1 else None,
        "precision": float(precision_score(y, pred, zero_division=0)),
        "recall": float(recall_score(y, pred, zero_division=0)),
        "f1": float(f1_score(y, pred, zero_division=0)),
        "false_positive_rate": float(fp / (fp + tn)) if fp + tn else 0.0,
        "true_positives": int(tp), "false_positives": int(fp),
        "true_negatives": int(tn), "false_negatives": int(fn),
        "review_alert_rate": float(pred.mean()),
    }


def run(rows: int, output_dir: str | Path) -> dict:
    data = make_synthetic_transactions(rows=rows)
    n = len(data)
    train_end, validation_end = int(n * 0.70), int(n * 0.85)
    train, validation, test = data.iloc[:train_end], data.iloc[train_end:validation_end], data.iloc[validation_end:]
    if any(part["is_fraud"].nunique() < 2 for part in (train, validation, test)):
        raise ValueError("Each chronological split must contain both label classes; increase rows or change the seed")
    model = make_pipeline(StandardScaler(), LogisticRegression(class_weight="balanced", max_iter=2000, random_state=41))
    model.fit(train[FEATURES], train["is_fraud"])
    validation_score = model.predict_proba(validation[FEATURES])[:, 1]
    threshold = choose_threshold(validation["is_fraud"].to_numpy(), validation_score)
    test_score = model.predict_proba(test[FEATURES])[:, 1]
    metrics = evaluate(test["is_fraud"].to_numpy(), test_score, threshold)
    metrics.update({
        "model": "balanced_logistic_regression",
        "data_disclosure": "synthetic demonstration data only",
        "split": "chronological 70% train / 15% validation / 15% test",
        "threshold_selected_on": "validation window only",
        "n_rows_total": n,
    })
    out = Path(output_dir)
    out.mkdir(parents=True, exist_ok=True)
    (out / "metrics.json").write_text(json.dumps(metrics, indent=2), encoding="utf-8")
    predictions = test[["transaction_id", "timestamp", "is_fraud"]].copy()
    predictions["risk_score"] = test_score
    predictions["predicted_for_review"] = (test_score >= threshold).astype(int)
    predictions.to_csv(out / "holdout_predictions.csv", index=False)
    print(json.dumps(metrics, indent=2))
    return metrics


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--rows", type=int, default=12000)
    parser.add_argument("--output-dir", default="projects/fraud-risk-analytics/outputs")
    args = parser.parse_args()
    run(args.rows, args.output_dir)


if __name__ == "__main__":
    main()
