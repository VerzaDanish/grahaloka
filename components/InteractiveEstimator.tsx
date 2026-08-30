"use client";

import React, { useState } from "react";
import { Calculator, ArrowRight, Check, Sparkles, Building, Layers, Compass, HardHat } from "lucide-react";

interface EstimatorProps {
  onOpenConsultationWithEstimate: (details: string) => void;
}

export default function InteractiveEstimator({ onOpenConsultationWithEstimate }: EstimatorProps) {
  const [service, setService] = useState<string>("interior");
  const [projectType, setProjectType] = useState<string>("residential");
  const [area, setArea] = useState<number>(2500);
  const [quality, setQuality] = useState<string>("premium");

  // Rates calculation logic per sq ft
  const rates: Record<string, { standard: number; premium: number; luxury: number; baseWeeks: number; weeksPer1000SqFt: number }> = {
    interior: { standard: 65, premium: 120, luxury: 210, baseWeeks: 6, weeksPer1000SqFt: 2 },
    exterior: { standard: 50, premium: 95, luxury: 175, baseWeeks: 8, weeksPer1000SqFt: 3 },
    "3d": { standard: 2.5, premium: 5, luxury: 9, baseWeeks: 2, weeksPer1000SqFt: 0.5 },
    drafting: { standard: 3.5, premium: 7, luxury: 12, baseWeeks: 3, weeksPer1000SqFt: 0.8 },
    construction: { standard: 140, premium: 250, luxury: 420, baseWeeks: 16, weeksPer1000SqFt: 4 },
  };

  const currentRateConfig = rates[service] || rates.interior;
  const unitRate = quality === "standard" ? currentRateConfig.standard : quality === "premium" ? currentRateConfig.premium : currentRateConfig.luxury;

  const estimatedCost = Math.round(area * unitRate);
  const minCost = Math.round(estimatedCost * 0.9);
  const maxCost = Math.round(estimatedCost * 1.15);

  const estimatedWeeks = Math.max(1, Math.round(currentRateConfig.baseWeeks + (area / 1000) * currentRateConfig.weeksPer1000SqFt));

  const formatCurrency = (val: number) => {
    return "$" + val.toLocaleString("en-US");
  };

  const handleBook = () => {
    const summary = `Service: ${service.toUpperCase()}, Type: ${projectType}, Area: ${area} sq ft, Quality: ${quality.toUpperCase()}, Estimated Budget: ${formatCurrency(minCost)} - ${formatCurrency(maxCost)}, Duration: ~${estimatedWeeks} weeks.`;
    onOpenConsultationWithEstimate(summary);
  };

  return (
    <section id="estimator" className="py-20 bg-[#F5F0E8] border-t border-[#E4DCCF]/60">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 border border-[#E4DCCF] text-[11px] font-semibold text-[#7A6E5D] uppercase tracking-wider shadow-xs">
            <Calculator className="w-3.5 h-3.5 text-[#B8A388]" />
            <span>Instant Project Calculator</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#1A1917]">
            Estimate Your Project
          </h2>

          <p className="text-sm md:text-base text-[#6B6358] font-sans font-light">
            Configure your space parameters to receive an instant estimate for budget and execution timeline.
          </p>
        </div>

        {/* Calculator Grid */}
        <div className="bg-white rounded-3xl p-6 md:p-10 border border-[#E4DCCF] shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Controls Form Left */}
          <div className="lg:col-span-7 space-y-6">
            {/* Step 1: Select Service Domain */}
            <div className="space-y-2.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#887C6C]">
                1. Select Service Domain
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { id: "interior", label: "Interior Contracting" },
                  { id: "exterior", label: "Exterior Arch" },
                  { id: "3d", label: "3D Render & VR" },
                  { id: "drafting", label: "CAD Drafting" },
                  { id: "construction", label: "General Construction" },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setService(item.id)}
                    className={`px-3 py-2.5 rounded-xl text-xs font-medium border transition-all cursor-pointer text-left ${
                      service === item.id
                        ? "bg-[#1A1917] text-[#F5F0E8] border-[#1A1917]"
                        : "bg-[#F5F0E8]/60 text-[#4A453E] border-[#E4DCCF] hover:bg-[#F5F0E8]"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Select Property Type */}
            <div className="space-y-2.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#887C6C]">
                2. Property Type
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "residential", label: "Residential Villa" },
                  { id: "penthouse", label: "Penthouse / Loft" },
                  { id: "commercial", label: "Commercial Office" },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setProjectType(item.id)}
                    className={`px-3 py-2.5 rounded-xl text-xs font-medium border transition-all cursor-pointer text-center ${
                      projectType === item.id
                        ? "bg-[#1A1917] text-[#F5F0E8] border-[#1A1917]"
                        : "bg-[#F5F0E8]/60 text-[#4A453E] border-[#E4DCCF] hover:bg-[#F5F0E8]"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Area Slider */}
            <div className="space-y-3 bg-[#F5F0E8]/40 p-4 rounded-2xl border border-[#E4DCCF]">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#887C6C]">
                  3. Total Floor Area
                </label>
                <span className="font-serif text-lg font-semibold text-[#1A1917]">
                  {area.toLocaleString()} <span className="text-xs text-[#887C6C]">sq ft</span>
                </span>
              </div>
              <input
                type="range"
                min={300}
                max={15000}
                step={100}
                value={area}
                onChange={(e) => setArea(Number(e.target.value))}
                className="w-full h-2 bg-[#D5C7B3] rounded-lg appearance-none cursor-pointer accent-[#1A1917]"
              />
              <div className="flex justify-between text-[11px] text-[#887C6C]">
                <span>300 sq ft</span>
                <span>5,000 sq ft</span>
                <span>15,000 sq ft</span>
              </div>
            </div>

            {/* Step 4: Finish Standard */}
            <div className="space-y-2.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#887C6C]">
                4. Material & Finishing Grade
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "standard", label: "Standard Luxury", desc: "High quality curated finishes" },
                  { id: "premium", label: "Premium Signature", desc: "Custom marble & millwork" },
                  { id: "luxury", label: "Masterpiece", desc: "Bespoke imported artisan tier" },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setQuality(item.id)}
                    className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                      quality === item.id
                        ? "bg-[#1A1917] text-[#F5F0E8] border-[#1A1917]"
                        : "bg-[#F5F0E8]/60 text-[#4A453E] border-[#E4DCCF] hover:bg-[#F5F0E8]"
                    }`}
                  >
                    <div className="text-xs font-semibold">{item.label}</div>
                    <div className={`text-[10px] mt-0.5 ${quality === item.id ? "text-[#D5C7B3]" : "text-[#7A6E5D]"}`}>
                      {item.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results Summary Box Right */}
          <div className="lg:col-span-5 bg-[#1A1917] text-[#F5F0E8] rounded-2xl p-6 md:p-8 flex flex-col justify-between space-y-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#D5C7B3]/10 rounded-full blur-2xl pointer-events-none" />

            <div>
              <span className="text-[10px] uppercase font-semibold text-[#D5C7B3] tracking-widest block mb-1">
                Estimated Summary
              </span>
              <h3 className="font-serif text-2xl font-normal text-white">
                Project Investment Range
              </h3>

              <div className="mt-6 space-y-1">
                <div className="text-xs text-[#A39785]">Estimated Total Cost</div>
                <div className="font-serif text-3xl sm:text-4xl font-semibold text-[#EBE4D8]">
                  {formatCurrency(minCost)} – {formatCurrency(maxCost)}
                </div>
                <p className="text-[11px] text-[#A39785]">Includes materials, labor, drafting & management.</p>
              </div>

              <div className="mt-6 pt-6 border-t border-[#33302B] grid grid-cols-2 gap-4">
                <div>
                  <div className="text-[11px] text-[#A39785]">Est. Duration</div>
                  <div className="font-serif text-xl font-semibold text-[#EBE4D8]">
                    ~{estimatedWeeks} Weeks
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-[#A39785]">Avg Rate</div>
                  <div className="font-serif text-xl font-semibold text-[#EBE4D8]">
                    ${unitRate}/sq ft
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-2 text-xs text-[#D5C7B3]">
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#C5B097]" />
                  <span>Free Initial On-Site Architectural Assessment</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#C5B097]" />
                  <span>Transparent Itemized BoQ Guarantee</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#C5B097]" />
                  <span>Licensed General Contracting Warranty</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleBook}
              className="w-full bg-[#EBE4D8] text-[#1A1917] py-3.5 px-6 rounded-full text-xs sm:text-sm font-semibold hover:bg-white transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer group"
            >
              <span>Book Consultation With This Estimate</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
