"use client";

import React, { useState, useEffect } from "react";
import TopHeader from "@/components/public/TopHeader";
import Header from "@/components/public/Header";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import { ShieldCheck, Search, Download } from "lucide-react";

interface SpmiDoc { id: number; title: string; category: string; fileUrl: string; year: number; description: string; }

const fallbackDocs: SpmiDoc[] = [
  { id: 1, title: "Buku Kebijakan SPMI UIN Sunan Gunung Djati Bandung", category: "Kebijakan SPMI", fileUrl: "https://www.w3.org/WSI/pdf/n3-spec.pdf", year: 2025, description: "Landasan filosofis, asas, dan prinsip utama pelaksanaan SPMI di UIN SGD." },
  { id: 2, title: "Manual Penetapan Standar Mutu Akademik UIN SGD (Manual P)", category: "PPEPP", fileUrl: "https://www.w3.org/WSI/pdf/n3-spec.pdf", year: 2025, description: "Prosedur penetapan Indikator Kinerja Utama (IKU) dan IKT." },
  { id: 3, title: "Buku Standar Mutu Pendidikan, Penelitian, dan PKM (32 Standar)", category: "Standar Mutu", fileUrl: "https://www.w3.org/WSI/pdf/n3-spec.pdf", year: 2025, description: "Dokumen tolok ukur 32 Standar Mutu UIN SGD Bandung." },
];

const ppeppSteps = [
  { code: "P", name: "Penetapan", desc: "Penetapan 32 Standar SPMI & IKU." },
  { code: "P", name: "Pelaksanaan", desc: "Pelaksanaan tridharma berbasis SOP." },
  { code: "E", name: "Evaluasi", desc: "Evaluasi melalui Audit Mutu Internal." },
  { code: "P", name: "Pengendalian", desc: "Perumusan RTL dalam RTM." },
  { code: "P", name: "Peningkatan", desc: "Peningkatan mutu berkelanjutan (Kaizen)." },
];

export default function SpmiPage() {
  const [documents, setDocuments] = useState<SpmiDoc[]>(fallbackDocs);
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetch("/api/spmi").then(r => r.json()).then(json => { if (json.success && json.data) setDocuments(json.data); }).catch(() => {});
  }, []);

  const categories = ["Semua", "Kebijakan SPMI", "PPEPP", "Standar Mutu", "Kebijakan Mutu"];

  const filteredDocs = documents.filter(doc => {
    const matchCat = activeCategory === "Semua" || doc.category.toLowerCase() === activeCategory.toLowerCase();
    const matchQ = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) || doc.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchQ;
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <TopHeader /><Header /><Navbar />
      <main className="flex-1">
        <section className="bg-emerald-900 text-white py-12 border-b border-emerald-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
              <ShieldCheck className="w-4 h-4" /><span>Sistem Penjaminan Mutu Internal (SPMI)</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">Kerangka Mutu & Siklus Siklikal PPEPP UIN SGD</h1>
            <p className="mt-2 text-slate-200 text-sm max-w-3xl leading-relaxed">Dokumen Kebijakan, Manual, dan Standar Mutu acuan utama pelaksanaan tridharma perguruan tinggi di UIN Sunan Gunung Djati Bandung.</p>
          </div>
        </section>
        <section className="py-8 bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-bold text-slate-900 mb-6 text-center">5 Tahapan Siklus PPEPP LPM UIN SGD</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {ppeppSteps.map((step, idx) => (
                <div key={idx} className="bg-slate-50 border border-slate-200 rounded-xl p-4 shadow-xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="w-8 h-8 rounded-lg bg-emerald-900 text-amber-400 font-bold text-xs flex items-center justify-center">{step.code}</span>
                    <span className="text-[10px] text-slate-400 font-bold">0{idx + 1}</span>
                  </div>
                  <h3 className="font-bold text-xs text-slate-900 mb-1">{step.name}</h3>
                  <p className="text-[11px] text-slate-600">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs mb-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Cari pedoman SPMI, manual PPEPP, atau standar mutu..." className="w-full text-xs pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-900" />
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  {categories.map((cat) => (
                    <button key={cat} onClick={() => setActiveCategory(cat)} className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${activeCategory === cat ? "bg-emerald-900 text-white font-semibold" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}>{cat}</button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredDocs.map((doc) => (
                <div key={doc.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 rounded">{doc.category}</span>
                      <span className="text-xs text-slate-400">Tahun {doc.year}</span>
                    </div>
                    <h3 className="font-bold text-xs text-slate-900 mb-1">{doc.title}</h3>
                    <p className="text-[11px] text-slate-600 line-clamp-2">{doc.description}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400">Dokumen Resmi LPM</span>
                    <a href={doc.fileUrl} target="_blank" rel="noreferrer" className="inline-flex items-center space-x-1 text-xs font-semibold bg-emerald-900 hover:bg-emerald-950 text-white px-3 py-1.5 rounded-lg transition-colors">
                      <Download className="w-3.5 h-3.5 text-amber-400" /><span>Unduh PDF</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}