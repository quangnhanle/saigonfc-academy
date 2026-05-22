import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
};

const VARIANT_CLASS: Record<Variant, string> = {
  primary:
    "bg-ink text-background hover:bg-ink/90 focus-visible:ring-ink/30 shadow-soft",
  secondary:
    "bg-brand text-background hover:bg-brand-500 focus-visible:ring-brand-300 shadow-glow",
  ghost:
    "bg-transparent text-ink hover:bg-ink/10 focus-visible:ring-ink/20",
  danger:
    "bg-red-500 text-white hover:bg-red-600 focus-visible:ring-red-300"
};

const SIZE_CLASS: Record<Size, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-4 text-sm",
  lg: "h-12 px-6 text-base"
};

export function Button({
  variant = "primary",
  size = "md",
  leftIcon,
  rightIcon,
  fullWidth,
  className = "",
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      className={[
        "inline-flex items-center justify-center gap-2 rounded-xl font-semibold",
        "transition-all duration-200 outline-none",
        "focus-visible:ring-4",
        "disabled:opacity-50 disabled:pointer-events-none",
        VARIANT_CLASS[variant],
        SIZE_CLASS[size],
        fullWidth ? "w-full" : "",
        className
      ].join(" ")}
    >
      {leftIcon ? <span className="-ml-0.5">{leftIcon}</span> : null}
      <span>{children}</span>
      {rightIcon ? <span className="-mr-0.5">{rightIcon}</span> : null}
    </button>
  );
}
