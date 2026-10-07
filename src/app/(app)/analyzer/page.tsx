"use client";

import { useState } from "react";
import { Gauge, Loader2 } from "lucide-react";
import { ScoreRing } from "@/components/ScoreRing";
import type { ScoreBreakdown } from "@/lib/types";

type ScoreResult = {
  seoScore: number;
  wordCount: number;
  breakdown: ScoreBreakdown;
};

export default function AnalyzerPage() {
  const [keyword, setKeyword] = useState("on page seo checklist");
  const [title, setTitle] = useState("On Page SEO Checklist for 2026");
  const [metaTitle, setMetaTitle] = useState(
    "On Page SEO Checklist (2026) | Rank Higher Fast"
  );
  const [metaDescription, setMetaDescription] = useState(
    "Use this practical on page seo checklist to improve titles, content structure, internal links, and technical basics for better rankings."
  );
  const [body, setBody] = useState(
    `# On Page SEO Checklist for 2026

## Start with search intent
Match your page to what people want when they search for on page seo checklist.

## Optimize titles and headings
Include the primary keyword in the H1 and one H2. Keep titles clear.

## Structure for scanners
- Short paragraphs
- Bullet lists
- Descriptive subheadings

## Technical basics
Fix crawl issues, compress images, and add internal links.

## Measure results
Track clicks, impressions, and average position weekly.
`
  );
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScoreResult | null>(null);
  const [error, setError] = useState("");

  async function analyze(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          keyword,
          title,
          metaTitle,
          metaDescription,
          body,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Analysis failed");
        return;
      }
      setResult(data);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6 animate-rise">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand">
          Analyzer
        </p>
        <h1 className="font-display text-3xl font-bold tracking-tight">
          SEO Analyzer
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-ink-soft">
          Paste any draft and get a weighted SEO score across keyword usage,
          structure, readability, meta tags, and length.
        </p>
      </div>

      <form
        onSubmit={analyze}
        className="grid gap-4 lg:grid-cols-[1fr_300px]"
      >
        <div className="space-y-3 rounded-2xl border border-line bg-panel p-4 shadow-sm">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-ink-soft">
                Keyword
              </label>
              <input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="mt-1 w-full rounded-xl border border-line bg-paper px-3 py-2 text-sm outline-none ring-brand focus:ring-2"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-ink-soft">
                Title
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 w-full rounded-xl border border-line bg-paper px-3 py-2 text-sm outline-none ring-brand focus:ring-2"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-ink-soft">
              Meta title
            </label>
            <input
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
              className="mt-1 w-full rounded-xl border border-line bg-paper px-3 py-2 text-sm outline-none ring-brand focus:ring-2"
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-ink-soft">
              Meta description
            </label>
            <textarea
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              rows={2}
              className="mt-1 w-full rounded-xl border border-line bg-paper px-3 py-2 text-sm outline-none ring-brand focus:ring-2"
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-ink-soft">
              Body (markdown)
            </label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={16}
              className="mt-1 w-full rounded-xl border border-line bg-paper px-3 py-2 font-mono text-xs outline-none ring-brand focus:ring-2"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-white hover:bg-brand-deep disabled:opacity-60"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Gauge className="h-4 w-4" />
            )}
            Analyze SEO
          </button>
          {error ? <p className="text-sm text-rose-600">{error}</p> : null}
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-line bg-panel p-4 text-center shadow-sm">
            {result ? (
              <>
                <ScoreRing score={result.seoScore} size={110} />
                <p className="mt-2 text-sm text-ink-soft">
                  {result.wordCount} words analyzed
                </p>
              </>
            ) : (
              <p className="py-10 text-sm text-ink-soft">
                Run analysis to see score
              </p>
            )}
          </div>
          {result ? (
            <div className="rounded-2xl border border-line bg-panel p-4 shadow-sm">
              <p className="mb-3 text-sm font-semibold">Breakdown</p>
              {(
                [
                  ["Keyword usage", result.breakdown.keywordUsage],
                  ["Structure", result.breakdown.structure],
                  ["Readability", result.breakdown.readability],
                  ["Meta", result.breakdown.meta],
                  ["Length", result.breakdown.length],
                ] as const
              ).map(([label, val]) => (
                <div key={label} className="mb-2">
                  <div className="mb-1 flex justify-between text-xs">
                    <span>{label}</span>
                    <span className="font-semibold">{val}</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-line">
                    <div
                      className="h-full rounded-full bg-brand"
                      style={{ width: `${val}%` }}
                    />
                  </div>
                </div>
              ))}
              <p className="mt-4 text-sm font-semibold">Suggestions</p>
              <ul className="mt-2 space-y-1 text-xs text-ink-soft">
                {result.breakdown.suggestions.map((s) => (
                  <li key={s}>• {s}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </aside>
      </form>
    </div>
  );
}
