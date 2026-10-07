import type { KeywordRecord } from "@/lib/types";
import { hashString, seededFloat, seededInt } from "./hash";

const MODIFIERS = [
  "best",
  "how to",
  "guide",
  "tips",
  "vs",
  "examples",
  "tools",
  "checklist",
  "for beginners",
  "2026",
  "strategy",
  "template",
  "free",
  "software",
  "services",
  "near me",
  "pricing",
  "benefits",
  "mistakes",
  "case study",
];

const INTENTS = [
  "informational",
  "commercial",
  "transactional",
  "navigational",
] as const;

function titleCase(s: string) {
  return s.replace(/\b\w/g, (c) => c.toUpperCase());
}

export function researchKeywords(
  seedKeyword: string,
  projectId: string,
  count = 12
): Omit<KeywordRecord, "id" | "researchedAt">[] {
  const base = seedKeyword.trim().toLowerCase();
  if (!base) return [];

  const results: Omit<KeywordRecord, "id" | "researchedAt">[] = [];
  const seen = new Set<string>();

  const primaryHash = hashString(base);
  results.push({
    projectId,
    keyword: base,
    volume: seededInt(primaryHash, 800, 48000),
    difficulty: seededInt(primaryHash + 1, 18, 78),
    cpc: Number(seededFloat(primaryHash + 2, 0.3, 8.5).toFixed(2)),
    intent: INTENTS[seededInt(primaryHash + 3, 0, 3)],
    trend: Array.from({ length: 12 }, (_, i) =>
      seededInt(primaryHash + 10 + i, 40, 100)
    ),
    opportunity: 0,
  });
  seen.add(base);

  for (let i = 0; i < MODIFIERS.length && results.length < count; i++) {
    const mod = MODIFIERS[(primaryHash + i) % MODIFIERS.length];
    let phrase: string;
    if (mod === "vs") {
      phrase = `${base} vs alternatives`;
    } else if (mod === "how to" || mod === "best") {
      phrase = `${mod} ${base}`;
    } else if (mod === "for beginners" || mod === "near me" || mod === "2026") {
      phrase = `${base} ${mod}`;
    } else {
      phrase = `${base} ${mod}`;
    }
    phrase = phrase.toLowerCase();
    if (seen.has(phrase)) continue;
    seen.add(phrase);

    const h = hashString(phrase);
    const volume = seededInt(h, 120, 22000);
    const difficulty = seededInt(h + 1, 8, 85);
    const cpc = Number(seededFloat(h + 2, 0.15, 12).toFixed(2));
    const opportunity = Math.round(
      (volume / 1000) * (100 - difficulty) * seededFloat(h + 5, 0.6, 1.4)
    );

    results.push({
      projectId,
      keyword: phrase,
      volume,
      difficulty,
      cpc,
      intent: INTENTS[seededInt(h + 3, 0, 3)],
      trend: Array.from({ length: 12 }, (_, ti) =>
        seededInt(h + 20 + ti, 35, 100)
      ),
      opportunity,
    });
  }

  results[0].opportunity = Math.round(
    (results[0].volume / 1000) *
      (100 - results[0].difficulty) *
      seededFloat(primaryHash + 9, 0.8, 1.2)
  );

  return results.sort((a, b) => b.opportunity - a.opportunity);
}

export function formatKeywordLabel(keyword: string) {
  return titleCase(keyword);
}
