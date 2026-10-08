DROP TABLE IF EXISTS staging_prescribing_snapshot;
CREATE TABLE staging_prescribing_snapshot (
 period_start TEXT, period_end TEXT, period_key TEXT, period_label TEXT,
 is_partial_period INTEGER, entity_type TEXT, entity_code TEXT, entity_name TEXT,
 published_rank INTEGER, prescription_items INTEGER
);
