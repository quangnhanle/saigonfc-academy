import type { ReactNode } from "react";
import { RATING_TONE } from "../../utils/rating";
import type { SkillRating } from "../../types/football";

export function RatingBadge({ rating }: { rating: SkillRating }) {
  const tone = RATING_TONE[rating];
  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold",
        "ring-1",
        tone.bg,
        tone.text,
        tone.ring
      ].join(" ")}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${tone.dot}`}
      />
      {tone.label}
    </span>
  );
}

export function Pill({
  children,
  tone = "neutral"
}: {
  children: ReactNode;
  tone?: "neutral" | "brand" | "ink";
}) {
  const tones: Record<string, string> = {
    neutral: "bg-ink/5 text-ink/85 ring-1 ring-ink/10",
    brand: "bg-brand/15 text-brand-300 ring-1 ring-brand/30",
    ink: "bg-ink text-background"
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

export function RankMedal({ rank }: { rank: number }) {
  if (rank === 1) {
    return (
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand to-brand-600 text-background font-bold text-sm shadow-glow ring-2 ring-brand/40">
        1
      </span>
    );
  }
  if (rank === 2) {
    return (
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-slate-300 to-slate-500 text-background font-bold text-sm ring-2 ring-slate-400/40">
        2
      </span>
    );
  }
  if (rank === 3) {
    return (
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-orange-600 text-background font-bold text-sm ring-2 ring-orange-300/40">
        3
      </span>
    );
  }
  return (
    <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-ink/10 text-ink/70 font-bold text-sm">
      {rank}
    </span>
  );
}
