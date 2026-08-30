"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, MessageSquare, Compass, Layers, HardHat, CheckCircle2 } from "lucide-react";

const stepIcons = [MessageSquare, Compass, Layers, HardHat, CheckCircle2];

export default function WorkflowSection() {
  const [workflowHeader, setWorkflowHeader] = useState({
    badge: "Methodology",
    title: "How We Execute",
    description: "A seamless 5-stage architectural workflow designed for speed, cost control, and uncompromised build quality.",
  });

  const [steps, setSteps] = useState([
    {
      num: "01",
      title: "Discovery & Briefing",
      desc: "Initial site inspection, spatial requirements analysis, aesthetic goal alignment, and preliminary budget framework definition.",
    },
    {
      num: "02",
      title: "2D CAD Drafting & BIM",
      desc: "Creating detailed architectural blueprints, structural engineering calculations, MEP schematics, and city permit documentation.",
    },
    {
      num: "03",
      title: "3D Render & VR Simulation",
      desc: "Photorealistic 8K visualizations and 360° VR walkthroughs allowing client approval of exact materials, lighting, and finishes.",
    },
    {
      num: "04",
      title: "Procurement & Contracting",
      desc: "Fixed-price Bill of Quantities (BoQ), high-grade material sourcing, millwork fabrication, and milestone scheduling.",
    },
    {
      num: "05",
      title: "Construction & Handover",
      desc: "On-site civil engineering build, continuous quality audits, site cleanup, and final turnkey key handover with warranty.",
    },
  ]);

  useEffect(() => {
    async function fetchWorkflowContent() {
      try {
        const res = await fetch("/api/admin/content");
        const data = await res.json();
        if (data.success && data.data?.workflow) {
          if (data.data.workflow.badge || data.data.workflow.title || data.data.workflow.description) {
            setWorkflowHeader((prev) => ({
              ...prev,
              badge: data.data.workflow.badge || prev.badge,
              title: data.data.workflow.title || prev.title,
              description: data.data.workflow.description || prev.description,
            }));
          }
          if (data.data.workflow.steps && Array.isArray(data.data.workflow.steps)) {
            setSteps(data.data.workflow.steps);
          }
        }
      } catch (e) {
        console.error("Gagal memuat konten Workflow", e);
      }
    }
    fetchWorkflowContent();
  }, []);

  return (
    <section id="process" className="py-20 bg-[#F5F0E8] border-t border-[#E4DCCF]/60">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 border border-[#E4DCCF] text-[11px] font-semibold text-[#7A6E5D] uppercase tracking-wider shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#B8A388]" />
            <span>{workflowHeader.badge}</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#1A1917]">
            {workflowHeader.title}
          </h2>

          <p className="text-sm md:text-base text-[#6B6358] font-sans font-light">
            {workflowHeader.description}
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {steps.map((step, idx) => {
            const IconComp = stepIcons[idx] || CheckCircle2;
            return (
              <div
                key={idx}
                className="bg-white rounded-3xl p-6 border border-[#E4DCCF] shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow relative group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-serif text-2xl font-semibold text-[#C5B097] group-hover:text-[#1A1917] transition-colors">
                    {step.num || `0${idx + 1}`}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-[#F5F0E8] flex items-center justify-center text-[#7A6E5D]">
                    <IconComp className="w-4 h-4" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <h3 className="font-serif font-semibold text-lg text-[#1A1917]">
                    {step.title}
                  </h3>
                  <p className="text-xs text-[#544D44] font-light leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
