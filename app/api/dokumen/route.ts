import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { lpmDocuments } from "@/lib/schema";
import { desc, eq } from "drizzle-orm";

const sampleDocuments = [
  {
    id: 1,
    title: "Pedoman Operasional Baku Audit Mutu Internal (AMI) 2026",
    mainCategory: "Dokumen Regulasi",
    subCategory: "AMI",
    year: 2026,
    targetUnit: "Universitas",
    downloadUrl: "https://www.w3.org/WSI/pdf/n3-spec.pdf",
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    title: "Laporan Evaluasi Diri (LED) & Audit Mutu Eksternal BAN-PT",
    mainCategory: "Dokumen Regulasi",
    subCategory: "AME",
    year: 2025,
    targetUnit: "Fakultas Sains dan Teknologi",
    downloadUrl: "https://www.w3.org/WSI/pdf/n3-spec.pdf",
    createdAt: new Date().toISOString(),
  },
  {
    id: 3,
    title: "Rencana Strategis (Renstra) Lembaga Penjaminan Mutu 2024-2029",
    mainCategory: "Dokumen Regulasi",
    subCategory: "Renstra & RIP",
    year: 2024,
    targetUnit: "Universitas",
    downloadUrl: "https://www.w3.org/WSI/pdf/n3-spec.pdf",
    createdAt: new Date().toISOString(),
  },
  {
    id: 4,
    title: "Buku Kebijakan Sistem Penjaminan Mutu Internal (SPMI) UIN SGD",
    mainCategory: "SPMI",
    subCategory: "Kebijakan",
    year: 2025,
    targetUnit: "Universitas",
    downloadUrl: "https://www.w3.org/WSI/pdf/n3-spec.pdf",
    createdAt: new Date().toISOString(),
  },
  {
    id: 5,
    title: "Manual Penetapan, Pelaksanaan, Evaluasi, Pengendalian, Peningkatan (PPEPP)",
    mainCategory: "SPMI",
    subCategory: "PPEPP",
    year: 2025,
    targetUnit: "Universitas",
    downloadUrl: "https://www.w3.org/WSI/pdf/n3-spec.pdf",
    createdAt: new Date().toISOString(),
  },
  {
    id: 6,
    title: "Laporan Hasil Survei Kepuasan Mahasiswa Terhadap Layanan Akademik 2025",
    mainCategory: "Monitoring & Evaluasi",
    subCategory: "Laporan Survei",
    year: 2025,
    targetUnit: "Universitas",
    downloadUrl: "https://www.w3.org/WSI/pdf/n3-spec.pdf",
    createdAt: new Date().toISOString(),
  },
  {
    id: 7,
    title: "Laporan Monev Pembelajaran Semester Ganjil 2025/2026",
    mainCategory: "Monitoring & Evaluasi",
    subCategory: "Laporan Monev",
    year: 2025,
    targetUnit: "Seluruh Program Studi",
    downloadUrl: "https://www.w3.org/WSI/pdf/n3-spec.pdf",
    createdAt: new Date().toISOString(),
  },
  {
    id: 8,
    title: "Sertifikat ISO 9001:2015 Sistem Manajemen Mutu Perguruan Tinggi",
    mainCategory: "Dokumen Regulasi",
    subCategory: "Sertifikasi",
    year: 2025,
    targetUnit: "Universitas",
    downloadUrl: "https://www.w3.org/WSI/pdf/n3-spec.pdf",
    createdAt: new Date().toISOString(),
  },
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const mainCategory = searchParams.get("mainCategory");
    const subCategory = searchParams.get("subCategory");
    const year = searchParams.get("year");
    const query = searchParams.get("q");

    let docs = [...sampleDocuments];

    try {
      const dbDocs = await db.select().from(lpmDocuments).orderBy(desc(lpmDocuments.year));
      if (dbDocs && dbDocs.length > 0) {
        docs = dbDocs.map(d => ({
          ...d,
          createdAt: d.createdAt ? d.createdAt.toISOString() : new Date().toISOString(),
        }));
      }
    } catch {
      // Fallback
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

    const newDoc = {
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
    } catch {
      sampleDocuments.unshift(newDoc);
    }

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
    try {
      await db.delete(lpmDocuments).where(eq(lpmDocuments.id, docId));
    } catch {
      // Offline fallback
    }

    return NextResponse.json({ success: true, message: "Dokumen berhasil dihapus" });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

