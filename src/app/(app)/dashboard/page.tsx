"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Activity,
  Eye,
  FileText,
  MousePointerClick,
  Search,
  Target,
  TrendingUp,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { KpiCard } from "@/components/KpiCard";
import { ScoreRing } from "@/components/ScoreRing";
import { formatNumber, scoreColor } from "@/lib/utils";
import type { AnalyticsPoint, ContentRecord, RankingRow } from "@/lib/types";

type DashboardData = {
  project: { name: string; domain: string; niche: string };
  kpis: {
    organicTraffic: number;
    trafficDelta: number;
    impressions: number;
    clicks: number;
    avgPosition: number;
    keywordsTracked: number;
    contentPieces: number;
    avgSeoScore: number;
    rankingsImproving: number;
  };
  analytics: AnalyticsPoint[];
  rankings: RankingRow[];
  recentContent: ContentRecord[];
};

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/dashboard")
      .then((r) => r.json())
      .then(setData)
      .catch(() => setError("Failed to load dashboard."));
  }, []);

  if (error) {
    return <p className="text-rose-600">{error}</p>;
  }

  if (!data) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-10 w-64 rounded-xl bg-line/60" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 rounded-2xl bg-line/50" />
          ))}
        </div>
      </div>
    );
  }

  const { kpis, project } = data;

  return (
    <div className="space-y-6 animate-rise">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand">
            Overview
          </p>
          <h1 className="font-display text-3xl font-bold tracking-tight text-ink">
            {project.name}
          </h1>
          <p className="mt-1 text-sm text-ink-soft">
            {project.domain} · {project.niche}
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/research"
            className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-deep"
          >
            Research keywords
          </Link>
          <Link
            href="/engine"
            className="rounded-full border border-line bg-panel px-4 py-2 text-sm font-semibold text-ink hover:bg-paper"
          >
            Generate content
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Organic traffic"
          value={formatNumber(kpis.organicTraffic)}
          icon={TrendingUp}
          trend={kpis.trafficDelta}
        />
        <KpiCard
          label="Impressions"
          value={formatNumber(kpis.impressions)}
          icon={Eye}
        />
        <KpiCard
          label="Clicks"
          value={formatNumber(kpis.clicks)}
          icon={MousePointerClick}
        />
        <KpiCard
          label="Avg. position"
          value={String(kpis.avgPosition)}
          icon={Target}
          hint={`${kpis.rankingsImproving} rankings improving`}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-line bg-panel p-4 shadow-sm lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-lg font-bold">Organic traffic</h2>
            <Activity className="h-4 w-4 text-brand" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.analytics}>
                <defs>
                  <linearGradient id="trafficFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0f766e" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#0f766e" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => String(v).slice(5)}
                />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="organicTraffic"
                  stroke="#0f766e"
                  fill="url(#trafficFill)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-line bg-panel p-4 shadow-sm">
          <h2 className="font-display text-lg font-bold">Content health</h2>
          <div className="mt-4 flex items-center gap-4">
            <ScoreRing score={kpis.avgSeoScore} />
            <div className="space-y-2 text-sm">
              <p className="flex items-center gap-2 text-ink-soft">
                <FileText className="h-4 w-4 text-brand" />
                {kpis.contentPieces} pieces
              </p>
              <p className="flex items-center gap-2 text-ink-soft">
                <Search className="h-4 w-4 text-brand" />
                {kpis.keywordsTracked} keywords
              </p>
              <p className={`font-semibold ${scoreColor(kpis.avgSeoScore)}`}>
                Avg SEO score {kpis.avgSeoScore}
              </p>
            </div>
          </div>
          <div className="mt-5 space-y-2">
            {data.recentContent.map((c) => (
              <Link
                key={c.id}
                href={`/library/${c.id}`}
                className="block rounded-xl border border-line px-3 py-2 transition hover:border-brand/40 hover:bg-paper"
              >
                <p className="truncate text-sm font-medium text-ink">
                  {c.title}
                </p>
                <p className="mt-0.5 text-xs text-ink-soft">
                  Score {c.seoScore} · {c.status}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-line bg-panel p-4 shadow-sm">
        <h2 className="mb-3 font-display text-lg font-bold">Ranking movement</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="text-xs uppercase tracking-wider text-ink-soft">
              <tr>
                <th className="pb-2 font-medium">Keyword</th>
                <th className="pb-2 font-medium">Position</th>
                <th className="pb-2 font-medium">Prev</th>
                <th className="pb-2 font-medium">Change</th>
                <th className="pb-2 font-medium">URL</th>
              </tr>
            </thead>
            <tbody>
              {data.rankings.map((r) => (
                <tr key={r.id} className="border-t border-line/80">
                  <td className="py-2.5 font-medium">{r.keyword}</td>
                  <td>{r.position}</td>
                  <td>{r.previousPosition}</td>
                  <td
                    className={
                      r.change > 0
                        ? "font-semibold text-emerald-600"
                        : r.change < 0
                          ? "font-semibold text-rose-600"
                          : "text-ink-soft"
                    }
                  >
                    {r.change > 0 ? `+${r.change}` : r.change}
                  </td>
                  <td className="text-ink-soft">{r.url}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
