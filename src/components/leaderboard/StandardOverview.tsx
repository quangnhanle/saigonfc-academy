import { Target, ChevronRight } from "lucide-react";
import { useClubStandards } from "../../hooks/useClubStandards";
import { useSkillTests } from "../../hooks/useSkillTests";
import { useSubSkillTests } from "../../hooks/useSubSkillTests";

export function StandardOverview() {
  const { data: standards } = useClubStandards();
  const { data: tests } = useSkillTests();
  const { data: subs } = useSubSkillTests();

  return (
    <section className="space-y-5">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 rounded-full bg-brand/15 text-brand-300 px-3 py-1 text-xs font-semibold">
          <Target className="h-3.5 w-3.5" />
          Tiêu chuẩn đánh giá Saigon FC
        </div>
        <p className="text-sm text-muted max-w-2xl">
          Mọi học viên đều được đánh giá dựa trên điểm chuẩn của CLB và phân loại tự động.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {standards
          .slice()
          .map((cs) => {
            const csTests = tests.filter(
              (t) => t.club_standard_id === cs.id
            );
            const csSubs = subs.filter((s) =>
              csTests.some((t) => t.id === s.skill_test_id)
            );
            return (
              <div
                key={cs.id}
                className="rounded-2xl border border-border bg-card p-4 shadow-soft hover:border-brand/50 transition"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-brand-300 uppercase tracking-wider">
                      {cs.standard_name}
                    </p>
                    {cs.description ? (
                      <p className="text-sm text-ink/80 mt-1">
                        {cs.description}
                      </p>
                    ) : null}
                  </div>
                  <div className="text-right shrink-0">
                    <p className="display-font text-2xl text-ink leading-none">
                      {csTests.length}
                    </p>
                    <p className="text-[10px] text-muted mt-1">bài test</p>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-border/70 space-y-1.5">
                  {csTests.length === 0 ? (
                    <p className="text-[11px] text-muted italic">
                      Chưa có bài test nào
                    </p>
                  ) : (
                    csTests.map((t) => {
                        const subCount = csSubs.filter(
                          (s) => s.skill_test_id === t.id
                        ).length;
                        return (
                          <div
                            key={t.id}
                            className="flex items-center justify-between text-[12px]"
                          >
                            <span className="flex items-center gap-1.5 text-ink/85 min-w-0">
                              <ChevronRight className="h-3 w-3 text-muted shrink-0" />
                              <span className="truncate">{t.test_name}</span>
                            </span>
                            <span className="text-muted shrink-0 ml-2">
                              {subCount} bài con
                            </span>
                          </div>
                        );
                      })
                  )}
                </div>
              </div>
            );
          })}
      </div>
    </section>
  );
}
