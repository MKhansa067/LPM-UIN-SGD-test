import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { lpmFeeds } from "@/lib/schema";
import { desc, eq } from "drizzle-orm";

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

const fallbackFeeds: FeedItem[] = [
  {
    id: 1,
    title: "Pelaksanaan Audit Mutu Internal (AMI) Semester Genap TA 2025/2026 UIN Sunan Gunung Djati Bandung",
    category: "Berita",
    publishedDate: "2026-03-08",
    content: "Lembaga Penjaminan Mutu (LPM) UIN Sunan Gunung Djati Bandung secara resmi membuka rangkaian pelaksanaan Audit Mutu Internal (AMI) untuk Semester Genap Tahun Akademik 2025/2026. Kegiatan ini diikuti oleh seluruh program studi dari 9 fakultas dan Program Pascasarjana.\n\nKetua LPM UIN SGD Bandung menyampaikan bahwa AMI periode ini berfokus pada kesiapan akreditasi internasional dan evaluasi capaian Indikator Kinerja Utama (IKU) universitas.",
    imageUrl: "/assets/logo-lpm.webp",
    pdfAttachmentUrl: "-",
    viewCount: 1420,
    sections: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    title: "Sosialisasi Penyusunan Borang Akreditasi Internasional ASIIN bagi Program Studi S1",
    category: "Berita",
    publishedDate: "2026-03-05",
    content: "Dalam upaya memperkuat posisi UIN Sunan Gunung Djati Bandung sebagai World Class University, LPM menggelar pendampingan intensif penyusunan dokumen Self Assessment Report (SAR) untuk akreditasi internasional ASIIN.",
    imageUrl: "/assets/logo-uinsgd.webp",
    pdfAttachmentUrl: "-",
    viewCount: 980,
    sections: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: 3,
    title: "Pengumuman Jadwal Desk Evaluation Audit Mutu Internal Fakultas Tarbiyah dan Keguruan",
    category: "Pengumuman",
    publishedDate: "2026-03-09",
    content: "Diberitahukan kepada seluruh Tim Gugus Kendali Mutu (GKM) di lingkungan Fakultas Tarbiyah dan Keguruan UIN SGD Bandung bahwa unggah dokumen borang SPMI dibuka hingga 15 Maret 2026.",
    imageUrl: "/assets/logo-lpm.webp",
    pdfAttachmentUrl: "https://www.w3.org/WSI/pdf/n3-spec.pdf",
    viewCount: 2310,
    sections: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: 4,
    title: "Undangan Rapat Tinjauan Manajemen (RTM) Hasil Survei Kepuasan Civitas Akademika 2025",
    category: "Pengumuman",
    publishedDate: "2026-03-02",
    content: "Rapat Tinjauan Manajemen (RTM) Penjaminan Mutu akan diselenggarakan pada Hari Selasa, 17 Maret 2026 bertempat di Aula Rektorat Lantai 3 UIN Sunan Gunung Djati Bandung.",
    imageUrl: "/assets/logo-uinsgd.webp",
    pdfAttachmentUrl: "https://www.w3.org/WSI/pdf/n3-spec.pdf",
    viewCount: 1850,
    sections: [],
    createdAt: new Date().toISOString(),
  },
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const year = searchParams.get("year");
    const query = searchParams.get("q");
    // `all=1` mengembalikan feeds draft + published (khusus halaman admin CMS).
    const includeUnpublished = searchParams.get("all") === "1";

    let feeds = [...fallbackFeeds];

    try {
      const dbFeeds = await db.select().from(lpmFeeds).orderBy(desc(lpmFeeds.publishedDate));
      if (dbFeeds && dbFeeds.length > 0) {
        feeds = dbFeeds.map(f => ({
          ...f,
          imageUrl: f.imageUrl || "",
          pdfAttachmentUrl: f.pdfAttachmentUrl || "-",
          sections: Array.isArray(f.sections) ? f.sections : [],
          publishedDate: f.publishedDate ? String(f.publishedDate) : "",
          createdAt: f.createdAt ? f.createdAt.toISOString() : new Date().toISOString(),
          isPublished: f.isPublished ?? true,
        }));
      }
    } catch {
      // Fall back to sample feeds if DB not running locally
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

    const newFeed: FeedItem = {
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
        newFeed.id = inserted[0].id;
      }
    } catch {
      fallbackFeeds.unshift(newFeed);
    }

    return NextResponse.json({ success: true, data: newFeed }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
