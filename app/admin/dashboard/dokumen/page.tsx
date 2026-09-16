"use client";

import React, { useState, useEffect } from "react";
import { Plus, Search, Trash2, Download, X } from "lucide-react";

interface DocItem {
  id: number;
  title: string;
  mainCategory: string;
  subCategory: string;
  year: number;
  targetUnit: string;
  downloadUrl: string;
}

export default function AdminDokumenPage() {
  const [docs, setDocs] = useState<DocItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [title, setTitle] = useState("");
  const [mainCategory, setMainCategory] = useState("Dokumen Regulasi");
  const [subCategory, setSubCategory] = useState("AMI");
  const [year, setYear] = useState(new Date().getFullYear());
  const [targetUnit, setTargetUnit] = useState("Universitas");
  const [downloadUrl, setDownloadUrl] = useState("");

  const subCategories: Record<string, string[]> = {
    "Dokumen Regulasi": ["AMI", "AME", "Renstra & RIP", "HAKi", "Sertifikasi"],
    "Monitoring & Evaluasi": ["Laporan Monev", "Uji Validitas", "Laporan Survei"],
    "SPMI": ["Kebijakan", "PPEPP", "Standar Mutu", "Kebijakan Mutu"],
  };

  useEffect(() => { fetchDocs(); }, []);

  async function fetchDocs() {
    try {
      const res = await fetch("/api/dokumen");
      const json = await res.json();
      if (json.success && json.data) setDocs(json.data);
    } catch { /* fallback */ }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await fetch("/api/dokumen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, mainCategory, subCategory, year, targetUnit, downloadUrl }),
      });
      setShowModal(false);
      fetchDocs();
    } catch { alert("Gagal menyimpan dokumen"); }
  }

  async function handleDelete(id: number) {
    if (!confirm("Yakin ingin menghapus dokumen ini?")) return;
    try {
      await fetch(`/api/dokumen?id=${id}`, { method: "DELETE" });
      fetchDocs();
    } catch { alert("Gagal menghapus dokumen"); }
  }

  const filteredDocs = docs.filter((d) => d.title.toLowerCase().includes(searchQuery.toLowerCase()));
return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <span className="text-xs uppercase font-bold text-amber-500 tracking-wider block">Repositori Dokumen</span>
          <h1 className="text-xl font-bold text-slate-900">Kelola Dokumen Mutu & Monev</h1>
        </div>
        <button onClick={() => setShowModal(true)} className="inline-flex items-center space-x-2 bg-emerald-900 hover:bg-emerald-950 text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors">
          <Plus className="w-4 h-4 text-amber-400" />
          <span>Tambah Dokumen</span>
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center space-x-3">
        <Search className="w-4 h-4 text-slate-400" />
        <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Cari dokumen mutu..." className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-900" />
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase">
              <th className="py-3 px-4">Judul Dokumen</th>
              <th className="py-3 px-4">Kategori</th>
              <th className="py-3 px-4">Sub Kategori</th>
              <th className="py-3 px-4">Tahun</th>
              <th className="py-3 px-4">Unit</th>
              <th className="py-3 px-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
            {filteredDocs.map((doc) => (
              <tr key={doc.id} className="hover:bg-slate-50">
                <td className="py-3 px-4 font-semibold text-slate-900 max-w-xs truncate">{doc.title}</td>
                <td className="py-3 px-4"><span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold">{doc.mainCategory}</span></td>
                <td className="py-3 px-4 text-slate-500">{doc.subCategory}</td>
                <td className="py-3 px-4 text-slate-500">{doc.year}</td>
                <td className="py-3 px-4 text-slate-500">{doc.targetUnit}</td>
                <td className="py-3 px-4 text-right space-x-2">
                  <a href={doc.downloadUrl} target="_blank" rel="noreferrer" className="p-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-md inline-flex"><Download className="w-3.5 h-3.5" /></a>
                  <button onClick={() => handleDelete(doc.id)} className="p-1.5 bg-red-50 text-red-700 hover:bg-red-100 rounded-md"><Trash2 className="w-3.5 h-3.5" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h2 className="text-base font-bold text-slate-900">Tambah Dokumen Baru</h2>
              <button onClick={() => setShowModal(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Judul Dokumen</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-900" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Kategori Utama</label>
                  <select value={mainCategory} onChange={(e) => { setMainCategory(e.target.value); setSubCategory(subCategories[e.target.value]?.[0] || ""); }} className="w-full p-2.5 border border-slate-200 rounded-lg">
                    {Object.keys(subCategories).map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Sub Kategori</label>
                  <select value={subCategory} onChange={(e) => setSubCategory(e.target.value)} className="w-full p-2.5 border border-slate-200 rounded-lg">
                    {(subCategories[mainCategory] || []).map((sub) => <option key={sub} value={sub}>{sub}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Tahun</label>
                  <input type="number" value={year} onChange={(e) => setYear(parseInt(e.target.value))} className="w-full p-2.5 border border-slate-200 rounded-lg" />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Unit Target</label>
                  <input type="text" value={targetUnit} onChange={(e) => setTargetUnit(e.target.value)} className="w-full p-2.5 border border-slate-200 rounded-lg" />
                </div>
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Download URL</label>
                <input type="text" value={downloadUrl} onChange={(e) => setDownloadUrl(e.target.value)} required className="w-full p-2.5 border border-slate-200 rounded-lg" />
              </div>
              <div className="flex justify-end space-x-2 pt-4 border-t">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-lg">Batal</button>
                <button type="submit" className="px-4 py-2 bg-emerald-900 text-white font-semibold rounded-lg hover:bg-emerald-950">Simpan Dokumen</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
