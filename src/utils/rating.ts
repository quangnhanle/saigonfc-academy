import type { SkillRating } from "../types/football";

export function getRating(scorePercent: number): SkillRating {
  if (scorePercent >= 90) return "Xuất sắc";
  if (scorePercent >= 75) return "Tốt";
  if (scorePercent >= 60) return "Đạt yêu cầu";
  return "Cần cải thiện";
}

export const RATING_TONE: Record<
  SkillRating,
  {
    bg: string;
    text: string;
    ring: string;
    dot: string;
    label: string;
  }
> = {
  "Xuất sắc": {
    bg: "bg-brand/15",
    text: "text-brand-300",
    ring: "ring-brand/30",
    dot: "bg-brand",
    label: "Xuất sắc"
  },
  "Tốt": {
    bg: "bg-emerald-500/15",
    text: "text-emerald-300",
    ring: "ring-emerald-500/30",
    dot: "bg-emerald-400",
    label: "Tốt"
  },
  "Đạt yêu cầu": {
    bg: "bg-sky-500/15",
    text: "text-sky-300",
    ring: "ring-sky-500/30",
    dot: "bg-sky-400",
    label: "Đạt yêu cầu"
  },
  "Cần cải thiện": {
    bg: "bg-orange-500/15",
    text: "text-orange-300",
    ring: "ring-orange-500/30",
    dot: "bg-orange-400",
    label: "Cần cải thiện"
  }
};
