import { AlertTriangle } from "lucide-react";

export function ConfigErrorScreen() {
  return (
    <div className="min-h-screen bg-background text-ink flex items-center justify-center p-6">
      <div className="max-w-xl w-full rounded-3xl border border-border bg-card shadow-soft overflow-hidden">
        <div className="p-6 border-b border-border/70 flex items-start gap-3">
          <div className="h-12 w-12 rounded-2xl bg-red-500/15 text-red-300 flex items-center justify-center shrink-0">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div className="min-w-0">
            <h1 className="display-font text-xl text-ink">
              Thiếu cấu hình Supabase
            </h1>
            <p className="text-sm text-muted mt-1">
              Ứng dụng cần biến môi trường để kết nối đến Supabase. Vui lòng
              thiết lập trước khi sử dụng.
            </p>
          </div>
        </div>

        <div className="p-6 space-y-4 text-sm">
          <div>
            <p className="font-semibold text-ink mb-2">Các bước thiết lập:</p>
            <ol className="list-decimal pl-5 space-y-1.5 text-ink/80">
              <li>
                Tạo file <code className="px-1.5 py-0.5 rounded bg-background border border-border text-xs">.env</code> tại thư mục gốc của project
                (copy từ <code className="px-1.5 py-0.5 rounded bg-background border border-border text-xs">.env.example</code>).
              </li>
              <li>
                Điền hai biến sau với giá trị từ Supabase Dashboard → Project
                Settings → API:
              </li>
            </ol>
          </div>

          <pre className="rounded-xl bg-background border border-border p-3 text-xs overflow-x-auto">
{`VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...`}
          </pre>

          <ol className="list-decimal pl-5 space-y-1.5 text-ink/80" start={3}>
            <li>
              Chạy file <code className="px-1.5 py-0.5 rounded bg-background border border-border text-xs">supabase/schema.sql</code> trên Supabase SQL Editor
              để tạo bảng.
            </li>
            <li>Khởi động lại lệnh <code className="px-1.5 py-0.5 rounded bg-background border border-border text-xs">npm run dev</code>.</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
