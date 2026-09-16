import { z } from "zod";

export const loginSchema = z.object({
  username: z
    .string()
    .min(3, "Username minimal 3 karakter")
    .max(50, "Username maksimal 50 karakter"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

export const feedSchema = z.object({
  title: z.string().min(5, "Judul minimal 5 karakter"),
  category: z.enum(["Berita", "Pengumuman", "Event"]),
  publishedDate: z.string(),
  content: z.string().min(10, "Konten minimal 10 karakter"),
  imageUrl: z.string().optional(),
  pdfAttachmentUrl: z.string().optional().default("-"),
  sections: z.array(z.any()).optional().default([]),
  isPublished: z.boolean().optional().default(true),
});

export const documentSchema = z.object({
  title: z.string().min(3, "Judul minimal 3 karakter"),
  mainCategory: z.enum(["Dokumen Regulasi", "Monitoring & Evaluasi"]),
  subCategory: z.string().min(2, "Sub kategori wajib diisi"),
  year: z.number().int().min(2000).max(2100),
  targetUnit: z.string().optional().default("Universitas"),
  downloadUrl: z.string().url("URL unduh tidak valid"),
  fileSize: z.string().optional(),
});

export const accreditationSchema = z.object({
  programName: z.string().min(2, "Nama prodi wajib diisi"),
  degreeLevel: z.enum(["S1", "S2", "S3", "Profesi"]),
  faculty: z.string().min(2, "Fakultas wajib diisi"),
  rating: z.enum([
    "Unggul",
    "A",
    "Baik Sekali",
    "B",
    "Baik",
    "Internasional",
    "Belum",
  ]),
  accreditor: z.string().default("BAN-PT"),
  expirationDate: z.string(),
  quarterPeriod: z.string(),
  semesterPeriod: z.string(),
  skUrl: z.string().optional(),
});
