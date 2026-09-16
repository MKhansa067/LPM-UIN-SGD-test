# 🏛️ Website LPM UIN Sunan Gunung Djati Bandung

Portal Resmi & CMS Lembaga Penjaminan Mutu (LPM) UIN Sunan Gunung Djati Bandung.

---

## 🌟 Fitur Utama
- 🎨 **Flat & Clean UI/UX:** Tampilan modern, responsif, tanpa warna gradasi (Deep Emerald `#064e3b` & Amber Gold `#f59e0b`).
- 📊 **Dashboard Akreditasi Real-Time:** Visualisasi grafik Recharts per triwulan & rekap semester.
- 📂 **Mega Menu & Filter Hub Dokumen:** Navigasi Mega Menu 2-kolom untuk Regulasi Mutu, Monev, dan SPMI.
- 📰 **Dual-Tab CMS Feed:** Tab Berita Terkini & Pengumuman Resmi dengan In-App PDF Reader.
- 🔐 **Keamanan High-Grade:** NextAuth.js Credentials + JWT + Rate Limiting + Audit Logging.
- 🐳 **Docker Multi-Stage Deploy:** Siap jalan di server OS manapun (Windows, Linux, macOS, VPS, cPanel Node.js).

---

## 📚 Dokumentasi
- [📋 Log Perubahan (log.md)](docs/log.md)
- [📚 Dokumentasi Teknis (dokumentasi.md)](docs/dokumentasi.md)
- [🌐 Dokumentasi API (api.md)](docs/api.md)
- [🗄️ Skema Database (database.md)](docs/database.md)
- [🐳 Panduan Deployment & Docker (deployment.md)](docs/deployment.md)
- [🔐 Sistem Autentikasi (auth.md)](docs/auth.md)

---

## ⚡ Cara Menjalankan

### Dengan Docker (Rekomendasi)
```bash
cp .env.example .env.local
docker compose up -d
```
Akses di browser: `http://localhost:3000`

### Tanpa Docker
```bash
npm install --legacy-peer-deps
npm run dev
```

---
*Dikembangkan dengan ❤️ untuk LPM UIN Sunan Gunung Djati Bandung.*
