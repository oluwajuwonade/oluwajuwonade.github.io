# Power BI handoff - Open Data Blend healthcare dashboard

## Data source

Use data/dashboard_fact.csv for the reproducible portfolio snapshot. It is cleaned with the SQL logic in sql/02_clean.sql.

For the full Open Data Blend source, replace the compact snapshot with a bulk extract and preserve the same semantic definitions. Do not treat 2021 YTD as a full-year value.

## Model

Fact table: dashboard_fact

Recommended dimensions:
- DimPeriod: PeriodKey, PeriodStart, PeriodEnd, PeriodLabel, IsPartialPeriod
- DimEntity: EntityKey, EntityType, EntityCode, EntityName

Relationships:
- DimPeriod[PeriodKey] 1:* dashboard_fact[period_key]
- DimEntity[EntityKey] 1:* dashboard_fact[entity_key]

## DAX

~~~DAX
Prescription Items =
SUM(dashboard_fact[prescription_items])

Top Practice Items =
CALCULATE(
    [Prescription Items],
    dashboard_fact[entity_type] = "PRACTICE"
)

Top CCG Items =
CALCULATE(
    [Prescription Items],
    dashboard_fact[entity_type] = "CCG"
)

Practice Rank =
IF(
    SELECTEDVALUE(dashboard_fact[entity_type]) = "PRACTICE",
    RANKX(
        FILTER(
            ALLSELECTED(dashboard_fact[entity_code]),
            CALCULATE(SELECTEDVALUE(dashboard_fact[entity_type])) = "PRACTICE"
        ),
        [Prescription Items],
        ,
        DESC,
        Dense
    )
)

2019-2020 Practice Change % =
VAR a = CALCULATE([Prescription Items], dashboard_fact[period_key] = "2019")
VAR b = CALCULATE([Prescription Items], dashboard_fact[period_key] = "2020")
RETURN DIVIDE(b - a, a)
~~~

## Dashboard layout

### KPI cards
- Top-10 practice items - 2019
- Top-10 practice items - 2020
- 2019 to 2020 change
- Jan-Jun 2021 top-10 practice items

### Practice trend
Line or clustered column chart.
Axis: PeriodLabel.
Legend: Practice.
Value: Prescription Items.

### 2021 YTD CCG ranking
Horizontal bar chart.
Category: EntityName.
Value: Prescription Items.
Filters: EntityType = CCG and PeriodKey = 2021 YTD.

### 2019 vs 2020 practice comparison
Clustered bar chart.
Category: EntityName.
Values: 2019 Items and 2020 Items.
Tooltip: 2019-2020 Practice Change %.

### Detail table
EntityType, EntityCode, EntityName, PeriodLabel, Prescription Items, Published Rank.

### Slicers
PeriodKey, EntityType, EntityName.

## Interpretation rules

- Use prescription items as the primary volume metric.
- Keep 2021 YTD visibly labelled as partial.
- Do not interpret ranking as clinical quality.
- Do not claim causality from descriptive prescribing differences.
- Preserve the published ranking when comparing the compact snapshot.
