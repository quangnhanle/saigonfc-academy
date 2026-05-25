import { useEffect, useMemo, useState } from "react";
import { Pencil, Plus, Table2, Trophy, Trash2 } from "lucide-react";
import type {
  SkillTest,
  Student,
  SubSkillTest,
  TestResult
} from "../../types/database";
import { Avatar } from "../common/Avatar";
import { RankMedal, RatingBadge } from "../common/Badge";
import { Button } from "../common/Button";
import { EmptyState } from "../common/EmptyState";
import { Modal } from "../common/Modal";
import { SubSkillTestForm } from "./SubSkillTestForm";
import { unitOf } from "../../types/football";
import { getRating } from "../../utils/rating";

type MatrixCellValue = {
  result?: TestResult;
  studentId: string;
  test: SkillTest;
};

type CellSavePayload =
  | { kind: "delete" }
  | { kind: "value"; value: number | null }
  | { kind: "success_attempt"; success: number; attempt: number };

function average(scores: number[]) {
  if (scores.length === 0) return 0;
  return scores.reduce((acc, score) => acc + score, 0) / scores.length;
}

function clampSubScore(score: number) {
  return Math.min(100, score);
}

function actualValue(result: TestResult, test: SkillTest) {
  if (test.record_type === "success_attempt") {
    return result.success_count ?? null;
  }
  return result.value_numeric ?? null;
}

function formatRankingInput(result: TestResult, test: SkillTest) {
  const value = actualValue(result, test);
  if (value == null) return "—";
  return Number.isInteger(value) ? value.toString() : value.toFixed(2);
}

/* ---------- Single editable cell ---------- */
function MatrixCell({
  value,
  onSave
}: {
  value: MatrixCellValue;
  onSave: (payload: CellSavePayload) => void;
}) {
  const { result, test } = value;
  const isSA = test.record_type === "success_attempt";

  // Local state mirrors saved value
  const initialNumeric = result?.value_numeric ?? null;
  const initialSuccess = result?.success_count ?? null;
  const initialAttempt = result?.attempt_count ?? null;

  const [numeric, setNumeric] = useState<string>(
    initialNumeric != null ? String(initialNumeric) : ""
  );
  const [success, setSuccess] = useState<string>(
    initialSuccess != null ? String(initialSuccess) : ""
  );
  const [attempt, setAttempt] = useState<string>(
    initialAttempt != null ? String(initialAttempt) : ""
  );

  useEffect(() => {
    setNumeric(initialNumeric != null ? String(initialNumeric) : "");
    setSuccess(initialSuccess != null ? String(initialSuccess) : "");
    setAttempt(initialAttempt != null ? String(initialAttempt) : "");
  }, [initialNumeric, initialSuccess, initialAttempt]);

  const commit = () => {
    if (isSA) {
      const s = success === "" ? null : parseInt(success, 10);
      const a = attempt === "" ? null : parseInt(attempt, 10);
      if (s == null || a == null) {
        // Bỏ trống cả 2 → xóa kết quả nếu có
        if (result && initialSuccess != null) {
          onSave({ kind: "delete" });
        }
        return;
      }
      if (s === initialSuccess && a === initialAttempt) return;
      onSave({ kind: "success_attempt", success: s, attempt: a });
    } else {
      if (numeric === "") {
        if (result && initialNumeric != null) onSave({ kind: "delete" });
        return;
      }
      const v = parseFloat(numeric);
      if (!Number.isFinite(v)) return;
      if (v === initialNumeric) return;
      onSave({ kind: "value", value: v });
    }
  };

  return (
    <div className="p-2 min-w-[140px]">
      {isSA ? (
        <div className="flex items-center gap-1">
          <input
            type="number"
            min={0}
            value={success}
            onChange={(e) => setSuccess(e.target.value)}
            onBlur={commit}
            placeholder="✓"
            className="w-14 rounded-lg bg-background/60 border border-border px-2 py-1.5 text-sm text-ink text-center outline-none focus:border-brand/60 focus:ring-2 focus:ring-brand/20"
          />
          <span className="text-muted">/</span>
          <input
            type="number"
            min={1}
            value={attempt}
            onChange={(e) => setAttempt(e.target.value)}
            onBlur={commit}
            placeholder="∑"
            className="w-14 rounded-lg bg-background/60 border border-border px-2 py-1.5 text-sm text-ink text-center outline-none focus:border-brand/60 focus:ring-2 focus:ring-brand/20"
          />
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <input
            type="number"
            step="0.01"
            value={numeric}
            onChange={(e) => setNumeric(e.target.value)}
            onBlur={commit}
            placeholder="—"
            className="w-full max-w-[110px] rounded-lg bg-background/60 border border-border px-2 py-1.5 text-sm text-ink outline-none focus:border-brand/60 focus:ring-2 focus:ring-brand/20"
          />
          <span className="text-[10px] text-muted shrink-0">
            {unitOf(test.record_type)}
          </span>
        </div>
      )}
    </div>
  );
}

/* ---------- Sub-skill-test sub-header chip ---------- */
function SubHeaderChip({
  sub,
  test,
  onEdit,
  onDelete
}: {
  sub: SubSkillTest;
  test: SkillTest;
  onEdit: () => void;
  onDelete?: () => void;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="font-semibold text-ink text-sm">
        {sub.sub_skill_test_name}
      </span>
      <span className="text-[11px] text-muted">
        Chuẩn {sub.standard_score} {unitOf(test.record_type)} ·{" "}
        {test.higher_is_better ? "↑" : "↓"}
      </span>
      <div className="flex items-center gap-1 mt-0.5">
        <button
          onClick={onEdit}
          className="h-6 w-6 rounded-md flex items-center justify-center bg-ink/10 text-ink/80 hover:bg-ink/20 transition"
          aria-label="Sửa bài test con"
        >
          <Pencil className="h-3 w-3" />
        </button>
        {onDelete ? (
          <button
            onClick={onDelete}
            className="h-6 w-6 rounded-md flex items-center justify-center bg-red-500/15 text-red-300 hover:bg-red-500/25 transition"
            aria-label="Xóa bài test con"
          >
            <Trash2 className="h-3 w-3" />
          </button>
        ) : null}
      </div>
    </div>
  );
}

/* ---------- Matrix table ---------- */
type Props = {
  test: SkillTest;
  subTests: SubSkillTest[];
  students: Student[];
  results: TestResult[];
  onCreateSub: (data: Omit<SubSkillTest, "id">) => void;
  onUpdateSub: (id: string, data: Partial<Omit<SubSkillTest, "id">>) => void;
  onDeleteSub: (id: string) => void;
  lockFootSubTests?: boolean;
  onCreateResult: (
    data: Omit<TestResult, "id" | "score_percent">
  ) => void;
  onUpdateResult: (
    id: string,
    data: Partial<Omit<TestResult, "id">>
  ) => void;
  onDeleteResult: (id: string) => void;
};

export function ResultMatrix({
  test,
  subTests,
  students,
  results,
  onCreateSub,
  onUpdateSub,
  onDeleteSub,
  lockFootSubTests = false,
  onCreateResult,
  onUpdateResult,
  onDeleteResult
}: Props) {
  const [view, setView] = useState<"matrix" | "ranking">("matrix");
  const [subModal, setSubModal] = useState<{
    open: boolean;
    editing: SubSkillTest | null;
  }>({ open: false, editing: null });

  // Index results by (student × sub)
  const resultByKey = useMemo(() => {
    const map = new Map<string, TestResult>();
    for (const r of results) {
      map.set(`${r.student_id}::${r.sub_skill_test_id}`, r);
    }
    return map;
  }, [results]);

  const rankingRows = useMemo(() => {
    const rows = students
      .map((student) => {
        const cells = subTests.map((sub) => {
          const result = resultByKey.get(`${student.id}::${sub.id}`);
          return {
            sub,
            result,
            actual: result ? actualValue(result, test) : null
          };
        });
        const enteredCells = cells.filter(
          (cell): cell is typeof cell & { actual: number } =>
            cell.actual != null
        );
        const actualAverage = average(
          enteredCells.map((cell) => cell.actual)
        );
        const standardAverage = average(
          enteredCells.map((cell) => cell.sub.standard_score)
        );
        const rawSubScore =
          actualAverage > 0 && standardAverage > 0
            ? test.higher_is_better
              ? (actualAverage / standardAverage) * 100
              : (standardAverage / actualAverage) * 100
            : 0;
        const subScore = clampSubScore(
          Math.round(rawSubScore * 10) / 10
        );

        return {
          student,
          cells,
          subScore,
          rating: getRating(subScore),
          hasResult: enteredCells.length > 0,
          rank: 0
        };
      })
      .filter((row) => row.hasResult)
      .sort((a, b) => b.subScore - a.subScore);

    rows.forEach((row, index) => {
      row.rank = index + 1;
    });

    return rows;
  }, [students, subTests, resultByKey]);

  const handleCellSave = (
    student: Student,
    sub: SubSkillTest,
    payload: CellSavePayload
  ) => {
    const existing = resultByKey.get(`${student.id}::${sub.id}`);
    const tested_at = new Date().toISOString().slice(0, 10);

    if (payload.kind === "delete") {
      if (existing) onDeleteResult(existing.id);
      return;
    }

    const base = {
      student_id: student.id,
      sub_skill_test_id: sub.id,
      note: existing?.note ?? null,
      tested_at: existing?.tested_at ?? tested_at,
      value_numeric: null as number | null,
      success_count: null as number | null,
      attempt_count: null as number | null
    };

    if (payload.kind === "value") {
      base.value_numeric = payload.value;
    } else if (payload.kind === "success_attempt") {
      base.success_count = payload.success;
      base.attempt_count = payload.attempt;
    }

    if (existing) {
      onUpdateResult(existing.id, base);
    } else {
      onCreateResult(base);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-ink">
            Bảng nhập kết quả · {test.test_name}
          </p>
          <p className="text-xs text-muted mt-0.5">
            {subTests.length} bài test con · {students.length} học viên · Nhập
            xong bấm Tab/Click ra ngoài để lưu
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-xl border border-border bg-background/60 p-1">
            <button
              type="button"
              onClick={() => setView("matrix")}
              className={[
                "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition",
                view === "matrix"
                  ? "bg-brand text-background shadow-soft"
                  : "text-muted hover:text-ink"
              ].join(" ")}
            >
              <Table2 className="h-3.5 w-3.5" />
              Nhập điểm
            </button>
            <button
              type="button"
              onClick={() => setView("ranking")}
              className={[
                "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition",
                view === "ranking"
                  ? "bg-brand text-background shadow-soft"
                  : "text-muted hover:text-ink"
              ].join(" ")}
            >
              <Trophy className="h-3.5 w-3.5" />
              Xếp hạng
            </button>
          </div>
        {!lockFootSubTests ? (
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<Plus className="h-3.5 w-3.5" />}
            onClick={() => setSubModal({ open: true, editing: null })}
          >
            Thêm bài test con
          </Button>
        ) : null}
      </div>
      </div>

      {subTests.length === 0 ? (
        <EmptyState
          title="Bài test này chưa có bài test con"
          description="Thêm ít nhất một bài test con (vd: Chân trái, Chân phải) để bắt đầu nhập kết quả."
          action={
            lockFootSubTests ? undefined : (
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<Plus className="h-3.5 w-3.5" />}
              onClick={() => setSubModal({ open: true, editing: null })}
            >
              Thêm bài test con đầu tiên
            </Button>
            )
          }
        />
      ) : view === "matrix" ? (
        <div className="rounded-2xl border border-border bg-card shadow-soft overflow-hidden">
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-ink/[0.04]">
                  <th className="sticky left-0 z-10 bg-card/95 backdrop-blur min-w-[220px] text-left px-4 py-3 text-xs uppercase tracking-wider text-muted border-r border-border">
                    Học viên
                  </th>
                  {subTests.map((sub) => (
                    <th
                      key={sub.id}
                      className="text-left px-3 py-3 text-xs uppercase tracking-wider text-muted border-r border-border/60"
                    >
                      <SubHeaderChip
                        sub={sub}
                        test={test}
                        onEdit={() =>
                          setSubModal({ open: true, editing: sub })
                        }
                        onDelete={
                          lockFootSubTests
                            ? undefined
                            : () => {
                                if (
                                  confirm(
                                    `Xóa bài test con "${sub.sub_skill_test_name}"? Toàn bộ kết quả của bài test con này sẽ bị xóa.`
                                  )
                                ) {
                                  onDeleteSub(sub.id);
                                }
                              }
                        }
                      />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/70">
                {students.map((student) => (
                  <tr key={student.id} className="hover:bg-brand/5 transition">
                    <td className="sticky left-0 z-10 bg-card/95 backdrop-blur px-4 py-2 border-r border-border">
                      <div className="flex items-center gap-2.5">
                        <Avatar
                          name={student.full_name}
                          src={student.avatar_url}
                          size="sm"
                        />
                        <div className="min-w-0">
                          <p className="font-medium text-ink text-sm truncate">
                            {student.full_name}
                          </p>
                          <p className="text-[11px] text-muted truncate">
                            {student.position}
                          </p>
                        </div>
                      </div>
                    </td>
                    {subTests.map((sub) => {
                      const result = resultByKey.get(
                        `${student.id}::${sub.id}`
                      );
                      return (
                        <td
                          key={sub.id}
                          className="align-top border-r border-border/60"
                        >
                          <MatrixCell
                            value={{
                              result,
                              studentId: student.id,
                              test
                            }}
                            onSave={(p) => handleCellSave(student, sub, p)}
                          />
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : rankingRows.length === 0 ? (
        <EmptyState
          title="Chưa có dữ liệu xếp hạng"
          description="Nhập kết quả cho ít nhất một học viên để xem bảng xếp hạng của bài test này."
        />
      ) : (
        <div className="rounded-2xl border border-border bg-card shadow-soft overflow-hidden">
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full border-collapse text-sm">
              <thead className="text-xs uppercase tracking-wider text-muted bg-ink/[0.04]">
                <tr>
                  <th className="text-left font-semibold px-4 py-3 w-20">
                    Hạng
                  </th>
                  <th className="sticky left-0 z-10 bg-card/95 backdrop-blur min-w-[220px] text-left font-semibold px-4 py-3 border-r border-border">
                    Học viên
                  </th>
                  {subTests.map((sub) => (
                    <th
                      key={sub.id}
                      className="text-left font-semibold px-3 py-3 min-w-[150px] border-r border-border/60"
                    >
                      {sub.sub_skill_test_name}
                    </th>
                  ))}
                  <th className="text-left font-semibold px-4 py-3 min-w-[120px]">
                    Điểm sub
                  </th>
                  <th className="text-left font-semibold px-4 py-3 min-w-[150px]">
                    Đánh giá
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/70">
                {rankingRows.map((row) => (
                  <tr
                    key={row.student.id}
                    className="hover:bg-brand/5 transition"
                  >
                    <td className="px-4 py-3 align-middle">
                      <RankMedal rank={row.rank} />
                    </td>
                    <td className="sticky left-0 z-10 bg-card/95 backdrop-blur px-4 py-3 align-middle border-r border-border">
                      <div className="flex items-center gap-2.5">
                        <Avatar
                          name={row.student.full_name}
                          src={row.student.avatar_url}
                          size="sm"
                        />
                        <div className="min-w-0">
                          <p className="font-semibold text-ink truncate">
                            {row.student.full_name}
                          </p>
                          <p className="text-[11px] text-muted truncate">
                            {row.student.position}
                          </p>
                        </div>
                      </div>
                    </td>
                    {row.cells.map((cell) => (
                      <td
                        key={cell.sub.id}
                        className="px-3 py-3 align-middle border-r border-border/60"
                      >
                        {cell.result ? (
                          <div>
                            <p className="font-semibold text-ink">
                              {formatRankingInput(cell.result, test)}
                            </p>
                            <p className="text-[11px] text-muted mt-0.5">
                              Chuẩn {cell.sub.standard_score}{" "}
                              {unitOf(test.record_type)}
                            </p>
                          </div>
                        ) : (
                          <span className="text-muted">—</span>
                        )}
                      </td>
                    ))}
                    <td className="px-4 py-3 align-middle">
                      <span className="font-bold text-ink">
                        {row.subScore.toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-4 py-3 align-middle">
                      <RatingBadge rating={row.rating} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal
        open={subModal.open}
        onClose={() => setSubModal({ open: false, editing: null })}
        title={
          subModal.editing ? "Cập nhật bài test con" : "Thêm bài test con"
        }
      >
        <SubSkillTestForm
          tests={[test]}
          initial={
            subModal.editing ?? {
              id: "",
              skill_test_id: test.id,
              sub_skill_test_name: "",
              standard_score: 0
            }
          }
          onCancel={() => setSubModal({ open: false, editing: null })}
          onSubmit={(data) => {
            if (subModal.editing) {
              onUpdateSub(subModal.editing.id, data);
            } else {
              onCreateSub({ ...data, skill_test_id: test.id });
            }
            setSubModal({ open: false, editing: null });
          }}
        />
      </Modal>
    </div>
  );
}
