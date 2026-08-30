import React from "react";
import fs from "fs/promises";
import path from "path";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, Calendar, Clock, User, Share2, Bookmark } from "lucide-react";
import Link from "next/link";

import type { Metadata } from "next";

interface Article {
  id: string;
  title: string;
  slug: string;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  published: boolean;
}

async function getArticleBySlug(slug: string): Promise<Article | null> {
  try {
    const dataPath = path.join(process.cwd(), "data", "articles.json");
    const fileData = await fs.readFile(dataPath, "utf-8");
    const articles: Article[] = JSON.parse(fileData);
    return articles.find((a) => a.slug === slug && a.published) || null;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return {
      title: "Artikel Tidak Ditemukan | Grahaloka",
    };
  }

  return {
    title: article.metaTitle || `${article.title} | Grahaloka`,
    description: article.metaDescription || article.excerpt,
    keywords: article.keywords ? article.keywords.split(",").map((k) => k.trim()) : undefined,
    openGraph: {
      title: article.metaTitle || article.title,
      description: article.metaDescription || article.excerpt,
      images: [article.coverImage],
    },
  };
}

async function getRelatedArticles(currentId: string): Promise<Article[]> {
  try {
    const dataPath = path.join(process.cwd(), "data", "articles.json");
    const fileData = await fs.readFile(dataPath, "utf-8");
    const articles: Article[] = JSON.parse(fileData);
    return articles.filter((a) => a.id !== currentId && a.published).slice(0, 3);
  } catch {
    return [];
  }
}

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const relatedArticles = await getRelatedArticles(article.id);

  return (
    <main className="min-h-screen bg-[#F5F0E8] text-[#22201D] font-sans selection:bg-[#D5C7B3] selection:text-[#171717]">
      <Navbar />

      {/* Back Link Header */}
      <div className="max-w-4xl mx-auto px-4 pt-8">
        <Link
          href="/artikel"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#8C7A6B] hover:text-[#22201D] transition"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Daftar Artikel
        </Link>
      </div>

      {/* Main Article Article Container */}
      <article className="max-w-4xl mx-auto px-4 py-8">
        {/* Category & Metadata */}
        <div className="space-y-4 mb-8 text-center sm:text-left">
          <div className="inline-block px-3 py-1 rounded-full bg-[#8C7A6B]/15 text-[#8C7A6B] text-xs font-bold uppercase tracking-wider">
            {article.category}
          </div>
          <h1 className="font-serif font-bold text-3xl sm:text-4xl md:text-5xl text-[#22201D] leading-tight">
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 sm:gap-6 text-xs text-[#666057] pt-2 border-b border-[#E3DACD] pb-6">
            <span className="flex items-center gap-1.5 font-semibold text-[#22201D]">
              <User className="w-4 h-4 text-[#8C7A6B]" /> {article.author}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[#8C7A6B]" /> {article.date}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#8C7A6B]" /> {article.readTime}
            </span>
          </div>
        </div>

        {/* Cover Image */}
        <div className="relative h-64 sm:h-96 w-full rounded-3xl overflow-hidden shadow-xl mb-10 bg-[#E8DFD3]">
          {/* eslint-disable-next-html-element-suppression */}
          <img
            src={article.coverImage}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content Body */}
        <div className="bg-white border border-[#E3DACD] rounded-3xl p-6 sm:p-10 shadow-sm leading-relaxed space-y-6 text-[#33302B]">
          <p className="text-base sm:text-lg font-medium text-[#403B35] italic border-l-4 border-[#8C7A6B] pl-4 py-1">
            {article.excerpt}
          </p>

          <div className="prose prose-stone max-w-none text-sm sm:text-base leading-relaxed space-y-4 whitespace-pre-line">
            {article.content}
          </div>

          <div className="pt-6 border-t border-[#F2ECE3] flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-[#787065]">
              <Bookmark className="w-4 h-4 text-[#8C7A6B]" /> Diterbitkan oleh Grahaloka
            </div>
            <div className="flex items-center gap-3">
              <button
                className="p-2 rounded-full bg-[#F5F0E8] hover:bg-[#E8DFD3] text-[#22201D] transition cursor-pointer"
                title="Bagikan Artikel"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <div className="mt-16 border-t border-[#E3DACD] pt-12">
            <h3 className="font-serif font-bold text-2xl text-[#22201D] mb-6">Artikel Terkait Lainnya</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {relatedArticles.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/artikel/${rel.slug}`}
                  className="bg-white border border-[#E3DACD] rounded-2xl overflow-hidden hover:shadow-md transition group block"
                >
                  <div className="h-32 bg-[#E8DFD3] overflow-hidden">
                    {/* eslint-disable-next-html-element-suppression */}
                    <img
                      src={rel.coverImage}
                      alt={rel.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                    />
                  </div>
                  <div className="p-4">
                    <span className="text-[10px] font-bold text-[#8C7A6B] uppercase">{rel.category}</span>
                    <h4 className="font-serif font-bold text-sm text-[#22201D] line-clamp-2 mt-1 group-hover:text-[#8C7A6B]">
                      {rel.title}
                    </h4>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>

      <Footer />
    </main>
  );
}
