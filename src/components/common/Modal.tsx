import { X } from "lucide-react";
import { useEffect, type ReactNode } from "react";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg";
};

const SIZE: Record<NonNullable<ModalProps["size"]>, string> = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl"
};

export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  size = "md"
}: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6">
      <div
        className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={`relative w-full ${SIZE[size]} rounded-t-2xl sm:rounded-2xl bg-card shadow-2xl border border-border/70`}
      >
        <div className="flex items-center justify-between border-b border-border/70 p-4">
          <h3 className="text-base font-bold text-ink">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 hover:bg-ink/5 text-muted hover:text-ink transition"
            aria-label="Đóng"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="p-5 max-h-[70vh] overflow-y-auto scrollbar-thin">
          {children}
        </div>
        {footer ? (
          <div className="border-t border-border/70 p-4 flex justify-end gap-2">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
}
