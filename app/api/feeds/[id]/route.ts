import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { lpmFeeds } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { recordAuditLog } from "@/lib/audit";

export async function GET(
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
      const feed = await db.select().from(lpmFeeds).where(eq(lpmFeeds.id, feedId));
      if (feed && feed.length > 0) {
        const f = feed[0];
        return NextResponse.json({
          success: true,
          data: {
            ...f,
            imageUrl: f.imageUrl || "",
            pdfAttachmentUrl: f.pdfAttachmentUrl || "-",
            publishedDate: f.publishedDate ? String(f.publishedDate) : "",
            createdAt: f.createdAt ? f.createdAt.toISOString() : new Date().toISOString(),
            isPublished: f.isPublished ?? true,
          },
        });
      }
    } catch (err) {
      console.error("Error fetching feed by ID:", err);
    }

    return NextResponse.json({ success: false, error: "Artikel tidak ditemukan" }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}


export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const feedId = parseInt(id, 10);
    const body = await request.json();
    const { title, category, publishedDate, content, imageUrl, pdfAttachmentUrl, sections, isPublished } = body;

    await db
      .update(lpmFeeds)
      .set({
        title,
        category,
        publishedDate,
        content,
        imageUrl,
        pdfAttachmentUrl,
        sections: Array.isArray(sections) ? sections : [],
        isPublished: isPublished ?? true,
      })
      .where(eq(lpmFeeds.id, feedId));

    // Record audit log permanently in DB
    await recordAuditLog({
      adminId: 1,
      action: "UPDATE",
      targetTable: "lpm_feeds",
      targetId: feedId,
      details: `Memperbarui artikel feed '${title}' (ID: ${feedId})`,
      ipAddress: "127.0.0.1",
    });

    return NextResponse.json({ success: true, message: "Feed diperbarui" });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const feedId = parseInt(id, 10);
    const body = await request.json();
    const isPublished = Boolean(body.isPublished);

    await db
      .update(lpmFeeds)
      .set({ isPublished })
      .where(eq(lpmFeeds.id, feedId));

    // Record audit log permanently in DB
    await recordAuditLog({
      adminId: 1,
      action: "UPDATE",
      targetTable: "lpm_feeds",
      targetId: feedId,
      details: isPublished ? `Mempublikasikan feed ID ${feedId}` : `Mengarsipkan feed ID ${feedId} sebagai draft`,
      ipAddress: "127.0.0.1",
    });

    return NextResponse.json({
      success: true,
      message: isPublished ? "Feed dipublikasikan" : "Feed diarsipkan sebagai draft",
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const feedId = parseInt(id, 10);

    await db.delete(lpmFeeds).where(eq(lpmFeeds.id, feedId));

    // Record audit log permanently in DB
    await recordAuditLog({
      adminId: 1,
      action: "DELETE",
      targetTable: "lpm_feeds",
      targetId: feedId,
      details: `Menghapus artikel feed ID ${feedId}`,
      ipAddress: "127.0.0.1",
    });

    return NextResponse.json({ success: true, message: "Feed dihapus" });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

