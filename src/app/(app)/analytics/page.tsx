"use client";

import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatNumber } from "@/lib/utils";
import type {
  AnalyticsPoint,
  KeywordRecord,
  RankingRow,
} from "@/lib/types";

type AnalyticsPayload = {
  project: { name: string; domain: string };
  analytics: AnalyticsPoint[];
  rankings: RankingRow[];
  intentDistribution: { intent: string; count: number }[];
  scoreDistribution: { label: string; count: number }[];
  topKeywords: KeywordRecord[];
};

const INTENT_COLORS = ["#0f766e", "#ea580c", "#0369a1", "#7c3aed"];

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsPayload | null>(null);
  const [resetting, setResetting] = useState(false);

  const load = () => {
    fetch("/api/analytics")
      .then((r) => r.json())
      .then(setData);
  };

  useEffect(() => {
    load();
  }, []);

  async function resetDemo() {
    if (!confirm("Reset all demo data to the seeded state?")) return;
    setResetting(true);
    try {
      await fetch("/api/reset", { method: "POST" });
      load();
    } finally {
      setResetting(false);
    }
  }

  if (!data) {
    return <p className="text-sm text-ink-soft">Loading analytics…</p>;
  }

  return (
    <div className="space-y-6 animate-rise">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand">
            Insights
          </p>
          <h1 className="font-display text-3xl font-bold tracking-tight">
            Analytics
          </h1>
          <p className="mt-1 text-sm text-ink-soft">
            Simulated Search Console–style metrics for {data.project.domain}
          </p>
        </div>
        <button
          type="button"
          onClick={resetDemo}
          disabled={resetting}
          className="rounded-full border border-line bg-panel px-4 py-2 text-sm font-medium hover:bg-paper disabled:opacity-60"
        >
          {resetting ? "Resetting…" : "Reset demo data"}
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-line bg-panel p-4 shadow-sm">
          <h2 className="mb-3 font-display text-lg font-bold">
            Clicks vs impressions
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.analytics}>
                <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10 }}
                  tickFormatter={(v) => String(v).slice(5)}
                />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="clicks"
                  stroke="#0f766e"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="impressions"
                  stroke="#ea580c"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-line bg-panel p-4 shadow-sm">
          <h2 className="mb-3 font-display text-lg font-bold">
            Average position
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.analytics}>
                <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10 }}
                  tickFormatter={(v) => String(v).slice(5)}
                />
                <YAxis reversed tick={{ fontSize: 10 }} domain={["auto", "auto"]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="avgPosition"
                  stroke="#0369a1"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-line bg-panel p-4 shadow-sm">
          <h2 className="mb-3 font-display text-lg font-bold">
            Search intent mix
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.intentDistribution}
                  dataKey="count"
                  nameKey="intent"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={3}
                >
                  {data.intentDistribution.map((_, i) => (
                    <Cell
                      key={i}
                      fill={INTENT_COLORS[i % INTENT_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-line bg-panel p-4 shadow-sm">
          <h2 className="mb-3 font-display text-lg font-bold">
            Content score distribution
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.scoreDistribution}>
                <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#0f766e" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-line bg-panel p-4 shadow-sm">
        <h2 className="mb-3 font-display text-lg font-bold">
          Top opportunity keywords
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="text-xs uppercase tracking-wider text-ink-soft">
              <tr>
                <th className="pb-2 font-medium">Keyword</th>
                <th className="pb-2 font-medium">Volume</th>
                <th className="pb-2 font-medium">Difficulty</th>
                <th className="pb-2 font-medium">Opportunity</th>
              </tr>
            </thead>
            <tbody>
              {data.topKeywords.map((k) => (
                <tr key={k.id} className="border-t border-line">
                  <td className="py-2.5 font-medium">{k.keyword}</td>
                  <td>{formatNumber(k.volume)}</td>
                  <td>{k.difficulty}</td>
                  <td className="font-semibold text-brand">
                    {formatNumber(k.opportunity)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
