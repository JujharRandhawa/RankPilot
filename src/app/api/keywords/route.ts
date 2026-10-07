import { NextRequest, NextResponse } from "next/server";
import { addKeywords, getStore } from "@/lib/db";

export async function GET() {
  const store = await getStore();
  return NextResponse.json({
    keywords: store.keywords,
    project: store.project,
  });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const seed = String(body.keyword ?? "").trim();
  if (!seed || seed.length < 2) {
    return NextResponse.json(
      { error: "Provide a seed keyword (at least 2 characters)." },
      { status: 400 }
    );
  }
  const keywords = await addKeywords(seed);
  return NextResponse.json({ keywords, seed });
}
