import type { RecordType } from "../types/football";
import { unitOf } from "../types/football";
import type { TestResult } from "../types/database";

type ScoreInput = {
  recordType: RecordType;
  higherIsBetter: boolean;
  standardScore: number;
  valueNumeric?: number | null;
  successCount?: number | null;
  attemptCount?: number | null;
};

/**
 * Quy raw value về 1 con số "actual" rồi so với standard_score.
 * Trả về phần trăm đạt chuẩn, clamp [0, 100].
 */
export function calculateScorePercent({
  recordType,
  higherIsBetter,
  standardScore,
  valueNumeric,
  successCount,
  attemptCount
}: ScoreInput): number {
  let actual: number | null = null;

  if (recordType === "success_attempt") {
    if (
      successCount == null ||
      attemptCount == null ||
      attemptCount <= 0
    ) {
      return 0;
    }
    actual = (successCount / attemptCount) * 100;
  } else {
    actual = valueNumeric ?? null;
  }

  if (actual == null || actual <= 0 || standardScore <= 0) return 0;

  const raw = higherIsBetter
    ? (actual / standardScore) * 100
    : (standardScore / actual) * 100;

  return Math.round(Math.max(0, Math.min(raw, 100)) * 100) / 100;
}

/**
 * Format raw value của TestResult thành chuỗi hiển thị.
 */
export function formatResultRaw(
  result: Pick<
    TestResult,
    "value_numeric" | "success_count" | "attempt_count"
  >,
  recordType: RecordType
): string {
  if (recordType === "success_attempt") {
    const s = result.success_count ?? 0;
    const a = result.attempt_count ?? 0;
    const pct = a > 0 ? Math.round((s / a) * 1000) / 10 : 0;
    return `${s}/${a} · ${pct}%`;
  }
  const v = result.value_numeric ?? 0;
  const formatted = Number.isInteger(v) ? v.toString() : v.toFixed(2);
  return `${formatted} ${unitOf(recordType)}`;
}

/**
 * Khoảng cách raw so với chuẩn (đã đảo dấu để + luôn nghĩa là "tốt hơn chuẩn").
 */
export function calculateDifference(
  result: Pick<
    TestResult,
    "value_numeric" | "success_count" | "attempt_count"
  >,
  recordType: RecordType,
  higherIsBetter: boolean,
  standardScore: number
): number {
  let actual: number;
  if (recordType === "success_attempt") {
    const s = result.success_count ?? 0;
    const a = result.attempt_count ?? 0;
    actual = a > 0 ? (s / a) * 100 : 0;
  } else {
    actual = result.value_numeric ?? 0;
  }
  const diff = actual - standardScore;
  return Math.round((higherIsBetter ? diff : -diff) * 100) / 100;
}

export function formatDifference(diff: number, recordType: RecordType): string {
  const sign = diff > 0 ? "+" : "";
  const formatted = Number.isInteger(diff) ? diff.toString() : diff.toFixed(2);
  return `${sign}${formatted} ${unitOf(recordType)}`;
}
