import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { lpmSpmiDocs } from "@/lib/schema";
import { desc, eq } from "drizzle-orm";
import { recordAuditLog } from "@/lib/audit";

interface SpmiItem {
  id: number;
  title: string;
  category: string;
  fileUrl: string;
  year: number;
  description: string;
  createdAt: string;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const query = searchParams.get("q");

    let docs: SpmiItem[] = [];

    try {
      const dbDocs = await db.select().from(lpmSpmiDocs).orderBy(desc(lpmSpmiDocs.year));
      if (dbDocs && dbDocs.length > 0) {
        docs = dbDocs.map((d) => ({
          id: d.id,
          title: d.title,
          category: d.category,
          fileUrl: d.fileUrl,
          year: d.year,
          description: d.description || "",
          createdAt: d.createdAt ? d.createdAt.toISOString() : new Date().toISOString(),
        }));
      }
    } catch (err) {
      console.error("Error fetching SPMI docs from DB:", err);
    }

    if (category && category !== "Semua") {
      docs = docs.filter((d) => d.category.toLowerCase() === category.toLowerCase());
    }

    if (query) {
      const qLower = query.toLowerCase();
      docs = docs.filter(
        (d) =>
          d.title.toLowerCase().includes(qLower) ||
          d.description.toLowerCase().includes(qLower)
      );
    }

    return NextResponse.json({ success: true, data: docs, total: docs.length });
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
    const { title, category, fileUrl, year, description } = body;

    if (!title || !category || !fileUrl || !year) {
      return NextResponse.json(
        { success: false, error: "Judul, Kategori, URL File, dan Tahun wajib diisi" },
        { status: 400 }
      );
    }

    let newItem: SpmiItem = {
      id: Date.now(),
      title,
      category,
      fileUrl,
      year: parseInt(String(year), 10),
      description: description || "",
      createdAt: new Date().toISOString(),
    };

    try {
      const inserted = await db
        .insert(lpmSpmiDocs)
        .values({
          title,
          category,
          fileUrl,
          year: parseInt(String(year), 10),
          description: description || "",
        })
        .returning();

      if (inserted && inserted.length > 0) {
        newItem.id = inserted[0].id;
      }
    } catch (err) {
      console.error("Error inserting SPMI doc into DB:", err);
    }

    // Record audit log permanently in DB
    await recordAuditLog({
      adminId: 1,
      action: "CREATE",
      targetTable: "lpm_spmi_docs",
      targetId: newItem.id,
      details: `Menambahkan dokumen SPMI '${title}' (Kategori: ${category})`,
      ipAddress: "127.0.0.1",
    });

    return NextResponse.json({ success: true, data: newItem }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "ID wajib diisi" }, { status: 400 });
    }

    const docId = parseInt(id, 10);
    await db.delete(lpmSpmiDocs).where(eq(lpmSpmiDocs.id, docId));

    // Record audit log permanently in DB
    await recordAuditLog({
      adminId: 1,
      action: "DELETE",
      targetTable: "lpm_spmi_docs",
      targetId: docId,
      details: `Menghapus dokumen SPMI ID ${docId}`,
      ipAddress: "127.0.0.1",
    });

    return NextResponse.json({ success: true, message: "Dokumen SPMI dihapus" });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
