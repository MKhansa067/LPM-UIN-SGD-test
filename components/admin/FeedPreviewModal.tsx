"use client";

import React from "react";
import { X, Eye } from "lucide-react";
import FeedArticle, { type FeedArticleData } from "@/components/public/FeedArticle";

interface Props {
  feed: FeedArticleData;
  onClose: () => void;
}

/**
 * Modal preview yang merender artikel persis seperti halaman publik
 * (/feeds/[id]) — termasuk konten HTML TipTap, sections, dan attachment PDF.
 * Dipakai untuk melihat hasil draft sebelum dipublikasikan.
 */
export default function FeedPreviewModal({ feed, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-[60] bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-6 py-3 border-b border-slate-200 bg-slate-50 shrink-0">
          <div className="flex items-center space-x-2 text-xs text-slate-600">
            <Eye className="w-4 h-4 text-emerald-800" />
            <span className="font-bold uppercase tracking-wider">Preview Artikel</span>
            <span className="text-slate-400">— tampilan publik (belum disimpan)</span>
          </div>
          <button onClick={onClose} title="Tutup Preview" className="p-1.5 rounded hover:bg-slate-200 text-slate-500">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-y-auto px-6 py-6">
          {feed.title ? (
            <FeedArticle feed={feed} showViewCount={false} />
          ) : (
            <div className="py-16 text-center text-slate-400 text-sm">
              Preview kosong — isi judul dan konten untuk melihat pratinjau artikel.
            </div>
          )}
        </div>

        <div className="flex justify-between items-center px-6 py-3 border-t border-slate-200 bg-slate-50 shrink-0">
          <span className="text-[11px] text-slate-400">Render identik dengan halaman publik /feeds/[id]</span>
          <button onClick={onClose} className="px-4 py-2 bg-emerald-900 text-white font-semibold rounded-lg hover:bg-emerald-950 text-xs">
            Tutup Preview
          </button>
        </div>
      </div>
    </div>
  );
}