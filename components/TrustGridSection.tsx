"use client";

import React, { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";

export default function TrustGridSection() {
  const [trustData, setTrustData] = useState({
    badge: "Proven Excellence",
    title: "Built On Trust",
    description: "Built through timeless craftsmanship, technical precision, and lasting client relationships across interior, exterior, 3D archviz, drafting, and construction.",
    image1: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80",
    image2: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=800&q=80",
    image3: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    image4: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80",
    stat1: "250+",
    stat1Label: "Project Completed",
    stat2: "15+",
    stat2Label: "Years of Experience",
    stat3: "98%+",
    stat3Label: "Client Satisfaction",
    stat4: "12",
    stat4Label: "Design Awards",
  });

  useEffect(() => {
    async function fetchTrustContent() {
      try {
        const res = await fetch("/api/admin/content");
        const data = await res.json();
        if (data.success && data.data?.trust) {
          setTrustData((prev) => ({
            ...prev,
            ...data.data.trust,
          }));
        }
      } catch (e) {
        console.error("Gagal memuat konten Trust", e);
      }
    }
    fetchTrustContent();
  }, []);

  return (
    <section id="trust" className="py-20 bg-[#F5F0E8] border-none">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 border border-[#E4DCCF] text-[11px] font-semibold text-[#7A6E5D] uppercase tracking-wider shadow-xs">
            <Sparkles className="w-3 h-3 text-[#B8A388]" />
            <span>{trustData.badge}</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#1A1917]">
            {trustData.title}
          </h2>

          <p className="text-sm md:text-base text-[#6B6358] font-sans font-light">
            {trustData.description}
          </p>
        </div>

        {/* 4-Column Asymmetrical Masonry Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch">
          {/* Column 1 */}
          <div className="flex flex-col gap-5">
            {/* Card 1: Top Image */}
            <div className="relative h-64 sm:h-72 rounded-3xl overflow-hidden shadow-sm border border-[#E4DCCF] group bg-[#EBE4D8]">
              {/* eslint-disable-next-html-element-suppression */}
              <img
                src={trustData.image1}
                alt="Architectural Interior Design"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
              <div className="absolute bottom-4 left-4 right-4 text-white text-xs font-medium backdrop-blur-sm bg-black/20 p-2.5 rounded-xl border border-white/10">
                Architectural Interior Design
              </div>
            </div>

            {/* Card 5: Bottom Stat Card */}
            <div className="bg-white rounded-3xl p-7 shadow-sm border border-[#E4DCCF] flex flex-col justify-center min-h-[220px] hover:shadow-md transition-shadow">
              <div className="font-serif text-4xl md:text-5xl font-semibold text-[#1A1917] mb-2 tracking-tight">
                {trustData.stat1}
              </div>
              <h3 className="font-sans font-semibold text-base text-[#1A1917] mb-1">
                {trustData.stat1Label}
              </h3>
              <p className="text-xs text-[#7A6E5D] font-light leading-relaxed">
                Delivering thoughtfully designed spaces across residential, commercial, and industrial sectors.
              </p>
            </div>
          </div>

          {/* Column 2 */}
          <div className="flex flex-col gap-5">
            {/* Card 2: Top Stat Card */}
            <div className="bg-white rounded-3xl p-7 shadow-sm border border-[#E4DCCF] flex flex-col justify-center min-h-[220px] hover:shadow-md transition-shadow">
              <div className="font-serif text-4xl md:text-5xl font-semibold text-[#1A1917] mb-2 tracking-tight">
                15+
              </div>
              <h3 className="font-sans font-semibold text-base text-[#1A1917] mb-1">
                Years of Experience
              </h3>
              <p className="text-xs text-[#7A6E5D] font-light leading-relaxed">
                Shaping timeless interiors & master-planned architecture with unmatched creative expertise and drafting precision.
              </p>
            </div>

            {/* Card 6: Bottom Image */}
            <div className="relative h-64 sm:h-72 rounded-3xl overflow-hidden shadow-sm border border-[#E4DCCF] group bg-[#EBE4D8]">
              <img
                src="https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=800&q=80"
                alt="Luxury Lounge Corridor"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
              <div className="absolute bottom-4 left-4 right-4 text-white text-xs font-medium backdrop-blur-sm bg-black/20 p-2.5 rounded-xl border border-white/10">
                3D CAD & BIM Modeling
              </div>
            </div>
          </div>

          {/* Column 3 */}
          <div className="flex flex-col gap-5">
            {/* Card 3: Top Image */}
            <div className="relative h-64 sm:h-72 rounded-3xl overflow-hidden shadow-sm border border-[#E4DCCF] group bg-[#EBE4D8]">
              <img
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"
                alt="Modern Stone Kitchen Island"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
              <div className="absolute bottom-4 left-4 right-4 text-white text-xs font-medium backdrop-blur-sm bg-black/20 p-2.5 rounded-xl border border-white/10">
                Custom Interior Joinery
              </div>
            </div>

            {/* Card 7: Bottom Stat Card */}
            <div className="bg-white rounded-3xl p-7 shadow-sm border border-[#E4DCCF] flex flex-col justify-center min-h-[220px] hover:shadow-md transition-shadow">
              <div className="font-serif text-4xl md:text-5xl font-semibold text-[#1A1917] mb-2 tracking-tight">
                98%+
              </div>
              <h3 className="font-sans font-semibold text-base text-[#1A1917] mb-1">
                Client Satisfaction
              </h3>
              <p className="text-xs text-[#7A6E5D] font-light leading-relaxed">
                Built on exceptional client trust, transparent contracting, and flawless turn-key site execution.
              </p>
            </div>
          </div>

          {/* Column 4 */}
          <div className="flex flex-col gap-5">
            {/* Card 4: Top Stat Card */}
            <div className="bg-white rounded-3xl p-7 shadow-sm border border-[#E4DCCF] flex flex-col justify-center min-h-[220px] hover:shadow-md transition-shadow">
              <div className="font-serif text-4xl md:text-5xl font-semibold text-[#1A1917] mb-2 tracking-tight">
                12
              </div>
              <h3 className="font-sans font-semibold text-base text-[#1A1917] mb-1">
                Design Awards
              </h3>
              <p className="text-xs text-[#7A6E5D] font-light leading-relaxed">
                Recognized for exceptional client satisfaction, innovative 3D visualization, and architectural mastery.
              </p>
            </div>

            {/* Card 8: Bottom Image */}
            <div className="relative h-64 sm:h-72 rounded-3xl overflow-hidden shadow-sm border border-[#E4DCCF] group bg-[#EBE4D8]">
              <img
                src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80"
                alt="Coastal Villa Bedroom Lounge"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
              <div className="absolute bottom-4 left-4 right-4 text-white text-xs font-medium backdrop-blur-sm bg-black/20 p-2.5 rounded-xl border border-white/10">
                General Construction Build
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
