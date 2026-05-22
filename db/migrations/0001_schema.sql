-- =============================================================
-- Saigon FC Skill Hub · 0001 schema
-- PostgreSQL 14+
-- =============================================================

BEGIN;

-- ---------- Enums ----------
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'preferred_foot_enum') THEN
    CREATE TYPE preferred_foot_enum AS ENUM ('left', 'right', 'both');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'record_type_enum') THEN
    CREATE TYPE record_type_enum AS ENUM (
      'time_seconds',
      'success_attempt',
      'percentage',
      'score'
    );
  END IF;
END $$;

-- ---------- students ----------
CREATE TABLE IF NOT EXISTS students (
  id              bigserial PRIMARY KEY,
  full_name       varchar(255)        NOT NULL,
  birth_year      smallint            NOT NULL,
  position        varchar(64)         NOT NULL,
  preferred_foot  preferred_foot_enum NOT NULL,
  avatar_url      text,
  created_at      timestamptz         NOT NULL DEFAULT now(),
  updated_at      timestamptz         NOT NULL DEFAULT now(),
  CONSTRAINT students_birth_year_chk
    CHECK (birth_year BETWEEN 1980 AND EXTRACT(YEAR FROM now())::int)
);
CREATE INDEX IF NOT EXISTS students_full_name_idx ON students (full_name);
CREATE INDEX IF NOT EXISTS students_position_idx  ON students (position);

-- ---------- club_standards ----------
CREATE TABLE IF NOT EXISTS club_standards (
  id              bigserial PRIMARY KEY,
  standard_name   varchar(128) NOT NULL UNIQUE,
  description     text,
  display_order   smallint     NOT NULL DEFAULT 0,
  created_at      timestamptz  NOT NULL DEFAULT now(),
  updated_at      timestamptz  NOT NULL DEFAULT now()
);

-- ---------- skill_tests ----------
CREATE TABLE IF NOT EXISTS skill_tests (
  id                bigserial PRIMARY KEY,
  club_standard_id  bigint           NOT NULL REFERENCES club_standards(id) ON DELETE CASCADE,
  test_name         varchar(255)     NOT NULL,
  description       text,
  record_type       record_type_enum NOT NULL,
  standard_unit     varchar(32)      NOT NULL,
  higher_is_better  boolean          NOT NULL,
  display_order     smallint         NOT NULL DEFAULT 0,
  created_at        timestamptz      NOT NULL DEFAULT now(),
  updated_at        timestamptz      NOT NULL DEFAULT now(),
  CONSTRAINT skill_tests_unique_per_standard UNIQUE (club_standard_id, test_name)
);
CREATE INDEX IF NOT EXISTS skill_tests_club_standard_id_idx ON skill_tests (club_standard_id);

-- ---------- sub_skill_tests ----------
CREATE TABLE IF NOT EXISTS sub_skill_tests (
  id                  bigserial PRIMARY KEY,
  skill_test_id       bigint        NOT NULL REFERENCES skill_tests(id) ON DELETE CASCADE,
  sub_skill_test_name varchar(255)  NOT NULL,
  standard_score      numeric(10,3) NOT NULL,
  display_order       smallint      NOT NULL DEFAULT 0,
  created_at          timestamptz   NOT NULL DEFAULT now(),
  updated_at          timestamptz   NOT NULL DEFAULT now(),
  CONSTRAINT sub_skill_tests_unique_per_skill
    UNIQUE (skill_test_id, sub_skill_test_name),
  CONSTRAINT sub_skill_tests_standard_pos_chk
    CHECK (standard_score > 0)
);
CREATE INDEX IF NOT EXISTS sub_skill_tests_skill_test_id_idx
  ON sub_skill_tests (skill_test_id);

-- ---------- student_test_results ----------
CREATE TABLE IF NOT EXISTS student_test_results (
  id                  bigserial PRIMARY KEY,
  student_id          bigint        NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  sub_skill_test_id   bigint        NOT NULL REFERENCES sub_skill_tests(id) ON DELETE CASCADE,

  -- Cho record_type IN (time_seconds, percentage, score)
  value_numeric       numeric(10,3),

  -- Cho record_type = success_attempt
  success_count       int,
  attempt_count       int,

  -- Cache để rank nhanh, được tính bằng trigger ở 0002_triggers.sql
  score_percent       numeric(6,2),

  note                text,
  tested_at           timestamptz   NOT NULL DEFAULT now(),
  recorded_by         bigint,

  created_at          timestamptz   NOT NULL DEFAULT now(),
  updated_at          timestamptz   NOT NULL DEFAULT now(),

  CONSTRAINT str_attempt_pos_chk
    CHECK (attempt_count IS NULL OR attempt_count > 0),
  CONSTRAINT str_success_range_chk
    CHECK (
      success_count IS NULL
      OR (success_count >= 0 AND success_count <= attempt_count)
    ),
  CONSTRAINT str_score_pct_chk
    CHECK (score_percent IS NULL OR score_percent BETWEEN 0 AND 200),
  CONSTRAINT str_unique_per_test_time
    UNIQUE (student_id, sub_skill_test_id, tested_at)
);

CREATE INDEX IF NOT EXISTS str_student_id_idx
  ON student_test_results (student_id);
CREATE INDEX IF NOT EXISTS str_sub_skill_test_id_idx
  ON student_test_results (sub_skill_test_id);
CREATE INDEX IF NOT EXISTS str_score_percent_idx
  ON student_test_results (score_percent DESC);

COMMIT;
