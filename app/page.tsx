"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import TrustGridSection from "@/components/TrustGridSection";
import ProjectsSection, { ProjectItem } from "@/components/ProjectsSection";
import ServicesSection from "@/components/ServicesSection";
import InteractiveEstimator from "@/components/InteractiveEstimator";
import ComparisonSlider from "@/components/ComparisonSlider";
import WorkflowSection from "@/components/WorkflowSection";
import ArticlesSection from "@/components/ArticlesSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import Footer from "@/components/Footer";
import ProjectModal from "@/components/ProjectModal";
import ConsultationModal from "@/components/ConsultationModal";

export default function Home() {
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [consultationOpen, setConsultationOpen] = useState<boolean>(false);
  const [consultationNotes, setConsultationNotes] = useState<string>("");

  const handleOpenConsultation = (notes = "") => {
    setConsultationNotes(notes);
    setConsultationOpen(true);
  };

  return (
    <main className="min-h-screen bg-[#F5F0E8] text-[#22201D] font-sans selection:bg-[#D5C7B3] selection:text-[#171717]">
      {/* Navigation Header */}
      <Navbar onOpenConsultation={() => handleOpenConsultation()} />

      {/* Hero Section (Matches top of screenshot) */}
      <HeroSection onOpenConsultation={() => handleOpenConsultation()} />

      {/* Trust Grid Section (Matches middle asymmetrical masonry grid of screenshot) */}
      <TrustGridSection />

      {/* Signature Projects Section (Matches bottom 4-column cards of screenshot) */}
      <ProjectsSection
        onSelectProject={(project) => setSelectedProject(project)}
      />

      {/* Core Services Section (Contractor, 3D Architect, Drafter, Construction) */}
      <ServicesSection onOpenConsultation={() => handleOpenConsultation()} />

      {/* Dynamic Project Estimator */}
      <InteractiveEstimator
        onOpenConsultationWithEstimate={(notes) => handleOpenConsultation(notes)}
      />

      {/* Interactive 3D Render vs Build Comparison */}
      <ComparisonSlider />

      {/* 5-Step Execution Workflow */}
      <WorkflowSection />

      {/* Articles & Blog Section */}
      <ArticlesSection />

      {/* Client Endorsements */}
      <TestimonialsSection />

      {/* Footer */}
      <Footer onOpenConsultation={() => handleOpenConsultation()} />

      {/* Interactive Modals */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onOpenConsultation={() => handleOpenConsultation()}
      />

      <ConsultationModal
        isOpen={consultationOpen}
        onClose={() => setConsultationOpen(false)}
        initialNotes={consultationNotes}
      />
    </main>
  );
}
