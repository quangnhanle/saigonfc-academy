import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, TrendingDown, TrendingUp } from "lucide-react";
import type { StandardFilterValue } from "./SkillFilter";
import { useStudents } from "../../hooks/useStudents";
import { useClubStandards } from "../../hooks/useClubStandards";
import { useRankings } from "../../hooks/useRankings";
import { Avatar } from "../common/Avatar";
import { RankMedal, RatingBadge } from "../common/Badge";
import { EmptyState } from "../common/EmptyState";

type Props = {
  filter: StandardFilterValue;
};

export function LeaderboardTable({ filter }: Props) {
  const navigate = useNavigate();
  const { data: students } = useStudents();
  const { data: standards } = useClubStandards();
  const { overall, rankByStandard } = useRankings();

  const studentMap = useMemo(
    () => new Map(students.map((s) => [s.id, s])),
    [students]
  );

  type Row = {
    key: string;
    rank: number;
    studentId: string;
    studentName: string;
    avatarUrl?: string | null;
    position?: string;
    groupLabel: string;
    score: number;
    diff: number;
    rating: (typeof overall)[number]["rating"];
  };

  const rows: Row[] = useMemo(() => {
    if (filter === "all") {
      return overall.map((o) => {
        const stu = studentMap.get(o.student_id);
        return {
          key: `all-${o.student_id}`,
          rank: o.rank_position,
          studentId: o.student_id,
          studentName: stu?.full_name ?? "—",
          avatarUrl: stu?.avatar_url ?? null,
          position: stu?.position,
          groupLabel: "Tổng hợp 5 nhóm",
          score: o.average_score,
          diff: Math.round((o.average_score - 100) * 10) / 10,
          rating: o.rating
        };
      });
    }
    const list = rankByStandard.get(filter) ?? [];
    const standardName =
      standards.find((s) => s.id === filter)?.standard_name ?? "—";
    return list.map((r) => {
      const stu = studentMap.get(r.student_id);
      return {
        key: `${filter}-${r.student_id}`,
        rank: r.rank_position,
        studentId: r.student_id,
        studentName: stu?.full_name ?? "—",
        avatarUrl: stu?.avatar_url ?? null,
        position: stu?.position,
        groupLabel: standardName,
        score: r.average_score,
        diff: Math.round((r.average_score - 100) * 10) / 10,
        rating: r.rating
      };
    });
  }, [filter, overall, rankByStandard, standards, studentMap]);

  if (rows.length === 0) {
    return (
      <EmptyState
        title="Chưa có dữ liệu xếp hạng"
        description="Thêm học viên hoặc cập nhật kết quả test trong trang Quản trị."
      />
    );
  }

  const handleClick = (studentId: string) =>
    navigate(`/students/${studentId}`);

  return (
    <div className="space-y-3">
      {/* Desktop table */}
      <div className="hidden md:block rounded-2xl border border-border bg-card overflow-hidden shadow-soft">
        <table className="w-full text-sm">
          <thead className="text-xs uppercase tracking-wider text-muted bg-ink/[0.04]">
            <tr>
              <th className="text-left font-semibold px-4 py-3 w-20">Hạng</th>
              <th className="text-left font-semibold px-4 py-3">Tên học viên</th>
              <th className="text-left font-semibold px-4 py-3">Nhóm kỹ năng</th>
              <th className="text-left font-semibold px-4 py-3">Điểm TB</th>
              <th className="text-left font-semibold px-4 py-3">
                Chênh lệch chuẩn CLB
              </th>
              <th className="text-left font-semibold px-4 py-3">
                Xếp hạng đánh giá
              </th>
              <th className="w-12 px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/70">
            {rows.map((row) => (
              <tr
                key={row.key}
                onClick={() => handleClick(row.studentId)}
                className="cursor-pointer transition-all duration-200 hover:bg-brand/5 hover:shadow-[inset_4px_0_0_0_rgba(246,201,69,0.85)] group"
              >
                <td className="px-4 py-3 align-middle">
                  <RankMedal rank={row.rank} />
                </td>
                <td className="px-4 py-3 align-middle">
                  <div className="flex items-center gap-3">
                    <Avatar
                      name={row.studentName}
                      src={row.avatarUrl}
                      size="md"
                    />
                    <div>
                      <p className="font-semibold text-ink leading-tight">
                        {row.studentName}
                      </p>
                      <p className="text-xs text-muted">{row.position}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 align-middle text-ink/80">
                  {row.groupLabel}
                </td>
                <td className="px-4 py-3 align-middle">
                  <span className="font-semibold text-ink">
                    {row.score.toFixed(1)}%
                  </span>
                </td>
                <td className="px-4 py-3 align-middle">
                  <span
                    className={[
                      "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
                      row.diff >= 0
                        ? "bg-emerald-500/15 text-emerald-300"
                        : "bg-orange-500/15 text-orange-300"
                    ].join(" ")}
                  >
                    {row.diff >= 0 ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    {row.diff >= 0 ? "+" : ""}
                    {row.diff.toFixed(1)}%
                  </span>
                </td>
                <td className="px-4 py-3 align-middle">
                  <RatingBadge rating={row.rating} />
                </td>
                <td className="px-4 py-3 align-middle">
                  <ChevronRight className="h-4 w-4 text-muted group-hover:text-brand transition" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile card list */}
      <div className="md:hidden space-y-3">
        {rows.map((row) => (
          <button
            key={row.key}
            type="button"
            onClick={() => handleClick(row.studentId)}
            className="w-full text-left rounded-2xl border border-border bg-card p-4 shadow-soft transition hover:-translate-y-0.5 hover:shadow-glow"
          >
            <div className="flex items-center gap-3">
              <RankMedal rank={row.rank} />
              <Avatar name={row.studentName} src={row.avatarUrl} size="md" />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-ink truncate">{row.studentName}</p>
                <p className="text-xs text-muted truncate">{row.position}</p>
              </div>
              <RatingBadge rating={row.rating} />
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
              <div>
                <p className="text-muted">Nhóm kỹ năng</p>
                <p className="font-semibold text-ink mt-0.5">{row.groupLabel}</p>
              </div>
              <div>
                <p className="text-muted">Điểm TB</p>
                <p className="font-semibold text-ink mt-0.5">
                  {row.score.toFixed(1)}%
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-muted">Chênh lệch chuẩn CLB</p>
                <span
                  className={[
                    "inline-flex items-center gap-1.5 mt-1 rounded-full px-2.5 py-1 text-xs font-semibold",
                    row.diff >= 0
                      ? "bg-emerald-500/15 text-emerald-300"
                      : "bg-orange-500/15 text-orange-300"
                  ].join(" ")}
                >
                  {row.diff >= 0 ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  {row.diff >= 0 ? "+" : ""}
                  {row.diff.toFixed(1)}%
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
