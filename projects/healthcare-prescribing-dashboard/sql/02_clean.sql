DROP TABLE IF EXISTS prescribing_clean;
CREATE TABLE prescribing_clean AS
SELECT
  date(period_start) AS period_start,
  date(period_end) AS period_end,
  TRIM(period_key) AS period_key,
  TRIM(period_label) AS period_label,
  CASE WHEN is_partial_period IN (1,'1','true','TRUE') THEN 1 ELSE 0 END AS is_partial_period,
  UPPER(TRIM(entity_type)) AS entity_type,
  TRIM(entity_code) AS entity_code,
  TRIM(REPLACE(REPLACE(entity_name, '  ', ' '), '  ', ' ')) AS entity_name,
  CAST(published_rank AS INTEGER) AS published_rank,
  CAST(prescription_items AS INTEGER) AS prescription_items,
  TRIM(UPPER(entity_type) || '|' || entity_code) AS entity_key
FROM staging_prescribing_snapshot
WHERE entity_code IS NOT NULL
  AND TRIM(entity_code) <> ''
  AND entity_name IS NOT NULL
  AND TRIM(entity_name) <> ''
  AND prescription_items IS NOT NULL
  AND CAST(prescription_items AS INTEGER) >= 0;

CREATE INDEX idx_prescribing_clean_entity ON prescribing_clean(entity_key);
CREATE INDEX idx_prescribing_clean_period ON prescribing_clean(period_key);
CREATE INDEX idx_prescribing_clean_type ON prescribing_clean(entity_type);

DROP VIEW IF EXISTS vw_dashboard_entity_summary;
CREATE VIEW vw_dashboard_entity_summary AS
SELECT period_key, period_label, period_start, period_end, is_partial_period,
       entity_type, entity_code, entity_name, published_rank, prescription_items, entity_key
FROM prescribing_clean;

DROP VIEW IF EXISTS vw_practice_period_totals;
CREATE VIEW vw_practice_period_totals AS
SELECT period_key, period_label, period_start, period_end, is_partial_period,
       SUM(prescription_items) AS top10_practice_items,
       MAX(prescription_items) AS top_practice_items
FROM prescribing_clean
WHERE entity_type='PRACTICE'
GROUP BY period_key, period_label, period_start, period_end, is_partial_period
ORDER BY period_start;

DROP VIEW IF EXISTS vw_ccg_2021_ranking;
CREATE VIEW vw_ccg_2021_ranking AS
SELECT published_rank, entity_code, entity_name, prescription_items
FROM prescribing_clean
WHERE entity_type='CCG' AND period_key='2021 YTD'
ORDER BY published_rank;

DROP VIEW IF EXISTS vw_practice_2019_2020;
CREATE VIEW vw_practice_2019_2020 AS
WITH a AS (
 SELECT entity_code, entity_name, prescription_items AS items_2019
 FROM prescribing_clean WHERE entity_type='PRACTICE' AND period_key='2019'
),
b AS (
 SELECT entity_code, entity_name, prescription_items AS items_2020
 FROM prescribing_clean WHERE entity_type='PRACTICE' AND period_key='2020'
)
SELECT a.entity_code, COALESCE(a.entity_name,b.entity_name) AS entity_name,
       a.items_2019, b.items_2020,
       ROUND(100.0*(b.items_2020-a.items_2019)/NULLIF(a.items_2019,0),2) AS pct_change_2019_to_2020
FROM a JOIN b USING(entity_code);
