"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FileText, Trash2 } from "lucide-react";
import type { ContentRecord } from "@/lib/types";
import { scoreColor } from "@/lib/utils";

export default function LibraryPage() {
  const [contents, setContents] = useState<ContentRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    fetch("/api/content")
      .then((r) => r.json())
      .then((d) => setContents(d.contents ?? []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  async function remove(id: string) {
    if (!confirm("Delete this draft?")) return;
    await fetch(`/api/content/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div className="space-y-6 animate-rise">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand">
            Library
          </p>
          <h1 className="font-display text-3xl font-bold tracking-tight">
            Content Library
          </h1>
          <p className="mt-1 text-sm text-ink-soft">
            All generated drafts with SEO scores and publish status.
          </p>
        </div>
        <Link
          href="/engine"
          className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-deep"
        >
          New draft
        </Link>
      </div>

      {loading ? (
        <p className="text-sm text-ink-soft">Loading library…</p>
      ) : contents.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line bg-panel p-10 text-center">
          <FileText className="mx-auto h-8 w-8 text-brand" />
          <p className="mt-3 font-medium">No content yet</p>
          <p className="mt-1 text-sm text-ink-soft">
            Generate your first draft from the Content Engine.
          </p>
        </div>
      ) : (
        <div className="grid gap-3">
          {contents.map((c) => (
            <div
              key={c.id}
              className="flex flex-col gap-3 rounded-2xl border border-line bg-panel p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <Link
                  href={`/library/${c.id}`}
                  className="font-display text-lg font-bold hover:text-brand"
                >
                  {c.title}
                </Link>
                <p className="mt-1 truncate text-sm text-ink-soft">
                  Keyword: {c.keyword} · {c.wordCount} words ·{" "}
                  <span className="capitalize">{c.status}</span>
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`font-display text-2xl font-bold ${scoreColor(c.seoScore)}`}
                >
                  {c.seoScore}
                </span>
                <Link
                  href={`/library/${c.id}`}
                  className="rounded-lg border border-line px-3 py-2 text-sm font-medium hover:bg-paper"
                >
                  Edit
                </Link>
                <button
                  type="button"
                  onClick={() => remove(c.id)}
                  className="rounded-lg border border-line p-2 text-ink-soft hover:border-rose-300 hover:text-rose-600"
                  aria-label="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
