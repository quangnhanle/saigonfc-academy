import type {
  ClubStandard,
  SkillTest,
  Student,
  SubSkillTest,
  TestResult
} from "../types/database";
import { calculateScorePercent } from "../utils/score";

export const clubStandards: ClubStandard[] = [
  { id: "cs-1", standard_name: "Dẫn bóng" },
  { id: "cs-2", standard_name: "Chuyền bóng" },
  { id: "cs-3", standard_name: "Sút bóng" },
  { id: "cs-4", standard_name: "Thể lực" },
  { id: "cs-5", standard_name: "Tư duy chơi bóng" }
];

export const skillTests: SkillTest[] = [
  {
    id: "st-dribbling-obstacle",
    club_standard_id: "cs-1",
    test_name: "Dẫn bóng qua chướng ngại vật",
    description: "Vượt 6 cọc cách nhau 5m, đếm số lần thành công trên 10 lượt.",
    record_type: "success_attempt",
    standard_unit: "%",
    higher_is_better: true,
  },
  {
    id: "st-passing-15m",
    club_standard_id: "cs-2",
    test_name: "Chuyền 15m",
    description: "Chuyền chính xác bóng ở cự ly 15m, đo thời gian thực hiện.",
    record_type: "time_seconds",
    standard_unit: "giây",
    higher_is_better: false,
  },
  {
    id: "st-passing-25m",
    club_standard_id: "cs-2",
    test_name: "Chuyền 25m",
    description: "Chuyền dài 25m, đo thời gian thực hiện.",
    record_type: "time_seconds",
    standard_unit: "giây",
    higher_is_better: false,
  },
  {
    id: "st-shooting-target",
    club_standard_id: "cs-3",
    test_name: "Sút trúng mục tiêu",
    description: "Sút 10 lần vào khung mục tiêu từ 16m.",
    record_type: "success_attempt",
    standard_unit: "%",
    higher_is_better: true,
  },
  {
    id: "st-sprint-30m",
    club_standard_id: "cs-4",
    test_name: "Chạy nước rút 30m",
    description: "Chạy nước rút 30m, đo thời gian.",
    record_type: "time_seconds",
    standard_unit: "giây",
    higher_is_better: false,
  },
  {
    id: "st-yoyo",
    club_standard_id: "cs-4",
    test_name: "Yo-Yo endurance test",
    description: "Bài test sức bền liên tục đến khi không theo nhịp.",
    record_type: "score",
    standard_unit: "mét",
    higher_is_better: true,
  },
  {
    id: "st-tactical",
    club_standard_id: "cs-5",
    test_name: "Đánh giá quyết định chiến thuật",
    description: "Đánh giá khả năng đọc tình huống và ra quyết định.",
    record_type: "score",
    standard_unit: "điểm",
    higher_is_better: true,
  }
];

export const subSkillTests: SubSkillTest[] = [
  // Dẫn bóng qua chướng ngại vật
  { id: "sst-drib-left",  skill_test_id: "st-dribbling-obstacle", sub_skill_test_name: "Chân trái", standard_score: 60 },
  { id: "sst-drib-right", skill_test_id: "st-dribbling-obstacle", sub_skill_test_name: "Chân phải", standard_score: 70 },
  { id: "sst-drib-both",  skill_test_id: "st-dribbling-obstacle", sub_skill_test_name: "Hai chân",  standard_score: 80 },

  // Chuyền 15m
  { id: "sst-pass15-left",  skill_test_id: "st-passing-15m", sub_skill_test_name: "Chân trái", standard_score: 3.5 },
  { id: "sst-pass15-right", skill_test_id: "st-passing-15m", sub_skill_test_name: "Chân phải", standard_score: 3.0 },

  // Chuyền 25m
  { id: "sst-pass25-left",  skill_test_id: "st-passing-25m", sub_skill_test_name: "Chân trái", standard_score: 5.5 },
  { id: "sst-pass25-right", skill_test_id: "st-passing-25m", sub_skill_test_name: "Chân phải", standard_score: 5.0 },

  // Sút trúng mục tiêu
  { id: "sst-shoot-flat", skill_test_id: "st-shooting-target", sub_skill_test_name: "Sút sệt",  standard_score: 70 },
  { id: "sst-shoot-lob",  skill_test_id: "st-shooting-target", sub_skill_test_name: "Sút bổng", standard_score: 60 },

  // Chạy nước rút
  { id: "sst-sprint-30", skill_test_id: "st-sprint-30m", sub_skill_test_name: "30m", standard_score: 4.3 },

  // Yo-Yo
  { id: "sst-yoyo-total", skill_test_id: "st-yoyo", sub_skill_test_name: "Tổng quãng đường", standard_score: 2200 },

  // Tư duy
  { id: "sst-tactical-total", skill_test_id: "st-tactical", sub_skill_test_name: "Tổng điểm", standard_score: 85 }
];

export const students: Student[] = [
  { id: "s-001", full_name: "Nguyễn Hoàng Anh", birth_year: 2008, position: "Tiền đạo",          preferred_foot: "right", avatar_url: null },
  { id: "s-002", full_name: "Trần Minh Khôi",   birth_year: 2009, position: "Tiền vệ trung tâm", preferred_foot: "both",  avatar_url: null },
  { id: "s-003", full_name: "Lê Quang Hưng",    birth_year: 2007, position: "Hậu vệ cánh",       preferred_foot: "left",  avatar_url: null },
  { id: "s-004", full_name: "Phạm Đức Huy",     birth_year: 2008, position: "Tiền vệ phòng ngự", preferred_foot: "right", avatar_url: null },
  { id: "s-005", full_name: "Võ Tấn Lộc",       birth_year: 2010, position: "Tiền đạo cánh",     preferred_foot: "left",  avatar_url: null },
  { id: "s-006", full_name: "Đặng Bảo Sơn",     birth_year: 2009, position: "Trung vệ",          preferred_foot: "right", avatar_url: null },
  { id: "s-007", full_name: "Bùi Anh Tuấn",     birth_year: 2008, position: "Thủ môn",           preferred_foot: "right", avatar_url: null },
  { id: "s-008", full_name: "Hoàng Gia Bảo",    birth_year: 2010, position: "Tiền vệ tấn công",  preferred_foot: "both",  avatar_url: null }
];

type RawInput = {
  student_id: string;
  sub_skill_test_id: string;
  value_numeric?: number;
  success_count?: number;
  attempt_count?: number;
};

const rawResults: RawInput[] = [
  // Hoàng Anh
  { student_id: "s-001", sub_skill_test_id: "sst-drib-left",  success_count: 7,  attempt_count: 10 },
  { student_id: "s-001", sub_skill_test_id: "sst-drib-right", success_count: 9,  attempt_count: 10 },
  { student_id: "s-001", sub_skill_test_id: "sst-drib-both",  success_count: 8,  attempt_count: 10 },
  { student_id: "s-001", sub_skill_test_id: "sst-pass15-right", value_numeric: 3.1 },
  { student_id: "s-001", sub_skill_test_id: "sst-shoot-flat",   success_count: 8,  attempt_count: 10 },
  { student_id: "s-001", sub_skill_test_id: "sst-sprint-30",    value_numeric: 4.2 },
  { student_id: "s-001", sub_skill_test_id: "sst-yoyo-total",   value_numeric: 2350 },
  { student_id: "s-001", sub_skill_test_id: "sst-tactical-total", value_numeric: 88 },

  // Minh Khôi
  { student_id: "s-002", sub_skill_test_id: "sst-drib-right", success_count: 8, attempt_count: 10 },
  { student_id: "s-002", sub_skill_test_id: "sst-pass15-left",  value_numeric: 3.4 },
  { student_id: "s-002", sub_skill_test_id: "sst-pass15-right", value_numeric: 2.9 },
  { student_id: "s-002", sub_skill_test_id: "sst-pass25-right", value_numeric: 5.1 },
  { student_id: "s-002", sub_skill_test_id: "sst-shoot-flat",   success_count: 6, attempt_count: 10 },
  { student_id: "s-002", sub_skill_test_id: "sst-sprint-30",    value_numeric: 4.45 },
  { student_id: "s-002", sub_skill_test_id: "sst-yoyo-total",   value_numeric: 2400 },
  { student_id: "s-002", sub_skill_test_id: "sst-tactical-total", value_numeric: 92 },

  // Quang Hưng
  { student_id: "s-003", sub_skill_test_id: "sst-drib-left", success_count: 8, attempt_count: 10 },
  { student_id: "s-003", sub_skill_test_id: "sst-pass15-left", value_numeric: 3.6 },
  { student_id: "s-003", sub_skill_test_id: "sst-sprint-30",   value_numeric: 4.15 },
  { student_id: "s-003", sub_skill_test_id: "sst-yoyo-total",  value_numeric: 2280 },
  { student_id: "s-003", sub_skill_test_id: "sst-tactical-total", value_numeric: 78 },

  // Đức Huy
  { student_id: "s-004", sub_skill_test_id: "sst-drib-right", success_count: 7, attempt_count: 10 },
  { student_id: "s-004", sub_skill_test_id: "sst-pass15-right", value_numeric: 3.2 },
  { student_id: "s-004", sub_skill_test_id: "sst-pass25-right", value_numeric: 5.4 },
  { student_id: "s-004", sub_skill_test_id: "sst-shoot-flat",   success_count: 5, attempt_count: 10 },
  { student_id: "s-004", sub_skill_test_id: "sst-sprint-30",    value_numeric: 4.5 },
  { student_id: "s-004", sub_skill_test_id: "sst-tactical-total", value_numeric: 80 },

  // Tấn Lộc
  { student_id: "s-005", sub_skill_test_id: "sst-drib-left",  success_count: 5, attempt_count: 10 },
  { student_id: "s-005", sub_skill_test_id: "sst-pass15-left", value_numeric: 3.7 },
  { student_id: "s-005", sub_skill_test_id: "sst-shoot-flat",  success_count: 7, attempt_count: 10 },
  { student_id: "s-005", sub_skill_test_id: "sst-sprint-30",   value_numeric: 4.3 },
  { student_id: "s-005", sub_skill_test_id: "sst-yoyo-total",  value_numeric: 1950 },
  { student_id: "s-005", sub_skill_test_id: "sst-tactical-total", value_numeric: 70 },

  // Bảo Sơn
  { student_id: "s-006", sub_skill_test_id: "sst-drib-right", success_count: 6, attempt_count: 10 },
  { student_id: "s-006", sub_skill_test_id: "sst-pass15-right", value_numeric: 3.3 },
  { student_id: "s-006", sub_skill_test_id: "sst-sprint-30",    value_numeric: 4.6 },
  { student_id: "s-006", sub_skill_test_id: "sst-yoyo-total",   value_numeric: 2200 },
  { student_id: "s-006", sub_skill_test_id: "sst-tactical-total", value_numeric: 86 },

  // Anh Tuấn
  { student_id: "s-007", sub_skill_test_id: "sst-pass15-right", value_numeric: 3.4 },
  { student_id: "s-007", sub_skill_test_id: "sst-sprint-30",    value_numeric: 4.7 },
  { student_id: "s-007", sub_skill_test_id: "sst-yoyo-total",   value_numeric: 1980 },
  { student_id: "s-007", sub_skill_test_id: "sst-tactical-total", value_numeric: 82 },

  // Gia Bảo
  { student_id: "s-008", sub_skill_test_id: "sst-drib-left",  success_count: 7, attempt_count: 10 },
  { student_id: "s-008", sub_skill_test_id: "sst-drib-right", success_count: 8, attempt_count: 10 },
  { student_id: "s-008", sub_skill_test_id: "sst-pass15-left",  value_numeric: 3.2 },
  { student_id: "s-008", sub_skill_test_id: "sst-pass15-right", value_numeric: 2.9 },
  { student_id: "s-008", sub_skill_test_id: "sst-shoot-flat",   success_count: 7, attempt_count: 10 },
  { student_id: "s-008", sub_skill_test_id: "sst-sprint-30",    value_numeric: 4.35 },
  { student_id: "s-008", sub_skill_test_id: "sst-tactical-total", value_numeric: 90 }
];

export const testResults: TestResult[] = rawResults.map((row, idx) => {
  const sub = subSkillTests.find((s) => s.id === row.sub_skill_test_id)!;
  const test = skillTests.find((t) => t.id === sub.skill_test_id)!;
  const score = calculateScorePercent({
    recordType: test.record_type,
    higherIsBetter: test.higher_is_better,
    standardScore: sub.standard_score,
    valueNumeric: row.value_numeric ?? null,
    successCount: row.success_count ?? null,
    attemptCount: row.attempt_count ?? null
  });
  return {
    id: `tr-${(idx + 1).toString().padStart(4, "0")}`,
    student_id: row.student_id,
    sub_skill_test_id: row.sub_skill_test_id,
    value_numeric: row.value_numeric ?? null,
    success_count: row.success_count ?? null,
    attempt_count: row.attempt_count ?? null,
    score_percent: score,
    note: null,
    tested_at: "2025-09-12"
  };
});
