import { useMemo, useState } from "react";
import { StandardOverview } from "../components/leaderboard/StandardOverview";
import {
  SkillFilter,
  type StandardFilterValue
} from "../components/leaderboard/SkillFilter";
import { LeaderboardTable } from "../components/leaderboard/LeaderboardTable";
import { useClubStandards } from "../hooks/useClubStandards";

export function HomePage() {
  const [filter, setFilter] = useState<StandardFilterValue>("all");
  const { data: standards } = useClubStandards();

  const filterLabel = useMemo(() => {
    if (filter === "all") return null;
    return standards.find((s) => s.id === filter)?.standard_name ?? null;
  }, [filter, standards]);

  return (
    <div className="space-y-8">
      <StandardOverview />

      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div>
            <h2 className="display-font text-2xl sm:text-3xl text-ink">
              Football Skill Leaderboard
            </h2>
            <p className="text-sm text-muted mt-1">
              {filterLabel
                ? `Xếp hạng nhóm "${filterLabel}" theo điểm trung bình của các bài test.`
                : "Xếp hạng tổng hợp 5 nhóm kỹ năng theo điểm chuẩn CLB."}
            </p>
          </div>
        </div>
        <SkillFilter value={filter} standards={standards} onChange={setFilter} />
        <LeaderboardTable filter={filter} />
      </section>
    </div>
  );
}
