# Database — Saigon FC Skill Hub

PostgreSQL 14+ schema, có thể dùng trực tiếp cho Supabase / Neon / RDS.

## Cấu trúc

```
db/
└── migrations/
    ├── 0001_schema.sql    -- Enums, tables, indexes, check constraints
    ├── 0002_triggers.sql  -- updated_at, validate, fill/recompute score_percent
    └── 0003_seed.sql      -- Dữ liệu mẫu để kiểm tra trigger
```

Chạy theo thứ tự đánh số. Mỗi file đều idempotent ở mức an toàn (dùng
`IF NOT EXISTS`, `DROP TRIGGER IF EXISTS`, `ON CONFLICT DO NOTHING`).

## Chạy migration

```bash
psql "$DATABASE_URL" -f db/migrations/0001_schema.sql
psql "$DATABASE_URL" -f db/migrations/0002_triggers.sql
psql "$DATABASE_URL" -f db/migrations/0003_seed.sql   # tùy chọn
```

## Quan hệ chính

```
club_standards (1) ─┐
                    ├─< skill_tests (1) ─< sub_skill_tests (1) ─< student_test_results
students       (1) ─┘                                            ┘
```

- **`club_standards`**: nhóm kỹ năng lớn — Dẫn bóng, Chuyền bóng, Sút bóng, Thể lực
- **`skill_tests`**: bài test cụ thể, giữ `record_type` (`time_seconds` hoặc `success_attempt`) + `higher_is_better` (dùng chung cho mọi sub bên dưới). Đơn vị hiển thị suy ra từ `record_type`: `time_seconds` → "giây", `success_attempt` → "%".
- **`sub_skill_tests`**: biến thể (chân trái / chân phải / hai chân, 30m / 60m ...) với `standard_score` riêng
- **`student_test_results`**: kết quả thô; chia thành `value_numeric` (cho `time_seconds`) hoặc `success_count + attempt_count` (cho `success_attempt`), kèm cache `score_percent`

## Logic tự động (trigger)

| Trigger | Khi nào | Tác dụng |
| --- | --- | --- |
| `set_updated_at` | trước `UPDATE` | gán `updated_at = now()` |
| `validate_result_shape` | trước `INSERT/UPDATE student_test_results` | bắt buộc raw value khớp `record_type` (success_attempt → `success_count + attempt_count`, time_seconds → `value_numeric`) |
| `fill_score_percent` | trước `INSERT/UPDATE student_test_results` | tính `score_percent` từ raw + standard |
| `recompute_on_standard_change` | sau `UPDATE sub_skill_tests.standard_score` | tính lại `score_percent` của mọi kết quả thuộc sub đó |
| `recompute_on_test_change` | sau `UPDATE skill_tests.{higher_is_better, record_type}` | tính lại `score_percent` của mọi kết quả thuộc test đó |

## Công thức `score_percent`

Hàm `calc_score_percent(record_type, higher_is_better, standard, value, success, attempt)`:

1. Quy raw về 1 con số:
   - `success_attempt` → `actual = success / attempt * 100`
   - `time_seconds` → `actual = value_numeric`
2. Tính:
   - `higher_is_better = true` → `actual / standard * 100`
   - `higher_is_better = false` → `standard / actual * 100`
3. Clamp `[0, 200]` rồi `round(_, 2)`.

## Truy vấn ranking nhanh

```sql
-- Top 10 cho 1 sub_skill_test
SELECT stu.full_name, r.score_percent
  FROM student_test_results r
  JOIN students stu ON stu.id = r.student_id
 WHERE r.sub_skill_test_id = :sub_id
 ORDER BY r.score_percent DESC
 LIMIT 10;

-- Trung bình theo học viên trên 1 club_standard
SELECT stu.full_name, AVG(r.score_percent) AS avg_score
  FROM student_test_results r
  JOIN students stu        ON stu.id = r.student_id
  JOIN sub_skill_tests sst ON sst.id = r.sub_skill_test_id
  JOIN skill_tests st      ON st.id  = sst.skill_test_id
 WHERE st.club_standard_id = :standard_id
 GROUP BY stu.id, stu.full_name
 ORDER BY avg_score DESC;
```

## Lưu ý khi migrate dữ liệu cũ

Schema cũ dùng `raw_value jsonb`. Khi chuyển dữ liệu:

```sql
-- success_attempt
UPDATE student_test_results_old r
   SET success_count = (raw_value->>'success')::int,
       attempt_count = (raw_value->>'attempt')::int
 WHERE raw_value ? 'success';

-- time_seconds
UPDATE student_test_results_old r
   SET value_numeric = (raw_value->>'value')::numeric
 WHERE raw_value ? 'value';
```

Sau đó chỉ cần `INSERT INTO student_test_results SELECT ... FROM student_test_results_old`, trigger sẽ tự tính lại `score_percent`.
