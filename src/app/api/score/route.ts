import { NextRequest, NextResponse } from "next/server";
import { scoreContent } from "@/lib/seo/scorer";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const keyword = String(body.keyword ?? "").trim();
  const title = String(body.title ?? "");
  const metaTitle = String(body.metaTitle ?? "");
  const metaDescription = String(body.metaDescription ?? "");
  const contentBody = String(body.body ?? "");

  if (!keyword) {
    return NextResponse.json(
      { error: "Keyword is required." },
      { status: 400 }
    );
  }
  if (!contentBody.trim()) {
    return NextResponse.json(
      { error: "Content body is required." },
      { status: 400 }
    );
  }

  const scored = scoreContent({
    keyword,
    title: title || keyword,
    metaTitle: metaTitle || title || keyword,
    metaDescription:
      metaDescription ||
      `Learn about ${keyword} with practical tips and actionable steps.`,
    body: contentBody,
  });

  return NextResponse.json({
    seoScore: scored.total,
    wordCount: scored.wordCount,
    breakdown: {
      keywordUsage: scored.keywordUsage,
      structure: scored.structure,
      readability: scored.readability,
      meta: scored.meta,
      length: scored.length,
      suggestions: scored.suggestions,
    },
  });
}
