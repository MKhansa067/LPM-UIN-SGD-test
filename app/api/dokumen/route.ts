import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { lpmDocuments } from "@/lib/schema";
import { desc, eq } from "drizzle-orm";
import { recordAuditLog } from "@/lib/audit";

interface DocItem {
  id: number;
  title: string;
  mainCategory: string;
  subCategory: string;
  year: number;
  targetUnit: string;
  downloadUrl: string;
  fileSize?: string;
  createdAt: string;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const mainCategory = searchParams.get("mainCategory");
    const subCategory = searchParams.get("subCategory");
    const year = searchParams.get("year");
    const query = searchParams.get("q");

    let docs: DocItem[] = [];

    try {
      const dbDocs = await db.select().from(lpmDocuments).orderBy(desc(lpmDocuments.year));
      if (dbDocs && dbDocs.length > 0) {
        docs = dbDocs.map((d) => ({
          id: d.id,
          title: d.title,
          mainCategory: d.mainCategory,
          subCategory: d.subCategory,
          year: d.year,
          targetUnit: d.targetUnit || "Universitas",
          downloadUrl: d.downloadUrl,
          fileSize: d.fileSize || "1.2 MB",
          createdAt: d.createdAt ? d.createdAt.toISOString() : new Date().toISOString(),
        }));
      }
    } catch (err) {
      console.error("Error fetching documents from DB:", err);
    }

    if (mainCategory && mainCategory !== "Semua") {
      docs = docs.filter((d) => d.mainCategory.toLowerCase() === mainCategory.toLowerCase());
    }

    if (subCategory && subCategory !== "Semua") {
      docs = docs.filter((d) => d.subCategory.toLowerCase() === subCategory.toLowerCase());
    }

    if (year) {
      const yearNum = parseInt(year, 10);
      if (!isNaN(yearNum)) {
        docs = docs.filter((d) => d.year === yearNum);
      }
    }

    if (query) {
      const qLower = query.toLowerCase();
      docs = docs.filter((d) => d.title.toLowerCase().includes(qLower));
    }

    return NextResponse.json({ success: true, data: docs, total: docs.length });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}


export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, mainCategory, subCategory, year, targetUnit, downloadUrl, fileSize } = body;

    if (!title || !mainCategory || !subCategory || !year || !downloadUrl) {
      return NextResponse.json(
        { success: false, error: "Judul, Kategori Utama, Sub Kategori, Tahun, dan Download URL wajib diisi" },
        { status: 400 }
      );
    }

    let newDoc: DocItem = {
      id: Date.now(),
      title,
      mainCategory,
      subCategory,
      year: parseInt(String(year), 10),
      targetUnit: targetUnit || "Universitas",
      downloadUrl,
      fileSize: fileSize || "1.2 MB",
      createdAt: new Date().toISOString(),
    };

    try {
      const inserted = await db
        .insert(lpmDocuments)
        .values({
          title,
          mainCategory,
          subCategory,
          year: parseInt(String(year), 10),
          targetUnit: targetUnit || "Universitas",
          downloadUrl,
          fileSize: fileSize || "1.2 MB",
        })
        .returning();

      if (inserted && inserted.length > 0) {
        newDoc.id = inserted[0].id;
      }
    } catch (err) {
      console.error("Error inserting document into DB:", err);
    }

    // Record audit log permanently in DB
    await recordAuditLog({
      adminId: 1,
      action: "CREATE",
      targetTable: "lpm_documents",
      targetId: newDoc.id,
      details: `Menambahkan dokumen mutu '${title}' (${mainCategory} - ${subCategory})`,
      ipAddress: "127.0.0.1",
    });

    return NextResponse.json({ success: true, data: newDoc }, { status: 201 });
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
    await db.delete(lpmDocuments).where(eq(lpmDocuments.id, docId));

    // Record audit log permanently in DB
    await recordAuditLog({
      adminId: 1,
      action: "DELETE",
      targetTable: "lpm_documents",
      targetId: docId,
      details: `Menghapus dokumen mutu ID ${docId}`,
      ipAddress: "127.0.0.1",
    });

    return NextResponse.json({ success: true, message: "Dokumen berhasil dihapus" });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

