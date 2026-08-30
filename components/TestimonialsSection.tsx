"use client";

import React from "react";
import { Sparkles, Star, Quote } from "lucide-react";

export default function TestimonialsSection() {
  const testimonials = [
    {
      quote:
        "Elysian translated our complex architectural visions into flawless 3D renders, precise CAD blueprints, and finally executed the turnkey interior build without a single budget overrun.",
      author: "Lord Harrison Vance",
      title: "Private Estate Owner • London",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    },
    {
      quote:
        "The level of accuracy between their 3D renderings and the final completed villa in Dubai was 100%. Their drafting team handled permits effortlessly while general construction ran on schedule.",
      author: "Elena Rostova",
      title: "Real Estate Developer • Dubai",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    },
    {
      quote:
        "Finding one firm that excels in 3D architecture, technical drafting, general contracting, AND interior fitouts saved us months of coordination friction. Absolute perfectionists.",
      author: "Marcus Vance",
      title: "Commercial Director • New York",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    },
  ];

  return (
    <section className="py-20 bg-[#F5F0E8] border-t border-[#E4DCCF]/60">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 border border-[#E4DCCF] text-[11px] font-semibold text-[#7A6E5D] uppercase tracking-wider shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#B8A388]" />
            <span>Client Endorsements</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#1A1917]">
            Trusted By Visionaries
          </h2>

          <p className="text-sm md:text-base text-[#6B6358] font-sans font-light">
            Read testimonials from homeowners, property developers, and commercial leaders worldwide.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-7 border border-[#E4DCCF] shadow-sm flex flex-col justify-between space-y-6 hover:shadow-md transition-shadow relative"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-1 text-[#C5B097]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>

                <Quote className="w-8 h-8 text-[#E4DCCF]" />

                <p className="text-xs sm:text-sm text-[#4A453E] leading-relaxed font-light italic">
                  "{t.quote}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-[#F5F0E8]">
                <img
                  src={t.avatar}
                  alt={t.author}
                  className="w-10 h-10 rounded-full object-cover border border-[#E4DCCF]"
                />
                <div>
                  <h4 className="font-serif font-semibold text-sm text-[#1A1917]">
                    {t.author}
                  </h4>
                  <span className="text-[11px] text-[#887C6C] block">
                    {t.title}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
