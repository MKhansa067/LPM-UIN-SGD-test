# 📋 Log Perubahan — LPM UIN SGD (v0.2.0 - Iterasi 1)

**Versi:** `v0.2.0`
**Tanggal:** 2026-09-10
**Tipe:** `feat` | `security` | `ui`
**Developer:** AI Agent (Cline)

---

### ✅ Yang Ditambahkan
1. **Halaman Autentikasi Admin (`/admin/login`):**
   - Clean Flat UI (Deep Emerald Green `#064e3b`, Amber Gold `#f59e0b`, Slate background, tanpa warna gradasi).
   - Form validation & toggle password eye visibility.
   - Integrasi `NextAuth.js v5` Credentials Provider (`signIn("credentials")`) dengan bcrypt password hashing.

2. **Sistem Proteksi Middleware:**
   - Proteksi otomatis seluruh sub-rute `/admin/dashboard/*` via `middleware.ts` & `auth.config.ts`.
   - Redirection otomatis penguji unauthenticated ke `/admin/login`.

3. **Layout Workspace Admin Shell (`/admin/dashboard/layout.tsx`):**
   - `Sidebar.tsx`: Drawer navigasi admin responsif (Overview, CMS Feed, Dokumen Mutu, SPMI, Akreditasi, Pengaturan, Quick link ke website publik, Tombol Logout).
   - `Topbar.tsx`: Sticky Header bar dengan status koneksi server real-time & badge superadmin.

4. **Dashboard Overview Analytics & Audit Log (`/admin/dashboard/page.tsx`):**
   - Metrics Cards (Total Konten, View Count, Dokumen Mutu, Akreditasi Unggul).
   - Quick Action Shortcuts (Tambah CMS, Upload Dokumen, Update Akreditasi).
   - `AuditLog.tsx`: Stream log audit aktivitas admin real-time.

5. **Root Provider Integration:**
   - Pembungkusan `Providers.tsx` dengan `SessionProvider` di `app/layout.tsx`.
