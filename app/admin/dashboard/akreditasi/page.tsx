"use client";

import React, { useState, useEffect } from "react";
import { Award, Plus, Trash2, Save, Search, X } from "lucide-react";

interface AccItem {
  id: number;
  studyProgram: string;
  faculty: string;
  degree: string;
  status: string;
  accreditationBody: string;
  skNumber: string;
  validUntil: string;
  quarter: string;
  semester: string;
  internationalAccredited: boolean;
}

const ratings = ["Unggul", "A", "Baik Sekali", "B", "Baik", "Internasional"];
const degrees = ["S1", "S2", "S3", "Profesi"];

export default function AdminAkreditasiPage() {
  const [items, setItems] = useState<AccItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [draft, setDraft] = useState<AccItem | null>(null);
  const [showNewRow, setShowNewRow] = useState(false);

  useEffect(() => { fetchData(); }, []);

  async function fetchData() {
    try {
      const res = await fetch("/api/akreditasi");
      const json = await res.json();
      if (json.success && json.data) setItems(json.data);
    } catch { /* fallback */ }
  }

  async function handleSave(id: number) {
    if (!draft) return;
    try {
      await fetch("/api/akreditasi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      await fetch(`/api/akreditasi?id=${id}`, { method: "DELETE" });
      setEditingId(null);
      setDraft(null);
      fetchData();
    } catch { alert("Gagal menyimpan data akreditasi"); }
  }

  async function handleCreate() {
    if (!draft) return;
    try {
      await fetch("/api/akreditasi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      setShowNewRow(false);
      setDraft(null);
      fetchData();
    } catch { alert("Gagal menambah data akreditasi"); }
  }

  async function handleDelete(id: number) {
    if (!confirm("Yakin ingin menghapus data akreditasi ini?")) return;
    try {
      await fetch(`/api/akreditasi?id=${id}`, { method: "DELETE" });
      fetchData();
    } catch { alert("Gagal menghapus data"); }
  }

  function openEdit(item: AccItem) {
    setEditingId(item.id);
    setDraft({ ...item });
  }

  function openNew() {
    setShowNewRow(true);
    setDraft({
      id: 0,
      studyProgram: "",
      faculty: "",
      degree: "S1",
      status: "Unggul",
      accreditationBody: "BAN-PT",
      skNumber: "SK-",
      validUntil: "2030-12-31",
      quarter: "Q1-2026",
      semester: "Genap 2025/2026",
      internationalAccredited: false,
    });
  }

  const filteredItems = items.filter(
    (i) =>
      i.studyProgram.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.faculty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.status.toLowerCase().includes(searchQuery.toLowerCase())
  );
return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <span className="text-xs uppercase font-bold text-amber-500 tracking-wider block">Real-time Dashboard</span>
          <h1 className="text-xl font-bold text-slate-900">Kelola Data Akreditasi Prodi</h1>
        </div>
        <button onClick={openNew} className="inline-flex items-center space-x-2 bg-emerald-900 hover:bg-emerald-950 text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors">
          <Plus className="w-4 h-4 text-amber-400" />
          <span>Tambah Baris</span>
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center space-x-3">
        <Search className="w-4 h-4 text-slate-400" />
        <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Cari prodi / fakultas..." className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-900" />
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-x-auto shadow-xs">
        <table className="w-full text-left border-collapse min-w-[1100px]">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase">
              <th className="py-3 px-3">Prodi</th>
              <th className="py-3 px-3">Fakultas</th>
              <th className="py-3 px-3">Jenjang</th>
              <th className="py-3 px-3">Status</th>
              <th className="py-3 px-3">Badan</th>
              <th className="py-3 px-3">SK</th>
              <th className="py-3 px-3">Berlaku</th>
              <th className="py-3 px-3">Triwulan</th>
              <th className="py-3 px-3">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
            {showNewRow && draft && (
              <tr className="bg-emerald-50/50">
                <td className="py-2 px-3"><input value={draft.studyProgram} onChange={(e) => setDraft({ ...draft, studyProgram: e.target.value })} className="w-full p-1.5 border border-slate-200 rounded" /></td>
                <td className="py-2 px-3"><input value={draft.faculty} onChange={(e) => setDraft({ ...draft, faculty: e.target.value })} className="w-full p-1.5 border border-slate-200 rounded" /></td>
                <td className="py-2 px-3"><select value={draft.degree} onChange={(e) => setDraft({ ...draft, degree: e.target.value })} className="w-full p-1.5 border border-slate-200 rounded">{degrees.map((d) => <option key={d} value={d}>{d}</option>)}</select></td>
                <td className="py-2 px-3"><select value={draft.status} onChange={(e) => setDraft({ ...draft, status: e.target.value })} className="w-full p-1.5 border border-slate-200 rounded">{ratings.map((r) => <option key={r} value={r}>{r}</option>)}</select></td>
                <td className="py-2 px-3"><input value={draft.accreditationBody} onChange={(e) => setDraft({ ...draft, accreditationBody: e.target.value })} className="w-full p-1.5 border border-slate-200 rounded" /></td>
                <td className="py-2 px-3"><input value={draft.skNumber} onChange={(e) => setDraft({ ...draft, skNumber: e.target.value })} className="w-full p-1.5 border border-slate-200 rounded" /></td>
                <td className="py-2 px-3"><input type="date" value={draft.validUntil} onChange={(e) => setDraft({ ...draft, validUntil: e.target.value })} className="w-full p-1.5 border border-slate-200 rounded" /></td>
                <td className="py-2 px-3"><input value={draft.quarter} onChange={(e) => setDraft({ ...draft, quarter: e.target.value })} className="w-full p-1.5 border border-slate-200 rounded" /></td>
                <td className="py-2 px-3 space-x-1">
                  <button onClick={handleCreate} className="p-1.5 bg-emerald-900 text-white rounded"><Save className="w-3.5 h-3.5" /></button>
                  <button onClick={() => setShowNewRow(false)} className="p-1.5 bg-slate-200 text-slate-600 rounded"><X className="w-3.5 h-3.5" /></button>
                </td>
              </tr>
            )}
{filteredItems.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50">
                {editingId === item.id && draft ? (
                  <>
                    <td className="py-2 px-3"><input value={draft.studyProgram} onChange={(e) => setDraft({ ...draft, studyProgram: e.target.value })} className="w-full p-1 border border-slate-200 rounded" /></td>
                    <td className="py-2 px-3"><input value={draft.faculty} onChange={(e) => setDraft({ ...draft, faculty: e.target.value })} className="w-full p-1 border border-slate-200 rounded" /></td>
                    <td className="py-2 px-3"><select value={draft.degree} onChange={(e) => setDraft({ ...draft, degree: e.target.value })} className="w-full p-1 border border-slate-200 rounded">{degrees.map((d) => <option key={d} value={d}>{d}</option>)}</select></td>
                    <td className="py-2 px-3"><select value={draft.status} onChange={(e) => setDraft({ ...draft, status: e.target.value })} className="w-full p-1 border border-slate-200 rounded">{ratings.map((r) => <option key={r} value={r}>{r}</option>)}</select></td>
                    <td className="py-2 px-3"><input value={draft.accreditationBody} onChange={(e) => setDraft({ ...draft, accreditationBody: e.target.value })} className="w-full p-1 border border-slate-200 rounded" /></td>
                    <td className="py-2 px-3"><input value={draft.skNumber} onChange={(e) => setDraft({ ...draft, skNumber: e.target.value })} className="w-full p-1 border border-slate-200 rounded" /></td>
                    <td className="py-2 px-3"><input type="date" value={draft.validUntil} onChange={(e) => setDraft({ ...draft, validUntil: e.target.value })} className="w-full p-1 border border-slate-200 rounded" /></td>
                    <td className="py-2 px-3"><input value={draft.quarter} onChange={(e) => setDraft({ ...draft, quarter: e.target.value })} className="w-full p-1 border border-slate-200 rounded" /></td>
                    <td className="py-2 px-3 space-x-1">
                      <button onClick={() => handleSave(item.id)} className="p-1.5 bg-emerald-900 text-white rounded"><Save className="w-3.5 h-3.5" /></button>
                      <button onClick={() => setEditingId(null)} className="p-1.5 bg-slate-200 text-slate-600 rounded"><X className="w-3.5 h-3.5" /></button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="py-3 px-3 font-semibold text-slate-900">{item.studyProgram}</td>
                    <td className="py-3 px-3 text-slate-500">{item.faculty}</td>
                    <td className="py-3 px-3"><span className="px-1.5 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px] font-bold">{item.degree}</span></td>
                    <td className="py-3 px-3"><span className={`px-2 py-0.5 rounded text-[10px] font-bold ${item.status === "Unggul" || item.status === "Internasional" ? "bg-amber-50 text-amber-800 border border-amber-200" : "bg-emerald-50 text-emerald-800 border border-emerald-200"}`}>{item.status}</span></td>
                    <td className="py-3 px-3 text-slate-500">{item.accreditationBody}</td>
                    <td className="py-3 px-3 text-slate-500 truncate max-w-[120px]">{item.skNumber}</td>
                    <td className="py-3 px-3 text-slate-500">{item.validUntil}</td>
                    <td className="py-3 px-3 text-slate-500">{item.quarter}</td>
                    <td className="py-3 px-3 space-x-1">
                      <button onClick={() => openEdit(item)} className="p-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-md">Edit</button>
                      <button onClick={() => handleDelete(item.id)} className="p-1.5 bg-red-50 text-red-700 hover:bg-red-100 rounded-md"><Trash2 className="w-3.5 h-3.5" /></button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}