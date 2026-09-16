"use client";

import React, { useState } from "react";
import TopHeader from "@/components/public/TopHeader";
import Header from "@/components/public/Header";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import Link from "next/link";
import { ChevronRight, Download, PieChart, BarChart2 } from "lucide-react";
import { ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

const mockAcc = [
  { id: 1, name: "Teknik Informatika", faculty: "FST", degree: "S1", status: "Unggul", body: "LAM INFOKOM", sk: "SK-042/2025", int: true },
  { id: 2, name: "Sistem Informasi", faculty: "FST", degree: "S1", status: "Unggul", body: "LAM INFOKOM", sk: "SK-112/2024", int: false },
  { id: 3, name: "Pendidikan Agama Islam", faculty: "FTK", degree: "S1", status: "Unggul", body: "LAMDIK", sk: "SK-089/2024", int: true },
  { id: 4, name: "Hukum Keluarga", faculty: "FSH", degree: "S1", status: "Unggul", body: "BAN-PT", sk: "SK-304/2023", int: false },
  { id: 5, name: "Magister PAI", faculty: "Pascasarjana", degree: "S2", status: "Baik Sekali", body: "LAMDIK", sk: "SK-512/2023", int: false },
];

const pieData = [
  { name: "Unggul", value: 4, color: "#064e3b" },
  { name: "Baik Sekali", value: 1, color: "#f59e0b" },
];

const barData = [
  { name: "S1", Unggul: 4 },
  { name: "S2", Unggul: 0 },
];

export default function AkreditasiPage() {
  const [degree, setDegree] = useState("Semua");
  const filtered = mockAcc.filter((item) => degree === "Semua" || item.degree === degree);

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
            {["Semua", "S1", "S2"].map((d) => (
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
              {filtered.map((item, idx) => (
                <tr key={item.id} className="hover:bg-slate-50">
                  <td className="py-2 px-3 font-bold text-slate-400">{idx + 1}</td>
                  <td className="py-2 px-3 font-bold text-slate-900">{item.name}</td>
                  <td className="py-2 px-3 text-slate-600">{item.faculty}</td>
                  <td className="py-2 px-3 font-bold text-emerald-900">{item.degree}</td>
                  <td className="py-2 px-3 font-bold text-emerald-800">{item.status}</td>
                  <td className="py-2 px-3">{item.body}</td>
                  <td className="py-2 px-3 text-center">
                    <a href="#" className="text-emerald-800 font-bold inline-flex items-center space-x-1">
                      <Download className="w-3 h-3" /><span>SK</span>
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Footer />
    </div>
  );
}
