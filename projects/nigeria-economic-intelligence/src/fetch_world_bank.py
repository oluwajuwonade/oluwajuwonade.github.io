"""Fetch Nigeria annual indicators from the World Bank Indicators API."""
from __future__ import annotations

import argparse
from datetime import datetime, timezone
from pathlib import Path
import time

import pandas as pd
import requests

API_ROOT = "https://api.worldbank.org/v2/country/NGA/indicator"
INDICATORS = {
    "FP.CPI.TOTL.ZG": "Inflation, consumer prices (annual %)",
    "NY.GDP.MKTP.KD.ZG": "GDP growth (annual %)",
    "PA.NUS.FCRF": "Official exchange rate (LCU per US$, period average)",
    "SL.UEM.TOTL.ZS": "Unemployment, total (% of total labor force) (modelled ILO estimate)",
    "FR.INR.RINR": "Real interest rate (%)",
    "NY.GDP.PCAP.KD.ZG": "GDP per capita growth (annual %)",
    "NV.IND.MANF.ZS": "Manufacturing, value added (% of GDP)",
    "BN.CAB.XOKA.GD.ZS": "Current account balance (% of GDP)",
}


def fetch_indicator(code: str, start: int, end: int) -> list[dict]:
    url = f"{API_ROOT}/{code}"
    response = requests.get(
        url,
        params={"format": "json", "date": f"{start}:{end}", "per_page": 1000},
        timeout=45,
        headers={"User-Agent": "NigeriaEconomicIntelligence/1.0 (educational research)"},
    )
    response.raise_for_status()
    payload = response.json()
    if not isinstance(payload, list) or len(payload) < 2:
        raise ValueError(f"Unexpected World Bank API response for {code}")
    retrieved = datetime.now(timezone.utc).isoformat()
    rows = []
    for item in payload[1] or []:
        raw = item.get("value")
        rows.append({
            "country_code": "NGA",
            "country": "Nigeria",
            "year": int(item["date"]),
            "indicator_code": code,
            "indicator_name": item.get("indicator", {}).get("value") or INDICATORS[code],
            "value": float(raw) if raw is not None else None,
            "unit": item.get("unit"),
            "source_note": item.get("footnote"),
            "retrieved_at_utc": retrieved,
            "source_url": response.url,
        })
    return rows


def fetch_all(start: int = 2000, end: int = 2025, pause: float = 0.05) -> pd.DataFrame:
    if start > end:
        raise ValueError("start must be less than or equal to end")
    rows = []
    for index, code in enumerate(INDICATORS):
        rows.extend(fetch_indicator(code, start, end))
        if pause and index < len(INDICATORS) - 1:
            time.sleep(pause)
    result = pd.DataFrame(rows)
    if result.empty:
        raise RuntimeError("World Bank API returned no observations")
    return result.sort_values(["indicator_code", "year"]).reset_index(drop=True)


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--start", type=int, default=2000)
    parser.add_argument("--end", type=int, default=datetime.now(timezone.utc).year - 1)
    parser.add_argument("--output", default="projects/nigeria-economic-intelligence/data/world_bank_nigeria.csv")
    args = parser.parse_args()
    output = Path(args.output)
    output.parent.mkdir(parents=True, exist_ok=True)
    data = fetch_all(args.start, args.end)
    data.to_csv(output, index=False)
    latest = data.dropna(subset=["value"]).groupby("indicator_code")["year"].max()
    print(f"Saved {len(data)} observations to {output}")
    print("Latest available year by indicator:")
    print(latest.to_string())


if __name__ == "__main__":
    main()
