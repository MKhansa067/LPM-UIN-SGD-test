# 📋 Log Perubahan — Iterasi 10 (v0.9.5)

**Tanggal:** 16 September 2026  
**Versi:** `v0.9.5`  
**Tipe:** `fix` | `admin` | `ui` | `refactor`  
**Developer:** AI Agent (Cline)

---

## 📑 Ringkasan Eksekutif

Iterasi 10 menyelesaikan masalah UX (*State Persistence / Stale Form Bug*) pada seluruh modul manajemen admin (**Kelola CMS Feed**, **Kelola Dokumen Mutu**, **Kelola Dokumen SPMI**, **Data Akreditasi**, dan **Manajemen Pengelola Admin**).

---

## 🐛 Masalah Yang Ditemukan (Issue Summary)

- **Gejala Bug**:
  - Setelah pengelola menyimpan data item baru (misal: Feed-1), lalu mengklik tombol **"Tambah Feed Baru"** pada sesi yang sama tanpa melakukan *refresh* halaman, modal yang terbuka justru terisi data Feed-1 (`editId` masih tersimpan di state).
  - Ketika tombol **"Simpan Feed"** diklik untuk niat membuat Feed-2, sistem melakukan HTTP `PUT /api/feeds/1` (meng-over-write / meng-edit Feed-1) bukannya `POST /api/feeds` (membuat Feed-2 baru).
  - Hal serupa terjadi pada modul Dokumen Mutu, SPMI, Data Akreditasi, dan Manajemen Admin di mana data inputan sebelumnya tidak dibersihkan (*reset*) secara otomatis setelah modal ditutup atau disubmit.

- **Akar Penyebab (Root Cause)**:
  1. Tombol **"Tambah Baru"** pada komponen UI langsung memanggil `setShowModal(true)` tanpa mereset status ID pengeditan (`editId` / `editingId`) dan variabel state input (`title`, `content`, `sections`, `downloadUrl`, `fileUrl`, dll).
  2. Fungsi handler submit (`handleSubmit`) tidak melakukan *flush/reset* variabel state form setelah sukses melakukan HTTP request dan menutup modal.

---

## ⚡ Solusi & Perbaikan Yang Diterapkan

1. **CMS Feed (`app/admin/dashboard/cms/page.tsx`)**:
   - Menambahkan fungsi helper `resetForm()` yang mengosongkan `editId`, `title`, `content`, `category`, `imageUrl`, `pdfAttachmentUrl`, `sections`, dan `isPublished`.
   - Mengubah handler tombol **"Tambah Feed Baru"** untuk memanggil `openCreateModal()` yang memicu `resetForm()`.
   - Memanggil `resetForm()` secara otomatis di dalam `handleSubmit()` setelah respons API dinyatakan berhasil.

2. **Dokumen Mutu (`app/admin/dashboard/dokumen/page.tsx`)**:
   - Menambahkan fungsi `resetForm()` dan `openCreateModal()` untuk mengosongkan input `title`, `downloadUrl`, `mainCategory`, `subCategory`, `year`, dan `targetUnit`.
   - Menghubungkan tombol **"Tambah Dokumen"** ke `openCreateModal()` dan melakukan reset otomatis setelah `handleSubmit()`.

3. **Dokumen SPMI (`app/admin/dashboard/spmi/page.tsx`)**:
   - Menambahkan `resetForm()` dan `openCreateModal()` untuk mengosongkan `title`, `fileUrl`, `description`, `category`, dan `year`.
   - Menghubungkan tombol **"Tambah Dokumen SPMI"** ke `openCreateModal()` dan memicu `resetForm()` saat simpan berhasil.

4. **Data Akreditasi (`app/admin/dashboard/akreditasi/page.tsx`)**:
   - Memperbaiki `openNew()` agar secara eksplisit mengeset `editingId = null` sehingga baris pembuatan baru tidak bertabrakan dengan mode pengeditan baris tabel yang ada.
   - Memperbaiki `openEdit()` agar mengeset `showNewRow = false`.
   - Memperbaiki `handleCreate()` agar membersihkan `editingId` dan `draft` setelah simpan berhasil.

5. **Manajemen Admin Users (`app/admin/dashboard/users/page.tsx`)**:
   - Membuat `openCreateModal()` untuk mereset `error` dan mengosongkan `form` (`name`, `username`, `email`, `password`, `role`) setiap kali modal dibuka.

---

## 🧪 Hasil Pengujian & Validasi

| Pengujian | Status | Catatan |
|---|---|---|
| `npx tsc --noEmit` | ✅ Pass | 0 TypeScript Errors |
| `npm run build` | ✅ Pass | 29 Static/Dynamic Routes compiled cleanly |
| Multi-Create Session Test | ✅ Pass | Tambah Feed-1 ➔ Klik Tambah Baru ➔ Form bersih ➔ Simpan Feed-2 sebagai POST request baru (bukan Edit) |

---

## 📌 Kesimpulan
Pengelola mutu dapat secara berkelanjutan menambahkan beberapa Feed, Dokumen Mutu, Dokumen SPMI, dan Data Akreditasi secara beruntun dalam satu sesi tanpa perlu melakukan *refresh* browser.
