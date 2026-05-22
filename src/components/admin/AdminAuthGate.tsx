import { useState, type ReactNode } from "react";
import { Lock, Phone } from "lucide-react";
import { Button } from "../common/Button";
import { FieldLabel, TextInput } from "../common/FormField";

const STORAGE_KEY = "saigon-fc-admin-phone";
// Số điện thoại được phép truy cập admin (mock auth).
const ALLOWED_PHONES = ["0901234567", "0987654321", "0123456789"];

function normalize(value: string) {
  return value.replace(/\D+/g, "");
}

type Props = {
  children: ReactNode;
};

export function AdminAuthGate({ children }: Props) {
  const [authed, setAuthed] = useState(() => {
    if (typeof window === "undefined") return false;
    const stored = window.sessionStorage.getItem(STORAGE_KEY);
    return stored ? ALLOWED_PHONES.includes(stored) : false;
  });
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (authed) return <>{children}</>;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const normalized = normalize(phone);
    if (!ALLOWED_PHONES.includes(normalized)) {
      setError("Số điện thoại không có quyền truy cập trang quản trị.");
      return;
    }
    window.sessionStorage.setItem(STORAGE_KEY, normalized);
    setError(null);
    setAuthed(true);
  };

  return (
    <div className="max-w-md mx-auto py-12">
      <div className="rounded-3xl border border-border bg-card shadow-soft overflow-hidden">
        <div className="p-6 border-b border-border/70 text-center">
          <div className="mx-auto mb-3 h-14 w-14 rounded-2xl bg-background border border-border flex items-center justify-center shadow-soft">
            <img
              src="/saigon-fc-logo.png"
              alt="Saigon FC"
              className="h-10 w-10 object-contain"
            />
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-brand/15 text-brand-300 px-3 py-1 text-xs font-semibold">
            <Lock className="h-3.5 w-3.5" />
            Đăng nhập Admin
          </div>
          <h2 className="display-font text-2xl mt-3 text-ink">
            Xác thực số điện thoại
          </h2>
          <p className="text-sm text-muted mt-2">
            Chỉ huấn luyện viên & quản trị viên của Saigon FC được phép
            vào trang quản trị dữ liệu.
          </p>
        </div>
        <form className="p-6 space-y-4" onSubmit={handleSubmit}>
          <FieldLabel
            label="Số điện thoại quản trị"
            hint="Demo: 0901234567 · 0987654321"
            required
            error={error ?? undefined}
          >
            <div className="relative">
              <Phone className="h-4 w-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <TextInput
                inputMode="tel"
                placeholder="09xx xxx xxx"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="pl-9"
                required
              />
            </div>
          </FieldLabel>
          <Button type="submit" variant="secondary" fullWidth>
            Truy cập trang quản trị
          </Button>
        </form>
      </div>
    </div>
  );
}
