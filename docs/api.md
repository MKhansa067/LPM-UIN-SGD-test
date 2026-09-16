# 🌐 Dokumentasi API Endpoints — LPM UIN SGD

Semua response API menggunakan standar JSON.

---

## 1. Feeds (Berita, Pengumuman, Event)

### `GET /api/feeds`
Mengambil daftar berita/pengumuman dengan filter & pagination.
- **Query Params:** `category`, `search`, `year`, `page`, `limit`, `all`
  - `all=1` — khusus halaman admin CMS: mengembalikan feed **draft + published**. Tanpa `all`, endpoint publik hanya mengembalikan feed yang sudah dipublikasikan.
- **Response:** `{ data: Feed[], total: number, page: number, totalPages: number }`

### `POST /api/feeds` *(Protected: Admin)*
Membuat berita/pengumuman baru.
- **Body:** `{ title, category, publishedDate, content, imageUrl, pdfAttachmentUrl, sections, isPublished }`
- **`content`**: Mendukung HTML (output TipTap WYSIWYG) atau plain text.
- **`isPublished`**: `boolean` — default `true`; `false` menyimpan feed sebagai draft (tidak tampil di halaman publik).
- **`sections`**: Array JSONB — tiap elemen bisa berupa:
  - `{ type: "heading", text: "Judul Seksi" }` — sub-heading
  - `{ type: "text", title: "Judul Blok", content: "Isi teks..." }` — blok teks
  - `{ type: "pdf_viewer", url: "https://..." }` — embedded PDF viewer

### `GET /api/feeds/[id]`
Mengambil detail feed berdasarkan ID/Slug.

### `PUT /api/feeds/[id]` *(Protected: Admin)*
Mengubah data feed. Body sama seperti `POST /api/feeds`.

### `PATCH /api/feeds/[id]` *(Protected: Admin)*
Mengubah sebagian field feed — dipakai untuk toggle status publish ringan.
- **Body:** `{ isPublished: boolean }`
- **Response:** `{ success: true, message: "Feed dipublikasikan" | "Feed diarsipkan sebagai draft" }`

### `DELETE /api/feeds/[id]` *(Protected: Admin)*
Menghapus feed.

### `PATCH /api/feeds/[id]/view`
Increment jumlah `view_count` feed saat artikel dibaca.

---

## 1b. Uploads (Gambar & PDF)

### `POST /api/uploads` *(Protected: Admin)*
Upload file gambar (JPG, PNG, WEBP, GIF, SVG) atau PDF.
- **Request:** `multipart/form-data` dengan field `file`.
- **Batasan:** Maks 10 MB; whitelist berdasarkan `Content-Type` MIME.
- **Response:** `{ success: true, url: "/api/uploads/<filename>", mime: "image/png" }`
- File disimpan ke `public/uploads/` dengan nama unik (timestamp + sanitasi + random hex).

### `GET /api/uploads/[filename]`
Menyajikan file yang sudah diunggah dari disk (dibaca saat request).
- **Header:** `Content-Type` sesuai ekstensi, `Content-Length`, `Cache-Control: public, max-age=31536000`.
- **Keamanan:** Nama file di-sanitasi dengan `path.basename` (cegah path traversal); file tidak ditemukan → `404`.
- **Framing:** `X-Frame-Options: SAMEORIGIN` agar PDF dapat tampil di iframe same-origin (aplikasi lain tetap `DENY`).

---

## 2. Dokumen Mutu

### `GET /api/documents`
- **Query Params:** `main_category`, `sub_category`, `year`, `search`

### `POST /api/documents` *(Protected: Admin)*
- **Body:** `{ title, main_category, sub_category, year, target_unit, download_url, file_size }`

---

## 3. Akreditasi

### `GET /api/accreditation`
- **Query Params:** `period_type` (`triwulan` | `semester`), `rating`, `faculty`

### `POST /api/accreditation` *(Protected: Admin)*
Batch insert / upsert data akreditasi prodi.

---

## 4. Audit Logs

### `GET /api/audit-logs`
Mengambil daftar log aktivitas & audit keamanan admin.
- **Query Params:** `action` (`LOGIN` | `CREATE` | `UPDATE` | `DELETE`), `q` (pencarian teks)
- **Response:** `{ success: true, data: AuditLog[], total: number }`

---

## 5. Admin Users (Manajemen Pengelola)

### `GET /api/admin/users` *(Protected: Admin)*
Mengambil daftar akun admin untuk manajemen pengelola.
- **Response:** `{ success: true, data: AdminUser[], total: number }`

### `POST /api/admin/users` *(Protected: Admin)*
Membuat akun admin baru.
- **Body:** `{ name, username, email, password, role }`
- **Keterangan:** Password di-hash dengan `bcryptjs` sebelum disimpan ke `lpm_admins`.

### `DELETE /api/admin/users?id=` *(Protected: Admin)*
Menghapus akun admin.

---

## 6. Health Check

### `GET /api/health`
Endpoint untuk Docker & Load Balancer health check.
- **Response:** `{ status: "ok", timestamp: "..." }`
