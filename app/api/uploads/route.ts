import { NextResponse } from "next/server";
import { writeFile, mkdir, stat } from "fs/promises";
import path from "path";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

// File uploads rely on Node.js runtime.
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

    // Cek apakah Supabase Credentials dikonfigurasi
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const bucketName = process.env.SUPABASE_STORAGE_BUCKET || "lpm-uploads";

    if (supabaseUrl && supabaseKey) {
      // 🌟 OPSI CLOUD: Upload langsung ke Supabase Storage (Permanen)
      const supabase = createClient(supabaseUrl, supabaseKey);

      const { data, error } = await supabase.storage.from(bucketName).upload(filename, buffer, {
        contentType: mime,
        cacheControl: "31536000",
        upsert: true,
      });

      if (error) {
        return NextResponse.json(
          { success: false, error: `Gagal upload ke Supabase Storage: ${error.message}` },
          { status: 500 }
        );
      }

      const { data: publicUrlData } = supabase.storage.from(bucketName).getPublicUrl(data.path);
      return NextResponse.json({ success: true, url: publicUrlData.publicUrl, mime, storage: "supabase" });
    } else {
      // 💻 OPSI LOKAL: Fallback simpan ke disk lokal (public/uploads)
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      try {
        await stat(uploadDir);
      } catch {
        await mkdir(uploadDir, { recursive: true });
      }

      await writeFile(path.join(uploadDir, filename), buffer);

      const url = `/api/uploads/${filename}`;
      return NextResponse.json({ success: true, url, mime, storage: "local" });
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}