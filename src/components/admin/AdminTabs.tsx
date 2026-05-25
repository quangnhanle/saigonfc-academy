import { Users, Layers, Dumbbell, Trophy } from "lucide-react";

export type AdminTabKey = "students" | "standards" | "tests" | "rankings";

const TABS: { key: AdminTabKey; label: string; icon: typeof Users }[] = [
  { key: "students",  label: "Học viên",     icon: Users },
  { key: "standards", label: "Nhóm kỹ năng", icon: Layers },
  { key: "tests",     label: "Bài test",     icon: Dumbbell },
  { key: "rankings",  label: "Bảng xếp hạng", icon: Trophy }
];

type Props = {
  value: AdminTabKey;
  onChange: (value: AdminTabKey) => void;
};

export function AdminTabs({ value, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-2 p-1.5 rounded-2xl bg-card border border-border shadow-soft">
      {TABS.map(({ key, label, icon: Icon }) => {
        const active = key === value;
        return (
          <button
            key={key}
            type="button"
            onClick={() => onChange(key)}
            className={[
              "inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition",
              active
                ? "bg-ink text-background shadow-soft"
                : "text-ink/70 hover:bg-ink/10 hover:text-ink"
            ].join(" ")}
          >
            <Icon className="h-4 w-4" />
            <span>{label}</span>
          </button>
        );
      })}
    </div>
  );
}
