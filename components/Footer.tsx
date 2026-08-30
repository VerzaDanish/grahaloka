"use client";

import React, { useState, useEffect } from "react";
import { ArrowRight, Phone, Mail, MapPin } from "lucide-react";

interface FooterProps {
  onOpenConsultation?: () => void;
}

export default function Footer({ onOpenConsultation }: FooterProps) {
  const [contactData, setContactData] = useState({
    phone: "+1 (800) 482-9102",
    whatsapp: "6281234567890",
    email: "contact@elysian-build.com",
    address: "Jl. Graha Utama No. 88, Jakarta Selatan, Indonesia",
    hours: "Senin - Sabtu: 08:00 - 17:00 WIB",
    copyright: "© 2026 GRAHALOKA Architecture & Build Inc. All rights reserved.",
  });

  useEffect(() => {
    async function fetchContact() {
      try {
        const res = await fetch("/api/admin/content");
        const data = await res.json();
        if (data.success && data.data?.contact) {
          setContactData((prev) => ({
            ...prev,
            ...data.data.contact,
          }));
        }
      } catch (e) {
        console.error("Gagal memuat kontak Footer", e);
      }
    }
    fetchContact();
  }, []);

  return (
    <footer className="bg-[#171614] text-[#D5C7B3] pt-16 pb-8 border-t border-[#2A2824]">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-[#2A2824]">
          {/* Brand Col */}
          <div className="md:col-span-4 space-y-4">
            <a href="#hero" className="flex items-center gap-3">
              {/* eslint-disable-next-html-element-suppression */}
              <img src="/logo.png" alt="Grahaloka Logo" className="w-10 h-10 object-contain" />
              <div className="flex flex-col">
                <span className="font-serif text-3xl tracking-[0.2em] font-semibold text-white">
                  GRAHA LOKA
                </span>
                <span className="text-[10px] tracking-[0.3em] uppercase text-[#887C6C] font-sans -mt-1 font-medium">
                  Architecture & Build Studio • Bali
                </span>
              </div>
            </a>
            <p className="text-xs text-[#A39785] leading-relaxed max-w-sm font-light">
              Crafting timeless architecture and interiors with sustainable innovation and craftsmanship in Bali. Full-turnkey contractor, 3D render studio, CAD drafter, and civil construction.
            </p>
            <div className="pt-2">
              <button
                onClick={() => onOpenConsultation?.()}
                className="bg-[#EBE4D8] text-[#1A1917] px-6 py-2.5 rounded-full text-xs font-semibold hover:bg-white transition-all inline-flex items-center gap-2 cursor-pointer"
              >
                <span>Schedule Consultation</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
              Disciplines
            </h4>
            <ul className="space-y-2 text-xs text-[#A39785]">
              <li><a href="#services" className="hover:text-white transition-colors">Interior Contracting</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">Exterior Architecture</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">3D ArchViz Renders</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">CAD & BIM Drafting</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">Turnkey Construction</a></li>
            </ul>
          </div>

          {/* Navigation */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs text-[#A39785]">
              <li><a href="/#hero" className="hover:text-white transition-colors">Home</a></li>
              <li><a href="/artikel" className="hover:text-white transition-colors text-[#C9A36A]">Artikel & Blog</a></li>
              <li><a href="/#projects" className="hover:text-white transition-colors">Signature Projects</a></li>
              <li><a href="/#estimator" className="hover:text-white transition-colors">Cost Estimator</a></li>
              <li><a href="/#process" className="hover:text-white transition-colors">Execution Process</a></li>
              <li><a href="/admin" className="hover:text-white transition-colors text-amber-400">Admin Panel</a></li>
            </ul>
          </div>

          {/* Global Locations & Contact */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
              Kontak & Alamat
            </h4>
            <div className="space-y-2 text-xs text-[#A39785]">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#C5B097] shrink-0 mt-0.5" />
                <span>{contactData.address}</span>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <Phone className="w-4 h-4 text-[#C5B097]" />
                <span>{contactData.phone} (WA: {contactData.whatsapp})</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#C5B097]" />
                <span>{contactData.email}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#7A6E5D]">
          <div>
            {contactData.copyright || `© ${new Date().getFullYear()} GRAHALOKA Architecture & General Contracting Inc. All rights reserved.`}
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-[#D5C7B3] transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-[#D5C7B3] transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-[#D5C7B3] transition-colors">Licensing & Permits</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
