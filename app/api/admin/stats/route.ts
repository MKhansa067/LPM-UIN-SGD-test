import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { lpmFeeds, lpmDocuments, lpmSpmiDocs, lpmAccreditation } from "@/lib/schema";
import { sql } from "drizzle-orm";

export async function GET() {
  try {
    let totalFeeds = 0;
    let totalViews = 0;
    let totalDocs = 0;
    let unggulPercentage = "0%";

    try {
      const feedsRes = await db
        .select({
          count: sql<number>`count(*)`,
          sumViews: sql<number>`coalesce(sum(${lpmFeeds.viewCount}), 0)`,
        })
        .from(lpmFeeds);

      if (feedsRes && feedsRes.length > 0) {
        totalFeeds = Number(feedsRes[0].count) || 0;
        totalViews = Number(feedsRes[0].sumViews) || 0;
      }

      const docsRes = await db.select({ count: sql<number>`count(*)` }).from(lpmDocuments);
      const spmiRes = await db.select({ count: sql<number>`count(*)` }).from(lpmSpmiDocs);

      const dCount = (docsRes && docsRes.length > 0 ? Number(docsRes[0].count) : 0) || 0;
      const sCount = (spmiRes && spmiRes.length > 0 ? Number(spmiRes[0].count) : 0) || 0;
      totalDocs = dCount + sCount;

      const accRes = await db.select().from(lpmAccreditation);
      if (accRes && accRes.length > 0) {
        const unggulCount = accRes.filter(
          (a) => a.rating === "Unggul" || a.rating === "Internasional" || a.rating === "A"
        ).length;
        const pct = Math.round((unggulCount / accRes.length) * 100);
        unggulPercentage = `${pct}%`;
      } else {
        unggulPercentage = "0%";
      }
    } catch (err) {
      console.error("Error fetching admin stats:", err);
    }

    return NextResponse.json({
      success: true,
      data: {
        totalFeeds,
        totalViews: totalViews.toLocaleString("id-ID"),
        totalDocs,
        unggulPercentage,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
