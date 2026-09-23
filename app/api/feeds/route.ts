import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { lpmFeeds } from "@/lib/schema";
import { desc } from "drizzle-orm";
import { recordAuditLog } from "@/lib/audit";

interface FeedItem {
  id: number;
  title: string;
  category: string;
  publishedDate: string;
  content: string;
  imageUrl: string;
  pdfAttachmentUrl: string;
  viewCount: number;
  sections: any[];
  isPublished?: boolean;
  createdAt: string;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const year = searchParams.get("year");
    const query = searchParams.get("q");
    // `all=1` mengembalikan feeds draft + published (khusus halaman admin CMS).
    const includeUnpublished = searchParams.get("all") === "1";

    let feeds: FeedItem[] = [];

    try {
      const dbFeeds = await db.select().from(lpmFeeds).orderBy(desc(lpmFeeds.publishedDate));
      if (dbFeeds && dbFeeds.length > 0) {
        feeds = dbFeeds.map((f) => ({
          ...f,
          imageUrl: f.imageUrl || "",
          pdfAttachmentUrl: f.pdfAttachmentUrl || "-",
          sections: Array.isArray(f.sections) ? f.sections : [],
          publishedDate: f.publishedDate ? String(f.publishedDate) : "",
          createdAt: f.createdAt ? f.createdAt.toISOString() : new Date().toISOString(),
          isPublished: f.isPublished ?? true,
        }));
      }
    } catch (err) {
      console.error("Error fetching feeds from DB:", err);
    }

    // Filter hanya feed yang dipublikasikan, kecuali dipanggil oleh CMS (all=1).
    if (!includeUnpublished) {
      feeds = feeds.filter((f) => f.isPublished !== false);
    }

    if (category && category !== "Semua") {
      feeds = feeds.filter((f) => f.category.toLowerCase() === category.toLowerCase());
    }

    if (year) {
      feeds = feeds.filter((f) => f.publishedDate.startsWith(year));
    }

    if (query) {
      const qLower = query.toLowerCase();
      feeds = feeds.filter(
        (f) => f.title.toLowerCase().includes(qLower) || f.content.toLowerCase().includes(qLower)
      );
    }

    return NextResponse.json({ success: true, data: feeds, total: feeds.length });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, category, publishedDate, content, imageUrl, pdfAttachmentUrl, sections, isPublished } = body;

    if (!title || !category || !content) {
      return NextResponse.json(
        { success: false, error: "Judul, Kategori, dan Konten wajib diisi" },
        { status: 400 }
      );
    }

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    let newFeed: FeedItem = {
      id: Date.now(),
      title,
      category,
      publishedDate: publishedDate || new Date().toISOString().split("T")[0],
      content,
      imageUrl: imageUrl || "/assets/logo-lpm.webp",
      pdfAttachmentUrl: pdfAttachmentUrl || "-",
      viewCount: 0,
      sections: Array.isArray(sections) ? sections : [],
      isPublished: isPublished ?? true,
      createdAt: new Date().toISOString(),
    };

    try {
      const inserted = await db
        .insert(lpmFeeds)
        .values({
          title,
          slug: `${slug}-${Date.now()}`,
          category,
          publishedDate: publishedDate || new Date().toISOString().split("T")[0],
          content,
          imageUrl: imageUrl || "/assets/logo-lpm.webp",
          pdfAttachmentUrl: pdfAttachmentUrl || "-",
          viewCount: 0,
          sections: Array.isArray(sections) ? sections : [],
          isPublished: isPublished ?? true,
        })
        .returning();

      if (inserted && inserted.length > 0) {
        const item = inserted[0];
        newFeed = {
          ...item,
          imageUrl: item.imageUrl || "",
          pdfAttachmentUrl: item.pdfAttachmentUrl || "-",
          sections: Array.isArray(item.sections) ? item.sections : [],
          publishedDate: item.publishedDate ? String(item.publishedDate) : "",
          createdAt: item.createdAt ? item.createdAt.toISOString() : new Date().toISOString(),
        };
      }
    } catch (err) {
      console.error("Error inserting feed into DB:", err);
    }

    // Record audit log permanently in DB
    await recordAuditLog({
      adminId: 1,
      action: "CREATE",
      targetTable: "lpm_feeds",
      targetId: newFeed.id,
      details: `Mempublikasikan artikel feed '${title}' (Kategori: ${category})`,
      ipAddress: "127.0.0.1",
    });

    return NextResponse.json({ success: true, data: newFeed }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
