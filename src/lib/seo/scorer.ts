import type { ScoreBreakdown } from "@/lib/types";

function countWords(text: string): number {
  return text
    .replace(/[#*_>`\[\]()!-]/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
}

function keywordDensity(body: string, keyword: string): number {
  const words = countWords(body);
  if (!words) return 0;
  const re = new RegExp(
    keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
    "gi"
  );
  const matches = body.match(re)?.length ?? 0;
  return (matches / words) * 100;
}

function fleschLike(text: string): number {
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  const words = countWords(text);
  const syllables = Math.max(
    1,
    Math.round(
      text
        .toLowerCase()
        .replace(/[^a-z\s]/g, "")
        .split(/\s+/)
        .filter(Boolean)
        .reduce((acc, w) => acc + Math.max(1, Math.ceil(w.length / 3)), 0)
    )
  );
  if (!sentences.length || !words) return 50;
  const asl = words / sentences.length;
  const asw = syllables / words;
  return Math.max(0, Math.min(100, 206.835 - 1.015 * asl - 84.6 * asw));
}

export function scoreContent(input: {
  keyword: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  body: string;
  outline?: string[];
}): ScoreBreakdown & { total: number; wordCount: number } {
  const { keyword, title, metaTitle, metaDescription, body } = input;
  const suggestions: string[] = [];
  const wordCount = countWords(body);
  const density = keywordDensity(body, keyword);
  const h2Count = (body.match(/^##\s+/gm) ?? []).length;
  const h1Count = (body.match(/^#\s+/gm) ?? []).length;
  const hasLists = /^[-*]\s+/m.test(body) || /^\d+\.\s+/m.test(body);
  const readability = fleschLike(body);

  // Keyword usage (0-100)
  let keywordUsage = 40;
  if (title.toLowerCase().includes(keyword.toLowerCase())) keywordUsage += 20;
  else suggestions.push("Include the primary keyword in the H1/title.");
  if (density >= 0.8 && density <= 2.5) keywordUsage += 30;
  else if (density > 0 && density < 0.8) {
    keywordUsage += 15;
    suggestions.push("Increase natural keyword mentions (aim ~1–2% density).");
  } else if (density > 2.5) {
    keywordUsage += 10;
    suggestions.push("Keyword density is high — reduce repetition.");
  } else {
    suggestions.push("Primary keyword is missing from the body.");
  }
  if (metaTitle.toLowerCase().includes(keyword.toLowerCase())) keywordUsage += 10;
  keywordUsage = Math.min(100, keywordUsage);

  // Structure
  let structure = 20;
  if (h1Count === 1) structure += 25;
  else suggestions.push("Use exactly one H1 heading.");
  if (h2Count >= 3) structure += 30;
  else suggestions.push("Add at least 3 H2 sections for topical coverage.");
  if (hasLists) structure += 15;
  else suggestions.push("Add bullet or numbered lists for scannability.");
  if ((input.outline?.length ?? 0) >= 3) structure += 10;
  structure = Math.min(100, structure);

  // Readability
  let readabilityScore = Math.round(readability);
  if (readabilityScore < 50)
    suggestions.push("Simplify sentences to improve readability.");
  if (readabilityScore > 80) readabilityScore = 85;

  // Meta
  let meta = 0;
  if (metaTitle.length >= 30 && metaTitle.length <= 60) meta += 45;
  else {
    meta += 20;
    suggestions.push("Meta title should be 30–60 characters.");
  }
  if (metaDescription.length >= 120 && metaDescription.length <= 160) meta += 45;
  else {
    meta += 20;
    suggestions.push("Meta description should be 120–160 characters.");
  }
  if (metaDescription.toLowerCase().includes(keyword.toLowerCase())) meta += 10;
  meta = Math.min(100, meta);

  // Length
  let length = 20;
  if (wordCount >= 1200) length = 100;
  else if (wordCount >= 800) length = 85;
  else if (wordCount >= 500) length = 65;
  else if (wordCount >= 300) length = 45;
  else suggestions.push("Aim for 800+ words for competitive informational queries.");

  const total = Math.round(
    keywordUsage * 0.3 +
      structure * 0.25 +
      readabilityScore * 0.15 +
      meta * 0.15 +
      length * 0.15
  );

  return {
    keywordUsage: Math.round(keywordUsage),
    structure: Math.round(structure),
    readability: Math.round(readabilityScore),
    meta: Math.round(meta),
    length: Math.round(length),
    suggestions: suggestions.slice(0, 6),
    total,
    wordCount,
  };
}
