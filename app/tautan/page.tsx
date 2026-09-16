"use client";

import React from "react";
import TopHeader from "@/components/public/TopHeader";
import Header from "@/components/public/Header";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import Link from "next/link";
import { ChevronRight, ExternalLink, Building2, GraduationCap, Landmark, BookOpen, Globe, ShieldCheck } from "lucide-react";

interface TautanLink {
  name: string;
  url: string;
  desc: string;
}

interface TautanCategory {
  title: string;
  icon: string;
  bgColor: string;
  links: TautanLink[];
}

const tautanData: TautanCategory[] = [
  {
    title: "Lembaga & Kementerian",
    icon: "landmark",
    bgColor: "bg-emerald-900",
    links: [
      { name: "Kementerian Agama RI", url: "https://kemenag.go.id", desc: "Portal resmi Kementerian Agama Republik Indonesia" },
      { name: "Kementerian Pendidikan Tinggi", url: "https://dikti.kemdikbud.go.id", desc: "Direktorat Jenderal Pendidikan Tinggi" },
      { name: "BAN-PT", url: "https://banpt.or.id", desc: "Badan Akreditasi Nasional Perguruan Tinggi" },
      { name: "LAM INFOKOM", url: "https://laminfokom.org", desc: "Lembaga Akreditasi Mandiri Informatika & Komputer" },
      { name: "LAMDIK", url: "https://lamdik.or.id", desc: "Lembaga Akreditasi Mandiri Pendidikan" },
    ],
  },
  {
    title: "UIN Sunan Gunung Djati Bandung",
    icon: "building",
    bgColor: "bg-blue-900",
    links: [
      { name: "Portal Resmi UIN SGD", url: "https://uinsgd.ac.id", desc: "Situs resmi UIN Sunan Gunung Djati Bandung" },
      { name: "SIAKAD UIN SGD", url: "https://siakad.uinsgd.ac.id", desc: "Sistem Informasi Akademik Terpadu" },
      { name: "E-Journal UIN SGD", url: "https://ejournal.uinsgd.ac.id", desc: "Portal Jurnal Ilmiah UIN SGD" },
      { name: "Repositori UIN SGD", url: "https://repositori.uinsgd.ac.id", desc: "Perpustakaan Digital & Repositori Skripsi" },
    ],
  },
  {
    title: "Akademik & Penelitian",
    icon: "graduation",
    bgColor: "bg-amber-500",
    links: [
      { name: "Google Scholar", url: "https://scholar.google.com", desc: "Mesin pencari literatur akademik global" },
      { name: "Garuda Kemdikbud", url: "https://garuda.kemdikbud.go.id", desc: "Portal Ristekdikti & Jurnal Bereputasi" },
      { name: "SINTA Ristekdikti", url: "https://sinta.kemdikbud.go.id", desc: "Sistem Informasi Penilaian Angka Kredit" },
      { name: "Scopus", url: "https://www.scopus.com", desc: "Database abstrak & sitasi jurnal internasional" },
    ],
  },
  {
    title: "Standar & Kelembagaan",
    icon: "shield",
    bgColor: "bg-violet-900",
    links: [
      { name: "ISO.org", url: "https://www.iso.org", desc: "Organisasi Standarisasi Internasional" },
      { name: "ISO 9001:2015", url: "https://www.iso.org/standard/62085.html", desc: "Standar Sistem Manajemen Mutu" },
      { name: "UNESCO IESALC", url: "https://iesalc.unesco.org", desc: "Pendidikan Tinggi UNESCO" },
    ],
  },
  {
    title: "Jurnal & Publikasi",
    icon: "book",
    bgColor: "bg-rose-900",
    links: [
      { name: "DOAJ", url: "https://doaj.org", desc: "Direktori Jurnal Akses Terbuka" },
      { name: "OJS UIN SGD", url: "https://ojs.uinsgd.ac.id", desc: "Open Journal Systems UIN SGD" },
      { name: "BRIN", url: "https://brin.go.id", desc: "Badan Riset dan Inovasi Nasional" },
    ],
  },
  {
    title: "Lainnya",
    icon: "globe",
    bgColor: "bg-slate-800",
    links: [
      { name: "PDDikti", url: "https://pddikti.kemdikbud.go.id", desc: "Pangkalan Data Pendidikan Tinggi" },
      { name: "Dikti Kemdikbud", url: "https://dikti.kemdikbud.go.id", desc: "Pendidikan Tinggi & Kemahasiswaan" },
    ],
  },
];

function getIcon(iconName: string) {
  switch (iconName) {
    case "landmark": return Landmark;
    case "building": return Building2;
    case "graduation": return GraduationCap;
    case "shield": return ShieldCheck;
    case "book": return BookOpen;
    case "globe": return Globe;
    default: return Globe;
  }
}

export default function TautanPage() {
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
            <span className="text-amber-400 font-medium">Tautan</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold">Tautan & Portal Resmi</h1>
          <p className="text-xs text-emerald-200 mt-1">
            Kumpulan tautan resmi lembaga, kementerian, akademik, dan portal pendukung SPMI UIN SGD.
          </p>
        </div>
      </div>

<div className="max-w-7xl mx-auto w-full py-8 px-4 md:px-8 flex-1">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2 text-xs text-slate-600">
            <Globe className="w-4 h-4 text-emerald-800" />
            <span className="font-semibold">{tautanData.length} Kategori</span>
            <span className="text-slate-400">•</span>
            <span>{tautanData.reduce((acc, cat) => acc + cat.links.length, 0)} Tautan Resmi</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tautanData.map((cat, catIdx) => {
            const Icon = getIcon(cat.icon);
            return (
              <div key={catIdx} className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
                <div className={`${cat.bgColor} text-white px-4 py-3 flex items-center space-x-2`}>
                  <Icon className="w-5 h-5" />
                  <h2 className="text-sm font-bold">{cat.title}</h2>
                  <span className="ml-auto text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-bold">
                    {cat.links.length}
                  </span>
                </div>

                <ul className="divide-y divide-slate-100">
                  {cat.links.map((link, linkIdx) => (
                    <li key={linkIdx}>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition-colors group"
                      >
                        <div className="min-w-0 pr-2">
                          <span className="text-xs font-bold text-slate-900 group-hover:text-emerald-800 block truncate">
                            {link.name}
                          </span>
                          <span className="text-[10px] text-slate-500 block truncate">
                            {link.desc}
                          </span>
                        </div>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-500 shrink-0 transition-colors" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <div className="mt-8 bg-emerald-50 border border-emerald-200 rounded-lg p-4 flex items-start space-x-3">
          <ShieldCheck className="w-5 h-5 text-emerald-800 shrink-0 mt-0.5" />
          <div className="text-xs text-emerald-800">
            <span className="font-bold block mb-0.5">Catatan Penting</span>
            <p className="text-emerald-700 leading-relaxed">
              Seluruh tautan di atas mengarah ke portal resmi lembaga yang diakui. Jika Anda
              menemukan tautan yang tidak aktif, silakan laporkan ke{" "}
              <span className="font-semibold">lpm@uinsgd.ac.id</span>.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}