import { Link, Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Toaster } from "../common/Toaster";

export function AppLayout() {
  return (
    <div className="min-h-screen w-full flex flex-col">
      <Header />
      <main className="flex-1 w-full">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
          <Outlet />
        </div>
      </main>
      <footer className="border-t border-border/70 bg-card/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted">
          <span>
            © {new Date().getFullYear()} Saigon FC Academy · Skill
            Leaderboard System
          </span>
          <div className="flex items-center gap-4">
            <Link
              to="/admin"
              className="font-semibold text-ink/80 hover:text-ink transition"
            >
              SaiGon FC Admin
            </Link>
          </div>
        </div>
      </footer>
      <Toaster />
    </div>
  );
}
