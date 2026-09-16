"use client";

import React, { useEffect, useState } from "react";
import TopHeader from "@/components/public/TopHeader";
import Header from "@/components/public/Header";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronRight, Search, ArrowLeft } from "lucide-react";
import FeedArticle from "@/components/public/FeedArticle";

interface FeedSection {
  type: string;
  text?: string;
  title?: string;
  content?: string;
  url?: string;
  images?: string[];
}

interface FeedDetail {
  id: number;
  title: string;
  category: string;
  publishedDate: string;
  content: string;
  imageUrl?: string;
  pdfAttachmentUrl: string;
  viewCount: number;
  sections: FeedSection[];
}

export default function FeedDetailPage() {
  const params = useParams();
  const feedId = params?.id as string;
  const [feed, setFeed] = useState<FeedDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!feedId) return;
    fetch(`/api/feeds/${feedId}/view`, { method: "POST" }).catch(() => {});
    fetch(`/api/feeds/${feedId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setFeed(data.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [feedId]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900">
      <TopHeader />
      <Header />
      <Navbar />

      <div className="bg-emerald-950 text-white py-6 px-4 border-b-4 border-amber-500">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center space-x-2 text-xs text-emerald-300 mb-1">
            <Link href="/" className="hover:text-amber-400">Beranda</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/feeds" className="hover:text-amber-400">Feeds</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-amber-400 font-medium line-clamp-1">{feed ? feed.title : "Detail"}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full py-8 px-4 md:px-8 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 bg-white p-6 rounded-lg border border-slate-200 shadow-sm space-y-6">
            {loading ? (
              <div className="py-12 text-center text-slate-500 text-sm">Memuat artikel...</div>
            ) : feed ? (
              <>
                <FeedArticle feed={feed} />

                <div className="pt-4 border-t flex justify-between">
                  <Link href="/feeds" className="inline-flex items-center space-x-1 text-xs font-bold text-emerald-800">
                    <ArrowLeft className="w-3.5 h-3.5" /><span>Kembali ke Feeds</span>
                  </Link>
                </div>
              </>
            ) : (
              <div className="py-12 text-center text-rose-600 text-sm">Artikel tidak ditemukan.</div>
            )}
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
              <h3 className="text-xs font-bold text-slate-900 border-b pb-3 mb-4 flex items-center space-x-2">
                <Search className="w-4 h-4 text-emerald-800" />
                <span>Pencarian</span>
              </h3>
              <input type="text" placeholder="Ketik kata kunci..." className="w-full bg-slate-50 border rounded px-3 py-1.5 text-xs text-slate-900 focus:outline-none" />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
