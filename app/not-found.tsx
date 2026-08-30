import React from "react";
import Link from "next/link";
import { Home, FileText, ArrowLeft, Search, Layers } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "404 - Halaman Tidak Ditemukan | Grahaloka Architecture & Build",
  description: "Maaf, halaman yang Anda cari tidak ditemukan atau telah dipindahkan. Kembali ke beranda Grahaloka Studio.",
  robots: "noindex, follow",
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#171614] text-[#F5F0E8] flex flex-col justify-between selection:bg-[#C9A36A] selection:text-[#171717]">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col items-center justify-center text-center my-auto">
        <div className="relative mb-6">
          <span className="font-serif text-8xl md:text-9xl font-bold tracking-widest text-[#2A2621] select-none">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="px-4 py-1.5 rounded-full bg-[#C9A36A]/20 border border-[#C9A36A]/40 text-[#DBC095] text-xs font-bold uppercase tracking-widest backdrop-blur-md">
              Halaman Tidak Ditemukan
            </span>
          </div>
        </div>

        <h1 className="font-serif text-3xl md:text-5xl font-bold text-[#F5F0E8] mb-4 leading-tight">
          Oops! Halaman Yang Anda Cari Tidak Ada
        </h1>

        <p className="text-sm md:text-base text-[#A89F91] max-w-lg mb-8 leading-relaxed font-light">
          Halaman tersebut mungkin telah dipindahkan, diubah namanya, atau tidak pernah ada. Silakan kembali ke beranda atau telusuri konten populer kami di bawah ini.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
          <Link
            href="/"
            className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#C9A36A] to-[#B38B52] hover:from-[#DBC095] hover:to-[#C9A36A] text-[#141311] font-bold text-sm flex items-center gap-2 shadow-lg shadow-[#C9A36A]/10 transition duration-200"
          >
            <Home className="w-4 h-4" /> Kembali ke Beranda
          </Link>

          <Link
            href="/artikel"
            className="px-6 py-3.5 rounded-xl bg-[#292521] hover:bg-[#38332E] text-[#D5C7B3] font-semibold text-sm flex items-center gap-2 border border-[#403B35] transition duration-200"
          >
            <FileText className="w-4 h-4 text-[#C9A36A]" /> Baca Artikel Blog
          </Link>
        </div>

        {/* Quick Links Box */}
        <div className="w-full bg-[#1C1A17] border border-[#332F2A] rounded-2xl p-6 text-left space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#C9A36A] flex items-center gap-2">
            <Layers className="w-4 h-4" /> Halaman Populer Grahaloka:
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Link
              href="/#services"
              className="p-3 rounded-xl bg-[#24211D] hover:bg-[#2F2B26] border border-[#38332E] transition flex flex-col gap-1 group"
            >
              <span className="text-xs font-bold text-[#F5F0E8] group-hover:text-[#C9A36A] transition">
                Layanan Utama
              </span>
              <span className="text-[11px] text-[#8C8275]">Arsitek, Kontraktor & Drafter</span>
            </Link>

            <Link
              href="/#estimator"
              className="p-3 rounded-xl bg-[#24211D] hover:bg-[#2F2B26] border border-[#38332E] transition flex flex-col gap-1 group"
            >
              <span className="text-xs font-bold text-[#F5F0E8] group-hover:text-[#C9A36A] transition">
                Kalkulator Estimator
              </span>
              <span className="text-[11px] text-[#8C8275]">Hitung biaya konstruksi villa/rumah</span>
            </Link>

            <Link
              href="/#process"
              className="p-3 rounded-xl bg-[#24211D] hover:bg-[#2F2B26] border border-[#38332E] transition flex flex-col gap-1 group"
            >
              <span className="text-xs font-bold text-[#F5F0E8] group-hover:text-[#C9A36A] transition">
                Alur Kerja Studio
              </span>
              <span className="text-[11px] text-[#8C8275]">Tahapan pengerjaan 2D, 3D & BoQ</span>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
