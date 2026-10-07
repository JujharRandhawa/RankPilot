"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";
import { ScoreRing } from "@/components/ScoreRing";
import { MarkdownBody } from "@/components/MarkdownBody";
import type { ContentRecord, ContentStatus } from "@/lib/types";

export default function ContentDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [content, setContent] = useState<ContentRecord | null>(null);
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState<"edit" | "preview">("edit");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch(`/api/content/${params.id}`)
      .then((r) => r.json())
      .then((d) => {
        if (!d.content) router.push("/library");
        else setContent(d.content);
      });
  }, [params.id, router]);

  async function save() {
    if (!content) return;
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch(`/api/content/${content.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: content.title,
          metaTitle: content.metaTitle,
          metaDescription: content.metaDescription,
          body: content.body,
          status: content.status,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setContent(data.content);
        setMessage("Saved & re-scored.");
      } else {
        setMessage(data.error || "Save failed");
      }
    } finally {
      setSaving(false);
    }
  }

  if (!content) {
    return <p className="text-sm text-ink-soft">Loading draft…</p>;
  }

  return (
    <div className="space-y-5 animate-rise">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link href="/library" className="text-sm font-medium text-brand">
            ← Library
          </Link>
          <h1 className="mt-1 font-display text-2xl font-bold tracking-tight sm:text-3xl">
            Edit content
          </h1>
        </div>
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-deep disabled:opacity-60"
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          Save changes
        </button>
      </div>

      {message ? (
        <p className="text-sm font-medium text-brand-deep">{message}</p>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-[1fr_260px]">
        <div className="space-y-3 rounded-2xl border border-line bg-panel p-4 shadow-sm">
          <label className="block text-xs font-semibold uppercase tracking-wider text-ink-soft">
            Title
          </label>
          <input
            value={content.title}
            onChange={(e) =>
              setContent({ ...content, title: e.target.value })
            }
            className="w-full rounded-xl border border-line bg-paper px-3 py-2 text-sm outline-none ring-brand focus:ring-2"
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-ink-soft">
                Meta title
              </label>
              <input
                value={content.metaTitle}
                onChange={(e) =>
                  setContent({ ...content, metaTitle: e.target.value })
                }
                className="mt-1 w-full rounded-xl border border-line bg-paper px-3 py-2 text-sm outline-none ring-brand focus:ring-2"
              />
              <p className="mt-1 text-[11px] text-ink-soft">
                {content.metaTitle.length}/60
              </p>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-ink-soft">
                Status
              </label>
              <select
                value={content.status}
                onChange={(e) =>
                  setContent({
                    ...content,
                    status: e.target.value as ContentStatus,
                  })
                }
                className="mt-1 w-full rounded-xl border border-line bg-paper px-3 py-2 text-sm outline-none ring-brand focus:ring-2"
              >
                <option value="draft">Draft</option>
                <option value="optimized">Optimized</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink-soft">
              Meta description
            </label>
            <textarea
              value={content.metaDescription}
              onChange={(e) =>
                setContent({ ...content, metaDescription: e.target.value })
              }
              rows={2}
              className="mt-1 w-full rounded-xl border border-line bg-paper px-3 py-2 text-sm outline-none ring-brand focus:ring-2"
            />
            <p className="mt-1 text-[11px] text-ink-soft">
              {content.metaDescription.length}/160
            </p>
          </div>

          <div className="flex gap-2 border-b border-line pb-2">
            <button
              type="button"
              onClick={() => setTab("edit")}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
                tab === "edit" ? "bg-brand text-white" : "text-ink-soft"
              }`}
            >
              Edit markdown
            </button>
            <button
              type="button"
              onClick={() => setTab("preview")}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
                tab === "preview" ? "bg-brand text-white" : "text-ink-soft"
              }`}
            >
              Preview
            </button>
          </div>

          {tab === "edit" ? (
            <textarea
              value={content.body}
              onChange={(e) =>
                setContent({ ...content, body: e.target.value })
              }
              rows={22}
              className="w-full rounded-xl border border-line bg-paper px-3 py-2 font-mono text-xs leading-relaxed outline-none ring-brand focus:ring-2"
            />
          ) : (
            <div className="rounded-xl border border-line bg-paper p-4">
              <MarkdownBody content={content.body} />
            </div>
          )}
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-line bg-panel p-4 text-center shadow-sm">
            <ScoreRing score={content.seoScore} size={100} />
            <p className="mt-2 text-sm text-ink-soft">
              Keyword: <strong>{content.keyword}</strong>
            </p>
            <p className="text-xs text-ink-soft">{content.wordCount} words</p>
          </div>
          <div className="rounded-2xl border border-line bg-panel p-4 shadow-sm">
            <p className="mb-2 text-sm font-semibold">Suggestions</p>
            <ul className="space-y-2 text-xs text-ink-soft">
              {content.scoreBreakdown.suggestions.length === 0 ? (
                <li>Looking strong — no major issues.</li>
              ) : (
                content.scoreBreakdown.suggestions.map((s) => (
                  <li key={s} className="rounded-lg bg-paper px-2 py-1.5">
                    {s}
                  </li>
                ))
              )}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
