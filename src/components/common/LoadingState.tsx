import { Loader2 } from "lucide-react";

export function LoadingState({ message = "Đang tải dữ liệu..." }: { message?: string }) {
  return (
    <div className="flex items-center justify-center gap-3 py-12 text-muted">
      <Loader2 className="h-5 w-5 animate-spin" />
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
}
