"use client";

import React, { useState, useEffect } from "react";
import {
  Compass,
  Layers,
  FileSpreadsheet,
  HardHat,
  CheckCircle,
  ArrowRight,
  Sparkles,
} from "lucide-react";

interface ServicesSectionProps {
  onOpenConsultation?: () => void;
}

const iconsMap = [Compass, Layers, FileSpreadsheet, HardHat];

export default function ServicesSection({ onOpenConsultation }: ServicesSectionProps) {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [servicesHeader, setServicesHeader] = useState({
    badge: "Comprehensive Disciplines",
    title: "Our Core Services",
    description: "An end-to-end ecosystem covering design, 3D visualization, drafting, contracting, and construction execution.",
  });
  const [servicesData, setServicesData] = useState([
    {
      id: "contractor",
      title: "Interior & Exterior Contractor",
      subtitle: "Turnkey fit-out, custom joinery, bespoke finishes & climate-engineered exterior facades.",
      description:
        "We bridge the gap between creative vision and physical reality. As licensed general contractors specializing in interior and exterior fit-outs, we manage material sourcing, luxury millwork, acoustic wall systems, and high-end facade installation with absolute precision.",
      features: [
        "Turnkey Interior Renovation & Bespoke Millwork",
        "Exterior Architectural Facade Engineering",
        "Custom Lighting, Acoustic & Ceiling Systems",
        "Premium Marble, Microcement & Timber Joinery",
        "Site Supervision & Quality Assurance Standards",
      ],
      deliverables: "Complete built space, material certificates, 2-year craftsmanship warranty.",
      image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1000&q=80",
    },
    {
      id: "3d-architecture",
      title: "3D Design & Architect",
      subtitle: "Photorealistic 8K renderings, spatial layout design & immersive VR architectural walkthroughs.",
      description:
        "Experience your vision before groundbreaking. Our senior architects and 3D visualizers craft hyper-realistic digital twins of your space, modeling real-world physics, sun angles, material textures, and mood lighting.",
      features: [
        "Conceptual Architecture & Spatial Planning",
        "8K Ultra-HD Photorealistic Renders",
        "360° Interactive VR Walkthroughs",
        "Sunlight Shadow & Artificial Light Studies",
        "Landscape & Interior Moodboard Curation",
      ],
      deliverables: "High-res render packages, VR 360 viewer links, architectural masterplan PDF.",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80",
    },
    {
      id: "drafter",
      title: "Architectural & BIM Drafter",
      subtitle: "CAD drafting, structural blueprints, MEP schematics & permit-ready construction drawings.",
      description:
        "Technical accuracy is the foundation of flawless construction. Our drafting team creates complete CAD drawing sets, 3D BIM models, structural engineering calculations, and MEP schematics compliant with international building codes.",
      features: [
        "Detailed 2D CAD Floor Plans & Elevation Cuts",
        "3D Revit & Archicad BIM Coordination",
        "Structural Load Calculations & Reinforcement",
        "MEP Blueprint Sets",
        "City Permit & Zoning Approval Documentation",
      ],
      deliverables: "AutoCAD .DWG files, Revit BIM models, stamped permit drawings.",
      image: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1000&q=80",
    },
    {
      id: "construction",
      title: "General Construction & Build",
      subtitle: "Structural engineering, foundation work, project management & ground-up construction.",
      description:
        "From breaking ground to final key handover, our construction division handles heavy structural works, reinforced concrete framing, steel structures, and project management to ensure on-time delivery within approved budgets.",
      features: [
        "Ground-Up Residential & Commercial Construction",
        "Structural Reinforced Concrete & Steel Framing",
        "Site Safety, Soil Testing & Foundation Engineering",
        "Supply Chain & Procurement Cost Management",
        "On-Site Civil Engineering & Quality Audits",
      ],
      deliverables: "Occupancy permits, structural warranties, as-built documentation set.",
      image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=80",
    },
  ]);

  const currentService = servicesData[activeTab] || servicesData[0];
  const CurrentIcon = iconsMap[activeTab] || Compass;

  return (
    <section id="services" className="py-20 bg-[#F5F0E8] border-t border-[#E4DCCF]/60">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 border border-[#E4DCCF] text-[11px] font-semibold text-[#7A6E5D] uppercase tracking-wider shadow-xs">
            <Sparkles className="w-3 h-3 text-[#B8A388]" />
            <span>{servicesHeader.badge}</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#1A1917]">
            {servicesHeader.title}
          </h2>

          <p className="text-sm md:text-base text-[#6B6358] font-sans font-light">
            {servicesHeader.description}
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
          {servicesData.map((service, index) => {
            const IconComponent = iconsMap[index] || Compass;
            return (
              <button
                key={service.id || index}
                onClick={() => setActiveTab(index)}
                className={`p-4 md:p-5 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                  activeTab === index
                    ? "bg-[#1A1917] text-[#F5F0E8] border-[#1A1917] shadow-md"
                    : "bg-white/80 text-[#1A1917] border-[#E4DCCF] hover:bg-white hover:border-[#C5B097]"
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      activeTab === index
                        ? "bg-[#33302B] text-[#D5C7B3]"
                        : "bg-[#F5F0E8] text-[#7A6E5D]"
                    }`}
                  >
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-serif font-semibold opacity-60">
                    0{index + 1}
                  </span>
                </div>

                <div>
                  <h3 className="font-serif font-semibold text-base sm:text-lg leading-snug">
                    {service.title}
                  </h3>
                </div>
              </button>
            );
          })}
        </div>

        {/* Service Feature Card Display */}
        <div className="bg-white rounded-3xl p-6 md:p-10 border border-[#E4DCCF] shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Content */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#887C6C]">
                Discipline 0{activeTab + 1}
              </span>
              <h3 className="font-serif text-2xl md:text-3xl font-semibold text-[#1A1917]">
                {currentService.title}
              </h3>
              <p className="text-sm md:text-base text-[#6B6358] font-light leading-relaxed">
                {currentService.subtitle}
              </p>
            </div>

            <p className="text-sm text-[#4A453E] leading-relaxed border-l-2 border-[#C5B097] pl-4 italic">
              &ldquo;{currentService.description}&rdquo;
            </p>

            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-semibold text-[#1A1917] uppercase tracking-wider">
                Key Scope & Capabilities:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {(currentService.features || [
                  "Professional Design Execution",
                  "Architectural Standards Compliance",
                  "Material Sourcing & Quality Audit",
                ]).map((feature, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-[#5A534A]">
                    <CheckCircle className="w-4 h-4 text-[#887C6C] shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 flex flex-wrap items-center gap-4 border-t border-[#F5F0E8]">
              <button
                onClick={() => onOpenConsultation?.()}
                className="bg-[#1A1917] text-[#F5F0E8] px-6 py-3 rounded-full text-xs md:text-sm font-medium hover:bg-[#33302B] transition-all flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <span>Request {currentService.title} Consultation</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <span className="text-xs text-[#887C6C] font-light">
                Deliverables: <strong className="font-medium text-[#22201D]">{currentService.deliverables}</strong>
              </span>
            </div>
          </div>

          {/* Right Image */}
          <div className="lg:col-span-5 relative aspect-[4/3] rounded-2xl overflow-hidden border border-[#E4DCCF] shadow-md bg-[#EBE4D8]">
            {/* eslint-disable-next-html-element-suppression */}
            <img
              src={currentService.image}
              alt={currentService.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md p-3.5 rounded-xl border border-white/40 text-xs text-[#1A1917] flex items-center justify-between font-medium">
              <span className="flex items-center gap-2">
                <CurrentIcon className="w-4 h-4 text-[#887C6C]" />
                {currentService.title}
              </span>
              <span className="text-[10px] text-[#887C6C] uppercase font-semibold">
                Guaranteed Standard
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
