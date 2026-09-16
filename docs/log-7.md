# 📋 Log Perubahan — LPM UIN SGD (v0.8.0 - Iterasi 7)

**Versi:** `v0.8.0`
**Tanggal:** 2026-09-11
**Tipe:** `feat` | `ui` | `admin` | `editor` | `api` | `refactor`
**Developer:** AI Agent (Cline)

---

### ✅ Yang Ditambahkan

1. **API Upload File (`app/api/uploads/route.ts` — BARU):**
   - Endpoint `POST /api/uploads` menerima multipart form-data (`file`) untuk gambar (JPG, PNG, WEBP, GIF, SVG) dan PDF.
   - Batas ukuran **10 MB**; whitelist berdasarkan `Content-Type` (bukan ekstensi file).
   - Nama file unik: prefix timestamp + nama asli yang di-sanitasi (lowercase, alphanumeric, max 60 char) + random hex 8 digit (`crypto.randomBytes`).
   - File disimpan ke `public/uploads/`; URL yang dikembalikan: `/api/uploads/<filename>`.
   - `.gitignore` ditambahkan: `/public/uploads/`.

2. **File-Serve Route (`app/api/uploads/[filename]/route.ts` — BARU):**
   - `GET /api/uploads/<filename>` membaca file dari disk saat request (proteksi path traversal via `path.basename`).
   - Bekerja di semua mode server: `next dev`, `next start`, dan `output: standalone` (di mana `public/` tidak dicopy ulang saat runtime).
   - Header respons: `Content-Type` sesuai ekstensi, `Content-Length`, `Cache-Control: public, max-age=31536000`.
   - `X-Frame-Options: SAMEORIGIN` (override di `next.config.ts`) agar PDF dapat ditampilkan dalam iframe same-origin (FeedArticle), sementara halaman lain tetap `DENY`.

3. **TipTap Upload Image Button (`components/admin/TiptapEditor.tsx`):**
   - Tombol upload di toolbar (ikon `Upload`) — pilih file dari perangkat → `fetch("/api/uploads")` → sisipkan gambar ke editor sebagai image node.
   - Tombol URL gambar yang sudah ada tetap dipertahankan.

4. **Komponen Shared `FeedArticle` (`components/public/FeedArticle.tsx` — ditulis ulang):**
   - Renderer tunggal untuk konten feed: meta info (kategori, tanggal, view count), gambar sampul / placeholder, konten HTML (TipTap) atau plain text, dynamic sections (heading/text/pdf_viewer), dan attachment PDF viewer.
   - Menghilangkan ~150 baris duplikasi antara halaman publik `/feeds/[id]` dan modal preview CMS.

5. **Feed Detail Page Refactor (`app/feeds/[id]/page.tsx`):**
   - Sekarang memakai `FeedArticle` shared component (tidak ada markup ganda).

6. **FeedPreviewModal (`components/admin/FeedPreviewModal.tsx` — BARU):**
   - Modal preview feed di CMS yang merender `FeedArticle` secara live dari form state (belum disubmit).

7. **Draft/Publish States:**
   - Kolom `isPublished` (boolean) pada data feed; `POST /api/feeds` menerima `isPublished`.
   - `GET /api/feeds?all=1` mengembalikan feed **draft + published** (khusus halaman CMS).
   - Tanpa `all=1`, endpoint publik hanya mengembalikan feed dengan `isPublished !== false`.
   - `PATCH /api/feeds/[id]` — endpoint lightweight untuk toggle status publish tanpa body feed lengkap.

8. **CMS Feed Page Enhancements (`app/admin/dashboard/cms/page.tsx`):**
   - **Filter status:** dropdown "Semua / Published / Draft" + badge status warna di tabel feed.
   - **Toggle publish:** toggle switch per baris (memanggil `PATCH /api/feeds/[id]`).
   - **Section drag-drop reorder:** native HTML5 drag-and-drop (tanpa dependency baru) — seret kartu seksi untuk mengubah urutan.
   - **Upload buttons:** tombol upload untuk Gambar Sampul & PDF per seksi (memanggil `/api/uploads`, mengisi URL ke state form).
   - **Preview:** tombol preview membuka `FeedPreviewModal`.
---

### 🔧 Yang Diubah (Refactor)

| Area | Sebelum | Sesudah |
|------|---------|---------|
| Feed detail renderer | Markup inline di `app/feeds/[id]/page.tsx` | Shared `FeedArticle.tsx` (dipakai publik + CMS preview) |
| Image input | Hanya URL manual | Upload file + URL (TipTap & cover) |
| Feed list CMS | Semua feed tampil | Filter Published/Draft + badge status |
| Feed status | Tidak ada | Draft ↔ Published (toggle) |
| Feed GET | Hanya published | `?all=1` untuk CMS (termasuk draft) |
| Section ordering CMS | Tidak bisa diubah urutan | Drag-and-drop native |
| `next.config.ts` headers | `X-Frame-Options: DENY` untuk semua | Override `SAMEORIGIN` khusus `/api/uploads/:path*` |

---

### 📁 File yang Diubah

```
app/api/uploads/route.ts                        ← [BARU] POST upload (gambar & PDF)
app/api/uploads/[filename]/route.ts             ← [BARU] GET serve file dari disk
components/public/FeedArticle.tsx               ← [REWRITE] shared renderer feed
components/admin/FeedPreviewModal.tsx           ← [BARU] modal preview CMS
components/admin/TiptapEditor.tsx               ← [MODIFIED] tombol upload gambar
app/feeds/[id]/page.tsx                         ← [REFACTOR] pakai FeedArticle
app/api/feeds/route.ts                          ← [MODIFIED] ?all=1, isPublished
app/api/feeds/[id]/route.ts                     ← [MODIFIED] PATCH toggle publish
app/admin/dashboard/cms/page.tsx                ← [MODIFIED] filter status, toggle, drag-drop, upload, preview
next.config.ts                                  ← [MODIFIED] SAMEORIGIN untuk /api/uploads
.gitignore                                      ← [MODIFIED] /public/uploads/
```

---

### ✅ Build & Test Status

- `npm run build`: **✅ Compiled successfully** — 29 routes, 0 TypeScript errors
- Runtime smoke test (`next start` port 3100):
  - `POST /api/uploads` (PNG & PDF): ✅ `{ success: true, url: "/api/uploads/..." }`
  - `GET /api/uploads/<file>`: ✅ 200, `image/png` / `application/pdf`, `Content-Length` cocok
  - Path traversal (`..%2F..%2Fnext.config.ts`): ✅ 404
  - File tidak ditemukan: ✅ 404
  - MIME tidak diizinkan: ✅ 400 (reject sebelum disimpan)
  - Header: ✅ `/api/uploads/*` → `SAMEORIGIN`; halaman lain → `DENY`
  - `GET /api/feeds?all=1`: ✅ 200 dengan data feeds
  - `PATCH /api/feeds/1`: ✅ toggle draft/published sukses

---

### 🔜 Lanjutan (Iteration 8 — Potensi)

- Penyimpanan upload ke object storage (mis. S3/MinIO) untuk deployment multi-instance.
- Pagination UI pada feed list CMS (untuk data dalam jumlah besar).
- Thumbnail/preview gambar sebelum submit di form CMS.
- Validasi ukuran & dimensi gambar di sisi klien sebelum upload.
- Optimistic UI & rollback pada toggle publish (saat ini menunggu respons).
- Test otomatis (unit/integration) untuk endpoint upload & feeds.