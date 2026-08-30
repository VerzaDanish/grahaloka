"use client";

import React, { useState, useEffect } from "react";
import { ArrowRight, Menu, X, Phone, Mail, MapPin } from "lucide-react";

interface NavbarProps {
  onOpenConsultation?: () => void;
}

export default function Navbar({ onOpenConsultation }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/#hero" },
    { name: "Projects", href: "/#projects" },
    { name: "Services", href: "/#services" },
    { name: "Artikel", href: "/artikel" },
    { name: "Estimator", href: "/#estimator" },
    { name: "Process", href: "/#process" },
    { name: "Admin", href: "/admin" },
  ];

  return (
    <>
      {/* Top Banner Bar */}
      <div className="bg-[#1A1917] text-[#D5C7B3] text-xs py-2 px-4 md:px-8 flex justify-between items-[#1A1917] transition-all">
        <div className="max-w-7xl mx-auto w-full flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-6 text-[#A39785]">
            <span className="flex items-center gap-1.5 hover:text-[#EBE4D8] transition-colors">
              <Phone className="w-3.5 h-3.5 text-[#C5B097]" />
              +1 (800) 482-9102
            </span>
            <span className="hidden sm:flex items-center gap-1.5 hover:text-[#EBE4D8] transition-colors">
              <Mail className="w-3.5 h-3.5 text-[#C5B097]" />
              contact@elysian-build.com
            </span>
            <span className="hidden md:flex items-center gap-1.5 text-[#887C6C]">
              <MapPin className="w-3.5 h-3.5 text-[#C5B097]" />
              New York • Dubai • London • Singapore
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="bg-[#2A2824] px-2.5 py-0.5 rounded-full text-[10px] font-medium text-[#D5C7B3] tracking-wide uppercase border border-[#3A3630]">
              Full Turnkey Services
            </span>
          </div>
        </div>
      </div>

      {/* Main Header Nav */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          scrolled ? "glass-header shadow-sm py-4" : "bg-[#F5F0E8]/90 py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
          {/* Logo */}
          <a href="#hero" className="flex flex-col group">
            <span className="font-serif text-2xl md:text-3xl tracking-[0.2em] font-semibold text-[#1A1917] group-hover:opacity-80 transition-opacity">
              GRAHA LOKA
            </span>
            <span className="text-[9px] tracking-[0.3em] uppercase text-[#887C6C] font-sans -mt-1 font-medium">
              Architecture & Build • Bali
            </span>
          </a>

          {/* Desktop Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-[#4A453E] hover:text-[#1A1917] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-[#1A1917] hover:after:w-full after:transition-all after:duration-300"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Action Button */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={() => onOpenConsultation?.()}
              className="bg-[#1A1917] text-[#F5F0E8] px-6 py-2.5 rounded-full text-xs md:text-sm font-medium hover:bg-[#33302B] active:scale-95 transition-all shadow-sm flex items-center gap-2 group cursor-pointer"
            >
              <span>Book a Consultation</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-[#1A1917] p-2 rounded-lg hover:bg-[#EBE4D8] transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#F5F0E8] border-b border-[#E4DCCF] px-6 py-6 space-y-4 animate-in slide-in-from-top duration-200">
            <div className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-base font-medium text-[#22201D] hover:text-[#887C6C] transition-colors py-1 border-b border-[#EBE4D8]/60"
                >
                  {link.name}
                </a>
              ))}
            </div>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenConsultation?.();
              }}
              className="w-full bg-[#1A1917] text-[#F5F0E8] py-3 rounded-full text-sm font-medium flex items-center justify-center gap-2"
            >
              <span>Book a Consultation</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </header>
    </>
  );
}
