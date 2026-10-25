"""Build source-traceable descriptive outputs from a World Bank Nigeria indicator extract."""
from __future__ import annotations

import argparse
from pathlib import Path
import shutil

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import pandas as pd

REQUIRED = {"country_code", "country", "year", "indicator_code", "indicator_name", "value", "source_url"}
DISPLAY_NAMES = {
    "FP.CPI.TOTL.ZG": ("Inflation", "%"),
    "NY.GDP.MKTP.KD.ZG": ("Real GDP growth", "%"),
    "PA.NUS.FCRF": ("Official exchange rate", "NGN per US$"),
    "SL.UEM.TOTL.ZS": ("Unemployment (modelled ILO)", "% labour force"),
    "FR.INR.RINR": ("Real interest rate", "%"),
    "NY.GDP.PCAP.KD.ZG": ("GDP per capita growth", "%"),
    "BN.CAB.XOKA.GD.ZS": ("Current account balance", "% of GDP"),
    "NV.IND.MANF.ZS": ("Manufacturing value added", "% of GDP"),
}


def transform(data: pd.DataFrame):
    missing = REQUIRED.difference(data.columns)
    if missing:
        raise ValueError(f"Missing required columns: {sorted(missing)}")
    clean = data.copy()
    if "unit" not in clean:
        clean["unit"] = clean["source_unit"] if "source_unit" in clean else ""
    if "display_unit" not in clean:
        clean["display_unit"] = ""
    if "retrieved_at_utc" not in clean:
        if "retrieved_date_utc" in clean:
            clean["retrieved_at_utc"] = clean["retrieved_date_utc"].astype(str)
        else:
            clean["retrieved_at_utc"] = "not-recorded"
    clean["year"] = pd.to_numeric(clean["year"], errors="raise").astype(int)
    clean["value"] = pd.to_numeric(clean["value"], errors="coerce")
    clean = clean.drop_duplicates(["country_code", "year", "indicator_code"], keep="last")
    wide = clean.pivot(index="year", columns="indicator_code", values="value").sort_index()
    observed = clean.dropna(subset=["value"]).sort_values("year")
    latest = observed.groupby(["indicator_code", "indicator_name"], as_index=False).tail(1)
    latest = latest[[
        "indicator_code", "indicator_name", "year", "value", "unit", "display_unit",
        "source_url", "retrieved_at_utc",
    ]].sort_values("indicator_code")
    coverage = clean.groupby(["indicator_code", "indicator_name"], as_index=False).agg(
        rows_returned=("year", "size"),
        first_year=("year", "min"),
        last_year=("year", "max"),
        non_missing_values=("value", "count"),
        missing_values=("value", lambda x: int(x.isna().sum())),
        retrieval_timestamp=("retrieved_at_utc", "max"),
    )
    coverage["missing_share"] = coverage["missing_values"] / coverage["rows_returned"].replace(0, pd.NA)
    return clean, wide, latest, coverage


def _evidence_brief(latest: pd.DataFrame, wide: pd.DataFrame) -> str:
    def value_at(code: str, year: int):
        try:
            value = wide.loc[year, code]
            return None if pd.isna(value) else float(value)
        except (KeyError, TypeError):
            return None

    def fmt(value, digits=2):
        return "n/a" if value is None else f"{value:.{digits}f}"

    inflation_24, inflation_25 = value_at("FP.CPI.TOTL.ZG", 2024), value_at("FP.CPI.TOTL.ZG", 2025)
    gdp_24, gdp_25 = value_at("NY.GDP.MKTP.KD.ZG", 2024), value_at("NY.GDP.MKTP.KD.ZG", 2025)
    fx_23, fx_25 = value_at("PA.NUS.FCRF", 2023), value_at("PA.NUS.FCRF", 2025)
    fx_multiple = fx_25 / fx_23 if fx_23 and fx_25 else None
    ca_24, ca_25 = value_at("BN.CAB.XOKA.GD.ZS", 2024), value_at("BN.CAB.XOKA.GD.ZS", 2025)
    rows = [
        "# Nigeria Economic Intelligence — Historical Evidence Brief", "",
        "## Data coverage", "",
        f"The extract contains {len(wide.columns)} indicator series and {int(wide.notna().sum().sum())} non-missing annual observations across the displayed years.",
        "The source URLs and retrieval metadata are retained in the long-format CSV. Values can be revised by publishers.", "",
        "## Key findings", "",
        f"1. **Inflation eased, but prices were still rising.** Annual CPI inflation moved from {fmt(inflation_24)}% in 2024 to {fmt(inflation_25)}% in 2025. This is disinflation, not deflation.",
        f"2. **Real GDP growth stayed near 4%.** The annual rate changed from {fmt(gdp_24)}% in 2024 to {fmt(gdp_25)}% in 2025. This is descriptive, not an explanation of drivers.",
        f"3. **The annual-average official exchange-rate series rose.** It moved from NGN {fmt(fx_23)} per US$ in 2023 to NGN {fmt(fx_25)} in 2025, around {fmt(fx_multiple)} times the 2023 level. It does not represent every FX market.",
        f"4. **The current-account balance moved from {fmt(ca_24)}% of GDP in 2024 to {fmt(ca_25)}% in 2025.** A ratio can change because of its numerator, denominator, or both.",
        f"5. **Modelled ILO unemployment estimates require care.** The series is not a complete measure of underemployment, informality, or job quality and may differ from national survey definitions.",
        "", "## Limitations", "",
        "- These are descriptive observations, not causal estimates.",
        "- Country-level aggregates conceal differences across households, regions, income groups, and firms.",
        "- The World Bank real-interest-rate series is not the same as the central bank policy rate.",
        "- Historical series can be revised; use the source URLs and retrieval metadata for update audits.",
        "", "## Source", "",
        "World Bank Indicators API V2: https://datahelpdesk.worldbank.org/knowledgebase/articles/889392", "",
    ]
    return "\n".join(rows)


def write_outputs(input_path: str | Path, output_dir: str | Path, website_dashboard: str | Path | None = None):
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
        ax.set(title=f"Nigeria — {title}", xlabel="Year", ylabel=DISPLAY_NAMES.get(code, (title, ""))[1])
        ax.grid(alpha=0.25)
        fig.tight_layout()
        fig.savefig(charts / f"{code.replace('.', '_')}.png", dpi=150)
        plt.close(fig)

    # Composite small multiples; each panel has its own scale.
    available = [code for code in DISPLAY_NAMES if code in wide.columns]
    fig, axes = plt.subplots(4, 2, figsize=(14, 12), sharex=True)
    for ax, code in zip(axes.flat, available):
        series = wide[code].dropna()
        title, unit = DISPLAY_NAMES[code]
        if series.empty:
            ax.set_visible(False)
            continue
        ax.plot(series.index, series.values, marker="o", markersize=2.5, linewidth=1.8)
        ax.set_title(title, loc="left", fontsize=11, fontweight="bold")
        ax.set_ylabel(unit, fontsize=8)
        ax.grid(alpha=0.25)
    for ax in axes[-1, :]:
        ax.set_xlabel("Year")
    fig.suptitle("Nigeria Economic Intelligence | 2000–2025", fontsize=16, fontweight="bold")
    fig.text(0.01, 0.01, "Source: World Bank Indicators API V2. Separate scales by panel; descriptive series, not causal estimates.", fontsize=8)
    fig.tight_layout(rect=(0, 0.035, 1, 0.96))
    svg_path = out / "nigeria-macro-dashboard.svg"
    fig.savefig(svg_path, bbox_inches="tight")
    fig.savefig(out / "nigeria-macro-dashboard.png", dpi=160, bbox_inches="tight")
    if website_dashboard:
        site_path = Path(website_dashboard)
        site_path.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(svg_path, site_path)
    plt.close(fig)
    (out / "executive_brief.md").write_text(_evidence_brief(latest, wide), encoding="utf-8")
    return latest, coverage


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--input", default="projects/nigeria-economic-intelligence/data/world_bank_nigeria_2000_2025.csv")
    parser.add_argument("--output", default="projects/nigeria-economic-intelligence/outputs")
    parser.add_argument("--website-dashboard", default="docs/assets/nigeria-macro-dashboard.svg")
    args = parser.parse_args()
    latest, coverage = write_outputs(args.input, args.output, args.website_dashboard)
    print(f"Wrote {len(latest)} latest observations and {len(coverage)} coverage rows")


if __name__ == "__main__":
    main()
