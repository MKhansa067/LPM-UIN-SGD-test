"use client";

import React from "react";
import TopHeader from "@/components/public/TopHeader";
import Header from "@/components/public/Header";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import Link from "next/link";
import { ChevronRight, Users, Target, Eye, Building2, Sparkles, Phone, Mail, MapPin } from "lucide-react";

const puskes = [
  {
    name: "Pusat Pengembangan Standar Mutu",
    desc: "Menyusun, menetapkan, dan mengembangkan standar mutu SPMI di lingkungan UIN Sunan Gunung Djati Bandung.",
    duties: ["Perumusan kebijakan SPMI", "Penyusunan standar mutu perguruan tinggi", "Pengembangan manual dan instrumen SPMI"],
    icon: Sparkles,
  },
  {
    name: "Pusat Audit & Pengendalian Mutu",
    desc: "Melaksanakan audit mutu internal (AMI), monitoring, dan evaluasi capaian standar mutu secara berkala.",
    duties: ["Pelaksanaan AMI tahunan", "Monitoring & evaluasi capaian SPMI", "Tindak lanjut hasil audit"],
    icon: Target,
  },
  {
    name: "Pusat Pendampingan & Akreditasi",
    desc: "Memberikan pendampingan persiapan akreditasi nasional maupun internasional bagi seluruh program studi.",
    duties: ["Pendampingan akreditasi BAN-PT & LAM", "Penyiapan LKPS dan LED", "Monev akreditasi per triwulan"],
    icon: Eye,
  },
];

const visiPoints = [
  "Menjadi pusat keunggulan penjaminan mutu perguruan tinggi islam di tingkat nasional",
  "Mewujudkan budaya mutu yang berkelanjutan di seluruh program studi",
  "Mengembangkan sistem penjaminan mutu yang adaptif dan berstandar internasional",
];

const misiPoints = [
  "Menyelenggarakan SPMI yang terintegrasi dan berkelanjutan sesuai siklus PPEPP",
  "Meningkatkan kapasitas auditor dan pengelola mutu di lingkungan universitas",
  "Mendorong pencapaian akreditasi unggul dan sertifikasi internasional seluruh prodi",
  "Mengembangkan budaya mutu berbasis data dan teknologi informasi",
];

export default function TentangKamiPage() {
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
            <span className="text-amber-400 font-medium">Tentang Kami</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold">Tentang Lembaga Penjaminan Mutu</h1>
          <p className="text-xs text-emerald-200 mt-1 max-w-2xl">
            LPM UIN SGD Bandung adalah lembaga yang bertanggung jawab menyelenggarakan
            Sistem Penjaminan Mutu Internal (SPMI) di lingkungan universitas.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full py-8 px-4 md:px-8 flex-1 space-y-10">
        {/* Visi & Misi */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-emerald-950 text-white rounded-xl p-6 border border-emerald-900 shadow-sm">
            <div className="flex items-center space-x-2 mb-4">
              <Eye className="w-5 h-5 text-amber-400" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-amber-400">Visi</h2>
            </div>
            <p className="text-xs text-emerald-100 leading-relaxed">
              Terwujudnya budaya mutu akademik yang unggul, islami, dan berstandar
              internasional di lingkungan UIN Sunan Gunung Djati Bandung.
            </p>
            <ul className="mt-4 space-y-2">
              {visiPoints.map((p, i) => (
                <li key={i} className="flex items-start space-x-2 text-[11px] text-emerald-200">
                  <span className="h-1.5 w-1.5 bg-amber-400 rounded-full mt-1 shrink-0" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
<div className="lg:col-span-7 bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center space-x-2 mb-4">
              <Target className="w-5 h-5 text-emerald-800" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-900">Misi</h2>
            </div>
            <ul className="space-y-3">
              {misiPoints.map((m, i) => (
                <li key={i} className="flex items-start space-x-3">
                  <span className="shrink-0 w-5 h-5 bg-emerald-100 text-emerald-900 rounded-full flex items-center justify-center text-[10px] font-bold">
                    {i + 1}
                  </span>
                  <span className="text-xs text-slate-700 leading-relaxed">{m}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Struktur Organisasi */}
        <div>
          <div className="flex items-center space-x-2 mb-5 pb-3 border-b border-slate-200">
            <Building2 className="w-5 h-5 text-emerald-900" />
            <h2 className="text-sm md:text-base font-bold text-slate-900">Struktur Organisasi LPM</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {puskes.map((p, i) => {
              const Icon = p.icon;
              return (
                <div key={i} className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                  <div className="bg-emerald-900 text-white px-4 py-3 flex items-center space-x-2">
                    <Icon className="w-5 h-5 text-amber-400" />
                    <span className="text-xs font-bold">{p.name}</span>
                  </div>
                  <div className="p-4 space-y-3">
                    <p className="text-[11px] text-slate-600 leading-relaxed">{p.desc}</p>
                    <ul className="space-y-1.5">
                      {p.duties.map((d, j) => (
                        <li key={j} className="flex items-start space-x-2 text-[11px] text-slate-700">
                          <span className="h-1.5 w-1.5 bg-amber-500 rounded-full mt-1.5 shrink-0" />
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Kontak */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <h2 className="text-sm font-bold text-slate-900 mb-4 flex items-center space-x-2">
            <Users className="w-4 h-4 text-emerald-800" />
            <span>Kontak Lembaga</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-700">
            <div className="flex items-start space-x-2 p-3 bg-slate-50 rounded-lg">
              <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">Alamat</span>
                <span className="text-slate-600">Gedung Rektorat Lt. 3, Jl. A.H. Nasution No. 105, Cipadung, Bandung</span>
              </div>
            </div>
            <div className="flex items-start space-x-2 p-3 bg-slate-50 rounded-lg">
              <Phone className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">Telepon</span>
                <span className="text-slate-600">(022) 7800525</span>
              </div>
            </div>
            <div className="flex items-start space-x-2 p-3 bg-slate-50 rounded-lg">
              <Mail className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">Email</span>
                <span className="text-slate-600">lpm@uinsgd.ac.id</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}