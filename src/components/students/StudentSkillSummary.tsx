import { RatingBadge } from "../common/Badge";
import { getRating } from "../../utils/rating";

export type SkillSummaryRow = {
  key: string;
  testId: string;
  testName: string;
  subSkillTestName: string;
  unit: string;
  standardScore: number;
  recordType: "time_seconds" | "success_attempt";
  rawLabel: string;
  scorePercent: number;
  difference: number;
  rankPosition: number;
};

export type SkillSummaryGroup = {
  standardId: string;
  standardName: string;
  averageScore: number;
  rows: SkillSummaryRow[];
};

type Props = {
  groups: SkillSummaryGroup[];
};

export function StudentSkillSummary({ groups }: Props) {
  if (groups.length === 0) {
    return (
      <p className="text-sm text-muted italic">
        Học viên chưa có kết quả test nào.
      </p>
    );
  }

  return (
    <div className="space-y-5">
      {groups.map((group) => {
        const rating = getRating(group.averageScore);
        return (
          <div key={group.standardId} className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-300">
                  {group.standardName}
                </span>
                <RatingBadge rating={rating} />
              </div>
              <span className="text-sm font-semibold text-ink">
                {group.averageScore.toFixed(1)}%
              </span>
            </div>
            {group.rows.length === 0 ? (
              <p className="text-xs text-muted italic">
                Chưa có kết quả trong nhóm này.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {group.rows.map((row) => {
                  const fill = Math.max(4, Math.min(100, row.scorePercent));
                  return (
                    <div
                      key={row.key}
                      className="rounded-2xl border border-border bg-card p-3.5 shadow-soft hover:border-brand/40 transition"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-ink truncate">
                            {row.testName}
                          </p>
                          <p className="text-xs text-muted truncate">
                            {row.subSkillTestName}
                          </p>
                        </div>
                        <span className="text-[11px] text-muted shrink-0">
                          #{row.rankPosition}
                        </span>
                      </div>

                      <div className="mt-3 flex items-end justify-between gap-2">
                        <div>
                          <p className="text-[10px] text-muted uppercase tracking-wider">
                            Kết quả
                          </p>
                          <p className="display-font text-xl text-ink leading-none mt-1">
                            {row.rawLabel}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] text-muted uppercase tracking-wider">
                            Đạt chuẩn
                          </p>
                          <p className="text-sm font-bold text-ink mt-1">
                            {row.scorePercent.toFixed(1)}%
                          </p>
                        </div>
                      </div>

                      <div className="mt-3">
                        <div className="flex items-center justify-between text-[11px] text-muted">
                          <span>
                            Tiêu chuẩn: {row.standardScore} {row.unit}
                          </span>
                          <span
                            className={
                              row.difference >= 0
                                ? "text-emerald-400 font-semibold"
                                : "text-orange-400 font-semibold"
                            }
                          >
                            {row.difference >= 0 ? "+" : ""}
                            {row.difference.toFixed(2)}
                          </span>
                        </div>
                        <div className="mt-1.5 h-1.5 rounded-full bg-ink/10 overflow-hidden">
                          <div
                            className={[
                              "h-full rounded-full transition-all duration-500",
                              row.scorePercent >= 90
                                ? "bg-brand"
                                : row.scorePercent >= 75
                                  ? "bg-emerald-500"
                                  : row.scorePercent >= 60
                                    ? "bg-sky-500"
                                    : "bg-orange-500"
                            ].join(" ")}
                            style={{ width: `${fill}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
