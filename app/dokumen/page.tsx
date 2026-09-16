"use client";

import React, { useState } from "react";
import TopHeader from "@/components/public/TopHeader";
import Header from "@/components/public/Header";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import Link from "next/link";
import { Search, Download, FileText, ChevronRight } from "lucide-react";

const mockDocs = [
  { id: 1, title: "Pedoman Operasional Baku Audit Mutu Internal (AMI) 2026", mainCategory: "Dokumen Regulasi", subCategory: "AMI", year: 2026, url: "https://www.w3.org/WSI/pdf/n3-spec.pdf" },
  { id: 2, title: "Laporan Evaluasi Diri (LED) & Audit Mutu Eksternal BAN-PT", mainCategory: "Dokumen Regulasi", subCategory: "AME", year: 2025, url: "https://www.w3.org/WSI/pdf/n3-spec.pdf" },
  { id: 3, title: "Rencana Strategis (Renstra) Lembaga Penjaminan Mutu 2024-2029", mainCategory: "Dokumen Regulasi", subCategory: "Renstra", year: 2024, url: "https://www.w3.org/WSI/pdf/n3-spec.pdf" },
  { id: 4, title: "Buku Kebijakan Sistem Penjaminan Mutu Internal (SPMI) UIN SGD", mainCategory: "SPMI", subCategory: "Kebijakan", year: 2025, url: "https://www.w3.org/WSI/pdf/n3-spec.pdf" },
  { id: 5, title: "Manual PPEPP (Penetapan, Pelaksanaan, Evaluasi, Pengendalian, Peningkatan)", mainCategory: "SPMI", subCategory: "PPEPP", year: 2025, url: "https://www.w3.org/WSI/pdf/n3-spec.pdf" },
  { id: 6, title: "Laporan Hasil Survei Kepuasan Mahasiswa Akademik 2025", mainCategory: "Monitoring & Evaluasi", subCategory: "Survei", year: 2025, url: "https://www.w3.org/WSI/pdf/n3-spec.pdf" },
  { id: 7, title: "Sertifikat ISO 9001:2015 Sistem Manajemen Mutu", mainCategory: "Dokumen Regulasi", subCategory: "ISO", year: 2025, url: "https://www.w3.org/WSI/pdf/n3-spec.pdf" },
];

export default function DokumenPage() {
  const [cat, setCat] = useState("Semua");
  const [q, setQ] = useState("");

  const filtered = mockDocs.filter((d) => {
    const matchCat = cat === "Semua" || d.mainCategory === cat;
    const matchQ = d.title.toLowerCase().includes(q.toLowerCase());
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
            <span className="text-amber-400 font-medium">Dokumen Mutu</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold">Pusat Repositori Dokumen Mutu & SPMI</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full py-8 px-4 md:px-8 flex-1 space-y-6">
        <div className="bg-white p-4 rounded border flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-wrap gap-2">
            {["Semua", "Dokumen Regulasi", "Monitoring & Evaluasi", "SPMI"].map((c) => (
              <button key={c} onClick={() => setCat(c)} className={`px-3 py-1.5 text-xs font-bold rounded ${cat === c ? "bg-emerald-900 text-amber-400" : "bg-slate-100 text-slate-700"}`}>
                {c}
              </button>
            ))}
          </div>
          <input type="text" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari dokumen..." className="bg-slate-50 border rounded px-3 py-1.5 text-xs" />
        </div>

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
              {filtered.map((d, idx) => (
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
                    <a href={d.url} target="_blank" rel="noreferrer" className="bg-emerald-900 text-amber-400 font-bold px-2.5 py-1 rounded text-[11px] inline-flex items-center space-x-1">
                      <Download className="w-3 h-3" />
                      <span>PDF</span>
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Footer />
    </div>
  );
}
