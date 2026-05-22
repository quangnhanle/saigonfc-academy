type AvatarProps = {
  name: string;
  src?: string | null;
  size?: "sm" | "md" | "lg" | "xl";
};

const SIZE: Record<NonNullable<AvatarProps["size"]>, string> = {
  sm: "h-9 w-9 text-xs",
  md: "h-11 w-11 text-sm",
  lg: "h-16 w-16 text-lg",
  xl: "h-24 w-24 text-2xl"
};

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return (parts[0]![0]! + parts[parts.length - 1]![0]!).toUpperCase();
}

const PALETTE = [
  "bg-amber-200 text-amber-800",
  "bg-rose-200 text-rose-800",
  "bg-emerald-200 text-emerald-800",
  "bg-sky-200 text-sky-800",
  "bg-violet-200 text-violet-800",
  "bg-orange-200 text-orange-800"
];

function pickPalette(name: string) {
  let sum = 0;
  for (const ch of name) sum += ch.charCodeAt(0);
  return PALETTE[sum % PALETTE.length];
}

export function Avatar({ name, src, size = "md" }: AvatarProps) {
  const sizeClass = SIZE[size];
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`${sizeClass} rounded-full object-cover ring-2 ring-card shadow-soft`}
      />
    );
  }
  return (
    <div
      className={`${sizeClass} ${pickPalette(name)} rounded-full flex items-center justify-center font-bold ring-2 ring-card shadow-soft`}
    >
      {initials(name)}
    </div>
  );
}
