"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, SlidersHorizontal } from "lucide-react";

export default function ComparisonSlider() {
  const [sliderPos, setSliderPos] = useState<number>(50);
  const [compData, setCompData] = useState({
    title: "3D Render vs Finished Built",
    description: "Drag the slider to compare our 3D photorealistic visualization against the final completed construction site build.",
    renderImage: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=80",
    buildImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80",
  });

  useEffect(() => {
    async function fetchCompContent() {
      try {
        const res = await fetch("/api/admin/content");
        const data = await res.json();
        if (data.success && data.data?.comparison) {
          setCompData((prev) => ({
            ...prev,
            ...data.data.comparison,
          }));
        }
      } catch (e) {
        console.error("Gagal memuat konten Komparasi", e);
      }
    }
    fetchCompContent();
  }, []);

  return (
    <section className="py-20 bg-[#F5F0E8] border-t border-[#E4DCCF]/60">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 border border-[#E4DCCF] text-[11px] font-semibold text-[#7A6E5D] uppercase tracking-wider shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#B8A388]" />
            <span>Precision Accuracy</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#1A1917]">
            {compData.title}
          </h2>

          <p className="text-sm md:text-base text-[#6B6358] font-sans font-light">
            {compData.description}
          </p>
        </div>

        {/* Interactive Comparison Container */}
        <div className="relative max-w-5xl mx-auto aspect-[16/9] rounded-3xl overflow-hidden shadow-2xl border border-[#E4DCCF] select-none">
          {/* Background Image: 3D Render */}
          <div className="absolute inset-0 bg-[#EBE4D8]">
            {/* eslint-disable-next-html-element-suppression */}
            <img
              src={compData.renderImage}
              alt="3D Render Visualization"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-6 right-6 bg-[#1A1917]/80 backdrop-blur-md text-white text-xs font-semibold px-4 py-2 rounded-full border border-white/20">
              3D CAD & BIM Render (Design Phase)
            </div>
          </div>

          {/* Foreground Image: Finished Built (Clipped) */}
          <div
            className="absolute inset-0 overflow-hidden bg-[#EBE4D8]"
            style={{ width: `${sliderPos}%` }}
          >
            {/* eslint-disable-next-html-element-suppression */}
            <img
              src={compData.buildImage}
              alt="Finished Construction Build"
              className="w-full h-full object-cover max-w-none"
              style={{ width: "100%", height: "100%" }}
            />
            <div className="absolute top-6 left-6 bg-[#1A1917]/80 backdrop-blur-md text-white text-xs font-semibold px-4 py-2 rounded-full border border-white/20">
              Completed Construction Build (100% Match)
            </div>
          </div>

          {/* Slider Line & Handle */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize shadow-2xl z-20 flex items-center justify-center"
            style={{ left: `${sliderPos}%` }}
          >
            <div className="w-10 h-10 -ml-5 bg-[#1A1917] text-white rounded-full border-2 border-white flex items-center justify-center shadow-xl">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
          </div>

          {/* Native Slider Input */}
          <input
            type="range"
            min={0}
            max={100}
            value={sliderPos}
            onChange={(e) => setSliderPos(Number(e.target.value))}
            className="absolute inset-0 opacity-0 cursor-ew-resize w-full h-full z-30"
          />
        </div>
      </div>
    </section>
  );
}
