"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ConsultationModal from "@/components/ConsultationModal";
import { Search, Calendar, Clock, ArrowRight, BookOpen } from "lucide-react";

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  published: boolean;
}

export default function ArticlesIndexPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [consultationOpen, setConsultationOpen] = useState(false);

  useEffect(() => {
    async function fetchArticles() {
      try {
        const res = await fetch("/api/admin/articles");
        const data = await res.json();
        if (data.success) {
          // Hanya tampilkan artikel yang statusnya published: true
          const publishedOnly = (data.data || []).filter((a: Article) => a.published);
          setArticles(publishedOnly);
        }
      } catch (e) {
        console.error("Gagal memuat artikel", e);
      } finally {
        setLoading(false);
      }
    }
    fetchArticles();
  }, []);

  const filteredArticles = articles.filter((art) => {
    const matchSearch =
      art.title.toLowerCase().includes(search.toLowerCase()) ||
      art.excerpt.toLowerCase().includes(search.toLowerCase()) ||
      art.category.toLowerCase().includes(search.toLowerCase());
    const matchCat = selectedCategory === "Semua" || art.category === selectedCategory;
    return matchSearch && matchCat;
  });

  const categories = ["Semua", ...Array.from(new Set(articles.map((a) => a.category)))];

  return (
    <main className="min-h-screen bg-[#F5F0E8] text-[#22201D] font-sans selection:bg-[#D5C7B3] selection:text-[#171717]">
      <Navbar onOpenConsultation={() => setConsultationOpen(true)} />

      {/* Header Banner */}
      <section className="bg-[#1C1A17] text-[#F5F0E8] py-16 sm:py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-5xl mx-auto text-center space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C9A36A]/15 text-[#DBC095] border border-[#C9A36A]/30 text-xs font-semibold uppercase tracking-widest">
            <BookOpen className="w-3.5 h-3.5" /> Artikel & Inspiration
          </div>
          <h1 className="font-serif font-bold text-3xl sm:text-5xl text-[#F5F0E8] leading-tight">
            Wawasan Arsitektur & Konstruksi Tropis
          </h1>
          <p className="text-sm sm:text-base text-[#A89F91] max-w-2xl mx-auto leading-relaxed">
            Temukan panduan praktis, tren desain interior, dan tips memilih struktur bangunan terbaik bersama para pakar Grahaloka.
          </p>

          {/* Search Bar */}
          <div className="max-w-md mx-auto mt-8 relative">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-[#8C8275]" />
            <input
              type="text"
              placeholder="Cari kata kunci artikel..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-full bg-[#282420] border border-[#403B35] text-sm text-[#F5F0E8] placeholder-[#8C8275] focus:outline-none focus:border-[#C9A36A] focus:ring-1 focus:ring-[#C9A36A] shadow-inner"
            />
          </div>
        </div>
      </section>

      {/* Category Pills & Article List */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-center gap-2 flex-wrap mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-xs font-semibold tracking-wide transition cursor-pointer ${
                selectedCategory === cat
                  ? "bg-[#22201D] text-[#F5F0E8] shadow-md"
                  : "bg-white/80 text-[#544F48] hover:bg-white border border-[#E3DACD]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="py-20 text-center text-[#8C8275]">Memuat artikel terbaru...</div>
        ) : filteredArticles.length === 0 ? (
          <div className="text-center py-20 bg-white/60 border border-[#E3DACD] rounded-3xl p-8">
            <p className="font-serif font-bold text-xl text-[#22201D]">Belum Ada Artikel</p>
            <p className="text-sm text-[#666057] mt-1">Coba gunakan kata kunci atau kategori lain.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map((art) => (
              <article
                key={art.id}
                className="bg-white border border-[#E3DACD] rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-52 overflow-hidden bg-[#E8DFD3]">
                    {/* eslint-disable-next-html-element-suppression */}
                    <img
                      src={art.coverImage}
                      alt={art.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute top-4 left-4 bg-[#22201D]/80 backdrop-blur-md text-[#E8DFD3] text-[11px] font-semibold uppercase tracking-wider px-3 py-1 rounded-full border border-white/20">
                      {art.category}
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center gap-4 text-xs text-[#787065] mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-[#C9A36A]" /> {art.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#C9A36A]" /> {art.readTime}
                      </span>
                    </div>

                    <h2 className="font-serif font-bold text-xl text-[#22201D] group-hover:text-[#8C7A6B] transition line-clamp-2 mb-3 leading-snug">
                      {art.title}
                    </h2>

                    <p className="text-xs text-[#544F48] line-clamp-3 leading-relaxed mb-4">{art.excerpt}</p>
                  </div>
                </div>

                <div className="p-6 pt-0 border-t border-[#F2ECE3] mt-2 flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#787065]">{art.author}</span>
                  <a
                    href={`/artikel/${art.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#8C7A6B] group-hover:text-[#22201D] transition"
                  >
                    Baca Selengkapnya <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <Footer onOpenConsultation={() => setConsultationOpen(true)} />
      <ConsultationModal isOpen={consultationOpen} onClose={() => setConsultationOpen(false)} />
    </main>
  );
}
