"use client";

import React, { useState, useEffect } from "react";
import { Plus, Search, Trash2, X, Layers, Edit3, FileText, Image as ImageIconLucide, Heading, Eye, EyeOff, Upload, GripVertical, Loader2 } from "lucide-react";
import TiptapEditor from "@/components/admin/TiptapEditor";
import FeedPreviewModal from "@/components/admin/FeedPreviewModal";

interface Section { type: "text" | "pdf_viewer" | "heading"; title?: string; content?: string; url?: string; text?: string; }
interface FeedItem { id: number; title: string; category: string; publishedDate: string; content: string; imageUrl: string; pdfAttachmentUrl: string; viewCount: number; sections: Section[]; isPublished?: boolean; }

export default function AdminCmsFeedsPage() {
  const [feeds, setFeeds] = useState<FeedItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Berita");
  const [publishedDate, setPublishedDate] = useState(new Date().toISOString().split("T")[0]);
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("/assets/logo-lpm.webp");
  const [pdfAttachmentUrl, setPdfAttachmentUrl] = useState("-");
  const [sections, setSections] = useState<Section[]>([]);
  const [isPublished, setIsPublished] = useState(true);
  const [draftFilter, setDraftFilter] = useState<string>("all");
  const [previewFeed, setPreviewFeed] = useState<FeedItem | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [uploading, setUploading] = useState<{ target: "image" | "pdf"; idx?: number } | null>(null);

  useEffect(() => { fetchFeeds(); }, []);

  async function fetchFeeds() {
    // `all=1` — CMS menampilkan feed draft + published.
    try { const res = await fetch("/api/feeds?all=1"); const json = await res.json(); if (json.success && json.data) setFeeds(json.data); } catch { /* fallback */ }
  }

  function openCreateModal() {
    setEditId(null); setTitle(""); setCategory("Berita");
    setPublishedDate(new Date().toISOString().split("T")[0]);
    setContent(""); setImageUrl("/assets/logo-lpm.webp"); setPdfAttachmentUrl("-"); setSections([]);
    setIsPublished(true);
    setShowModal(true);
  }

  function openEditModal(feed: FeedItem) {
    setEditId(feed.id); setTitle(feed.title); setCategory(feed.category);
    setPublishedDate(feed.publishedDate); setContent(feed.content);
    setImageUrl(feed.imageUrl || ""); setPdfAttachmentUrl(feed.pdfAttachmentUrl || "-");
    setSections(Array.isArray(feed.sections) ? feed.sections : []);
    setIsPublished(feed.isPublished !== false);
    setShowModal(true);
  }

  function handleAddSection(type: "text" | "pdf_viewer" | "heading") {
    if (type === "heading") setSections([...sections, { type: "heading", text: "Judul Seksi Baru" }]);
    else if (type === "text") setSections([...sections, { type: "text", title: "Seksi Teks Tambahan", content: "" }]);
    else setSections([...sections, { type: "pdf_viewer", url: "https://www.w3.org/WSI/pdf/n3-spec.pdf" }]);
  }

  function handleRemoveSection(idx: number) { setSections(sections.filter((_, i) => i !== idx)); }

  function handleSectionUpdate(idx: number, field: string, value: string) {
    const updated = [...sections];
    const target = updated[idx];
    if (target && (field === "text" || field === "title" || field === "content" || field === "url")) {
      (target as unknown as Record<string, string>)[field] = value;
    }
    setSections(updated);
  }

  // ── Drag & drop reorder sections (native HTML5) ─────────────────────────
  function handleDragStartSection(idx: number) { setDragIndex(idx); }

  function handleDragOverSection(e: React.DragEvent<HTMLDivElement>, idx: number) {
    e.preventDefault();
    if (dragIndex === null || dragIndex === idx) return;
    const reordered = [...sections];
    const [moved] = reordered.splice(dragIndex, 1);
    reordered.splice(idx, 0, moved);
    setDragIndex(idx);
    setSections(reordered);
  }

  function handleDropSection(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragIndex(null);
  }

  // ── File upload (gambar sampul / PDF seksi) ─────────────────────────────
  async function handleUploadFile(e: React.ChangeEvent<HTMLInputElement>, target: "image" | "pdf", idx?: number) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploading({ target, idx });
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/uploads", { method: "POST", body: fd });
      const json = await res.json();
      if (json.success && json.url) {
        if (target === "image") { setImageUrl(json.url); }
        else if (idx !== undefined) { handleSectionUpdate(idx, "url", json.url); }
      } else {
        alert(json.error || "Upload gagal");
      }
    } catch {
      alert("Upload gagal. Pastikan server berjalan.");
    } finally {
      setUploading(null);
    }
  }

  // ── Toggle publish status (draft ↔ published) ──────────────────────────
  async function handleTogglePublish(feed: FeedItem) {
    const next = feed.isPublished === false;
    try {
      await fetch(`/api/feeds/${feed.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: next }),
      });
      setFeeds(feeds.map((f) => (f.id === feed.id ? { ...f, isPublished: next } : f)));
    } catch { alert("Gagal mengubah status publish"); }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const url = editId ? `/api/feeds/${editId}` : "/api/feeds";
      const method = editId ? "PUT" : "POST";
      await fetch(url, { method, headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, category, publishedDate, content, imageUrl, pdfAttachmentUrl, sections, isPublished }) });
      setShowModal(false); fetchFeeds();
    } catch { alert(editId ? "Gagal memperbarui feed" : "Gagal menyimpan feed"); }
  }

  async function handleDelete(id: number) {
    if (!confirm("Yakin ingin menghapus feed ini?")) return;
    try { await fetch(`/api/feeds/${id}`, { method: "DELETE" }); fetchFeeds(); } catch { alert("Gagal menghapus feed"); }
  }

  const filteredFeeds = feeds.filter((f) => {
    const matchesQuery = f.title.toLowerCase().includes(searchQuery.toLowerCase()) || f.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      draftFilter === "all" ||
      (draftFilter === "published" && f.isPublished !== false) ||
      (draftFilter === "draft" && f.isPublished === false);
    return matchesQuery && matchesStatus;
  });

  const publishedCount = feeds.filter((f) => f.isPublished !== false).length;
  const draftCount = feeds.length - publishedCount;
return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <span className="text-xs uppercase font-bold text-amber-500 tracking-wider block">Kelola Media & Informasi</span>
          <h1 className="text-xl font-bold text-slate-900">CMS Berita & Pengumuman LPM</h1>
        </div>
        <button onClick={() => setShowModal(true)} className="inline-flex items-center space-x-2 bg-emerald-900 hover:bg-emerald-950 text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors">
          <Plus className="w-4 h-4 text-amber-400" /><span>Tambah Feed Baru</span>
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center gap-3">
        <Search className="w-4 h-4 text-slate-400 shrink-0" />
        <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Cari berita atau pengumuman..." className="flex-1 min-w-[180px] text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-900" />
        <select value={draftFilter} onChange={(e) => setDraftFilter(e.target.value)} className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-900">
          <option value="all">Semua Status ({feeds.length})</option>
          <option value="published">Published ({publishedCount})</option>
          <option value="draft">Draft ({draftCount})</option>
        </select>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase">
              <th className="py-3 px-4">Judul</th><th className="py-3 px-4">Kategori</th><th className="py-3 px-4">Status</th><th className="py-3 px-4">Tanggal</th><th className="py-3 px-4">Views</th><th className="py-3 px-4">Layout</th><th className="py-3 px-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
            {filteredFeeds.map((feed) => (
              <tr key={feed.id} className={`hover:bg-slate-50 ${feed.isPublished === false ? "bg-amber-50/40" : ""}`}>
                <td className="py-3 px-4 font-semibold text-slate-900 max-w-xs truncate">{feed.title}</td>
                <td className="py-3 px-4"><span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold">{feed.category}</span></td>
                <td className="py-3 px-4">
                  <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-bold border ${feed.isPublished === false ? "bg-amber-100 text-amber-800 border-amber-300" : "bg-emerald-50 text-emerald-800 border-emerald-200"}`}>
                    {feed.isPublished === false ? <><EyeOff className="w-3 h-3" /><span>Draft</span></> : <><Eye className="w-3 h-3" /><span>Published</span></>}
                  </span>
                </td>
                <td className="py-3 px-4 text-slate-500">{feed.publishedDate}</td>
                <td className="py-3 px-4 font-semibold text-amber-600">{feed.viewCount} views</td>
                <td className="py-3 px-4 text-slate-500">{feed.sections ? feed.sections.length : 0} seksi</td>
                <td className="py-3 px-4 text-right whitespace-nowrap">
                  <button onClick={() => setPreviewFeed(feed)} title="Preview" className="p-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-md inline-flex mr-1"><Eye className="w-3.5 h-3.5" /></button>
                  <button onClick={() => openEditModal(feed)} title="Edit" className="p-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-md inline-flex mr-1"><Edit3 className="w-3.5 h-3.5" /></button>
                  <button onClick={() => handleTogglePublish(feed)} title={feed.isPublished === false ? "Publikasikan" : "Arsipkan sebagai draft"} className="p-1.5 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-md inline-flex mr-1">
                    {feed.isPublished === false ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>
                  <button onClick={() => handleDelete(feed.id)} title="Hapus" className="p-1.5 bg-red-50 text-red-700 hover:bg-red-100 rounded-md inline-flex"><Trash2 className="w-3.5 h-3.5" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
{showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <h2 className="text-base font-bold text-slate-900">{editId ? `Edit Feed (ID: ${editId})` : "Tambah Feed Baru (CMS)"}</h2>
              <button onClick={() => setShowModal(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div><label className="font-bold text-slate-700 block mb-1">Judul</label><input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full p-2.5 border border-slate-200 rounded-lg" /></div>
              <div className="grid grid-cols-3 gap-4">
                <div><label className="font-bold text-slate-700 block mb-1">Kategori</label><select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-2.5 border border-slate-200 rounded-lg"><option value="Berita">Berita</option><option value="Pengumuman">Pengumuman</option><option value="Event">Event</option></select></div>
                <div><label className="font-bold text-slate-700 block mb-1">Tanggal</label><input type="date" value={publishedDate} onChange={(e) => setPublishedDate(e.target.value)} className="w-full p-2.5 border border-slate-200 rounded-lg" /></div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Status</label>
                  <select value={isPublished ? "published" : "draft"} onChange={(e) => setIsPublished(e.target.value === "published")} className="w-full p-2.5 border border-slate-200 rounded-lg">
                    <option value="published">Published (publik)</option>
                    <option value="draft">Draft (tersembunyi)</option>
                  </select>
                </div>
              </div>
              <div><label className="font-bold text-slate-700 block mb-1">Konten</label><TiptapEditor content={content} onChange={setContent} placeholder="Mulai menulis isi berita... gunakan toolbar untuk format teks bergaya WYSIWYG." minHeight="min-h-[160px]" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Gambar Sampul</label>
                  <div className="flex space-x-2">
                    <input type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="/uploads/... atau URL eksternal" className="flex-1 p-2.5 border border-slate-200 rounded-lg" />
                    <label className="shrink-0 cursor-pointer inline-flex items-center justify-center px-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 hover:bg-emerald-100 font-semibold">
                      {uploading?.target === "image" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                      <input type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml" className="hidden" onChange={(e) => handleUploadFile(e, "image")} />
                      <span className="ml-1 text-[11px]">Unggah</span>
                    </label>
                  </div>
                </div>
                <div><label className="font-bold text-slate-700 block mb-1">PDF Lampiran</label><input type="text" value={pdfAttachmentUrl} onChange={(e) => setPdfAttachmentUrl(e.target.value)} placeholder="URL PDF atau '-'" className="w-full p-2.5 border border-slate-200 rounded-lg" /></div>
              </div>
              <div className="border-t pt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 flex items-center space-x-1.5 text-[11px]"><Layers className="w-4 h-4 text-emerald-900" /><span>Seksi Layout (JSONB)</span></span>
                  <div className="flex space-x-1">
                    <button type="button" onClick={() => handleAddSection("heading")} className="px-2 py-1 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded text-[11px] font-semibold">+ Heading</button>
                    <button type="button" onClick={() => handleAddSection("text")} className="px-2 py-1 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded text-[11px] font-semibold">+ Teks</button>
                    <button type="button" onClick={() => handleAddSection("pdf_viewer")} className="px-2 py-1 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded text-[11px] font-semibold">+ PDF</button>
                  </div>
                </div>
                {sections.map((sec, idx) => (
                  <div
                    key={idx}
                    draggable
                    onDragStart={() => handleDragStartSection(idx)}
                    onDragOver={(e) => handleDragOverSection(e, idx)}
                    onDrop={handleDropSection}
                    className={`p-3 bg-slate-50 border rounded-lg transition-colors cursor-grab active:cursor-grabbing ${dragIndex === idx ? "border-emerald-500 ring-1 ring-emerald-200 opacity-60" : "border-slate-200"}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-emerald-900 uppercase text-[10px] flex items-center space-x-1">
                        <GripVertical className="w-3.5 h-3.5 text-slate-400" />
                        {sec.type === "heading" ? <Heading className="w-3 h-3" /> : sec.type === "pdf_viewer" ? <FileText className="w-3 h-3" /> : <ImageIconLucide className="w-3 h-3" />}
                        <span>Seksi {idx + 1}: {sec.type}</span>
                      </span>
                      <button type="button" onClick={() => handleRemoveSection(idx)} className="text-red-600 hover:text-red-800 text-[11px] font-bold">Hapus</button>
                    </div>
                    {sec.type === "heading" && (
                      <input type="text" value={sec.text || ""} onChange={(e) => handleSectionUpdate(idx, "text", e.target.value)} placeholder="Teks heading seksi..." className="w-full p-2 border border-slate-200 rounded-lg text-xs font-semibold bg-white" />
                    )}
                    {sec.type === "text" && (
                      <div className="space-y-2">
                        <input type="text" value={sec.title || ""} onChange={(e) => handleSectionUpdate(idx, "title", e.target.value)} placeholder="Judul seksi teks..." className="w-full p-2 border border-slate-200 rounded-lg text-xs bg-white" />
                        <textarea value={sec.content || ""} onChange={(e) => handleSectionUpdate(idx, "content", e.target.value)} rows={2} placeholder="Isi teks seksi..." className="w-full p-2 border border-slate-200 rounded-lg text-xs bg-white" />
                      </div>
                    )}
                    {sec.type === "pdf_viewer" && (
                      <div className="flex space-x-2">
                        <input type="text" value={sec.url || ""} onChange={(e) => handleSectionUpdate(idx, "url", e.target.value)} placeholder="URL dokumen PDF..." className="flex-1 p-2 border border-slate-200 rounded-lg text-xs bg-white" />
                        <label className="shrink-0 cursor-pointer inline-flex items-center justify-center px-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 hover:bg-emerald-100 font-semibold">
                          {uploading?.target === "pdf" && uploading.idx === idx ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                          <input type="file" accept="application/pdf" className="hidden" onChange={(e) => handleUploadFile(e, "pdf", idx)} />
                          <span className="ml-1 text-[10px]">Unggah</span>
                        </label>
                      </div>
                    )}
                  </div>
                ))}
                {sections.length === 0 && <p className="text-[11px] text-slate-400 italic">Belum ada seksi. Tambahkan heading, blok teks, atau viewer PDF untuk memperkaya layout artikel.</p>}
              </div>
              <div className="flex justify-end space-x-2 pt-4 border-t">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-lg">Batal</button>
                <button type="button" onClick={() => setPreviewFeed({ id: editId ?? 0, title, category, publishedDate, content, imageUrl, pdfAttachmentUrl, viewCount: 0, sections, isPublished })} className="px-4 py-2 bg-slate-200 text-slate-700 font-semibold rounded-lg inline-flex items-center space-x-1"><Eye className="w-3.5 h-3.5" /><span>Preview</span></button>
                <button type="submit" className="px-4 py-2 bg-emerald-900 text-white font-semibold rounded-lg hover:bg-emerald-950">{editId ? "Perbarui Feed" : "Simpan Feed"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {previewFeed && <FeedPreviewModal feed={previewFeed} onClose={() => setPreviewFeed(null)} />}
    </div>
  );
}
