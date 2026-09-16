import React from "react";
import TopHeader from "@/components/public/TopHeader";
import Header from "@/components/public/Header";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import Image from "next/image";
import {
  CheckCircle2,
  Target,
  ShieldCheck,
  Building,
} from "lucide-react";

export default function ProfilPage() {
  const centers = [
    {
      name: "Pusat Pengembangan Standar Mutu",
      lead: "Dr. H. Agus Mulyana, M.Ag.",
      desc: "Bertanggung jawab menyusun, mengevaluasi, dan merevisi 32 Standar Mutu UIN SGD Bandung.",
    },
    {
      name: "Pusat Audit & Pengendalian Mutu",
      lead: "Dr. Neneng Nurhasanah, M.Si.",
      desc: "Mengelola siklus Audit Mutu Internal (AMI), RTM, dan pelatihan asesor sertifikasi nasional.",
    },
    {
      name: "Pusat Pendampingan & Akreditasi",
      lead: "Dr. Yudi Febriadi, M.T.",
      desc: "Mendampingi program studi dalam akreditasi BAN-PT, LAM, dan Akreditasi Internasional (ASIIN/FIBAA).",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <TopHeader />
      <Header />
      <Navbar />

      <main className="flex-1">
        {/* Page Hero */}
        <section className="bg-emerald-900 text-white py-12 border-b border-emerald-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Building className="w-4 h-4" />
              <span>Profil Organisasi</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              Lembaga Penjaminan Mutu (LPM) UIN SGD Bandung
            </h1>
            <p className="mt-2 text-slate-200 text-sm max-w-3xl leading-relaxed">
              Mewujudkan Budaya Mutu Akademik Menuju Reputasi Unggul & Akreditasi Berstandar Internasional.
            </p>
          </div>
        </section>

        {/* Sambutan & Visi Misi */}
        <section className="py-12 bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              {/* Sambutan Ketua LPM */}
              <div className="lg:col-span-2 bg-slate-50 border border-slate-200 rounded-xl p-6 shadow-xs">
                <div className="flex items-center space-x-3 mb-4">
                  <Image
                    src="/assets/logo-lpm.webp"
                    alt="LPM Logo"
                    width={48}
                    height={48}
                    className="h-12 w-auto"
                  />
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      Sambutan Ketua LPM UIN SGD Bandung
                    </h2>
                    <p className="text-xs font-semibold text-emerald-900">
                      Prof. Dr. H. Ija Suntana, M.Ag.
                    </p>
                  </div>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed space-y-3">
                  <span className="block">
                    Assalamu’alaikum Warahmatullahi Wabarakatuh.
                  </span>
                  <span className="block">
                    Lembaga Penjaminan Mutu (LPM) UIN Sunan Gunung Djati Bandung berkomitmen mengawal pelaksanaan Sistem Penjaminan Mutu Internal (SPMI) secara berkelanjutan. Melalui penetapan standar mutu yang melampaui SN-Dikti, kami memastikan seluruh proses akademik, penelitian, dan pengabdian masyarakat terlaksana dengan tata kelola yang baik.
                  </span>
                  <span className="block">
                    Dengan semangat <em>Wahdatul 'Ulum</em> dan rekognisi internasional, LPM senantiasa mendampingi seluruh Program Studi untuk meraih peringkat <strong>Akreditasi Unggul</strong> serta sertifikasi internasional.
                  </span>
                </p>
              </div>

              {/* Visi & Misi Ringkas */}
              <div className="bg-emerald-900 text-white rounded-xl p-6 shadow-xs">
                <div className="flex items-center space-x-2 text-amber-400 font-bold text-xs uppercase mb-3">
                  <Target className="w-4 h-4" />
                  <span>Visi Lembaga</span>
                </div>
                <p className="text-xs text-slate-100 font-medium leading-relaxed mb-6">
                  "Menjadi lembaga penjaminan mutu yang profesional, akuntabel, dan inovatif dalam mewujudkan UIN Sunan Gunung Djati Bandung sebagai perguruan tinggi unggul berstandar internasional pada tahun 2030."
                </p>

                <div className="border-t border-emerald-800 pt-4">
                  <h3 className="text-xs font-bold text-amber-400 uppercase mb-2">Misi Utama</h3>
                  <ul className="text-[11px] text-slate-200 space-y-2">
                    <li className="flex items-start space-x-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <span>Pengembangan Standar SPMI terintegrasi.</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <span>Pelaksanaan Audit Mutu Internal (AMI) secara konsisten.</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <span>Pendampingan Akreditasi Nasional & Internasional.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Struktur & Pusat Di Bawah LPM */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-8">
              <span className="text-xs font-bold text-emerald-900 uppercase tracking-widest block mb-1">Struktur Operasional</span>
              <h2 className="text-2xl font-bold text-slate-900">Pusat Pengembangan & Penjaminan Mutu</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {centers.map((center, idx) => (
                <div key={idx} className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs hover:border-emerald-900 transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-emerald-900 text-amber-400 font-bold flex items-center justify-center mb-4">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 mb-1">{center.name}</h3>
                  <p className="text-xs font-semibold text-emerald-900 mb-3">{center.lead}</p>
                  <p className="text-xs text-slate-600 leading-relaxed">{center.desc}</p>
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
