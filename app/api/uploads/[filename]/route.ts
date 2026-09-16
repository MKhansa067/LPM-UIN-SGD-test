import { NextResponse } from "next/server";
import { createReadStream, existsSync, statSync } from "fs";
import { Readable } from "stream";
import path from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MIME_BY_EXT: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".pdf": "application/pdf",
};

// Menyajikan file yang diunggah dari public/uploads.
// File dibaca dari disk saat request sehingga bekerja di semua mode
// (next dev, next start, maupun standalone output).
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;
    const safeName = path.basename(filename); // cegah path traversal
    const filePath = path.join(process.cwd(), "public", "uploads", safeName);

    if (!existsSync(filePath)) {
      return NextResponse.json({ success: false, error: "File tidak ditemukan" }, { status: 404 });
    }

    const fileStat = statSync(filePath);
    const ext = path.extname(safeName).toLowerCase();
    const contentType = MIME_BY_EXT[ext] || "application/octet-stream";

    const nodeStream = createReadStream(filePath);
    const webStream = Readable.toWeb(nodeStream) as unknown as ReadableStream;

    return new Response(webStream, {
      headers: {
        "Content-Type": contentType,
        "Content-Length": String(fileStat.size),
        "Cache-Control": "public, max-age=31536000, immutable",
        // SAMEORIGIN mengizinkan embed PDF di iframe same-origin (FeedArticle).
        "X-Frame-Options": "SAMEORIGIN",
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}