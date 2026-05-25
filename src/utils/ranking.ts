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

function roundScore(score: number): number {
  return Math.round(score * 10) / 10;
}

function capScore(score: number): number {
  return Math.min(100, score);
}

function buildResultLookup(testResults: TestResult[]) {
  const map = new Map<string, TestResult>();
  for (const result of testResults) {
    map.set(`${result.student_id}::${result.sub_skill_test_id}`, result);
  }
  return map;
}

function computeStudentTestScore(
  studentId: string,
  testId: string,
  { subSkillTests, testResults }: ResultIndex
): number | null {
  const resultByKey = buildResultLookup(testResults);
  const subIds = subSkillTests
    .filter((sub) => sub.skill_test_id === testId)
    .map((sub) => sub.id);
  const scores = subIds
    .map((subId) => resultByKey.get(`${studentId}::${subId}`))
    .filter((result): result is TestResult => Boolean(result))
    .map((result) => capScore(result.score_percent));

  if (scores.length === 0) return null;
  return roundScore(avg(scores));
}

function computeStudentStandardScore(
  studentId: string,
  standardId: string,
  index: ResultIndex
): number | null {
  const testScores = index.skillTests
    .filter((test) => test.club_standard_id === standardId)
    .map((test) => computeStudentTestScore(studentId, test.id, index))
    .filter((score): score is number => score != null);

  if (testScores.length === 0) return null;
  return roundScore(avg(testScores));
}

function studentIdsWithResults(testResults: TestResult[]): string[] {
  return [...new Set(testResults.map((result) => result.student_id))];
}

/**
 * Tính tổng hợp bằng trung bình các nhóm kỹ năng đã có dữ liệu.
 * Mỗi nhóm kỹ năng được tính từ trung bình các bài test trong nhóm, và mỗi
 * bài test là trung bình điểm các bài test con đã nhập, chặn tối đa 100%.
 */
export function computeOverallRanking(index: ResultIndex): OverallRanking[] {
  const overall: OverallRanking[] = [];
  for (const student_id of studentIdsWithResults(index.testResults)) {
    const standardScores = index.clubStandards
      .map((standard) =>
        computeStudentStandardScore(student_id, standard.id, index)
      )
      .filter((score): score is number => score != null);
    if (standardScores.length === 0) continue;

    const a = roundScore(avg(standardScores));
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
 * Xếp hạng 1 nhóm kỹ năng bằng trung bình các bài test trong nhóm.
 * Trong mỗi bài test, chỉ tính trung bình các bài test con đã nhập và chặn
 * điểm con tối đa 100%.
 */
export function computeStandardRanking(
  standardId: string,
  index: ResultIndex
): StandardRanking[] {
  const rankings: StandardRanking[] = [];
  for (const student_id of studentIdsWithResults(index.testResults)) {
    const a = computeStudentStandardScore(student_id, standardId, index);
    if (a == null) continue;

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
    .map((r) => {
      const score = capScore(r.score_percent);
      return {
        student_id: r.student_id,
        sub_skill_test_id: r.sub_skill_test_id,
        score,
        rank_position: 0,
        rating: getRating(score)
      };
    });
  rows.sort((a, b) => b.score - a.score);
  rows.forEach((row, i) => (row.rank_position = i + 1));
  return rows;
}

/**
 * Trung bình điểm kỹ năng của học viên cho mỗi club_standard,
 * dùng cho radar chart trên trang hồ sơ.
 */
export function computeStudentAveragesByStandard(
  studentId: string,
  index: ResultIndex
): { standard_id: string; standard_name: string; average_score: number }[] {
  return index.clubStandards
    .slice()
    .map((cs) => ({
      standard_id: cs.id,
      standard_name: cs.standard_name,
      average_score: computeStudentStandardScore(studentId, cs.id, index) ?? 0
    }));
}
