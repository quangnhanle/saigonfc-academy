import { useMemo } from "react";
import type {
  ClubStandard,
  SkillTest,
  Student,
  SubSkillTest,
  TestResult
} from "../../types/database";
import { Avatar } from "../common/Avatar";
import { EmptyState } from "../common/EmptyState";
import { getRating, RATING_TONE } from "../../utils/rating";

type Props = {
  standard: ClubStandard;
  tests: SkillTest[];
  subTests: SubSkillTest[];
  students: Student[];
  results: TestResult[];
};

function pickToneFromScore(score: number) {
  const r = getRating(score);
  return RATING_TONE[r];
}

export function StandardMatrix({
  standard,
  tests,
  subTests,
  students,
  results
}: Props) {
  const standardScore = standard.standard_score ?? 100;

  const subsByTest = useMemo(() => {
    const map = new Map<string, SubSkillTest[]>();
    for (const t of tests) map.set(t.id, []);
    for (const s of subTests) {
      if (map.has(s.skill_test_id)) {
        map.get(s.skill_test_id)!.push(s);
      }
    }
    return map;
  }, [tests, subTests]);

  const cellScores = useMemo(() => {
    const map = new Map<string, Map<string, number | null>>();

    for (const student of students) {
      const row = new Map<string, number | null>();
      for (const t of tests) {
        const subs = subsByTest.get(t.id) ?? [];
        const subIds = new Set(subs.map((s) => s.id));
        const scores = results
          .filter(
            (r) =>
              r.student_id === student.id && subIds.has(r.sub_skill_test_id)
          )
          .map((r) => r.score_percent);
        if (scores.length === 0) {
          row.set(t.id, null);
        } else {
          const avg = scores.reduce((acc, s) => acc + s, 0) / scores.length;
          row.set(t.id, Math.round(avg * 10) / 10);
        }
      }
      map.set(student.id, row);
    }
    return map;
  }, [students, tests, results, subsByTest]);

  if (tests.length === 0) {
    return (
      <EmptyState
        title="Nhóm kỹ năng này chưa có bài test"
        description="Thêm bài test đầu tiên cho nhóm kỹ năng này để xem bảng tổng hợp."
      />
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card shadow-soft overflow-hidden">
      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-ink/[0.04]">
              <th className="sticky left-0 z-10 bg-card/95 backdrop-blur min-w-[220px] text-left px-4 py-3 text-xs uppercase tracking-wider text-muted border-r border-border">
                Học viên
              </th>
              {tests.map((t) => (
                <th
                  key={t.id}
                  className="text-left px-3 py-3 text-xs uppercase tracking-wider text-muted border-r border-border/60 min-w-[160px]"
                >
                  <div className="flex flex-col gap-0.5">
                    <span className="font-semibold text-ink text-sm normal-case tracking-normal">
                      {t.test_name}
                    </span>
                    <span className="text-[11px] text-muted normal-case tracking-normal">
                      Chuẩn {standardScore}% (theo nhóm)
                    </span>
                  </div>
                </th>
              ))}
              <th className="text-left px-3 py-3 text-xs uppercase tracking-wider text-muted border-r border-border/60 min-w-[170px] bg-brand/5">
                <div className="flex flex-col gap-0.5">
                  <span className="font-semibold text-brand-300 text-sm normal-case tracking-normal">
                    Trung bình
                  </span>
                  <span className="text-[11px] text-muted normal-case tracking-normal">
                    Chuẩn {standardScore}%
                  </span>
                </div>
              </th>
              <th className="text-left px-3 py-3 text-xs uppercase tracking-wider text-muted min-w-[140px]">
                Đánh giá
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/70">
            {students.map((student) => {
              const row = cellScores.get(student.id);
              const validScores: number[] = [];
              if (row) {
                for (const t of tests) {
                  const v = row.get(t.id);
                  if (v != null) validScores.push(v);
                }
              }
              const avg =
                validScores.length === 0
                  ? null
                  : Math.round(
                      (validScores.reduce((acc, s) => acc + s, 0) /
                        validScores.length) *
                        10
                    ) / 10;
              const diff =
                avg == null
                  ? null
                  : Math.round((avg - standardScore) * 10) / 10;
              const rating = avg == null ? null : getRating(avg);
              const ratingTone = rating ? RATING_TONE[rating] : null;

              return (
                <tr key={student.id} className="hover:bg-brand/5 transition">
                  <td className="sticky left-0 z-10 bg-card/95 backdrop-blur px-4 py-2.5 border-r border-border">
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
                  {tests.map((t) => {
                    const v = row?.get(t.id);
                    if (v == null) {
                      return (
                        <td
                          key={t.id}
                          className="px-3 py-2.5 border-r border-border/60 text-center"
                        >
                          <span className="text-xs text-muted">—</span>
                        </td>
                      );
                    }
                    const tone = pickToneFromScore(v);
                    return (
                      <td
                        key={t.id}
                        className="px-3 py-2.5 border-r border-border/60"
                      >
                        <div
                          className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold ring-1 ${tone.bg} ${tone.text} ${tone.ring}`}
                        >
                          {v.toFixed(1)}%
                        </div>
                      </td>
                    );
                  })}
                  <td className="px-3 py-2.5 border-r border-border/60 bg-brand/5">
                    {avg == null ? (
                      <span className="text-xs text-muted">—</span>
                    ) : (
                      <div className="flex flex-col gap-0.5">
                        <span className="font-bold text-ink text-sm">
                          {avg.toFixed(1)}%
                        </span>
                        {diff != null ? (
                          <span
                            className={`text-[11px] font-semibold ${
                              diff >= 0
                                ? "text-emerald-400"
                                : "text-orange-400"
                            }`}
                          >
                            {diff >= 0 ? "+" : ""}
                            {diff.toFixed(1)}% so với chuẩn
                          </span>
                        ) : null}
                      </div>
                    )}
                  </td>
                  <td className="px-3 py-2.5">
                    {rating && ratingTone ? (
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${ratingTone.bg} ${ratingTone.text} ${ratingTone.ring}`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${ratingTone.dot}`}
                        />
                        {ratingTone.label}
                      </span>
                    ) : (
                      <span className="text-xs text-muted">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
