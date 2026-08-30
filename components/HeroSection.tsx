"use client";

import React, { useState, useEffect } from "react";
import { ArrowRight, Compass, ShieldCheck, Layers } from "lucide-react";

interface HeroSectionProps {
  onOpenConsultation?: () => void;
}

export default function HeroSection({ onOpenConsultation }: HeroSectionProps) {
  const [heroData, setHeroData] = useState({
    badge: "GRAHA LOKA",
    title: "Crafting timeless architecture and interiors with sustainable innovation and craftsmanship in Bali.",
    description: "Premier interior & exterior contractor, 3D architectural rendering studio, CAD drafting, and full-turnkey construction in Bali.",
    ctaText: "Book a Consultation",
    heroImage: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=2800&q=95",
  });

  const [heroCards, setHeroCards] = useState([
    { tag: "01 • Design", title: "Interior & Exterior", desc: "Custom spatial planning, material curation & exterior facade styling." },
    { tag: "02 • Visualization", title: "3D Architecture", desc: "Ultra photorealistic 8K renders, animation & VR walkthroughs." },
    { tag: "03 • Technical", title: "Drafter & BIM", desc: "Architectural CAD blueprints, MEP drafting & permit schematics." },
    { tag: "04 • Execution", title: "General Contractor", desc: "Turnkey construction build, site supervision & structural engineering." },
  ]);

  useEffect(() => {
    async function fetchHeroContent() {
      try {
        const res = await fetch("/api/admin/content");
        const data = await res.json();
        if (data.success) {
          if (data.data?.hero) {
            setHeroData((prev) => ({
              ...prev,
              ...data.data.hero,
            }));
          }
          if (data.data?.heroCards && Array.isArray(data.data.heroCards)) {
            setHeroCards(data.data.heroCards);
          }
        }
      } catch (e) {
        console.error("Gagal memuat konten Hero", e);
      }
    }
    fetchHeroContent();
  }, []);

  return (
    <section id="hero" className="relative pt-0 pb-12 md:pt-0 md:pb-20 bg-[#F5F0E8] overflow-hidden">
      {/* Background shadow & lighting ray effect */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-[#FFFDF9]/60 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Hero Visual Banner */}
      <div className="w-full px-0 mt-0">
        <div className="relative w-full max-w-none rounded-none border-none group">
          {/* Main Visual Image with Seamless Bottom Dark Fade */}
          <div className="relative aspect-[16/10] md:aspect-[21/9] lg:aspect-[2.35/1] w-full min-h-[520px] sm:min-h-[600px] md:min-h-[700px] lg:min-h-[780px] bg-[#2A241E] overflow-hidden rounded-none">
            {/* eslint-disable-next-html-element-suppression */}
            <img
              src={heroData.heroImage || "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=2800&q=95"}
              alt="Hero Visual Space"
              className="w-full h-full object-cover object-center transform group-hover:scale-102 transition-transform duration-1000 ease-out"
            />

            {/* Left-to-right subtle scrim overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/25 to-transparent pointer-events-none" />

            {/* Subtle low-height bottom fade */}
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#2A241E] via-[#2A241E]/40 to-transparent pointer-events-none" />

            {/* Soft Ambient Light Texture */}
            <div className="absolute inset-0 opacity-15 mix-blend-soft-light bg-[radial-gradient(#FFFDF9_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

            {/* Content OVERLAY INSIDE THE IMAGE */}
            <div className="absolute inset-0 flex flex-col justify-center items-start text-left px-6 sm:px-12 md:px-16 lg:px-20 py-12 z-10">
              <div className="max-w-lg lg:max-w-2xl space-y-5">
                <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-normal tracking-tight text-white leading-[1.2] drop-shadow-md">
                  <span className="block font-sans text-xs sm:text-sm font-bold tracking-[0.35em] uppercase text-[#D5C7B3] mb-2.5">
                    {heroData.badge}
                  </span>
                  {heroData.title}
                </h1>

                <p className="text-xs sm:text-sm md:text-base text-[#F5F0E8]/90 leading-relaxed max-w-lg font-sans font-light drop-shadow-sm">
                  {heroData.description}
                </p>

                <div className="pt-2">
                  <button
                    onClick={() => onOpenConsultation?.()}
                    className="bg-[#1A1917] text-[#F5F0E8] hover:bg-black hover:text-white px-7 py-3.5 rounded-full text-xs md:text-sm font-medium active:scale-95 transition-all shadow-xl inline-flex items-center gap-2.5 group cursor-pointer border border-white/20"
                  >
                    <span>{heroData.ctaText}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform text-[#D5C7B3]" />
                  </button>
                </div>
              </div>
            </div>

            {/* Floating Quick Feature Pills (Stacked Vertically on the Right Side) */}
            <div className="absolute right-6 sm:right-10 md:right-14 top-1/2 -translate-y-1/2 hidden md:flex flex-col gap-3.5 items-end pointer-events-none z-20">
              <div className="bg-[#1A1917]/85 backdrop-blur-md text-[#F5F0E8] px-5 py-3 rounded-2xl text-xs font-medium border border-white/15 flex items-center gap-2.5 shadow-xl pointer-events-auto hover:bg-[#1A1917] transition-all group">
                <Compass className="w-4 h-4 text-[#D5C7B3] group-hover:scale-110 transition-transform" />
                <span>Interior & Exterior Contracting</span>
              </div>

              <div className="bg-[#1A1917]/85 backdrop-blur-md text-[#F5F0E8] px-5 py-3 rounded-2xl text-xs font-medium border border-white/15 flex items-center gap-2.5 shadow-xl pointer-events-auto hover:bg-[#1A1917] transition-all group">
                <Layers className="w-4 h-4 text-[#D5C7B3] group-hover:scale-110 transition-transform" />
                <span>3D ArchViz & Precision CAD Drafting</span>
              </div>

              <div className="bg-[#1A1917]/85 backdrop-blur-md text-[#F5F0E8] px-5 py-3 rounded-2xl text-xs font-medium border border-white/15 flex items-center gap-2.5 shadow-xl pointer-events-auto hover:bg-[#1A1917] transition-all group">
                <ShieldCheck className="w-4 h-4 text-[#D5C7B3] group-hover:scale-110 transition-transform" />
                <span>Licensed Full Construction</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Core Services Sub-ribbon */}
      <div className="relative w-full pt-8 pb-16 md:pb-20 mt-0 bg-gradient-to-b from-[#2A241E] via-[#2A241E] via-40% to-[#F5F0E8]">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-left">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {heroCards.map((card, idx) => (
              <div key={idx} className="bg-[#1A1917]/85 backdrop-blur-md p-5 rounded-2xl border border-white/10 hover:border-[#C5B097] transition-all group shadow-xl">
                <span className="text-xs font-semibold text-[#C5B097] tracking-wider uppercase block mb-1">{card.tag}</span>
                <h4 className="font-serif text-lg font-semibold text-white group-hover:text-[#D5C7B3] transition-colors">
                  {card.title}
                </h4>
                <p className="text-xs text-[#A39785] mt-1 font-light">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
