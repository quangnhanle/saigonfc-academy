import { CheckCircle2, Info, X, AlertTriangle } from "lucide-react";
import { useDataStore } from "../../data/DataProvider";

const KIND_STYLE = {
  success:
    "bg-emerald-500/15 border-emerald-500/30 text-emerald-200",
  error:
    "bg-red-500/15 border-red-500/30 text-red-200",
  info:
    "bg-sky-500/15 border-sky-500/30 text-sky-200"
} as const;

export function Toaster() {
  const { toasts, dismissToast } = useDataStore();

  return (
    <div className="fixed bottom-4 right-4 z-[60] flex flex-col gap-2 max-w-sm w-full">
      {toasts.map((t) => {
        const Icon =
          t.kind === "success"
            ? CheckCircle2
            : t.kind === "error"
              ? AlertTriangle
              : Info;
        return (
          <div
            key={t.id}
            className={`flex items-start gap-3 rounded-xl border px-4 py-3 shadow-soft ${KIND_STYLE[t.kind]}`}
          >
            <Icon className="h-5 w-5 mt-0.5 shrink-0" />
            <div className="flex-1 text-sm font-medium">{t.message}</div>
            <button
              onClick={() => dismissToast(t.id)}
              className="text-current/70 hover:text-current"
              aria-label="Đóng thông báo"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
