"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, Sparkles, Wand2 } from "lucide-react";
import { ScoreRing } from "@/components/ScoreRing";
import { MarkdownBody } from "@/components/MarkdownBody";
import type { ContentRecord } from "@/lib/types";

export default function EnginePage() {
  const [keyword, setKeyword] = useState("content brief generator");
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState<ContentRecord | null>(null);
  const [error, setError] = useState("");

  async function generate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Generation failed");
        return;
      }
      setContent(data.content);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6 animate-rise">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand">
          Autonomous engine
        </p>
        <h1 className="font-display text-3xl font-bold tracking-tight">
          Content Engine
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-ink-soft">
          Generate an SEO-ready draft from a target keyword: outline, meta tags,
          body copy, and an instant SEO score — no paid AI key required.
        </p>
      </div>

      <form
        onSubmit={generate}
        className="rounded-2xl border border-line bg-panel p-5 shadow-sm"
      >
        <label className="text-xs font-semibold uppercase tracking-wider text-ink-soft">
          Target keyword
        </label>
        <div className="mt-2 flex flex-col gap-3 sm:flex-row">
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="flex-1 rounded-xl border border-line bg-paper px-4 py-3 text-sm outline-none ring-brand focus:ring-2"
            placeholder="Enter keyword to write about"
          />
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-60"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Wand2 className="h-4 w-4" />
            )}
            Generate draft
          </button>
        </div>
        {error ? <p className="mt-3 text-sm text-rose-600">{error}</p> : null}
      </form>

      {content ? (
        <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
          <div className="rounded-2xl border border-line bg-panel p-5 shadow-sm">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-display text-xl font-bold">{content.title}</h2>
              <Link
                href={`/library/${content.id}`}
                className="text-sm font-semibold text-brand hover:underline"
              >
                Open in library →
              </Link>
            </div>
            <div className="mb-4 space-y-1 rounded-xl bg-paper p-3 text-xs text-ink-soft">
              <p>
                <span className="font-semibold text-ink">Meta title:</span>{" "}
                {content.metaTitle}
              </p>
              <p>
                <span className="font-semibold text-ink">Meta description:</span>{" "}
                {content.metaDescription}
              </p>
            </div>
            <MarkdownBody content={content.body} />
          </div>

          <aside className="space-y-4">
            <div className="rounded-2xl border border-line bg-panel p-4 text-center shadow-sm">
              <ScoreRing score={content.seoScore} size={100} />
              <p className="mt-2 text-sm text-ink-soft">
                {content.wordCount} words · {content.status}
              </p>
            </div>
            <div className="rounded-2xl border border-line bg-panel p-4 shadow-sm">
              <p className="mb-2 flex items-center gap-2 text-sm font-semibold">
                <Sparkles className="h-4 w-4 text-brand" />
                Outline
              </p>
              <ol className="list-decimal space-y-1 pl-4 text-sm text-ink-soft">
                {content.outline.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ol>
            </div>
            <div className="rounded-2xl border border-line bg-panel p-4 shadow-sm">
              <p className="mb-2 text-sm font-semibold">Score breakdown</p>
              {(
                [
                  ["Keyword", content.scoreBreakdown.keywordUsage],
                  ["Structure", content.scoreBreakdown.structure],
                  ["Readability", content.scoreBreakdown.readability],
                  ["Meta", content.scoreBreakdown.meta],
                  ["Length", content.scoreBreakdown.length],
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
            </div>
          </aside>
        </div>
      ) : null}
    </div>
  );
}
