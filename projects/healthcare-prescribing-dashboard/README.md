# Open Data Blend Healthcare Prescribing Dashboard

An end-to-end healthcare analytics project using Open Data Blend's NHS England prescribing data.

## Project objective

Demonstrate a production-style analytics workflow:

**Open Data Blend -> CSV -> SQL database -> SQL cleaning -> Power BI model -> dashboard insights**

The project focuses on prescription-item activity for glucose blood-testing reagents and compares published top practices across 2019, 2020 and Jan-Jun 2021, alongside a 2021 YTD primary-care-organisation view.

## Source

Open Data Blend Prescribing dataset:
https://www.opendatablend.io/dataset/?name=open-data-blend-prescribing

Dataset API:
https://packages.opendatablend.io/v1/open-data-blend-prescribing/datapackage.json

Open Data Blend analytical example:
https://github.com/opendatablend/opendatablend-py/blob/master/examples/nhs_england_prescriptions_analysis_pandas.ipynb

## Data scope

This repository contains a compact, reproducible portfolio snapshot derived from published Open Data Blend analytical evidence.

Open Data Blend documents that public .csv resources are 100-row preview files. The larger source files are distributed through bulk formats. Therefore, this repository does not claim to contain the complete NHS prescribing warehouse.

## Pipeline

1. Load the source snapshot CSV into a staging table.
2. Clean text keys and labels with SQL.
3. Standardise entity types.
4. Cast dates, ranks and prescription-item counts to analytical types.
5. Exclude invalid entity keys, names and negative counts.
6. Create analytical SQL views.
7. Export the cleaned fact table for Power BI.
8. Build the semantic model and DAX measures in Power BI.

## Dashboard questions

- How does published prescription-item activity compare across periods?
- Which practices appear at the top of the published practice ranking?
- Which practices changed between 2019 and 2020?
- Which primary-care organisations have the largest Jan-Jun 2021 published counts?
- How should a partial-year period be handled in executive reporting?

## Verified snapshot findings

| Measure | Result |
|---|---:|
| Top-10 practice items - 2019 | 74,754 |
| Top-10 practice items - 2020 | 73,363 |
| Change, 2019 -> 2020 | -1.86% |
| Top-10 practice items - Jan-Jun 2021 | 38,548 |
| Highest published CCG in Jan-Jun 2021 | Kent and Medway CCG |
| Kent and Medway CCG items | 98,394 |
| Highest-ranked practice in all three periods | Octagon Medical Practice |

The 2021 period is January-June and is therefore **not directly comparable with full-year 2019/2020 totals** without an explicit annualisation assumption.

## Repository structure

data/ - raw and SQL-cleaned CSV snapshots
sql/ - staging schema, cleaning logic and analytical views
docs/ - Power BI semantic model, DAX measures and dashboard specification

## Power BI model

Fact table: dashboard_fact

Recommended dimensions:
- DimPeriod
- DimEntity

Key measures:
- Prescription Items
- Top Practice Items
- Top CCG Items
- Practice Rank
- 2019-2020 Practice Change %
- Top 10 Practice Share of Snapshot

See docs/POWER_BI_HANDOFF.md.

## Data-quality controls

The SQL validation confirms:
- 40 rows loaded into staging
- 40 rows retained after cleaning
- no negative prescription-item values
- no missing entity codes
- no invalid dates in the project snapshot
- no unexpected entity types

## Skills demonstrated

SQL · SQLite · Data Cleaning · Data Modelling · KPI Design · Healthcare Analytics · Power BI · DAX · Data Quality · Analytical Communication · Git/GitHub

## Disclaimer

This is an analytical portfolio project using open/public data. It does not contain patient-level clinical information and should not be interpreted as clinical guidance or causal evidence.
