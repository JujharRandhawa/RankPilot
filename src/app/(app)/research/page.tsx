"use client";

import { useEffect, useState } from "react";
import { Loader2, Search } from "lucide-react";
import type { KeywordRecord } from "@/lib/types";
import { formatNumber } from "@/lib/utils";

export default function ResearchPage() {
  const [keyword, setKeyword] = useState("seo content strategy");
  const [loading, setLoading] = useState(false);
  const [keywords, setKeywords] = useState<KeywordRecord[]>([]);
  const [message, setMessage] = useState("");

  const load = () => {
    fetch("/api/keywords")
      .then((r) => r.json())
      .then((d) => setKeywords(d.keywords ?? []));
  };

  useEffect(() => {
    load();
  }, []);

  async function runResearch(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/keywords", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error || "Research failed");
      } else {
        setMessage(
          `Found ${data.keywords.length} opportunities for “${data.seed}”.`
        );
        load();
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6 animate-rise">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand">
          Research
        </p>
        <h1 className="font-display text-3xl font-bold tracking-tight">
          Keyword Research
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-ink-soft">
          Enter a seed keyword to simulate SERP expansion: volume, difficulty,
          CPC, intent, and opportunity score (mock engine).
        </p>
      </div>

      <form
        onSubmit={runResearch}
        className="flex flex-col gap-3 rounded-2xl border border-line bg-panel p-4 shadow-sm sm:flex-row"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" />
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="w-full rounded-xl border border-line bg-paper py-3 pl-10 pr-3 text-sm outline-none ring-brand focus:ring-2"
            placeholder="e.g. on page seo checklist"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-white hover:bg-brand-deep disabled:opacity-60"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Run research
        </button>
      </form>

      {message ? (
        <p className="text-sm font-medium text-brand-deep">{message}</p>
      ) : null}

      <div className="overflow-x-auto rounded-2xl border border-line bg-panel shadow-sm">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead className="bg-paper text-xs uppercase tracking-wider text-ink-soft">
            <tr>
              <th className="px-4 py-3 font-medium">Keyword</th>
              <th className="px-4 py-3 font-medium">Volume</th>
              <th className="px-4 py-3 font-medium">Difficulty</th>
              <th className="px-4 py-3 font-medium">CPC</th>
              <th className="px-4 py-3 font-medium">Intent</th>
              <th className="px-4 py-3 font-medium">Opportunity</th>
            </tr>
          </thead>
          <tbody>
            {keywords.map((k) => (
              <tr key={k.id} className="border-t border-line">
                <td className="px-4 py-3 font-medium">{k.keyword}</td>
                <td className="px-4 py-3">{formatNumber(k.volume)}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-16 overflow-hidden rounded-full bg-line">
                      <div
                        className="h-full rounded-full bg-accent"
                        style={{ width: `${k.difficulty}%` }}
                      />
                    </div>
                    {k.difficulty}
                  </div>
                </td>
                <td className="px-4 py-3">${k.cpc.toFixed(2)}</td>
                <td className="px-4 py-3 capitalize">{k.intent}</td>
                <td className="px-4 py-3 font-semibold text-brand">
                  {formatNumber(k.opportunity)}
                </td>
              </tr>
            ))}
            {keywords.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-ink-soft">
                  No keywords yet — run a research query.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
