# Nigeria Economic Intelligence

A reproducible World Bank Indicators API workflow for examining Nigeria's inflation, real GDP growth, official exchange rate, modelled unemployment estimate, real interest rate, GDP-per-capita growth, current-account balance, and manufacturing value added.

## Run

Install dependencies with pip install -r projects/nigeria-economic-intelligence/requirements.txt.

Fetch annual observations (the World Bank may not have a value for every indicator/year):

python projects/nigeria-economic-intelligence/src/fetch_world_bank.py --start 2000 --end 2025 --output projects/nigeria-economic-intelligence/data/world_bank_nigeria.csv

Then analyse the downloaded extract:

python projects/nigeria-economic-intelligence/src/analyze_macro.py --input projects/nigeria-economic-intelligence/data/world_bank_nigeria.csv --output projects/nigeria-economic-intelligence/outputs

## Evidence included

- data/nigeria_latest_indicator_snapshot.csv: curated latest-available development indicators; data/world_bank_nigeria_2000_2025.csv: refreshed 2000–2025 annual API extract with source URLs and update metadata.
- src/fetch_world_bank.py: repeatable API ingestion; writes retrieval timestamps and source URLs for each observation.
- src/analyze_macro.py: coverage diagnostics, latest-value table, wide data, per-indicator charts, and an executive brief. Published outputs include outputs/nigeria_indicators_wide.csv, outputs/latest_available_indicators.csv, outputs/coverage_diagnostics.csv, outputs/executive_brief.md, outputs/nigeria-macro-dashboard.svg, and docs/assets/nigeria-macro-dashboard.svg. The analysis script creates eight individual charts and a composite SVG/PNG dashboard; from the repository root it refreshes the website dashboard asset too.

The committed historical extract contains eight fully populated annual series for 2000–2025. The separate latest-value development snapshot has mixed reference years (2025 for inflation, GDP growth, and population; 2024 for electricity access and internet use). Publishers may revise values, so refresh the data before formal research publication.

## Interpretation guardrails

This is descriptive macroeconomic monitoring. Correlation between exchange rates, prices, output, and rates does not establish causality. Official exchange rates do not describe every market. Modelled ILO unemployment estimates may differ from national survey measures. Macro aggregates do not establish household-level welfare effects.

## Sources

- World Bank Indicators API documentation: https://datahelpdesk.worldbank.org/knowledgebase/articles/889392-about-the-indicators-api-documentation
- Nigeria country data: https://data.worldbank.org/country/ng
- Indicator-level source URLs are recorded in the CSV snapshot.
