"use client";

import React, { useEffect, useState } from "react";
import { Plus, Shield, Trash2, Search, UserCircle2, X, ShieldAlert } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface AdminUser {
  id: number;
  name: string;
  username: string;
  email: string;
  role: string;
  isActive: boolean;
  lastLogin: string | null;
  createdAt: string;
}

function formatDate(iso: string | null): string {
  if (!iso) return "Belum pernah";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function AdminUsersPage() {
  const { data: session, status } = useSession();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ name: "", username: "", email: "", password: "", role: "admin" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const userRole = (session?.user as { role?: string })?.role || "admin";

  const loadUsers = () => {
    setLoading(true);
    fetch("/api/admin/users")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setUsers(data.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (status === "authenticated" && userRole === "superadmin") {
      loadUsers();
    }
  }, [status, userRole]);

  if (status === "loading") {
    return (
      <div className="p-8 text-center text-xs text-slate-500">
        Memverifikasi hak akses...
      </div>
    );
  }

  // Proteksi Akses Halaman: Hanya Superadmin
  if (userRole !== "superadmin") {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-8 max-w-lg mx-auto my-12 text-center shadow-xs space-y-4">
        <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-base font-bold text-slate-900">Akses Ditolak (Restricted Access)</h2>
        <p className="text-xs text-slate-600 leading-relaxed">
          Halaman <span className="font-semibold text-slate-800">Manajemen Admin</span> hanya dapat diakses oleh <span className="font-bold text-emerald-900">Superadmin</span>. Peran Anda saat ini adalah <span className="font-bold uppercase text-amber-700">{userRole}</span>.
        </p>
        <div className="pt-2">
          <Link
            href="/admin/dashboard"
            className="inline-flex items-center px-4 py-2 bg-emerald-900 text-white font-bold text-xs rounded-lg hover:bg-emerald-800 transition-colors"
          >
            Kembali ke Overview Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const openCreateModal = () => {
    setError("");
    setForm({ name: "", username: "", email: "", password: "", role: "admin" });
    setModalOpen(true);
  };
  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(q.toLowerCase()) ||
      u.username.toLowerCase().includes(q.toLowerCase()) ||
      u.email.toLowerCase().includes(q.toLowerCase())
  );

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.error || "Gagal menambah admin");
        return;
      }
      setModalOpen(false);
      setForm({ name: "", username: "", email: "", password: "", role: "admin" });
      loadUsers();
    } catch {
      setError("Terjadi kesalahan jaringan");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin ingin menghapus admin ini?")) return;
    await fetch(`/api/admin/users?id=${id}`, { method: "DELETE" });
    loadUsers();
  };
return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col md:flex-row gap-3 md:items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-emerald-900 text-white rounded-lg">
            <UserCircle2 className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-900">Manajemen Pengelola Admin</h1>
            <p className="text-[11px] text-slate-500">Kelola akun pengelola mutu</p>
          </div>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center space-x-2 px-4 py-2 bg-emerald-900 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4 text-amber-400" />
          <span>Tambah Admin</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Cari admin berdasarkan nama / username / email..."
            className="pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-emerald-900 focus:outline-none w-full"
          />
        </div>
      </div>
<div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider">
                <th className="py-3 px-4">Admin</th>
                <th className="py-3 px-4">Username</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Login Terakhir</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">Memuat data admin...</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">Tidak ada admin ditemukan.</td>
                </tr>
              ) : (
                filtered.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-slate-900 text-amber-400 flex items-center justify-center text-xs font-bold shrink-0">
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <span className="font-semibold text-slate-900 block truncate">{u.name}</span>
                          <span className="text-[10px] text-slate-400 block truncate">{u.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px]">{u.username}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${u.role === "superadmin" ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center space-x-1 text-[10px] font-bold ${u.isActive ? "text-emerald-600" : "text-slate-400"}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${u.isActive ? "bg-emerald-500" : "bg-slate-300"}`} />
                        <span>{u.isActive ? "Aktif" : "Nonaktif"}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-400">{formatDate(u.lastLogin)}</td>
                    <td className="py-3 px-4 text-center">
                      <button onClick={() => handleDelete(u.id)} className="p-1.5 text-rose-500 hover:bg-rose-50 rounded transition-colors" title="Hapus admin">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center space-x-1">
            <Shield className="w-3.5 h-3.5 text-emerald-900" />
            <span>Akun admin disimpan dengan hashing bcrypt di PostgreSQL</span>
          </div>
          <span>{filtered.length} Admin Terdaftar</span>
        </div>
      </div>
{modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4" onClick={() => setModalOpen(false)}>
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-slate-900">Tambah Admin Baru</h2>
              <button onClick={() => setModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-700 rounded hover:bg-slate-100">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Nama Lengkap</label>
                <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-900 focus:outline-none" placeholder="cth: Admin LPM" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Username</label>
                  <input type="text" required value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-900 focus:outline-none" placeholder="admin_lpm" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Role</label>
                  <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-900 focus:outline-none">
                    <option value="admin">Admin</option>
                    <option value="superadmin">Superadmin</option>
                    <option value="editor">Editor</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Email</label>
                <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-900 focus:outline-none" placeholder="nama@uinsgd.ac.id" />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Password</label>
                <input type="password" required minLength={6} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-900 focus:outline-none" placeholder="Minimal 6 karakter" />
              </div>
              {error && <p className="text-[11px] text-rose-600 font-semibold">{error}</p>}
              <div className="pt-2 flex justify-end space-x-2">
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">Batal</button>
                <button type="submit" disabled={saving} className="px-4 py-2 text-xs font-bold bg-emerald-900 hover:bg-emerald-800 text-white rounded-lg transition-colors disabled:opacity-50">
                  {saving ? "Menyimpan..." : "Simpan Admin"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}