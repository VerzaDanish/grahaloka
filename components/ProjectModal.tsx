"use client";

import React from "react";
import { X, MapPin, Calendar, Layers, CheckCircle2, ArrowRight, Compass, HardHat } from "lucide-react";
import { ProjectItem } from "./ProjectsSection";

interface ProjectModalProps {
  project: ProjectItem | null;
  onClose: () => void;
  onOpenConsultation: () => void;
}

export default function ProjectModal({ project, onClose, onOpenConsultation }: ProjectModalProps) {
  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-[#F5F0E8] w-full max-w-4xl max-h-[90vh] rounded-3xl overflow-hidden shadow-2xl border border-[#E4DCCF] flex flex-col relative animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 bg-black/70 hover:bg-black text-white p-2.5 rounded-full transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header Image */}
        <div className="relative aspect-[21/9] w-full bg-[#EBE4D8] overflow-hidden">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#F5F0E8] via-transparent to-black/30" />
          <div className="absolute bottom-4 left-6 right-6">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#887C6C] bg-white/90 px-3 py-1 rounded-full border border-white/40">
              {project.tag}
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-semibold text-[#1A1917] mt-2">
              {project.title}
            </h2>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 md:p-8 overflow-y-auto space-y-6">
          {/* Metadata Ribbon */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-white p-4 rounded-2xl border border-[#E4DCCF]">
            <div>
              <span className="text-[10px] uppercase font-semibold text-[#887C6C]">Location</span>
              <div className="text-xs font-medium text-[#1A1917] flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-[#C5B097]" />
                {project.location}
              </div>
            </div>

            <div>
              <span className="text-[10px] uppercase font-semibold text-[#887C6C]">Completion</span>
              <div className="text-xs font-medium text-[#1A1917] flex items-center gap-1 mt-0.5">
                <Calendar className="w-3.5 h-3.5 text-[#C5B097]" />
                {project.date}
              </div>
            </div>

            <div>
              <span className="text-[10px] uppercase font-semibold text-[#887C6C]">Floor Area</span>
              <div className="text-xs font-medium text-[#1A1917] mt-0.5">
                {project.area}
              </div>
            </div>

            <div>
              <span className="text-[10px] uppercase font-semibold text-[#887C6C]">Project Duration</span>
              <div className="text-xs font-medium text-[#1A1917] mt-0.5">
                {project.timeline}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="font-serif text-xl font-semibold text-[#1A1917]">Project Narrative & Concept</h3>
            <p className="text-sm text-[#5A534A] leading-relaxed font-light">
              {project.description}
            </p>
          </div>

          {/* Execution Scope */}
          <div className="space-y-3">
            <h3 className="font-serif text-xl font-semibold text-[#1A1917]">Disciplines Delivered</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {project.scope.map((item, idx) => (
                <div key={idx} className="bg-white p-3 rounded-xl border border-[#E4DCCF] text-xs font-medium text-[#1A1917] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#887C6C]" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action CTA */}
          <div className="pt-4 flex items-center justify-between border-t border-[#E4DCCF]">
            <span className="text-xs text-[#7A6E5D]">
              Want a similar spatial design or construction build?
            </span>
            <button
              onClick={() => {
                onClose();
                onOpenConsultation();
              }}
              className="bg-[#1A1917] text-[#F5F0E8] px-6 py-3 rounded-full text-xs font-medium hover:bg-[#33302B] transition-all flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <span>Inquire About This Project</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
