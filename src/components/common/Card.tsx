import type { HTMLAttributes, ReactNode } from "react";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  interactive?: boolean;
  glow?: boolean;
};

export function Card({
  children,
  interactive,
  glow,
  className = "",
  ...rest
}: CardProps) {
  return (
    <div
      {...rest}
      className={[
        "rounded-2xl border bg-card border-border/80 shadow-soft",
        glow ? "glow-yellow border-brand/40" : "",
        interactive
          ? "transition-all duration-200 hover:-translate-y-0.5 hover:shadow-glow hover:border-brand/60 cursor-pointer"
          : "",
        className
      ].join(" ")}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  title,
  subtitle,
  action
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 p-5 border-b border-border/70">
      <div>
        <h3 className="text-lg font-bold tracking-tight text-ink">{title}</h3>
        {subtitle ? (
          <p className="text-sm text-muted mt-1">{subtitle}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export function CardBody({
  children,
  className = ""
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`p-5 ${className}`}>{children}</div>;
}
