import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { lpmSpmiDocs } from "@/lib/schema";
import { desc, eq } from "drizzle-orm";

interface SpmiItem {
  id: number;
  title: string;
  category: string;
  fileUrl: string;
  year: number;
  description: string;
  createdAt: string;
}

const sampleSpmiDocs: SpmiItem[] = [
  {
    id: 1,
    title: "Buku Kebijakan Sistem Penjaminan Mutu Internal (SPMI) UIN Sunan Gunung Djati Bandung",
    category: "Kebijakan SPMI",
    fileUrl: "https://www.w3.org/WSI/pdf/n3-spec.pdf",
    year: 2025,
    description: "Landasan filosofis, asas, dan prinsip utama pelaksanaan SPMI di lingkungan UIN SGD Bandung.",
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    title: "Manual Penetapan Standar Mutu Akademik UIN SGD (Manual P)",
    category: "PPEPP",
    fileUrl: "https://www.w3.org/WSI/pdf/n3-spec.pdf",
    year: 2025,
    description: "Prosedur baku penyusunan dan penetapan Indikator Kinerja Utama (IKU) dan Indikator Kinerja Tambahan (IKT).",
    createdAt: new Date().toISOString(),
  },
  {
    id: 3,
    title: "Manual Pelaksanaan Standar Pembelajaran dan Penelitian (Manual P)",
    category: "PPEPP",
    fileUrl: "https://www.w3.org/WSI/pdf/n3-spec.pdf",
    year: 2025,
    description: "Panduan operationalisasi pelaksanaan standar mutu tridharma perguruan tinggi.",
    createdAt: new Date().toISOString(),
  },
  {
    id: 4,
    title: "Manual Evaluasi & Audit Mutu Internal (AMI) Akademik (Manual E)",
    category: "PPEPP",
    fileUrl: "https://www.w3.org/WSI/pdf/n3-spec.pdf",
    year: 2026,
    description: "Tata cara desk evaluation dan visitasi lapangan Audit Mutu Internal semesteran.",
    createdAt: new Date().toISOString(),
  },
  {
    id: 5,
    title: "Manual Pengendalian Standar & Rapat Tinjauan Manajemen (Manual P)",
    category: "PPEPP",
    fileUrl: "https://www.w3.org/WSI/pdf/n3-spec.pdf",
    year: 2025,
    description: "Prosedur RTM untuk tindak lanjut temuan audit mutu internal dan penyusunan RTL.",
    createdAt: new Date().toISOString(),
  },
  {
    id: 6,
    title: "Buku Standar Mutu Pendidikan, Penelitian, dan PKM (32 Standar Mutu)",
    category: "Standar Mutu",
    fileUrl: "https://www.w3.org/WSI/pdf/n3-spec.pdf",
    year: 2025,
    description: "Dokumen tolok ukur 32 Standar Mutu UIN SGD Bandung.",
    createdAt: new Date().toISOString(),
  },
  {
    id: 7,
    title: "Kebijakan Mutu dan Maklumat Pelayanan Penjaminan Mutu Lembaga",
    category: "Kebijakan Mutu",
    fileUrl: "https://www.w3.org/WSI/pdf/n3-spec.pdf",
    year: 2024,
    description: "Komitmen kepemimpinan dalam mewujudkan budaya mutu terintegrasi.",
    createdAt: new Date().toISOString(),
  },
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const query = searchParams.get("q");

    let docs: SpmiItem[] = [...sampleSpmiDocs];

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
    } catch {
      // Fallback to sample array
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

    const newItem: SpmiItem = {
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
    } catch {
      sampleSpmiDocs.unshift(newItem);
    }

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

    try {
      await db.delete(lpmSpmiDocs).where(eq(lpmSpmiDocs.id, parseInt(id, 10)));
    } catch {
      // Offline fallback
    }

    return NextResponse.json({ success: true, message: "Dokumen SPMI dihapus" });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
