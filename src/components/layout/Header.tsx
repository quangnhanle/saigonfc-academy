import { NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const NAV = [
  { to: "/", label: "Bảng xếp hạng", end: true },
  { to: "/students", label: "Học viên", end: false }
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-card/85 backdrop-blur border-b border-border/70">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4 px-4 sm:px-6 py-3">
        <NavLink to="/" className="flex items-center gap-3">
          <img
            src="/saigon-fc-logo.png"
            alt="Saigon FC"
            className="h-11 w-11 rounded-xl object-contain bg-background border border-border p-1.5 shadow-soft"
          />
          <div className="leading-tight">
            <p className="display-font text-lg text-ink">SAIGON FC</p>
            <p className="text-[10px] text-muted -mt-0.5 tracking-wider uppercase">
              Skill Academy
            </p>
          </div>
        </NavLink>

        <nav className="hidden md:flex items-center gap-1">
          {NAV.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                [
                  "px-4 py-2 rounded-full text-sm font-semibold transition",
                  isActive
                    ? "bg-ink text-background"
                    : "text-ink/70 hover:bg-ink/5 hover:text-ink"
                ].join(" ")
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="md:hidden h-10 w-10 rounded-xl bg-ink/5 flex items-center justify-center text-ink"
          aria-label="Menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open ? (
        <nav className="md:hidden border-t border-border/70 px-4 py-3 flex flex-col gap-1 bg-card">
          {NAV.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                [
                  "px-4 py-2.5 rounded-xl text-sm font-semibold transition",
                  isActive
                    ? "bg-ink text-background"
                    : "text-ink/70 hover:bg-ink/5"
                ].join(" ")
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
      ) : null}
    </header>
  );
}
