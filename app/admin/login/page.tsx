"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, ArrowRight, ShieldCheck, Key } from "lucide-react";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        router.push("/admin");
      } else {
        setError(data.message || "Password salah!");
      }
    } catch {
      setError("Gagal terhubung ke server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1F1D1A] text-[#F5F0E8] flex items-center justify-center p-4 selection:bg-[#C9A36A] selection:text-[#171717]">
      <div className="w-full max-w-md bg-[#292622] border border-[#3D3833] rounded-2xl p-8 shadow-2xl backdrop-blur-sm relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#C9A36A]/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#C9A36A]/15 text-[#DBC095] border border-[#C9A36A]/30 mb-4 shadow-inner">
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight font-serif text-[#F5F0E8]">
            Admin CMS Grahaloka
          </h1>
          <p className="text-sm text-[#A89F91] mt-1">
            Masukan password pengelola untuk mengedit konten & artikel
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-lg bg-red-950/60 border border-red-800/80 text-red-200 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#C9A36A] mb-2 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5" /> Password Admin
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan password admin..."
              className="w-full px-4 py-3.5 rounded-xl bg-[#191715] border border-[#3D3833] text-[#F5F0E8] placeholder-[#787065] focus:outline-none focus:border-[#C9A36A] focus:ring-1 focus:ring-[#C9A36A] transition duration-200"
              required
            />
            <p className="text-[11px] text-[#8C8275] mt-2 flex items-start gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C9A36A] shrink-0 mt-0.5" />
              <span>Untuk perubahan atau pergantian password admin, harap hubungi pemilik website terlebih dahulu.</span>
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#C9A36A] to-[#B38B52] hover:from-[#DBC095] hover:to-[#C9A36A] text-[#191715] font-semibold flex items-center justify-center gap-2 shadow-lg shadow-[#C9A36A]/10 transition duration-200 disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Memverifikasi..." : "Masuk ke Dashboard"}
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-[#3D3833] text-center">
          <a
            href="/"
            className="text-xs text-[#A89F91] hover:text-[#C9A36A] transition"
          >
            ← Kembali ke Website Grahaloka
          </a>
        </div>
      </div>
    </div>
  );
}
