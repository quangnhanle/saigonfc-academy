-- =============================================================
-- Saigon FC Skill Hub · 0003 seed
--   Dữ liệu mẫu để verify schema + triggers
-- =============================================================

BEGIN;

-- ---------- club_standards ----------
INSERT INTO club_standards (standard_name, display_order, description) VALUES
  ('Dẫn bóng',         1, 'Kiểm soát và điều khiển bóng'),
  ('Chuyền bóng',      2, 'Phối hợp và phát triển bóng'),
  ('Sút bóng',         3, 'Khả năng dứt điểm'),
  ('Thể lực',          4, 'Tốc độ, sức bền, di chuyển')
ON CONFLICT (standard_name) DO NOTHING;

-- ---------- skill_tests ----------
WITH cs AS (
  SELECT id, standard_name FROM club_standards
)
INSERT INTO skill_tests
  (club_standard_id, test_name, record_type, higher_is_better, display_order)
SELECT cs.id, t.test_name, t.record_type, t.higher_is_better, t.display_order
  FROM cs
  JOIN (VALUES
    ('Dẫn bóng',         'Dẫn bóng qua chướng ngại vật', 'success_attempt'::record_type_enum, true,  1),
    ('Chuyền bóng',      'Chuyền 15m',                   'time_seconds'::record_type_enum,    false, 1),
    ('Chuyền bóng',      'Chuyền 25m',                   'time_seconds'::record_type_enum,    false, 2),
    ('Sút bóng',         'Sút trúng mục tiêu',           'success_attempt'::record_type_enum, true,  1),
    ('Thể lực',          'Chạy nước rút 30m',            'time_seconds'::record_type_enum,    false, 1)
  ) AS t(standard_name, test_name, record_type, higher_is_better, display_order)
    ON t.standard_name = cs.standard_name
ON CONFLICT (club_standard_id, test_name) DO NOTHING;

-- ---------- sub_skill_tests ----------
WITH st AS (
  SELECT id, test_name FROM skill_tests
)
INSERT INTO sub_skill_tests
  (skill_test_id, sub_skill_test_name, standard_score, display_order)
SELECT st.id, s.sub_name, s.standard_score, s.display_order
  FROM st
  JOIN (VALUES
    ('Dẫn bóng qua chướng ngại vật', 'Chân trái',  6,    1),
    ('Dẫn bóng qua chướng ngại vật', 'Chân phải',  7,    2),
    ('Dẫn bóng qua chướng ngại vật', 'Cả 2 chân',  8,    3),
    ('Chuyền 15m',                   'Chân trái',  3.5, 1),
    ('Chuyền 15m',                   'Chân phải',  3.0, 2),
    ('Chuyền 15m',                   'Cả 2 chân',  3.25, 3),
    ('Chuyền 25m',                   'Chân trái',  5.5, 1),
    ('Chuyền 25m',                   'Chân phải',  5.0, 2),
    ('Chuyền 25m',                   'Cả 2 chân',  5.25, 3),
    ('Sút trúng mục tiêu',           'Chân trái',  10,  1),
    ('Sút trúng mục tiêu',           'Chân phải',  10,  2),
    ('Sút trúng mục tiêu',           'Cả 2 chân',  10,  3),
    ('Chạy nước rút 30m',            '30m',        4.3, 1)
  ) AS s(test_name, sub_name, standard_score, display_order)
    ON s.test_name = st.test_name
ON CONFLICT (skill_test_id, sub_skill_test_name) DO NOTHING;

-- ---------- students ----------
INSERT INTO students (full_name, birth_year, position, preferred_foot) VALUES
  ('Nguyễn Hoàng Anh', 2008, 'Tiền đạo',             'right'),
  ('Trần Minh Khôi',   2009, 'Tiền vệ trung tâm',    'both'),
  ('Lê Quang Hưng',    2007, 'Hậu vệ cánh',          'left'),
  ('Phạm Đức Huy',     2008, 'Tiền vệ phòng ngự',    'right'),
  ('Võ Tấn Lộc',       2010, 'Tiền đạo cánh',        'left')
ON CONFLICT DO NOTHING;

-- ---------- ví dụ student_test_results ----------
-- 1 học viên · Dẫn bóng qua chướng ngại vật chân phải · 8/10 thành công
WITH s AS (SELECT id FROM students WHERE full_name = 'Nguyễn Hoàng Anh'),
     sst AS (
       SELECT sst.id
         FROM sub_skill_tests sst
         JOIN skill_tests st ON st.id = sst.skill_test_id
        WHERE st.test_name = 'Dẫn bóng qua chướng ngại vật'
          AND sst.sub_skill_test_name = 'Chân phải'
     )
INSERT INTO student_test_results
  (student_id, sub_skill_test_id, success_count, attempt_count, tested_at)
SELECT s.id, sst.id, 8, 10, now()
  FROM s, sst
ON CONFLICT DO NOTHING;

-- 1 học viên · Chạy nước rút 30m · 4.2s
WITH s AS (SELECT id FROM students WHERE full_name = 'Nguyễn Hoàng Anh'),
     sst AS (
       SELECT sst.id
         FROM sub_skill_tests sst
         JOIN skill_tests st ON st.id = sst.skill_test_id
        WHERE st.test_name = 'Chạy nước rút 30m'
          AND sst.sub_skill_test_name = '30m'
     )
INSERT INTO student_test_results
  (student_id, sub_skill_test_id, value_numeric, tested_at)
SELECT s.id, sst.id, 4.2, now()
  FROM s, sst
ON CONFLICT DO NOTHING;

COMMIT;

-- =============================================================
-- Verify: xem score_percent đã được trigger tự tính chưa
-- =============================================================
-- SELECT
--   stu.full_name, st.test_name, sst.sub_skill_test_name,
--   r.value_numeric, r.success_count, r.attempt_count, r.score_percent
-- FROM student_test_results r
-- JOIN students stu        ON stu.id = r.student_id
-- JOIN sub_skill_tests sst ON sst.id = r.sub_skill_test_id
-- JOIN skill_tests st      ON st.id  = sst.skill_test_id
-- ORDER BY r.tested_at DESC;
