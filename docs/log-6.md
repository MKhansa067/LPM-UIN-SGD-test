# 📋 Log Perubahan — LPM UIN SGD (v0.7.0 - Iterasi 6)

**Versi:** `v0.7.0`
**Tanggal:** 2026-09-11
**Tipe:** `feat` | `ui` | `admin` | `editor` | `refactor`
**Developer:** AI Agent (Cline)

---

### ✅ Yang Ditambahkan

1. **TipTap Rich Text Editor (`components/admin/TiptapEditor.tsx`):**
   - Komponen WYSIWYG editor berbasis TipTap v3 (`@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/extension-link`, `@tiptap/extension-placeholder`, `@tiptap/extension-image`).
   - Toolbar lengkap: Undo/Redo, Bold, Italic, Strike, Code, Heading (H1–H3), Bullet List, Ordered List, Blockquote, Horizontal Rule, Link (URL prompt), Image (URL prompt).
   - Styling konsisten dengan design system emerald-900/amber-400 pada tombol aktif.
   - Mendukung placeholder, min-height configurable, dan controlled `content`/`onChange` props.

2. **CMS Feed Page — Edit Mode & TipTap Integration (`/admin/dashboard/cms`):**
   - **Edit Mode:** Tombol Edit (ikon `Edit3` biru) pada setiap baris feed di tabel; membuka modal yang terisi dengan data feed yang ada.
   - **Dual-Mode Modal:** Header modal menampilkan "Tambah Feed Baru (CMS)" atau "Edit Feed (ID: N)" — tombol submit menampilkan "Simpan Feed" atau "Perbarui Feed".
   - **TipTap replaces Textarea:** Area konten modal sekarang menggunakan `TiptapEditor` untuk input WYSIWYG, menggantikan `<textarea>` sebelumnya.
   - **PUT API:** Submit edit memanggil `PUT /api/feeds/[id]` (endpoint yang sudah ada), submit baru memanggil `POST /api/feeds`.

3. **Section Builder — 3 Tipe Blok & Inline Editor:**
   - **Heading Block:** Tipe baru `heading` ditambahkan ke builder sections — menambahkan sub-judul (heading) di antara seksi konten.
   - **Inline Editing:** Setiap seksi (heading, text, pdf_viewer) memiliki input field inline langsung (input/textarea) — tidak lagi hanya menampilkan ringkasan statis.
   - **Icon per tipe:** Heading (`Heading`), Teks (`ImageIconLucide`), PDF (`FileText`) — memperjelas jenis seksi secara visual.
   - **Empty state:** Pesan informatif ditampilkan ketika belum ada seksi yang ditambahkan.

4. **Feed Detail Page — HTML Content Rendering (`/feeds/[id]`):**
   - Deteksi otomatis: jika konten mengandung HTML (output dari TipTap), menggunakan `dangerouslySetInnerHTML` dengan Tailwind prose styling.
   - Styling Tailwind/arbitrary untuk rendering heading (H1–H3), list (ul/ol), blockquote, link, gambar, kode, dan horizontal rule — tanpa dependency `@tailwindcss/typography`.
   - Fallback plain text rendering untuk konten lama yang belum menggunakan TipTap.
   - `FeedSection` interface diperbarui: field `title` dan `content` ditambahkan untuk dukungan inline section editing.
   - Heading section type: `section.type === "heading"` dirender sebagai `<h3>` dengan border-left amber-500.

5. **Dashboard Quick-Action Links Fixed (`/admin/dashboard`):**
   - Link "Tambah Konten CMS" diarahkan ke `/admin/dashboard/cms` (sebelumnya `/admin/dashboard/cms/baru` — 404).
   - Link "Upload Dokumen Mutu" diarahkan ke `/admin/dashboard/dokumen` (sebelumnya `/admin/dashboard/dokumen/baru` — 404).

---

### 🔧 Yang Diubah (Refactor)

| Area | Sebelum | Sesudah |
|------|---------|---------|
| CMS Feed content input | `<textarea>` polos | TipTap WYSIWYG editor |
| CMS modal title | Statis "Tambah Feed Baru" | Dinamis:Tambah/Edit |
| CMS submit button | Statis "Simpan Feed" | Dinamis:Simpan/Perbarui |
| CMS submit endpoint | Hanya `POST /api/feeds` | `POST` (baru) atau `PUT` (edit) |
| CMS table actions | Hanya tombol Delete | Tombol Edit + Delete |
| CMS section builder | 2 tipe (text, pdf_viewer), ringkasan statis | 3 tipe (+heading), input inline |
| Feed detail content | Plain text (`whitespace-pre-line`) | HTML (TipTap) atau fallback plain text |
| Feed detail sections | text/pdf_viewer saja | +heading + title/content field |

---

### 📁 File yang Diubah

```
components/admin/TiptapEditor.tsx              ← [BARU] TipTap WYSIWYG editor component
app/admin/dashboard/cms/page.tsx               ← [MODIFIED] Edit mode, TipTap, enhanced section builder
app/feeds/[id]/page.tsx                        ← [MODIFIED] HTML content rendering, heading section support
app/admin/dashboard/page.tsx                   ← [FIXED] Quick-action links point to correct routes
```

---

### ✅ Build & Test Status

- `npm run build`: **✅ Compiled successfully** — 27 routes, 0 TypeScript errors
- Dev server smoke test: ✅ `/feeds` 200, `/feeds/1` 200, `/admin/login` 200, `/api/feeds` 200
- Admin dashboard `/admin/dashboard` → redirect to `/admin/login` (auth guard working)

---

### 🔜 Lanjutan (Iteration 7 — Potensi)

- Inline image upload endpoint (`/api/upload`) — saat ini image hanya via URL input.
- Preview mode untuk feed sebelum publish (live preview TipTap output).
- Bulk publish/unpublish toggle pada feed list.
- Drag-and-drop reordering untuk sections JSONB.
- Rich text editor untuk sections text content (sudah pakai textarea, bisa upgrade ke mini TipTap).