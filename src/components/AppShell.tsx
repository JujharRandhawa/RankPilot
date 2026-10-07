"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  FileText,
  Gauge,
  LayoutDashboard,
  Search,
  Sparkles,
  Wand2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/research", label: "Keyword Research", icon: Search },
  { href: "/engine", label: "Content Engine", icon: Wand2 },
  { href: "/library", label: "Content Library", icon: FileText },
  { href: "/analyzer", label: "SEO Analyzer", icon: Gauge },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[250px_1fr]">
      <aside className="border-b border-line bg-panel/90 backdrop-blur lg:border-b-0 lg:border-r">
        <div className="flex items-center gap-2 px-5 py-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-white shadow-sm">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <p className="font-display text-lg font-bold leading-none tracking-tight text-ink">
              RankPilot
            </p>
            <p className="mt-1 text-[11px] uppercase tracking-[0.14em] text-ink-soft">
              SEO Engine
            </p>
          </div>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:overflow-visible lg:pb-6">
          {NAV.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex shrink-0 items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                  active
                    ? "bg-brand text-white shadow-sm"
                    : "text-ink-soft hover:bg-paper hover:text-ink"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="mx-3 mb-4 hidden rounded-2xl border border-line bg-paper p-3 text-xs text-ink-soft lg:block">
          <p className="font-semibold text-ink">Demo mode</p>
          <p className="mt-1 leading-relaxed">
            Mock keyword, SERP, and scoring APIs — no paid keys required for
            viva.
          </p>
        </div>
      </aside>
      <main className="min-w-0 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}
