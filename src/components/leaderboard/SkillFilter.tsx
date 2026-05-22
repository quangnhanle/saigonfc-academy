import { LayoutGrid } from "lucide-react";
import type { ClubStandard } from "../../types/database";

export type StandardFilterValue = "all" | string; // "all" hoặc club_standard.id

type Props = {
  value: StandardFilterValue;
  standards: ClubStandard[];
  onChange: (value: StandardFilterValue) => void;
};

export function SkillFilter({ value, standards, onChange }: Props) {
  const options: { key: StandardFilterValue; label: string }[] = [
    { key: "all", label: "Tổng hợp" },
    ...standards.map((s) => ({ key: s.id, label: s.standard_name }))
  ];

  return (
    <div className="flex items-center gap-3">
      <div className="hidden sm:flex items-center gap-2 text-xs text-muted font-semibold uppercase tracking-wider">
        <LayoutGrid className="h-3.5 w-3.5" />
        Lọc theo nhóm kỹ năng
      </div>
      <div className="flex-1 overflow-x-auto scrollbar-thin -mx-1 px-1">
        <div className="inline-flex gap-2">
          {options.map((opt) => {
            const active = opt.key === value;
            return (
              <button
                key={opt.key}
                type="button"
                onClick={() => onChange(opt.key)}
                className={[
                  "whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-semibold transition border",
                  active
                    ? "bg-ink text-background border-ink shadow-soft"
                    : "bg-card text-ink/70 border-border hover:border-ink/50 hover:text-ink"
                ].join(" ")}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
