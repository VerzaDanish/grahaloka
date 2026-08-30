"use client";

import React, { useState } from "react";
import { Sparkles, ArrowUpRight, Eye, Calendar, MapPin, Layers, Check } from "lucide-react";

export interface ProjectItem {
  id: string;
  category: string;
  tag: string;
  title: string;
  location: string;
  date: string;
  image: string;
  description: string;
  scope: string[];
  area: string;
  timeline: string;
}

const projectsData: ProjectItem[] = [
  {
    id: "proj-1",
    category: "interior",
    tag: "Residential • New York",
    title: "Modern Living Retreat",
    location: "New York, USA",
    date: "May 2025",
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80",
    description: "A luxury minimalist residence featuring warm microcement walls, custom oak joinery, natural stone accents, and soft sun shadow play.",
    scope: ["Interior Contracting", "Custom Furniture", "Lighting Design", "Full Fitout"],
    area: "3,400 sq ft",
    timeline: "5 Months",
  },
  {
    id: "proj-2",
    category: "exterior",
    tag: "Luxury Villa • Dubai",
    title: "Minimalist Urban Residence",
    location: "Emirates Hills, Dubai",
    date: "April 2025",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
    description: "Monolithic stone exterior architecture integrated seamlessly with private infinity pool courtyard, 3D parametric louvers, and floor-to-ceiling glass.",
    scope: ["Exterior Architecture", "3D Visualization", "General Construction", "Landscaping"],
    area: "8,500 sq ft",
    timeline: "14 Months",
  },
  {
    id: "proj-3",
    category: "3d",
    tag: "May 5, 2025 • New York",
    title: "Elegant Living Space",
    location: "Manhattan, New York",
    date: "May 5, 2025",
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80",
    description: "Photorealistic 8K 3D rendering and VR spatial simulation for a penthouse bedroom suite with indirect ambient LED lighting and raw timber acoustic paneling.",
    scope: ["3D ArchViz Render", "VR Walkthrough", "2D CAD Drafting", "Material Curation"],
    area: "2,100 sq ft",
    timeline: "3 Weeks",
  },
  {
    id: "proj-4",
    category: "drafting",
    tag: "May 5, 2025 • New York",
    title: "Modern Coastal Villa",
    location: "Hamptons, New York",
    date: "May 5, 2025",
    image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80",
    description: "Full architectural CAD blueprint drafting, structural BIM engineering, and general contracting for a seaside sanctuary villa.",
    scope: ["Architectural Drafting", "Structural BIM", "Permit Documentation", "Site Supervision"],
    area: "6,200 sq ft",
    timeline: "10 Months",
  },
  {
    id: "proj-5",
    category: "construction",
    tag: "Commercial • London",
    title: "Zenith Glass Pavilion",
    location: "Mayfair, London",
    date: "March 2025",
    image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=800&q=80",
    description: "Structural steel and glass curtain wall construction for an flagship architectural showroom and private gallery.",
    scope: ["Turnkey Construction", "Structural Contracting", "MEP Drafting", "Exterior Facade"],
    area: "12,000 sq ft",
    timeline: "16 Months",
  },
  {
    id: "proj-6",
    category: "3d",
    tag: "3D Render • Tokyo",
    title: "Metropolitan Loft Studio",
    location: "Ginza, Tokyo",
    date: "February 2025",
    image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80",
    description: "High-definition 3D rendering showcasing industrial concrete textures, floating steel staircases, and hidden spatial storage systems.",
    scope: ["3D Rendering", "Concept Design", "BIM Coordination"],
    area: "1,800 sq ft",
    timeline: "2 Weeks",
  },
  {
    id: "proj-7",
    category: "interior",
    tag: "Luxury Suite • Paris",
    title: "Haussmann Penthouse Fitout",
    location: "8th Arrondissement, Paris",
    date: "January 2025",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    description: "Complete interior contractor renovation combining heritage French molding with contemporary stone kitchen islands and brushed brass hardware.",
    scope: ["Interior Contracting", "Millwork", "Electrical & Plumbing", "Heritage Restoration"],
    area: "3,100 sq ft",
    timeline: "7 Months",
  },
  {
    id: "proj-8",
    category: "exterior",
    tag: "Resort Villa • Bali",
    title: "Sayan Tropical Pavilion",
    location: "Ubud, Bali",
    date: "December 2024",
    image: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=800&q=80",
    description: "Sustainable exterior bamboo and ironwood architecture, integrated rainwater harvesting, and organic open-air living spaces.",
    scope: ["Exterior Architecture", "Eco-Construction", "Drafting & Permitting", "Landscaping"],
    area: "9,800 sq ft",
    timeline: "12 Months",
  },
];

interface ProjectsSectionProps {
  onSelectProject: (project: ProjectItem) => void;
}

export default function ProjectsSection({ onSelectProject }: ProjectsSectionProps) {
  const [activeTab, setActiveTab] = useState<string>("all");

  const filterTabs = [
    { id: "all", label: "All Projects" },
    { id: "interior", label: "Interior Contracting" },
    { id: "exterior", label: "Exterior & Architecture" },
    { id: "3d", label: "3D Renders & VR" },
    { id: "drafting", label: "CAD & Drafting" },
    { id: "construction", label: "General Construction" },
  ];

  const filteredProjects = activeTab === "all"
    ? projectsData
    : projectsData.filter((p) => p.category === activeTab);

  return (
    <section id="projects" className="py-20 bg-[#F5F0E8] border-t border-[#E4DCCF]/60">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 border border-[#E4DCCF] text-[11px] font-semibold text-[#7A6E5D] uppercase tracking-wider shadow-xs">
            <Sparkles className="w-3 h-3 text-[#B8A388]" />
            <span>Signature Spaces</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#1A1917]">
            Elite Interior Works
          </h2>

          <p className="text-sm md:text-base text-[#6B6358] font-sans font-light">
            Every project reflects timeless craftsmanship, photorealistic 3D accuracy, precision drafting, and refined construction execution.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-full text-xs font-medium transition-all cursor-pointer ${
                activeTab === tab.id
                  ? "bg-[#1A1917] text-[#F5F0E8] shadow-sm"
                  : "bg-white/80 text-[#5A534A] hover:bg-white hover:text-[#1A1917] border border-[#E4DCCF]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 4-Column Projects Grid (Exact replica of bottom section in uploaded image) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              onClick={() => onSelectProject(project)}
              className="group cursor-pointer flex flex-col space-y-3"
            >
              {/* Image Container */}
              <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-[#EBE4D8] border border-[#E4DCCF] shadow-sm group-hover:shadow-lg transition-all duration-300">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <div className="w-full bg-white/95 backdrop-blur-md text-[#1A1917] py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-between shadow-md">
                    <span>Explore Specifications</span>
                    <ArrowUpRight className="w-4 h-4 text-[#887C6C]" />
                  </div>
                </div>
              </div>

              {/* Text Info (Exact format from bottom row of image) */}
              <div className="space-y-1 px-1">
                <span className="text-[11px] font-medium text-[#887C6C] tracking-wide block">
                  {project.tag}
                </span>
                <h3 className="font-serif text-lg font-semibold text-[#1A1917] group-hover:text-[#887C6C] transition-colors line-clamp-1">
                  {project.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
