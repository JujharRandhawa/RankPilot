import { NextResponse } from "next/server";
import { getStore } from "@/lib/db";

export async function GET() {
  const store = await getStore();
  const byIntent = store.keywords.reduce<Record<string, number>>((acc, k) => {
    acc[k.intent] = (acc[k.intent] ?? 0) + 1;
    return acc;
  }, {});

  const scoreBuckets = [
    { label: "90+", min: 90, max: 101, count: 0 },
    { label: "75-89", min: 75, max: 90, count: 0 },
    { label: "60-74", min: 60, max: 75, count: 0 },
    { label: "<60", min: 0, max: 60, count: 0 },
  ];
  for (const c of store.contents) {
    const bucket = scoreBuckets.find(
      (b) => c.seoScore >= b.min && c.seoScore < b.max
    );
    if (bucket) bucket.count += 1;
  }

  return NextResponse.json({
    project: store.project,
    analytics: store.analytics,
    rankings: store.rankings,
    intentDistribution: Object.entries(byIntent).map(([intent, count]) => ({
      intent,
      count,
    })),
    scoreDistribution: scoreBuckets,
    topKeywords: [...store.keywords]
      .sort((a, b) => b.opportunity - a.opportunity)
      .slice(0, 10),
  });
}
