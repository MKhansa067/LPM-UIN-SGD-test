import bcrypt from "bcryptjs";
import postgres from "postgres";

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://lpm_user:lpm_password@localhost:5432/lpm_db";

const sql = postgres(connectionString);

async function main() {
  console.log("🌱 Starting Database Seeding...");

  // 1. Seed Superadmin
  const passwordHash = await bcrypt.hash("admin123", 12);
  await sql`
    INSERT INTO lpm_admins (name, username, email, password_hash, role)
    VALUES ('Super Admin LPM', 'admin', 'admin@lpm.uinsgd.ac.id', ${passwordHash}, 'superadmin')
    ON CONFLICT (username) DO NOTHING;
  `;
  console.log("✅ Superadmin account ensured (admin / admin123)");

  // 2. Sample Feeds
  await sql`
    INSERT INTO lpm_feeds (title, slug, category, published_date, content, image_url, view_count, is_published)
    VALUES 
    ('LPM UIN SGD Lakukan Audit Mutu Internal Semester Genap 2025/2026', 'lpm-uin-sgd-lakukan-ami-genap-2025-2026', 'Berita', '2026-03-01', 'Lembaga Penjaminan Mutu UIN Sunan Gunung Djati Bandung menggelar Audit Mutu Internal (AMI) untuk memastikan seluruh standar akademik terpenuhi dengan unggul.', '/assets/logo-lpm.webp', 142, true),
    ('Pengumuman Hasil Akreditasi Program Studi Triwulan I 2026', 'pengumuman-hasil-akreditasi-triwulan-1-2026', 'Pengumuman', '2026-03-05', 'Berdasarkan Keputusan BAN-PT & LAM, berikut adalah rekapitulasi data perolehan peringkat akreditasi program studi UIN SGD Bandung.', '/assets/logo-akreditasi.webp', 98, true)
    ON CONFLICT (slug) DO NOTHING;
  `;
  console.log("✅ Sample Feeds seeded");

  // 3. Sample Documents
  await sql`
    INSERT INTO lpm_documents (title, main_category, sub_category, year, target_unit, download_url, file_size)
    VALUES 
    ('Pedoman Audit Mutu Internal (AMI) 2026', 'Dokumen Regulasi', 'AMI', 2026, 'Universitas', 'https://example.com/docs/pedoman-ami-2026.pdf', '2.4 MB'),
    ('Laporan Survei Kepuasan Mahasiswa 2025', 'Monitoring & Evaluasi', 'Laporan Survei', 2025, 'Universitas', 'https://example.com/docs/survei-kepuasan-2025.pdf', '1.8 MB')
    ON CONFLICT DO NOTHING;
  `;
  console.log("✅ Sample Documents seeded");

  // 4. Sample Accreditation
  await sql`
    INSERT INTO lpm_accreditation (program_name, degree_level, faculty, rating, expiration_date, quarter_period, semester_period)
    VALUES 
    ('Teknik Informatika', 'S1', 'Fakultas Sains dan Teknologi', 'Unggul', '2029-12-31', 'Q1-2026', 'Genap 2025/2026'),
    ('Sistem Informasi', 'S1', 'Fakultas Sains dan Teknologi', 'Unggul', '2030-05-15', 'Q1-2026', 'Genap 2025/2026'),
    ('Pendidikan Agama Islam', 'S1', 'Fakultas Tarbiyah dan Keguruan', 'Unggul', '2028-08-20', 'Q1-2026', 'Genap 2025/2026')
    ON CONFLICT DO NOTHING;
  `;
  console.log("✅ Sample Accreditation data seeded");

  console.log("🎉 Database Seeding Completed Successfully!");
  await sql.end();
}

main().catch((err) => {
  console.error("❌ Seeding Error:", err);
  process.exit(1);
});
