"use client";

import React, { useState, useEffect, useMemo } from "react";
import TopHeader from "@/components/public/TopHeader";
import Header from "@/components/public/Header";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import Link from "next/link";
import { ChevronRight, PieChart, BarChart2, Loader2 } from "lucide-react";
import { ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

interface AccItem {
  id: number;
  studyProgram: string;
  faculty: string;
  degree: string;
  status: string;
  accreditationBody: string;
  skNumber: string;
  validUntil: string;
  internationalAccredited: boolean;
}

const COLORS = ["#064e3b", "#f59e0b", "#10b981", "#3b82f6", "#8b5cf6", "#ef4444"];

export default function AkreditasiPage() {
  const [data, setData] = useState<AccItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [degree, setDegree] = useState("Semua");

  useEffect(() => {
    let cancelled = false;
    fetch("/api/akreditasi")
      .then((res) => res.json())
      .then((json) => {
        if (cancelled) return;
        if (json.success && Array.isArray(json.data)) setData(json.data);
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const filtered = data.filter((item) => degree === "Semua" || item.degree === degree);

  const pieData = useMemo(() => {
    const counts: Record<string, number> = {};
    data.forEach((d) => { counts[d.status] = (counts[d.status] || 0) + 1; });
    return Object.entries(counts).map(([name, value], i) => ({ name, value, color: COLORS[i % COLORS.length] }));
  }, [data]);

  const barData = useMemo(() => {
    const degrees = Array.from(new Set(data.map((d) => d.degree)));
    return degrees.map((deg) => ({ name: deg, Unggul: data.filter((d) => d.degree === deg && d.status === "Unggul").length }));
  }, [data]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <TopHeader />
      <Header />
      <Navbar />

      <div className="bg-emerald-950 text-white py-8 px-4 border-b-4 border-amber-500">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center space-x-2 text-xs text-emerald-300 mb-1">
            <Link href="/" className="hover:text-amber-400">Beranda</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-amber-400 font-medium">Akreditasi</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold">Dashboard Akreditasi Real-Time</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full py-8 px-4 flex-1 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded border">
            <h3 className="text-xs font-bold mb-3 flex items-center space-x-1"><PieChart className="w-4 h-4 text-emerald-800" /><span>Distribusi Peringkat</span></h3>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={45} label>
                    {pieData.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                  <Tooltip />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-4 rounded border">
            <h3 className="text-xs font-bold mb-3 flex items-center space-x-1"><BarChart2 className="w-4 h-4 text-amber-600" /><span>Per Jenjang</span></h3>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="Unggul" fill="#064e3b" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="bg-white rounded border p-4 space-y-4">
          <div className="flex space-x-2">
            {["Semua", ...Array.from(new Set(data.map((d) => d.degree)))].map((d) => (
              <button key={d} onClick={() => setDegree(d)} className={`px-2 py-1 text-xs font-semibold rounded ${degree === d ? "bg-emerald-900 text-amber-400" : "bg-slate-100"}`}>{d}</button>
            ))}
          </div>

          <table className="w-full text-left text-xs">
            <thead className="bg-emerald-950 text-emerald-100 font-bold uppercase text-[10px]">
              <tr>
                <th className="py-2 px-3">#</th>
                <th className="py-2 px-3">Prodi</th>
                <th className="py-2 px-3">Fakultas</th>
                <th className="py-2 px-3">Jenjang</th>
                <th className="py-2 px-3">Status</th>
                <th className="py-2 px-3">Lembaga</th>
                <th className="py-2 px-3 text-center">SK</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {loading ? (
                <tr><td colSpan={7} className="py-10 text-center"><span className="inline-flex items-center space-x-2 text-slate-400 text-sm"><Loader2 className="w-4 h-4 animate-spin" /><span>Memuat data akreditasi...</span></span></td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={7} className="py-10 text-center text-sm text-slate-400">Belum ada data akreditasi prodi yang ditambahkan oleh admin.</td></tr>
              ) : (
                filtered.map((item, idx) => (
                <tr key={item.id} className="hover:bg-slate-50">
                  <td className="py-2 px-3 font-bold text-slate-400">{idx + 1}</td>
                  <td className="py-2 px-3 font-bold text-slate-900">{item.studyProgram}</td>
                  <td className="py-2 px-3 text-slate-600">{item.faculty}</td>
                  <td className="py-2 px-3 font-bold text-emerald-900">{item.degree}</td>
                  <td className="py-2 px-3 font-bold text-emerald-800">{item.status}</td>
                  <td className="py-2 px-3">{item.accreditationBody}</td>
                  <td className="py-2 px-3 text-center">
                    {item.skNumber && item.skNumber !== "SK-DEFAULT" ? (
                      <span className="text-emerald-800 font-bold text-[11px]">{item.skNumber}</span>
                    ) : (
                      <span className="text-slate-300 text-[11px]">-</span>
                    )}
                  </td>
                </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Footer />
    </div>
  );
}
