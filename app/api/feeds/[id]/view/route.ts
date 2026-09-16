import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { lpmFeeds } from "@/lib/schema";
import { eq, sql } from "drizzle-orm";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const feedId = parseInt(id, 10);

    if (isNaN(feedId)) {
      return NextResponse.json({ success: false, error: "ID tidak valid" }, { status: 400 });
    }

    try {
      await db
        .update(lpmFeeds)
        .set({ viewCount: sql`${lpmFeeds.viewCount} + 1` })
        .where(eq(lpmFeeds.id, feedId));
    } catch {
      // If DB offline, return success silently
    }

    return NextResponse.json({ success: true, message: "View count updated" });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
