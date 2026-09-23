"use client";

import React, { useState, useEffect } from "react";
import TopHeader from "@/components/public/TopHeader";
import Header from "@/components/public/Header";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import Link from "next/link";
import { Search, Calendar, FileText, ArrowRight, ChevronRight, Loader2 } from "lucide-react";

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

const archiveYears = [2026, 2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016];

export default function FeedsPage() {
  const [feeds, setFeeds] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [catFilter, setCatFilter] = useState("Semua");

  useEffect(() => {
    let cancelled = false;
    fetch("/api/feeds")
      .then((res) => res.json())
      .then((json) => {
        if (cancelled) return;
        if (json.success && Array.isArray(json.data)) setFeeds(json.data);
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const rawCat = new URLSearchParams(window.location.search).get("category");
    if (rawCat) setCatFilter(rawCat);
  }, []);

  const categories = ["Semua", ...Array.from(new Set(feeds.map((f) => f.category)))];

  const filteredFeeds = feeds.filter((f) => {
    const matchCat = catFilter === "Semua" || f.category === catFilter;
    const term = query.toLowerCase();
    const matchQ = !term || f.title.toLowerCase().includes(term);
    return matchCat && matchQ;
  });
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900">
      <TopHeader />
      <Header />
      <Navbar />

      <div className="bg-emerald-950 text-white py-8 px-4 border-b-4 border-amber-500">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center space-x-2 text-xs text-emerald-300 mb-1">
            <Link href="/" className="hover:text-amber-400">Beranda</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-amber-400 font-medium">Feeds</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold">Pusat Berita & Pengumuman Mutu</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full py-8 px-4 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-4">
            {loading ? (
              <div className="bg-white rounded border p-8 shadow-sm text-center">
                <span className="inline-flex items-center space-x-2 text-slate-400 text-sm">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Memuat berita & pengumuman...</span>
                </span>
              </div>
            ) : filteredFeeds.length === 0 ? (
              <div className="bg-white rounded border p-8 shadow-sm text-center">
                <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-sm font-semibold text-slate-500">Belum ada berita atau pengumuman.</p>
                <p className="text-xs text-slate-400 mt-1">Data akan muncul di sini setelah admin menambahkan berita atau pengumuman melalui dashboard admin.</p>
              </div>
            ) : (
              filteredFeeds.map((f) => (
                <article key={f.id} className="bg-white rounded border p-4 shadow-sm flex flex-col sm:flex-row gap-4">
                  <div className="w-full sm:w-36 h-24 bg-slate-100 rounded border flex flex-col items-center justify-center p-2">
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-800 text-white mb-1">{f.category}</span>
                    <FileText className="w-6 h-6 text-slate-400" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center space-x-2 text-xs text-slate-500 mb-1">
                        <span>{f.publishedDate}</span>
                        <span>&bull;</span>
                        <span>{f.viewCount ?? 0} views</span>
                      </div>
                      <h2 className="text-sm font-bold text-slate-900 hover:text-emerald-800">
                        <Link href={`/feeds/${f.id}`}>{f.title}</Link>
                      </h2>
                    </div>
                    <Link href={`/feeds/${f.id}`} className="inline-flex items-center space-x-1 text-xs font-bold text-emerald-800 mt-2">
                      <span>Detail</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </article>
              ))
            )}
          </div>

          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white p-4 rounded border shadow-sm">
              <h3 className="text-xs font-bold mb-3 flex items-center space-x-1">
                <Search className="w-3.5 h-3.5 text-emerald-800" />
                <span>Pencarian</span>
              </h3>
              <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Ketik kata kunci..." className="w-full bg-slate-50 border rounded px-2.5 py-1 text-xs" />
            </div>

            <div className="bg-white p-4 rounded border shadow-sm">
              <h3 className="text-xs font-bold mb-3 flex items-center space-x-1">
                <Calendar className="w-3.5 h-3.5 text-amber-600" />
                <span>Kategori</span>
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {categories.map((c) => (
                  <button key={c} onClick={() => setCatFilter(c)} className={`px-2 py-1 text-xs rounded font-bold transition-colors ${catFilter === c ? "bg-emerald-900 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}>
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white p-4 rounded border shadow-sm">
              <h3 className="text-xs font-bold mb-3 flex items-center space-x-1">
                <Calendar className="w-3.5 h-3.5 text-amber-600" />
                <span>Arsip (2016-2026)</span>
              </h3>
              <div className="grid grid-cols-3 gap-1.5">
                {archiveYears.map((yr) => (
                  <button key={yr} className="py-1 text-xs border rounded bg-slate-50 hover:bg-amber-50">{yr}</button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
