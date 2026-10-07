import { NextRequest, NextResponse } from "next/server";
import { createContent, getStore } from "@/lib/db";

export async function GET() {
  const store = await getStore();
  return NextResponse.json({ contents: store.contents });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const keyword = String(body.keyword ?? "").trim();
  if (!keyword || keyword.length < 2) {
    return NextResponse.json(
      { error: "Provide a target keyword." },
      { status: 400 }
    );
  }
  const content = await createContent(keyword);
  return NextResponse.json({ content });
}
