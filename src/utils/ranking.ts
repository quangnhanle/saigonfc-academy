import type {
  ClubStandard,
  SkillTest,
  SubSkillTest,
  TestResult
} from "../types/database";
import type { SkillRating } from "../types/football";
import { getRating } from "./rating";

export type ResultIndex = {
  testResults: TestResult[];
  subSkillTests: SubSkillTest[];
  skillTests: SkillTest[];
  clubStandards: ClubStandard[];
};

export type OverallRanking = {
  student_id: string;
  average_score: number;
  rank_position: number;
  rating: SkillRating;
};

export type StandardRanking = {
  student_id: string;
  club_standard_id: string;
  average_score: number;
  rank_position: number;
  rating: SkillRating;
};

export type SubTestRanking = {
  student_id: string;
  sub_skill_test_id: string;
  score: number;
  rank_position: number;
  rating: SkillRating;
};

function avg(scores: number[]): number {
  if (scores.length === 0) return 0;
  return scores.reduce((acc, s) => acc + s, 0) / scores.length;
}

/**
 * Tính trung bình score_percent của 1 học viên trên toàn bộ kết quả.
 */
export function computeOverallRanking(
  testResults: TestResult[]
): OverallRanking[] {
  const byStudent = new Map<string, number[]>();
  for (const r of testResults) {
    const list = byStudent.get(r.student_id) ?? [];
    list.push(r.score_percent);
    byStudent.set(r.student_id, list);
  }
  const overall: OverallRanking[] = [];
  for (const [student_id, scores] of byStudent.entries()) {
    const a = Math.round(avg(scores) * 10) / 10;
    overall.push({
      student_id,
      average_score: a,
      rank_position: 0,
      rating: getRating(a)
    });
  }
  overall.sort((a, b) => b.average_score - a.average_score);
  overall.forEach((row, i) => (row.rank_position = i + 1));
  return overall;
}

/**
 * Trung bình score_percent của 1 học viên trên 1 club_standard
 * (gom tất cả sub_skill_test thuộc các skill_test của standard đó).
 */
export function computeStandardRanking(
  standardId: string,
  { testResults, subSkillTests, skillTests }: ResultIndex
): StandardRanking[] {
  const testIdsInStandard = new Set(
    skillTests
      .filter((t) => t.club_standard_id === standardId)
      .map((t) => t.id)
  );
  const subIdsInStandard = new Set(
    subSkillTests
      .filter((s) => testIdsInStandard.has(s.skill_test_id))
      .map((s) => s.id)
  );

  const byStudent = new Map<string, number[]>();
  for (const r of testResults) {
    if (!subIdsInStandard.has(r.sub_skill_test_id)) continue;
    const list = byStudent.get(r.student_id) ?? [];
    list.push(r.score_percent);
    byStudent.set(r.student_id, list);
  }

  const rankings: StandardRanking[] = [];
  for (const [student_id, scores] of byStudent.entries()) {
    const a = Math.round(avg(scores) * 10) / 10;
    rankings.push({
      student_id,
      club_standard_id: standardId,
      average_score: a,
      rank_position: 0,
      rating: getRating(a)
    });
  }
  rankings.sort((a, b) => b.average_score - a.average_score);
  rankings.forEach((row, i) => (row.rank_position = i + 1));
  return rankings;
}

/**
 * Xếp hạng trong 1 sub_skill_test cụ thể.
 */
export function computeSubTestRanking(
  subSkillTestId: string,
  testResults: TestResult[]
): SubTestRanking[] {
  const rows = testResults
    .filter((r) => r.sub_skill_test_id === subSkillTestId)
    .map((r) => ({
      student_id: r.student_id,
      sub_skill_test_id: r.sub_skill_test_id,
      score: r.score_percent,
      rank_position: 0,
      rating: getRating(r.score_percent)
    }));
  rows.sort((a, b) => b.score - a.score);
  rows.forEach((row, i) => (row.rank_position = i + 1));
  return rows;
}

/**
 * Trung bình score_percent của học viên cho mỗi club_standard,
 * dùng cho radar chart trên trang hồ sơ.
 */
export function computeStudentAveragesByStandard(
  studentId: string,
  { testResults, subSkillTests, skillTests, clubStandards }: ResultIndex
): { standard_id: string; standard_name: string; average_score: number }[] {
  const subById = new Map(subSkillTests.map((s) => [s.id, s]));
  const testById = new Map(skillTests.map((t) => [t.id, t]));

  const byStandard = new Map<string, number[]>();
  for (const r of testResults) {
    if (r.student_id !== studentId) continue;
    const sub = subById.get(r.sub_skill_test_id);
    if (!sub) continue;
    const test = testById.get(sub.skill_test_id);
    if (!test) continue;
    const list = byStandard.get(test.club_standard_id) ?? [];
    list.push(r.score_percent);
    byStandard.set(test.club_standard_id, list);
  }

  return clubStandards
    .slice()
    .map((cs) => ({
      standard_id: cs.id,
      standard_name: cs.standard_name,
      average_score:
        Math.round(avg(byStandard.get(cs.id) ?? []) * 10) / 10
    }));
}
