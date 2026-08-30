"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, Calendar, Clock } from "lucide-react";

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  category: string;
  date: string;
  readTime: string;
  published: boolean;
}

export default function ArticlesSection() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchArticles() {
      try {
        const res = await fetch("/api/admin/articles");
        const data = await res.json();
        if (data.success) {
          const publishedOnly = (data.data || [])
            .filter((a: Article) => a.published)
            .slice(0, 3);
          setArticles(publishedOnly);
        }
      } catch (e) {
        console.error("Gagal memuat artikel beranda", e);
      } finally {
        setLoading(false);
      }
    }
    fetchArticles();
  }, []);

  if (loading || articles.length === 0) {
    return null; // Sembunyikan jika tidak ada artikel
  }

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#EFEBE4] border-t border-b border-[#E0D7C9]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8C7A6B]/15 text-[#8C7A6B] text-xs font-bold uppercase tracking-widest mb-3">
              <BookOpen className="w-3.5 h-3.5" /> Artikel & Edukasi Tropis
            </div>
            <h2 className="font-serif font-bold text-3xl sm:text-4xl text-[#22201D]">
              Wawasan & Tips Konstruksi Grahaloka
            </h2>
            <p className="text-sm text-[#666057] mt-2 max-w-xl">
              Panduan dari arsitek dan tim proyek kami mengenai perencanaan bangunan, material, dan inspirasi desain.
            </p>
          </div>

          <Link
            href="/artikel"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#22201D] text-[#F5F0E8] hover:bg-[#8C7A6B] text-xs font-semibold tracking-wide transition shadow cursor-pointer self-start md:self-auto"
          >
            Lihat Semua Artikel <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.map((art) => (
            <article
              key={art.id}
              className="bg-white border border-[#E3DACD] rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-48 overflow-hidden bg-[#E8DFD3]">
                  {/* eslint-disable-next-html-element-suppression */}
                  <img
                    src={art.coverImage}
                    alt={art.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute top-4 left-4 bg-[#22201D]/80 backdrop-blur-md text-[#E8DFD3] text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full border border-white/20">
                    {art.category}
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-3 text-xs text-[#787065] mb-2.5">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#8C7A6B]" /> {art.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#8C7A6B]" /> {art.readTime}
                    </span>
                  </div>

                  <h3 className="font-serif font-bold text-lg text-[#22201D] group-hover:text-[#8C7A6B] transition line-clamp-2 mb-2 leading-snug">
                    {art.title}
                  </h3>

                  <p className="text-xs text-[#544F48] line-clamp-3 leading-relaxed">{art.excerpt}</p>
                </div>
              </div>

              <div className="p-6 pt-0 border-t border-[#F2ECE3] mt-2">
                <Link
                  href={`/artikel/${art.slug}`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#8C7A6B] group-hover:text-[#22201D] transition"
                >
                  Baca Selengkapnya <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
