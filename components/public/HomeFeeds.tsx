"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Newspaper, Bell, Calendar, Eye, ArrowRight } from "lucide-react";

/* ================= Types ================= */

interface FeedItem {
  id: number;
  title: string;
  category: string;
  publishedDate: string;
  content: string;
  imageUrl?: string;
  pdfAttachmentUrl?: string;
  viewCount?: number;
  isPublished?: boolean;
}

/* ================= Helpers ================= */

const MONTHS_ID = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

function formatDateId(value: string): string {
  if (!value) return "";
  const d = new Date(value.length === 10 ? `${value}T00:00:00` : value);
  if (Number.isNaN(d.getTime())) return value;
  return `${d.getDate()} ${MONTHS_ID[d.getMonth()]} ${d.getFullYear()}`;
}

/** Ubah konten HTML (TipTap) menjadi teks ringkas untuk excerpt kartu. */
function toPlainText(html: string): string {
  if (!html) return "";
  if (typeof document !== "undefined") {
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return (tmp.textContent || "").replace(/\s+/g, " ").trim();
  }
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

/* ================= Data Cadangan (Dihapus — 100% Database Driven) ================= */

/* ================= Sub Komponen ================= */

/** Gambar berita dengan fallback otomatis ke logo LPM bila kosong/gagal. */
function FeedImage({ src, alt }: { src?: string; alt: string }) {
  const [failed, setFailed] = useState(false);
  const finalSrc =
    !failed && src && src.trim() !== "" ? src : "/assets/logo-lpm.webp";

  return (
    <div className="w-full h-full bg-slate-100 overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={finalSrc}
        alt={alt}
        loading="lazy"
        onError={() => setFailed(true)}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden animate-pulse">
      <div className="h-44 bg-slate-200" />
      <div className="p-4 space-y-2">
        <div className="h-3 bg-slate-200 rounded w-1/3" />
        <div className="h-4 bg-slate-200 rounded w-3/4" />
        <div className="h-3 bg-slate-200 rounded w-full" />
      </div>
    </div>
  );
}

function SkeletonListItem() {
  return (
    <div className="py-3 border-b border-slate-100 animate-pulse">
      <div className="h-2 bg-slate-200 rounded w-1/4 mb-1.5" />
      <div className="h-3 bg-slate-200 rounded w-4/5" />
    </div>
  );
}

/* ================= Komponen Utama ================= */

/**
 * Bagian Berita + Pengumuman di Beranda.
 * - Berita (kiri, 2 kolom): menampilkan FOTO DOKUMENTASI berita yang
 *   diunggah lewat dashboard admin (`imageUrl` dari tabel feeds), plus
 *   judul, tanggal, deskripsi, dan tombol Selengkapnya.
 * - Pengumuman (kanan): daftar pengumuman + tombol Lainnya.
 */
export default function HomeFeeds() {
  const [feeds, setFeeds] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/feeds")
      .then((res) => res.json())
      .then((json) => {
        if (cancelled) return;
        if (json.success && Array.isArray(json.data)) setFeeds(json.data);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const berita = useMemo(
    () => feeds.filter((f) => f.category === "Berita").slice(0, 6),
    [feeds]
  );
  const pengumuman = useMemo(
    () => feeds.filter((f) => f.category === "Pengumuman").slice(0, 6),
    [feeds]
  );

  return (
    <section id="berita" className="py-10 md:py-14 px-4 md:px-8 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-200 pb-4">
          <div>
            <span className="text-[10px] uppercase font-extrabold tracking-widest text-emerald-900 block">
              Pusat Informasi &amp; Media LPM
            </span>
            <h2 className="text-lg md:text-xl font-black text-slate-900 tracking-tight">
              Berita Terkini &amp; Pengumuman
            </h2>
          </div>
          <Link
            href="/feeds"
            className="inline-flex items-center space-x-1 text-xs font-bold text-emerald-900 hover:text-emerald-700 transition-colors"
          >
            <span>Lihat Semua Berita &amp; Pengumuman</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ==================== BERITA (kiri 2/3) ==================== */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="p-1.5 bg-emerald-900 text-amber-400 rounded-lg">
                  <Newspaper className="w-4 h-4" />
                </span>
                <h3 className="text-base font-black text-slate-900">Berita</h3>
                <span className="text-[10px] bg-emerald-100 text-emerald-900 font-bold px-2 py-0.5 rounded">
                  {berita.length} item
                </span>
              </div>
              <Link
                href="/feeds?category=Berita"
                className="text-xs font-bold text-emerald-900 hover:underline"
              >
                Lainnya →
              </Link>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
              </div>
            ) : berita.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {berita.map((item) => (
                  <article
                    key={item.id}
                    className="group bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-emerald-800 hover:shadow-lg transition-all flex flex-col"
                  >
                    {/* Foto dokumentasi berita (unggahan dashboard admin) */}
                    <Link
                      href={`/feeds/${item.id}`}
                      className="relative block h-44 overflow-hidden bg-slate-100"
                    >
                      <FeedImage src={item.imageUrl} alt={item.title} />
                      <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-emerald-900/90 text-white text-[9px] font-extrabold uppercase tracking-wide backdrop-blur-sm">
                        {item.category}
                      </span>
                    </Link>

                    <div className="p-4 flex flex-col flex-1">
                      <div className="flex items-center space-x-3 text-[11px] text-slate-500 mb-1.5">
                        <span className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3 text-amber-500" />
                          <span>{formatDateId(item.publishedDate)}</span>
                        </span>
                        {typeof item.viewCount === "number" && item.viewCount > 0 && (
                          <span className="flex items-center space-x-1">
                            <Eye className="w-3 h-3 text-slate-400" />
                            <span>{item.viewCount}</span>
                          </span>
                        )}
                      </div>

                      <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-900 line-clamp-2 leading-snug">
                        <Link href={`/feeds/${item.id}`}>{item.title}</Link>
                      </h4>

                      <p className="text-[11px] text-slate-600 mt-1.5 line-clamp-2 flex-1">
                        {toPlainText(item.content)}
                      </p>

                      <div className="mt-3 pt-3 border-t border-slate-100">
                        <Link
                          href={`/feeds/${item.id}`}
                          className="inline-flex items-center space-x-1 text-xs font-bold text-emerald-900 hover:text-amber-600 transition-colors"
                        >
                          <span>Selengkapnya</span>
                          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-slate-500 text-xs">
                Belum ada berita yang dipublikasikan.
              </div>
            )}
          </div>

          {/* ==================== PENGUMUMAN (kanan 1/3) ==================== */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <span className="p-1.5 bg-amber-500 text-white rounded-lg">
                <Bell className="w-4 h-4" />
              </span>
              <h3 className="text-base font-black text-slate-900">Pengumuman</h3>
              <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded">
                {pengumuman.length} item
              </span>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-4 overflow-hidden">
              {loading ? (
                <div>
                  <SkeletonListItem />
                  <SkeletonListItem />
                  <SkeletonListItem />
                  <SkeletonListItem />
                </div>
              ) : pengumuman.length > 0 ? (
                <ul className="divide-y divide-slate-100">
                  {pengumuman.map((item) => (
                    <li key={item.id}>
                      <Link
                        href={`/feeds/${item.id}`}
                        className="group block py-3 hover:bg-slate-50 -mx-2 px-2 rounded-lg transition-colors"
                      >
                        <span className="flex items-center space-x-1 text-[10px] text-slate-500 mb-1">
                          <Calendar className="w-3 h-3 text-amber-500 shrink-0" />
                          <span>{formatDateId(item.publishedDate)}</span>
                        </span>
                        <span className="text-xs font-semibold text-slate-800 group-hover:text-emerald-900 line-clamp-2 leading-snug">
                          {item.title}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="py-8 text-center text-[11px] text-slate-400">
                  Belum ada pengumuman.
                </div>
              )}

              <div className="mt-4 pt-3 border-t border-slate-100">
                <Link
                  href="/feeds?category=Pengumuman"
                  className="w-full inline-flex justify-center items-center space-x-1 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold text-xs rounded-xl transition-colors"
                >
                  <span>Lainnya</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}