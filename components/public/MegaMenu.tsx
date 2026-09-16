import React from "react";
import Link from "next/link";
import {
  FileText,
  CheckCircle2,
  BookOpen,
  PieChart,
  Shield,
  Award,
  BarChart2,
  FileCheck,
  ClipboardList,
} from "lucide-react";

interface MegaMenuProps {
  onClose: () => void;
}

export default function MegaMenu({ onClose }: MegaMenuProps) {
  const regulasiItems = [
    { name: "Audit Mutu Internal (AMI)", href: "/dokumen?sub=AMI", desc: "Siklus dan laporan AMI", icon: CheckCircle2 },
    { name: "Audit Mutu Eksternal (AME)", href: "/dokumen?sub=AME", desc: "Hasil akreditasi BAN-PT & LAM", icon: Award },
    { name: "Renstra & RIP LPM", href: "/dokumen?sub=Renstra", desc: "Rencana strategis mutu", icon: BookOpen },
    { name: "Kebijakan Mutu SPMI", href: "/dokumen?sub=Kebijakan", desc: "Peraturan resmi universitas", icon: Shield },
    { name: "Siklus PPEPP", href: "/dokumen?sub=PPEPP", desc: "Alur penjaminan mutu", icon: PieChart },
    { name: "Sertifikasi ISO", href: "/dokumen?sub=Sertifikasi", desc: "Standar mutu ISO 9001:2015", icon: FileCheck },
  ];

  const monevItems = [
    { name: "Laporan Monev Pembelajaran", href: "/dokumen?sub=Monev", desc: "Evaluasi perkuliahan", icon: BarChart2 },
    { name: "Uji Validitas Data SPMI", href: "/dokumen?sub=Validitas", desc: "Verifikasi borang prodi", icon: FileText },
    { name: "Laporan Survei Kepuasan", href: "/dokumen?sub=Survei", desc: "Survei Mahasiswa & Dosen", icon: ClipboardList },
  ];

  return (
    <div
      onMouseLeave={onClose}
      className="absolute top-full left-0 w-full bg-white border-b border-slate-200 shadow-xl z-50 p-6 md:p-8 animate-in fade-in slide-in-from-top-2 duration-150"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Column 1: Dokumen Regulasi */}
        <div>
          <div className="flex items-center space-x-2 pb-3 mb-4 border-b border-slate-200">
            <div className="p-1.5 bg-emerald-100 text-emerald-900 rounded">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Dokumen Regulasi Mutu
              </h3>
              <p className="text-[11px] text-slate-500">
                Pedoman dan kebijakan resmi penjaminan mutu
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {regulasiItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <Link
                  key={idx}
                  href={item.href}
                  onClick={onClose}
                  className="flex items-start space-x-2.5 p-2 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-colors group"
                >
                  <Icon className="w-4 h-4 text-emerald-900 mt-0.5 group-hover:text-amber-500 transition-colors shrink-0" />
                  <div>
                    <span className="text-xs font-semibold text-slate-900 group-hover:text-emerald-900 block">
                      {item.name}
                    </span>
                    <span className="text-[10px] text-slate-500 block leading-tight">
                      {item.desc}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Column 2: Monitoring & Evaluasi */}
        <div>
          <div className="flex items-center space-x-2 pb-3 mb-4 border-b border-slate-200">
            <div className="p-1.5 bg-amber-100 text-amber-900 rounded">
              <BarChart2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Monitoring & Evaluasi (Monev)
              </h3>
              <p className="text-[11px] text-slate-500">
                Laporan evaluasi berkala dan hasil pengawasan
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {monevItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <Link
                  key={idx}
                  href={item.href}
                  onClick={onClose}
                  className="flex items-start space-x-2.5 p-2 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-colors group"
                >
                  <Icon className="w-4 h-4 text-emerald-900 mt-0.5 group-hover:text-amber-500 transition-colors shrink-0" />
                  <div>
                    <span className="text-xs font-semibold text-slate-900 group-hover:text-emerald-900 block">
                      {item.name}
                    </span>
                    <span className="text-[10px] text-slate-500 block leading-tight">
                      {item.desc}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="mt-6 p-3 bg-emerald-900 text-white rounded-lg flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-amber-400 block">
                Pusat Unduhan Dokumen Terpadu
              </span>
              <span className="text-[10px] text-slate-200">
                Akses semua file borang dan regulasi SPMI
              </span>
            </div>
            <Link
              href="/dokumen"
              onClick={onClose}
              className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-900 text-xs font-bold rounded transition-colors"
            >
              Lihat Semua
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
