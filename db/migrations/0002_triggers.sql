-- =============================================================
-- Saigon FC Skill Hub · 0002 triggers
--   - Auto updated_at trên mọi bảng
--   - Validate raw value khớp record_type
--   - Tự tính score_percent khi insert/update kết quả
--   - Tự tính lại score_percent khi đổi standard / record_type / higher_is_better
-- =============================================================

BEGIN;

-- =============================================================
-- 1) updated_at auto
-- =============================================================
CREATE OR REPLACE FUNCTION trg_set_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

DO $$
DECLARE
  t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'students',
    'club_standards',
    'skill_tests',
    'sub_skill_tests',
    'student_test_results'
  ]
  LOOP
    EXECUTE format(
      'DROP TRIGGER IF EXISTS set_updated_at ON %I;
       CREATE TRIGGER set_updated_at
         BEFORE UPDATE ON %I
         FOR EACH ROW EXECUTE FUNCTION trg_set_updated_at();',
      t, t
    );
  END LOOP;
END $$;

-- =============================================================
-- 2) Validate raw value shape khớp với record_type
-- =============================================================
CREATE OR REPLACE FUNCTION trg_validate_result_shape()
RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE
  v_record_type record_type_enum;
BEGIN
  SELECT st.record_type
    INTO v_record_type
    FROM sub_skill_tests sst
    JOIN skill_tests st ON st.id = sst.skill_test_id
   WHERE sst.id = NEW.sub_skill_test_id;

  IF v_record_type IS NULL THEN
    RAISE EXCEPTION 'sub_skill_test_id=% không tồn tại', NEW.sub_skill_test_id;
  END IF;

  IF v_record_type = 'success_attempt' THEN
    IF NEW.success_count IS NULL OR NEW.attempt_count IS NULL THEN
      RAISE EXCEPTION 'record_type=success_attempt cần success_count và attempt_count';
    END IF;
    IF NEW.value_numeric IS NOT NULL THEN
      RAISE EXCEPTION 'record_type=success_attempt không dùng value_numeric';
    END IF;
  ELSE
    -- record_type = time_seconds
    IF NEW.value_numeric IS NULL THEN
      RAISE EXCEPTION 'record_type=time_seconds cần value_numeric';
    END IF;
    IF NEW.success_count IS NOT NULL OR NEW.attempt_count IS NOT NULL THEN
      RAISE EXCEPTION 'record_type=time_seconds không dùng success/attempt';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS validate_result_shape ON student_test_results;
CREATE TRIGGER validate_result_shape
  BEFORE INSERT OR UPDATE ON student_test_results
  FOR EACH ROW EXECUTE FUNCTION trg_validate_result_shape();

-- =============================================================
-- 3) Hàm tính score_percent dùng chung
--    - higher_is_better=true:  score = actual / standard * 100
--    - higher_is_better=false: score = standard / actual * 100
--    - clamp [0, 200]
-- =============================================================
CREATE OR REPLACE FUNCTION calc_score_percent(
  p_record_type     record_type_enum,
  p_higher_better   boolean,
  p_standard_score  numeric,
  p_value_numeric   numeric,
  p_success_count   int,
  p_attempt_count   int
) RETURNS numeric LANGUAGE plpgsql IMMUTABLE AS $$
DECLARE
  v_actual numeric;
  v_score  numeric;
BEGIN
  IF p_record_type = 'success_attempt' THEN
    v_actual := (p_success_count::numeric / NULLIF(p_attempt_count, 0)) * 100;
  ELSE
    v_actual := p_value_numeric;
  END IF;

  IF v_actual IS NULL
     OR v_actual <= 0
     OR p_standard_score IS NULL
     OR p_standard_score <= 0 THEN
    RETURN 0;
  END IF;

  IF p_higher_better THEN
    v_score := (v_actual / p_standard_score) * 100;
  ELSE
    v_score := (p_standard_score / v_actual) * 100;
  END IF;

  RETURN ROUND(LEAST(GREATEST(v_score, 0), 200), 2);
END;
$$;

-- =============================================================
-- 4) BEFORE INSERT/UPDATE student_test_results: fill score_percent
-- =============================================================
CREATE OR REPLACE FUNCTION trg_fill_score_percent()
RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE
  v_record_type    record_type_enum;
  v_higher_better  boolean;
  v_standard       numeric;
BEGIN
  SELECT st.record_type, st.higher_is_better, sst.standard_score
    INTO v_record_type, v_higher_better, v_standard
    FROM sub_skill_tests sst
    JOIN skill_tests st ON st.id = sst.skill_test_id
   WHERE sst.id = NEW.sub_skill_test_id;

  NEW.score_percent := calc_score_percent(
    v_record_type, v_higher_better, v_standard,
    NEW.value_numeric, NEW.success_count, NEW.attempt_count
  );

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS fill_score_percent ON student_test_results;
CREATE TRIGGER fill_score_percent
  BEFORE INSERT OR UPDATE OF
    value_numeric, success_count, attempt_count, sub_skill_test_id
  ON student_test_results
  FOR EACH ROW EXECUTE FUNCTION trg_fill_score_percent();

-- =============================================================
-- 5) AFTER UPDATE sub_skill_tests.standard_score:
--    tính lại score_percent cho mọi kết quả thuộc sub đó
-- =============================================================
CREATE OR REPLACE FUNCTION trg_recompute_on_standard_change()
RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE
  v_record_type    record_type_enum;
  v_higher_better  boolean;
BEGIN
  IF NEW.standard_score IS DISTINCT FROM OLD.standard_score THEN
    SELECT st.record_type, st.higher_is_better
      INTO v_record_type, v_higher_better
      FROM skill_tests st
     WHERE st.id = NEW.skill_test_id;

    UPDATE student_test_results r
       SET score_percent = calc_score_percent(
             v_record_type,
             v_higher_better,
             NEW.standard_score,
             r.value_numeric,
             r.success_count,
             r.attempt_count
           )
     WHERE r.sub_skill_test_id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS recompute_on_standard_change ON sub_skill_tests;
CREATE TRIGGER recompute_on_standard_change
  AFTER UPDATE OF standard_score ON sub_skill_tests
  FOR EACH ROW EXECUTE FUNCTION trg_recompute_on_standard_change();

-- =============================================================
-- 6) AFTER UPDATE skill_tests.{higher_is_better, record_type}:
--    tính lại score_percent cho mọi kết quả thuộc test đó
-- =============================================================
CREATE OR REPLACE FUNCTION trg_recompute_on_test_change()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.higher_is_better IS DISTINCT FROM OLD.higher_is_better
     OR NEW.record_type    IS DISTINCT FROM OLD.record_type THEN
    UPDATE student_test_results r
       SET score_percent = calc_score_percent(
             NEW.record_type,
             NEW.higher_is_better,
             sst.standard_score,
             r.value_numeric,
             r.success_count,
             r.attempt_count
           )
      FROM sub_skill_tests sst
     WHERE r.sub_skill_test_id = sst.id
       AND sst.skill_test_id   = NEW.id;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS recompute_on_test_change ON skill_tests;
CREATE TRIGGER recompute_on_test_change
  AFTER UPDATE OF higher_is_better, record_type ON skill_tests
  FOR EACH ROW EXECUTE FUNCTION trg_recompute_on_test_change();

COMMIT;
