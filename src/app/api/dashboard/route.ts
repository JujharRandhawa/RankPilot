import { NextResponse } from "next/server";
import { getStore } from "@/lib/db";

export async function GET() {
  const store = await getStore();
  const latest = store.analytics[store.analytics.length - 1];
  const prev = store.analytics[store.analytics.length - 8] ?? store.analytics[0];

  const avgScore =
    store.contents.length === 0
      ? 0
      : Math.round(
          store.contents.reduce((s, c) => s + c.seoScore, 0) /
            store.contents.length
        );

  const improving = store.rankings.filter((r) => r.change > 0).length;

  return NextResponse.json({
    project: store.project,
    kpis: {
      organicTraffic: latest?.organicTraffic ?? 0,
      trafficDelta: latest && prev
        ? Math.round(
            ((latest.organicTraffic - prev.organicTraffic) /
              Math.max(1, prev.organicTraffic)) *
              100
          )
        : 0,
      impressions: latest?.impressions ?? 0,
      clicks: latest?.clicks ?? 0,
      avgPosition: latest?.avgPosition ?? 0,
      keywordsTracked: store.keywords.length,
      contentPieces: store.contents.length,
      avgSeoScore: avgScore,
      rankingsImproving: improving,
    },
    analytics: store.analytics,
    rankings: store.rankings.slice(0, 8),
    recentContent: store.contents.slice(0, 5),
  });
}
