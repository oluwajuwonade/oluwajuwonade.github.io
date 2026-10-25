# Nigeria Economic Intelligence — Historical Evidence Brief

**Dataset period:** 2000–2025  
**World Bank API source updated:** 8 October 2026  
**Snapshot retrieved:** 25 October 2026  
**Coverage:** 8 indicator series, 208 annual observations, 0 missing values in the selected series and requested period.

## Key findings

1. **Inflation eased in 2025, but prices were still rising.** Annual CPI inflation declined from 33.24% in 2024 to 23.01% in 2025, a 10.23 percentage-point decrease in the rate. This is disinflation, not deflation.
2. **Real GDP growth stayed close to 4%.** The rate changed from 4.07% in 2024 to 4.01% in 2025. The series fell to -6.37% in 2020 before returning to positive growth in subsequent years shown.
3. **GDP per capita growth was positive but modest.** It reached 1.89% in 2025 after a -8.34% contraction in 2020. This average does not describe the distribution of gains across households.
4. **The annual-average official exchange-rate indicator rose sharply.** It moved from NGN 645.19 per US dollar in 2023 to NGN 1478.97 in 2024 and NGN 1518.38 in 2025. The 2025 value was approximately 2.35 times the 2023 level. It does not describe every FX market.
5. **The current-account balance stayed positive as a share of GDP.** It moved from 7.54% in 2024 to 4.83% in 2025. The ratio can change because of the numerator, the GDP denominator, or both.
6. **The modelled ILO unemployment estimate requires care.** The series reports 3.06% for 2025. It may differ from national survey definitions and is not a complete measure of underemployment, informality, or job quality.
7. **Manufacturing value added represented 8.26% of GDP in 2025.** This structural measure does not directly measure manufacturing employment or productivity.
8. **The World Bank real-interest-rate series was 4.03% in 2025**, compared with 1.94% in 2024. It is not the same as the Central Bank of Nigeria policy rate.

## Data and method

- Annual observations for Nigeria, 2000–2025, from the World Bank Indicators API V2.
- The long-format CSV retains indicator codes, names, source URLs, source-update metadata, source units, display units, and retrieval date.
- The eight selected series have 26 non-missing annual values each. No imputation was used.
- Exports-of-goods-and-services indicators tested during exploration returned no non-null values in the API response used here and were not included; manufacturing value added was used instead.
- Outputs include long and wide CSV files, per-indicator charts, a composite dashboard, and coverage diagnostics.

## Limitations

These are descriptive observations, not causal estimates. Co-movement does not identify the effects of monetary policy, exchange-rate changes, inflation, or government actions. Publishers may revise historical values. Country-level aggregates can conceal differences by income group, region, household type, or firm size.

## Sources

- World Bank Indicators API documentation: https://datahelpdesk.worldbank.org/knowledgebase/articles/889392
- World Bank API query structures: https://datahelpdesk.worldbank.org/knowledgebase/articles/898599
- Exact source URLs are retained at observation level in the CSV.
