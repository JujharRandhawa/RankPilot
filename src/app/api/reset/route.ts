import { NextResponse } from "next/server";
import { resetStore } from "@/lib/db";

export async function POST() {
  const store = await resetStore();
  return NextResponse.json({
    ok: true,
    message: "Demo data reset successfully.",
    project: store.project,
  });
}
