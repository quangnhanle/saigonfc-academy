import { useEffect, useMemo, useState } from "react";
import type {
  SkillTest,
  Student,
  SubSkillTest,
  TestResult
} from "../../types/database";
import { Button } from "../common/Button";
import {
  FieldLabel,
  Select,
  TextArea,
  TextInput
} from "../common/FormField";
import {
  calculateScorePercent,
  formatDifference
} from "../../utils/score";
import { unitOf } from "../../types/football";
import { getRating } from "../../utils/rating";
import { RatingBadge } from "../common/Badge";

type Props = {
  students: Student[];
  tests: SkillTest[];
  subTests: SubSkillTest[];
  initial?: TestResult | null;
  onCancel: () => void;
  onSubmit: (data: Omit<TestResult, "id" | "score_percent">) => void;
};

export function TestResultForm({
  students,
  tests,
  subTests,
  initial,
  onCancel,
  onSubmit
}: Props) {
  const [studentId, setStudentId] = useState(students[0]?.id ?? "");
  const [subSkillTestId, setSubSkillTestId] = useState(
    subTests[0]?.id ?? ""
  );
  const [valueNumeric, setValueNumeric] = useState<number>(0);
  const [successCount, setSuccessCount] = useState<number>(0);
  const [attemptCount, setAttemptCount] = useState<number>(10);
  const [note, setNote] = useState("");
  const [testedAt, setTestedAt] = useState(
    new Date().toISOString().slice(0, 10)
  );

  useEffect(() => {
    if (initial) {
      setStudentId(initial.student_id);
      setSubSkillTestId(initial.sub_skill_test_id);
      setValueNumeric(initial.value_numeric ?? 0);
      setSuccessCount(initial.success_count ?? 0);
      setAttemptCount(initial.attempt_count ?? 10);
      setNote(initial.note ?? "");
      setTestedAt(initial.tested_at?.slice(0, 10) ?? "");
    } else {
      setStudentId(students[0]?.id ?? "");
      setSubSkillTestId(subTests[0]?.id ?? "");
      setValueNumeric(0);
      setSuccessCount(0);
      setAttemptCount(10);
      setNote("");
      setTestedAt(new Date().toISOString().slice(0, 10));
    }
  }, [initial, students, subTests]);

  const selectedSub = useMemo(
    () => subTests.find((s) => s.id === subSkillTestId),
    [subTests, subSkillTestId]
  );
  const selectedTest = useMemo(
    () =>
      selectedSub
        ? tests.find((t) => t.id === selectedSub.skill_test_id)
        : undefined,
    [tests, selectedSub]
  );

  const isSuccessAttempt = selectedTest?.record_type === "success_attempt";

  const preview = useMemo(() => {
    if (!selectedTest || !selectedSub) return null;
    const score = calculateScorePercent({
      recordType: selectedTest.record_type,
      higherIsBetter: selectedTest.higher_is_better,
      standardScore: selectedSub.standard_score,
      valueNumeric: isSuccessAttempt ? null : valueNumeric,
      successCount: isSuccessAttempt ? successCount : null,
      attemptCount: isSuccessAttempt ? attemptCount : null
    });
    let diff = 0;
    if (isSuccessAttempt) {
      const actual =
        attemptCount > 0 ? (successCount / attemptCount) * 100 : 0;
      diff = actual - selectedSub.standard_score;
    } else {
      diff = valueNumeric - selectedSub.standard_score;
    }
    return {
      scorePercent: score,
      difference:
        Math.round(
          (selectedTest.higher_is_better ? diff : -diff) * 100
        ) / 100,
      rating: getRating(score)
    };
  }, [
    selectedTest,
    selectedSub,
    isSuccessAttempt,
    valueNumeric,
    successCount,
    attemptCount
  ]);

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        if (!studentId || !subSkillTestId || !selectedTest) return;
        onSubmit({
          student_id: studentId,
          sub_skill_test_id: subSkillTestId,
          value_numeric: isSuccessAttempt ? null : Number(valueNumeric),
          success_count: isSuccessAttempt ? Number(successCount) : null,
          attempt_count: isSuccessAttempt ? Number(attemptCount) : null,
          note: note.trim() || null,
          tested_at: testedAt
        });
      }}
    >
      <div className="grid sm:grid-cols-2 gap-4">
        <FieldLabel label="Học viên" required>
          <Select
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
          >
            {students.map((s) => (
              <option key={s.id} value={s.id}>
                {s.full_name}
              </option>
            ))}
          </Select>
        </FieldLabel>
        <FieldLabel label="Bài test con" required>
          <Select
            value={subSkillTestId}
            onChange={(e) => setSubSkillTestId(e.target.value)}
          >
            {subTests.map((sub) => {
              const t = tests.find((x) => x.id === sub.skill_test_id);
              return (
                <option key={sub.id} value={sub.id}>
                  {t?.test_name ?? "—"} · {sub.sub_skill_test_name}
                </option>
              );
            })}
          </Select>
        </FieldLabel>
      </div>

      {isSuccessAttempt ? (
        <div className="grid sm:grid-cols-2 gap-4">
          <FieldLabel label="Số lần thành công" required>
            <TextInput
              type="number"
              value={successCount}
              min={0}
              onChange={(e) =>
                setSuccessCount(parseInt(e.target.value || "0", 10))
              }
            />
          </FieldLabel>
          <FieldLabel label="Tổng số lần thử" required>
            <TextInput
              type="number"
              value={attemptCount}
              min={1}
              onChange={(e) =>
                setAttemptCount(parseInt(e.target.value || "0", 10))
              }
            />
          </FieldLabel>
        </div>
      ) : (
        <FieldLabel
          label={`Kết quả (${
            selectedTest ? unitOf(selectedTest.record_type) : ""
          })`}
          required
        >
          <TextInput
            type="number"
            step="0.01"
            value={valueNumeric}
            onChange={(e) =>
              setValueNumeric(parseFloat(e.target.value || "0"))
            }
          />
        </FieldLabel>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        <FieldLabel label="Ngày test">
          <TextInput
            type="date"
            value={testedAt}
            onChange={(e) => setTestedAt(e.target.value)}
          />
        </FieldLabel>
      </div>

      <FieldLabel label="Ghi chú">
        <TextArea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Ghi chú về buổi test (nếu có)"
        />
      </FieldLabel>

      {preview && selectedTest && selectedSub ? (
        <div className="rounded-2xl border border-brand/30 bg-brand/10 p-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-brand-300">
            Hệ thống sẽ tự tính
          </p>
          <div className="mt-2 grid grid-cols-3 gap-3 text-sm">
            <div>
              <p className="text-xs text-muted">Đạt chuẩn</p>
              <p className="display-font text-2xl text-ink leading-none mt-1">
                {preview.scorePercent.toFixed(1)}%
              </p>
            </div>
            <div>
              <p className="text-xs text-muted">Chênh lệch</p>
              <p
                className={`display-font text-2xl leading-none mt-1 ${
                  preview.difference >= 0
                    ? "text-emerald-300"
                    : "text-orange-300"
                }`}
              >
                {formatDifference(preview.difference, selectedTest.record_type)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted">Rating</p>
              <div className="mt-1.5">
                <RatingBadge rating={preview.rating} />
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Hủy
        </Button>
        <Button type="submit" variant="secondary">
          {initial ? "Cập nhật kết quả" : "Lưu kết quả"}
        </Button>
      </div>
    </form>
  );
}
