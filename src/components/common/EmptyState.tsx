import type { ReactNode } from "react";
import { Inbox } from "lucide-react";

export function EmptyState({
  title = "Chưa có dữ liệu",
  description,
  icon,
  action
}: {
  title?: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12 px-6 rounded-2xl border border-dashed border-border bg-card/40">
      <div className="h-14 w-14 rounded-full bg-ink/10 flex items-center justify-center text-ink/50 mb-4">
        {icon ?? <Inbox className="h-6 w-6" />}
      </div>
      <h3 className="text-base font-semibold text-ink">{title}</h3>
      {description ? (
        <p className="text-sm text-muted mt-1 max-w-md">{description}</p>
      ) : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
