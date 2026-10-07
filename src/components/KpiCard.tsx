import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function KpiCard({
  label,
  value,
  hint,
  icon: Icon,
  trend,
}: {
  label: string;
  value: string;
  hint?: string;
  icon: LucideIcon;
  trend?: number;
}) {
  return (
    <div className="rounded-2xl border border-line bg-panel p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.12em] text-ink-soft">
            {label}
          </p>
          <p className="mt-2 font-display text-2xl font-bold tracking-tight text-ink">
            {value}
          </p>
          {hint ? (
            <p className="mt-1 text-xs text-ink-soft">{hint}</p>
          ) : null}
          {typeof trend === "number" ? (
            <p
              className={cn(
                "mt-2 text-xs font-semibold",
                trend >= 0 ? "text-emerald-600" : "text-rose-600"
              )}
            >
              {trend >= 0 ? "+" : ""}
              {trend}% vs last week
            </p>
          ) : null}
        </div>
        <div className="rounded-xl bg-glow/40 p-2.5 text-brand-deep">
          <Icon className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
}
