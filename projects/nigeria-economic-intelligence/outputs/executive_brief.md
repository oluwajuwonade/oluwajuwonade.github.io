# Nigeria Economic Intelligence — Historical Evidence Brief

**Dataset period:** 2000–2025  
**API source updated:** 8 October 2026  
**Retrieved:** 25 October 2026  
**Source:** World Bank Indicators API v2, World Development Indicators  
**Coverage:** 8 indicator series; 208 annual observations; 0 missing values within these selected series and requested years.

## Key findings

1. **Inflation eased in 2025 but prices were still rising.** Annual consumer-price inflation declined from 33.24% in 2024 to 23.01% in 2025, a 10.23 percentage-point decrease in the inflation rate. This is disinflation, not a fall in the overall price level.
2. **Real GDP growth remained around 4%.** The annual growth rate was 4.07% in 2024 and 4.01% in 2025, a change of -0.06 percentage points. Growth was strongly negative in 2020 (-6.37%), then returned to positive territory in the subsequent years shown.
3. **GDP per capita growth was positive but modest in 2025.** It was 1.89% in 2025, following a contraction of -8.34% in 2020. GDP per capita is an aggregate and says nothing by itself about distribution or household-level wellbeing.
4. **The official annual-average exchange-rate series moved sharply.** The indicator rose from 645.19 naira per US dollar in 2023 to 1478.97 in 2024 and 1518.38 in 2025. The 2025 annual average was approximately 2.35 times the 2023 value. This is the World Bank's official-rate series, not a measure of every foreign-exchange market.
5. **The current-account balance remained positive as a share of GDP.** It moved from 7.54% of GDP in 2024 to 4.83% in 2025. A change in this ratio can reflect the current-account numerator, nominal GDP denominator, or both.
6. **The modelled ILO unemployment estimate is not a complete labour-market diagnosis.** The World Bank series reports 3.06% for 2025. This is a modelled international estimate and can differ from national survey definitions and broader measures of underemployment or labour informality.
7. **Manufacturing value added represented 8.26% of GDP in 2025.** This is an aggregate structural indicator; it should not be interpreted as a direct measure of manufacturing employment, productivity, or domestic value-chain depth.
8. **The World Bank real-interest-rate series reached 4.03% in 2025**, compared with 1.94% in 2024. This is not the same measure as the Central Bank of Nigeria's policy rate.

## Data and method

- Retrieved the World Bank API V2 annual observations for Nigeria, 2000–2025.
- Retained indicator code, indicator name, source URL, source last-updated metadata, and retrieval date.
- Selected eight indicators with complete observations in the requested period. The exports-of-goods-and-services indicators tested during exploration returned no non-null observations in this API response and were not used in these outputs; manufacturing value added was included instead.
- Reported each indicator in its own chart and scale. The CSV preserves source values without imputation.
- The time series are descriptive. They do not identify causal effects of monetary policy, exchange-rate changes, inflation, or government actions.

## Source

- World Bank Indicators API documentation: https://datahelpdesk.worldbank.org/knowledgebase/articles/889392
- API basic call structures: https://datahelpdesk.worldbank.org/knowledgebase/articles/898581
- The exact source API URL for every observation is retained in the data CSV.

## Limitations

Values can be revised by the World Bank or underlying source institutions. Series definitions and revisions should be checked before formal publication. Country-level aggregates can conceal differences by income group, region, household type, or firm size. Historical co-movement should not be described as causation without an explicit identification design.
