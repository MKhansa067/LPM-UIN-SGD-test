import { NextResponse } from "next/server";
import { writeFile, mkdir, stat } from "fs/promises";
import path from "path";
import crypto from "crypto";

// File uploads rely on the local filesystem — force Node.js runtime.
export const runtime = "nodejs";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

const ALLOWED_MIME: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "image/svg+xml": ".svg",
  "application/pdf": ".pdf",
};

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ success: false, error: "File tidak ditemukan" }, { status: 400 });
    }

    const mime = file.type || "";
    if (!ALLOWED_MIME[mime]) {
      return NextResponse.json(
        { success: false, error: "Tipe file tidak didukung. Gunakan JPG, PNG, WEBP, GIF, SVG, atau PDF." },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ success: false, error: "Ukuran file maksimal 10 MB" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Generate a cryptographically random unique filename while keeping a readable prefix.
    const safeBase = file.name
      .replace(/\.[^/.]+$/, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "")
      .slice(0, 60) || "file";
    const filename = `${Date.now()}-${safeBase}-${crypto.randomBytes(4).toString("hex")}${ALLOWED_MIME[mime]}`;

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    try {
      await stat(uploadDir);
    } catch {
      await mkdir(uploadDir, { recursive: true });
    }

    await writeFile(path.join(uploadDir, filename), buffer);

    const url = `/api/uploads/${filename}`;
    return NextResponse.json({ success: true, url, mime });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}