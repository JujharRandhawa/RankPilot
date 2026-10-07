import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import type {
  AnalyticsPoint,
  ContentRecord,
  KeywordRecord,
  RankingRow,
  StoreData,
} from "@/lib/types";
import { researchKeywords } from "@/lib/seo/keywords";
import { generateContent } from "@/lib/seo/generator";
import { hashString, seededInt } from "@/lib/seo/hash";

const DATA_DIR = path.join(process.cwd(), "data");
const STORE_PATH = path.join(DATA_DIR, "store.json");

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

function buildSeed(): StoreData {
  const projectId = "proj_demo_rankpilot";
  const now = new Date().toISOString();

  const seedTerms = [
    "seo content strategy",
    "keyword research tools",
    "on page seo checklist",
  ];

  const keywords: KeywordRecord[] = [];
  for (const term of seedTerms) {
    const batch = researchKeywords(term, projectId, 5);
    for (const k of batch) {
      keywords.push({
        ...k,
        id: randomUUID(),
        researchedAt: now,
      });
    }
  }

  const contents: ContentRecord[] = seedTerms.map((term, i) => {
    const gen = generateContent(term, "SaaS marketing");
    return {
      id: randomUUID(),
      projectId,
      ...gen,
      status: i === 0 ? "published" : i === 1 ? "optimized" : "draft",
      createdAt: new Date(Date.now() - i * 86400000 * 2).toISOString(),
      updatedAt: new Date(Date.now() - i * 86400000).toISOString(),
    };
  });

  const analytics: AnalyticsPoint[] = Array.from({ length: 30 }, (_, i) => {
    const day = 29 - i;
    const h = hashString(`traffic-${day}`);
    return {
      date: daysAgo(day),
      organicTraffic: seededInt(h, 420, 980) + day * 8,
      impressions: seededInt(h + 1, 4200, 9800) + day * 40,
      clicks: seededInt(h + 2, 180, 520) + day * 4,
      avgPosition: Number(
        (18 - day * 0.15 + seededInt(h + 3, 0, 3) * 0.3).toFixed(1)
      ),
    };
  });

  const rankingKeywords = [
    "seo content strategy",
    "keyword research tools",
    "on page seo checklist",
    "content brief generator",
    "seo score analyzer",
    "blog topic ideas",
    "search intent guide",
    "meta description examples",
  ];

  const rankings: RankingRow[] = rankingKeywords.map((keyword, i) => {
    const h = hashString(keyword);
    const position = seededInt(h, 3, 28);
    const previous = position + seededInt(h + 1, -4, 5);
    return {
      id: randomUUID(),
      keyword,
      position,
      previousPosition: Math.max(1, previous),
      url: `/blog/${keyword.replace(/\s+/g, "-")}`,
      change: Math.max(1, previous) - position,
    };
  });

  return {
    project: {
      id: projectId,
      name: "RankPilot Demo Site",
      domain: "demo.rankpilot.local",
      niche: "SaaS marketing",
      createdAt: now,
    },
    keywords,
    contents,
    analytics,
    rankings,
  };
}

async function ensureStore(): Promise<StoreData> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    const raw = await fs.readFile(STORE_PATH, "utf8");
    return JSON.parse(raw) as StoreData;
  } catch {
    const seed = buildSeed();
    await fs.writeFile(STORE_PATH, JSON.stringify(seed, null, 2), "utf8");
    return seed;
  }
}

async function writeStore(data: StoreData) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(STORE_PATH, JSON.stringify(data, null, 2), "utf8");
}

export async function getStore() {
  return ensureStore();
}

export async function resetStore() {
  const seed = buildSeed();
  await writeStore(seed);
  return seed;
}

export async function addKeywords(
  seedKeyword: string
): Promise<KeywordRecord[]> {
  const store = await ensureStore();
  const researched = researchKeywords(
    seedKeyword,
    store.project.id,
    12
  ).map((k) => ({
    ...k,
    id: randomUUID(),
    researchedAt: new Date().toISOString(),
  }));

  // Dedupe by keyword text
  const existing = new Set(store.keywords.map((k) => k.keyword));
  const fresh = researched.filter((k) => !existing.has(k.keyword));
  store.keywords = [...fresh, ...store.keywords];
  await writeStore(store);
  return researched;
}

export async function createContent(keyword: string): Promise<ContentRecord> {
  const store = await ensureStore();
  const gen = generateContent(keyword, store.project.niche);
  const record: ContentRecord = {
    id: randomUUID(),
    projectId: store.project.id,
    ...gen,
    status: "draft",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  store.contents.unshift(record);
  await writeStore(store);
  return record;
}

export async function updateContent(
  id: string,
  patch: Partial<
    Pick<
      ContentRecord,
      | "title"
      | "metaTitle"
      | "metaDescription"
      | "body"
      | "status"
      | "outline"
    >
  >
): Promise<ContentRecord | null> {
  const store = await ensureStore();
  const idx = store.contents.findIndex((c) => c.id === id);
  if (idx < 0) return null;

  const current = store.contents[idx];
  const next = {
    ...current,
    ...patch,
    updatedAt: new Date().toISOString(),
  };

  // Re-score if content fields changed
  if (patch.body || patch.title || patch.metaTitle || patch.metaDescription) {
    const { scoreContent } = await import("@/lib/seo/scorer");
    const scored = scoreContent({
      keyword: next.keyword,
      title: next.title,
      metaTitle: next.metaTitle,
      metaDescription: next.metaDescription,
      body: next.body,
      outline: next.outline,
    });
    next.wordCount = scored.wordCount;
    next.seoScore = scored.total;
    next.scoreBreakdown = {
      keywordUsage: scored.keywordUsage,
      structure: scored.structure,
      readability: scored.readability,
      meta: scored.meta,
      length: scored.length,
      suggestions: scored.suggestions,
    };
  }

  store.contents[idx] = next;
  await writeStore(store);
  return next;
}

export async function deleteContent(id: string): Promise<boolean> {
  const store = await ensureStore();
  const before = store.contents.length;
  store.contents = store.contents.filter((c) => c.id !== id);
  if (store.contents.length === before) return false;
  await writeStore(store);
  return true;
}

export async function getContent(id: string) {
  const store = await ensureStore();
  return store.contents.find((c) => c.id === id) ?? null;
}
