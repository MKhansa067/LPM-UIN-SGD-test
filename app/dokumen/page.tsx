"use client";

import React, { useState, useEffect } from "react";
import TopHeader from "@/components/public/TopHeader";
import Header from "@/components/public/Header";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import Link from "next/link";
import { Search, Download, FileText, ChevronRight, Loader2 } from "lucide-react";

interface DokumenItem {
  id: number;
  title: string;
  mainCategory: string;
  subCategory: string;
  year: number;
  targetUnit?: string;
  downloadUrl: string;
  fileSize?: string;
}

const MAIN_CATEGORIES = ["Semua", "Dokumen Regulasi", "Monitoring & Evaluasi", "SPMI"];

const SUB_CATEGORY_ALIASES: Record<string, string> = {
  ame: "Audit Mutu Eksternal (AME)",
  ami: "Audit Mutu Internal (AMI)",
  renstra: "Renstra & RIP LPM",
  iso: "Sertifikasi ISO",
  sertifikasi: "Sertifikasi ISO",
  kebijakan: "Kebijakan Mutu SPMI",
  ppepp: "Siklus PPEPP",
  survei: "Laporan Survei Kepuasan",
  monev: "Laporan Monev Pembelajaran",
  validitas: "Uji Validitas Data SPMI",
};

/** Normalisasi label sub-kategori agar label lama (AMI, Renstra, dll.) tetap cocok dengan label baru. */
const SUB_CANONICAL: Record<string, string> = {
  "audit mutu internal": "ami",
  "audit mutu internal (ami)": "ami",
  ami: "ami",
  "audit mutu eksternal": "ame",
  "audit mutu eksternal (ame)": "ame",
  ame: "ame",
  renstra: "renstra",
  "renstra & rip": "renstra",
  "renstra & rip lpm": "renstra",
  iso: "iso",
  sertifikasi: "iso",
  "sertifikasi iso": "iso",
  kebijakan: "kebijakan",
  "kebijakan mutu": "kebijakan",
  "kebijakan mutu spmi": "kebijakan",
  ppepp: "ppepp",
  "siklus ppepp": "ppepp",
  survei: "survei",
  "laporan survei": "survei",
  "laporan survei kepuasan": "survei",
  monev: "monev",
  "laporan monev": "monev",
  "laporan monev pembelajaran": "monev",
  validitas: "validitas",
  "uji validitas": "validitas",
  "uji validitas data spmi": "validitas",
  "standar mutu": "standar",
};

function canonicalSub(s: string): string {
  return SUB_CANONICAL[s.toLowerCase().trim()] ?? s.toLowerCase().trim();
}

export default function DokumenPage() {
  const [docs, setDocs] = useState<DokumenItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [cat, setCat] = useState("Semua");
  const [sub, setSub] = useState<string>("Semua");
  const [q, setQ] = useState("");

  useEffect(() => {
    let cancelled = false;
    fetch("/api/dokumen")
      .then((res) => res.json())
      .then((json) => {
        if (cancelled) return;
        if (json.success && Array.isArray(json.data)) setDocs(json.data);
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const rawSub = new URLSearchParams(window.location.search).get("sub");
    if (rawSub) {
      const key = rawSub.toLowerCase();
      const alias = SUB_CATEGORY_ALIASES[key] || rawSub;
      setSub(alias);
    }
  }, []);
const subOptions: string[] = (() => {
    if (cat === "Semua") return ["Semua", ...Array.from(new Set(docs.map((d) => d.subCategory)))];
    return ["Semua", ...Array.from(new Set(docs.filter((d) => d.mainCategory === cat).map((d) => d.subCategory)))];
  })();

  const filtered = docs.filter((d) => {
    const matchCat = cat === "Semua" || d.mainCategory === cat;
    const matchSub = sub === "Semua" || canonicalSub(d.subCategory) === canonicalSub(sub);
    const term = q.toLowerCase();
    const matchQ = !term || d.title.toLowerCase().includes(term);
    return matchCat && matchSub && matchQ;
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
            <span className="text-amber-400 font-medium">Dokumen Mutu</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold">Pusat Repositori Dokumen Mutu & SPMI</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full py-8 px-4 md:px-8 flex-1 space-y-6">
        <div className="bg-white p-4 rounded border flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-wrap gap-2">
            {MAIN_CATEGORIES.map((c) => (
              <button key={c} onClick={() => { setCat(c); setSub("Semua"); }} className={`px-3 py-1.5 text-xs font-bold rounded ${cat === c ? "bg-emerald-900 text-amber-400" : "bg-slate-100 text-slate-700"}`}>
                {c}
              </button>
            ))}
          </div>
          <input type="text" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari dokumen..." className="bg-slate-50 border rounded px-3 py-1.5 text-xs" />
        </div>

        {subOptions.length > 1 && (
          <div className="bg-white p-3 rounded border flex flex-wrap gap-2">
            {subOptions.map((s) => (
              <button key={s} onClick={() => setSub(s)} className={`px-3 py-1.5 text-xs font-bold rounded ${sub === s ? "bg-emerald-900 text-amber-400" : "bg-slate-100 text-slate-700"}`}>
                {s}
              </button>
            ))}
          </div>
        )}

        <div className="bg-white rounded border shadow-sm overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-emerald-950 text-emerald-100 font-bold uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-4">Judul Dokumen</th>
                <th className="py-3 px-4">Kategori Utama</th>
                <th className="py-3 px-4">Sub</th>
                <th className="py-3 px-4">Tahun</th>
                <th className="py-3 px-4 text-center">Unduh</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center">
                    <span className="inline-flex items-center space-x-2 text-slate-400 text-sm">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Memuat dokumen...</span>
                    </span>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <FileText className="w-12 h-12 text-slate-300" />
                      <p className="text-sm font-semibold text-slate-500">Belum ada dokumen pada kategori ini.</p>
                      <p className="text-xs text-slate-400 max-w-md">Dokumen mutu seperti AMI, Renstra & RIP LPM, Siklus PPEPP, dan laporan evaluasi akan tampil di sini setelah ditambahkan oleh admin melalui dashboard.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((d, idx) => (
                  <tr key={d.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-bold text-slate-400">{idx + 1}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-emerald-800" />
                        <span>{d.title}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4"><span className="bg-emerald-100 text-emerald-900 font-bold px-2 py-0.5 rounded text-[10px]">{d.mainCategory}</span></td>
                    <td className="py-3 px-4 text-slate-600">{d.subCategory}</td>
                    <td className="py-3 px-4 font-bold text-amber-700">{d.year}</td>
                    <td className="py-3 px-4 text-center">
                      <a href={d.downloadUrl} target="_blank" rel="noreferrer" className="bg-emerald-900 text-amber-400 font-bold px-2.5 py-1 rounded text-[11px] inline-flex items-center space-x-1">
                        <Download className="w-3 h-3" />
                        <span>PDF</span>
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Footer />
    </div>
  );
}
