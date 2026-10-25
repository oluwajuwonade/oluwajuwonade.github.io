"""Build descriptive outputs from a World Bank Nigeria indicator extract."""
from __future__ import annotations

import argparse
from pathlib import Path

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import pandas as pd

REQUIRED = {
    "country_code", "country", "year", "indicator_code", "indicator_name",
    "value", "retrieved_at_utc", "source_url",
}


def transform(data: pd.DataFrame):
    missing = REQUIRED.difference(data.columns)
    if missing:
        raise ValueError(f"Missing required columns: {sorted(missing)}")
    clean = data.copy()
    clean["year"] = pd.to_numeric(clean["year"], errors="raise").astype(int)
    clean["value"] = pd.to_numeric(clean["value"], errors="coerce")
    clean = clean.drop_duplicates(["country_code", "year", "indicator_code"], keep="last")
    wide = clean.pivot(index="year", columns="indicator_code", values="value").sort_index()
    observed = clean.dropna(subset=["value"]).sort_values("year")
    latest = observed.groupby(["indicator_code", "indicator_name"], as_index=False).tail(1)
    latest = latest[[
        "indicator_code", "indicator_name", "year", "value", "unit",
        "source_url", "retrieved_at_utc",
    ]].sort_values("indicator_code")
    coverage = clean.groupby(["indicator_code", "indicator_name"], as_index=False).agg(
        rows_returned=("year", "size"),
        first_year=("year", "min"),
        last_year=("year", "max"),
        non_missing_values=("value", "count"),
        missing_values=("value", lambda x: int(x.isna().sum())),
    )
    coverage["missing_share"] = coverage["missing_values"] / coverage["rows_returned"]
    return clean, wide, latest, coverage


def write_outputs(input_path: str | Path, output_dir: str | Path):
    raw = pd.read_csv(input_path)
    clean, wide, latest, coverage = transform(raw)
    out = Path(output_dir)
    charts = out / "charts"
    charts.mkdir(parents=True, exist_ok=True)
    wide.to_csv(out / "nigeria_indicators_wide.csv")
    latest.to_csv(out / "latest_available_indicators.csv", index=False)
    coverage.to_csv(out / "coverage_diagnostics.csv", index=False)

    for code in wide.columns:
        series = wide[code].dropna()
        if series.empty:
            continue
        labels = clean.loc[clean["indicator_code"] == code, "indicator_name"].dropna()
        title = labels.iloc[0] if len(labels) else code
        fig, ax = plt.subplots(figsize=(8.5, 4.8))
        ax.plot(series.index, series.values, marker="o", linewidth=1.8)
        ax.set(title=f"Nigeria — {title}", xlabel="Year", ylabel=title)
        ax.grid(alpha=0.25)
        fig.tight_layout()
        fig.savefig(charts / f"{code.replace('.', '_')}.png", dpi=150)
        plt.close(fig)

    rows = [
        "# Nigeria Economic Intelligence — Evidence Brief",
        "",
        "## Latest available observations",
        "",
        "Observation years can differ by indicator. Values below are from the downloaded extract, not a common-year snapshot.",
        "",
        "| Indicator | Latest year | Value |",
        "|---|---:|---:|",
    ]
    for _, row in latest.iterrows():
        rows.append(f"| {row['indicator_name']} ({row['indicator_code']}) | {int(row['year'])} | {row['value']:.5g} |")
    rows += [
        "",
        "## Interpretation and limitations",
        "",
        "- These are descriptive observations; co-movement does not establish causality.",
        "- World Bank historical series can be revised; retrieval timestamps and source URLs are retained for provenance.",
        "- The official exchange-rate series does not describe every exchange-rate market.",
        "- Modelled ILO unemployment estimates may differ from national survey definitions.",
        "- Macro aggregates alone do not establish household-level distributional effects.",
        "",
        "## Source",
        "",
        "World Bank Indicators API documentation: https://datahelpdesk.worldbank.org/knowledgebase/articles/889392-about-the-indicators-api-documentation",
        "",
    ]
    (out / "executive_brief.md").write_text("\n".join(rows), encoding="utf-8")
    return latest, coverage


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--input", default="projects/nigeria-economic-intelligence/data/world_bank_nigeria.csv")
    parser.add_argument("--output", default="projects/nigeria-economic-intelligence/outputs")
    args = parser.parse_args()
    latest, coverage = write_outputs(args.input, args.output)
    print(f"Wrote {len(latest)} latest observations and {len(coverage)} coverage rows")


if __name__ == "__main__":
    main()
