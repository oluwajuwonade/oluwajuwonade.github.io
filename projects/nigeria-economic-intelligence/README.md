# Nigeria Economic Intelligence

A reproducible World Bank Indicators API workflow for examining Nigeria's inflation, real GDP growth, official exchange rate, unemployment estimate, real interest rate, GDP-per-capita growth, exports, and current-account balance.

## Run

Install dependencies with pip install -r projects/nigeria-economic-intelligence/requirements.txt.

Fetch annual observations (the World Bank may not have a value for every indicator/year):

python projects/nigeria-economic-intelligence/src/fetch_world_bank.py --start 2000 --end 2025 --output projects/nigeria-economic-intelligence/data/world_bank_nigeria.csv

Then analyse the downloaded extract:

python projects/nigeria-economic-intelligence/src/analyze_macro.py --input projects/nigeria-economic-intelligence/data/world_bank_nigeria.csv --output projects/nigeria-economic-intelligence/outputs

## Evidence included

- data/nigeria_latest_indicator_snapshot.csv: curated latest-available values visible on official World Bank country/indicator pages, with source URL, reference year, and access date.
- src/fetch_world_bank.py: repeatable API ingestion; writes retrieval timestamps and source URLs for each observation.
- src/analyze_macro.py: coverage diagnostics, latest-value table, wide data, charts, and an executive brief.

The latest-value snapshot is not a common-year panel: the indicator periods vary (2025 for inflation, GDP growth, and population; 2024 for electricity access and internet use). The full API extraction script is the route for historical time-series analysis. Snapshot values can be revised by publishers and should be refreshed before formal research publication.

## Interpretation guardrails

This is descriptive macroeconomic monitoring. Correlation between exchange rates, prices, output, and rates does not establish causality. Official exchange rates do not describe every market. Modelled ILO unemployment estimates may differ from national survey measures. Macro aggregates do not establish household-level welfare effects.

## Sources

- World Bank Indicators API documentation: https://datahelpdesk.worldbank.org/knowledgebase/articles/889392-about-the-indicators-api-documentation
- Nigeria country data: https://data.worldbank.org/country/ng
- Indicator-level source URLs are recorded in the CSV snapshot.
