import React from "react";
import fs from "fs/promises";
import path from "path";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import type { Metadata } from "next";

interface CustomPage {
  id: string;
  title: string;
  slug: string;
  metaTitle?: string;
  metaDescription: string;
  keywords?: string;
  headerImage: string;
  content: string;
  published: boolean;
  updatedAt: string;
}

async function getCustomPageBySlug(slug: string): Promise<CustomPage | null> {
  try {
    const dataPath = path.join(process.cwd(), "data", "pages.json");
    const fileData = await fs.readFile(dataPath, "utf-8");
    const pages: CustomPage[] = JSON.parse(fileData);
    return pages.find((p) => p.slug === slug && p.published) || null;
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
  const pageData = await getCustomPageBySlug(slug);

  if (!pageData) {
    return {
      title: "Halaman Tidak Ditemukan | Grahaloka",
    };
  }

  return {
    title: pageData.metaTitle || `${pageData.title} | Grahaloka`,
    description: pageData.metaDescription,
    keywords: pageData.keywords ? pageData.keywords.split(",").map((k) => k.trim()) : undefined,
    openGraph: {
      title: pageData.metaTitle || pageData.title,
      description: pageData.metaDescription,
      images: pageData.headerImage ? [pageData.headerImage] : undefined,
    },
  };
}

export default async function DynamicCustomPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const pageData = await getCustomPageBySlug(slug);

  if (!pageData) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#F5F0E8] text-[#22201D] font-sans selection:bg-[#D5C7B3]">
      <Navbar />

      {/* Header Banner */}
      <section className="bg-[#1C1A17] text-[#F5F0E8] py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center space-y-3 relative z-10">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#C9A36A] hover:underline mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Beranda Grahaloka
          </Link>
          <h1 className="font-serif font-bold text-3xl sm:text-5xl text-[#F5F0E8]">{pageData.title}</h1>
          {pageData.metaDescription && (
            <p className="text-sm sm:text-base text-[#A89F91] max-w-2xl mx-auto">{pageData.metaDescription}</p>
          )}
        </div>
      </section>

      {/* Header Image if available */}
      {pageData.headerImage && (
        <div className="max-w-5xl mx-auto px-4 -mt-8 relative z-20">
          <div className="h-64 sm:h-80 w-full rounded-3xl overflow-hidden shadow-2xl bg-[#E8DFD3]">
            {/* eslint-disable-next-html-element-suppression */}
            <img src={pageData.headerImage} alt={pageData.title} className="w-full h-full object-cover" />
          </div>
        </div>
      )}

      {/* Content Body */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white border border-[#E3DACD] rounded-3xl p-6 sm:p-12 shadow-sm leading-relaxed space-y-6 text-[#33302B] whitespace-pre-line text-sm sm:text-base">
          {pageData.content}
        </div>
      </section>

      <Footer />
    </main>
  );
}
