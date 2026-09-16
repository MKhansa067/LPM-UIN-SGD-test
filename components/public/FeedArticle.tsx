"use client";

import React from "react";
import { Calendar, Eye, Download, ImageOff } from "lucide-react";

export interface FeedSectionData {
  type: string;
  text?: string;
  title?: string;
  content?: string;
  url?: string;
  images?: string[];
}

export interface FeedArticleData {
  id?: number;
  title: string;
  category: string;
  publishedDate: string;
  content: string;
  imageUrl?: string;
  pdfAttachmentUrl: string;
  viewCount?: number;
  sections: FeedSectionData[];
}

/**
 * Komponen shared untuk merender konten artikel feed
 * (header info, gambar, konten HTML, sections, dan attachment PDF).
 * Dipakai di halaman publik /feeds/[id] dan di modal preview CMS.
 */
export default function FeedArticle({
  feed,
  showViewCount = true,
}: {
  feed: FeedArticleData;
  showViewCount?: boolean;
}) {
  const isHtml = /<[^>]+>/.test(feed.content || "");
  const showImage = Boolean(feed.imageUrl && feed.imageUrl.trim() !== "");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b pb-3 text-xs text-slate-500">
        <span className={`font-bold px-2 py-0.5 rounded text-white ${feed.category === "Berita" ? "bg-emerald-800" : "bg-amber-600"}`}>
          {feed.category}
        </span>
        <div className="flex items-center space-x-3">
          <span className="flex items-center space-x-1"><Calendar className="w-3.5 h-3.5 text-amber-600" /><span>{feed.publishedDate}</span></span>
          {showViewCount && feed.viewCount !== undefined && (
            <span className="flex items-center space-x-1"><Eye className="w-3.5 h-3.5 text-emerald-600" /><span>{feed.viewCount + 1} views</span></span>
          )}
        </div>
      </div>

      <h1 className="text-xl font-bold text-slate-900 leading-snug">{feed.title}</h1>

      {showImage ? (
        <div className="rounded border border-slate-200 overflow-hidden bg-slate-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={feed.imageUrl} alt={feed.title} className="w-full max-h-72 object-cover" />
        </div>
      ) : (
        <div className="bg-slate-100 border rounded p-6 flex flex-col items-center justify-center text-slate-500">
          <ImageOff className="w-8 h-8 text-slate-400 mb-1" />
          <span className="text-xs font-semibold">Tidak ada gambar sampul</span>
        </div>
      )}

      {/* Konten — mendukung HTML dari TipTap (WYSIWYG) & fallback teks biasa */}
      {isHtml ? (
        <div
          className="text-xs md:text-sm text-slate-700 leading-relaxed prose prose-sm prose-slate max-w-none
            [&_h1]:text-lg [&_h1]:font-bold [&_h1]:text-emerald-950 [&_h1]:mt-4
            [&_h2]:text-base [&_h2]:font-bold [&_h2]:text-emerald-950 [&_h2]:mt-4
            [&_h3]:text-sm [&_h3]:font-bold [&_h3]:text-emerald-950 [&_h3]:mt-3
            [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1
            [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-1
            [&_blockquote]:border-l-4 [&_blockquote]:border-amber-500 [&_blockquote]:bg-slate-50 [&_blockquote]:px-4 [&_blockquote]:py-2 [&_blockquote]:rounded-r
            [&_a]:text-emerald-800 [&_a]:underline [&_img]:rounded-lg [&_img]:max-w-full [&_img]:h-auto [&_img]:border [&_img]:my-2
            [&_p]:my-2 [&_hr]:my-4 [&_code]:bg-slate-100 [&_code]:px-1 [&_code]:rounded [&_code]:text-[11px]"
          dangerouslySetInnerHTML={{ __html: feed.content }}
        />
      ) : (
        <div className="text-xs md:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
          {feed.content}
        </div>
      )}
{/* Dynamic Sections Renderer */}
      {Array.isArray(feed.sections) && feed.sections.length > 0 && (
        <div className="space-y-4">
          {feed.sections.map((section, idx) => {
            if (section.type === "heading") {
              return (
                <h3 key={idx} className="text-sm md:text-base font-bold text-emerald-950 border-l-4 border-amber-500 pl-3 pt-2">
                  {section.text || `Seksi ${idx + 1}`}
                </h3>
              );
            }
            if (section.type === "text") {
              return (
                <div key={idx} className="bg-slate-50 border border-slate-200 rounded p-4">
                  {section.title && <h4 className="text-xs font-bold text-emerald-950 mb-1">{section.title}</h4>}
                  <div className="text-xs md:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                    {section.text || section.content || ""}
                  </div>
                </div>
              );
            }
            if (section.type === "pdf_viewer" && section.url) {
              return (
                <div key={idx} className="bg-emerald-950 text-white rounded p-4 border-l-4 border-amber-500 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-amber-400">DOKUMEN SEKSI {idx + 1}</span>
                    <a href={section.url} target="_blank" rel="noreferrer" className="bg-amber-500 text-slate-950 font-bold px-3 py-1 rounded text-xs inline-flex items-center space-x-1">
                      <Download className="w-3.5 h-3.5" /><span>Unduh</span>
                    </a>
                  </div>
                  <div className="w-full h-64 bg-slate-900 rounded border border-emerald-800 overflow-hidden">
                    <iframe src={`${section.url}#toolbar=0`} className="w-full h-full border-0" title={`PDF Viewer ${idx + 1}`} />
                  </div>
                </div>
              );
            }
            return null;
          })}
        </div>
      )}

      {feed.pdfAttachmentUrl && feed.pdfAttachmentUrl !== "-" && feed.pdfAttachmentUrl !== "" && (
        <div className="bg-emerald-950 text-white rounded p-4 border-l-4 border-amber-500 space-y-3">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-[10px] font-bold text-amber-400">DOKUMEN ATTACHMENT</span>
              <h4 className="text-xs font-bold">Berkas PDF Readable</h4>
            </div>
            <a href={feed.pdfAttachmentUrl} target="_blank" rel="noreferrer" className="bg-amber-500 text-slate-950 font-bold px-3 py-1 rounded text-xs inline-flex items-center space-x-1">
              <Download className="w-3.5 h-3.5" />
              <span>Unduh Lampiran</span>
            </a>
          </div>
          <div className="w-full h-64 bg-slate-900 rounded border border-emerald-800 overflow-hidden">
            <iframe src={`${feed.pdfAttachmentUrl}#toolbar=0`} className="w-full h-full border-0" title="PDF Attachment" />
          </div>
        </div>
      )}
    </div>
  );
}