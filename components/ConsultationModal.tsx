"use client";

import React, { useState, useEffect } from "react";
import { X, CheckCircle, Calendar, Send, ShieldCheck } from "lucide-react";

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialNotes?: string;
}

export default function ConsultationModal({
  isOpen,
  onClose,
  initialNotes = "",
}: ConsultationModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "interior",
    location: "",
    budget: "$50,000 - $150,000",
    notes: initialNotes,
  });

  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (initialNotes) {
      setFormData((prev) => ({ ...prev, notes: initialNotes }));
    }
  }, [initialNotes]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleResetAndClose = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="bg-[#F5F0E8] w-full max-w-xl max-h-[92vh] rounded-3xl overflow-hidden shadow-2xl border border-[#E4DCCF] flex flex-col relative animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Close Button */}
        <button
          onClick={handleResetAndClose}
          className="absolute top-4 right-4 z-20 bg-white/80 hover:bg-white text-[#1A1917] p-2.5 rounded-full transition-colors cursor-pointer border border-[#E4DCCF]"
        >
          <X className="w-5 h-5" />
        </button>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="p-6 md:p-8 overflow-y-auto space-y-5">
            <div className="space-y-1">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-[#887C6C]">
                Private Architecture & Construction Inquiry
              </span>
              <h2 className="font-serif text-2xl md:text-3xl font-semibold text-[#1A1917]">
                Book a Consultation
              </h2>
              <p className="text-xs text-[#6B6358] font-light">
                Schedule a 1-on-1 session with our principal architect and construction team.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <div>
                <label className="text-xs font-semibold text-[#4A453E] block mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Julian Thorne"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-white border border-[#E4DCCF] rounded-xl px-4 py-2.5 text-xs text-[#1A1917] focus:outline-none focus:border-[#1A1917]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#4A453E] block mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="julian@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-white border border-[#E4DCCF] rounded-xl px-4 py-2.5 text-xs text-[#1A1917] focus:outline-none focus:border-[#1A1917]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#4A453E] block mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-white border border-[#E4DCCF] rounded-xl px-4 py-2.5 text-xs text-[#1A1917] focus:outline-none focus:border-[#1A1917]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#4A453E] block mb-1">
                    Primary Service Needed *
                  </label>
                  <select
                    value={formData.service}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                    className="w-full bg-white border border-[#E4DCCF] rounded-xl px-3 py-2.5 text-xs text-[#1A1917] focus:outline-none focus:border-[#1A1917]"
                  >
                    <option value="interior">Interior & Exterior Contractor</option>
                    <option value="3d">3D Architecture & VR Visuals</option>
                    <option value="drafting">CAD Drafting & BIM Blueprints</option>
                    <option value="construction">Turnkey General Construction</option>
                    <option value="full">Full Package (Design to Build)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#4A453E] block mb-1">
                    Target Budget Range
                  </label>
                  <select
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    className="w-full bg-white border border-[#E4DCCF] rounded-xl px-3 py-2.5 text-xs text-[#1A1917] focus:outline-none focus:border-[#1A1917]"
                  >
                    <option value="Under $50k">Under $50,000</option>
                    <option value="$50,000 - $150,000">$50,000 - $150,000</option>
                    <option value="$150,000 - $500,000">$150,000 - $500,000</option>
                    <option value="$500,000+">$500,000+</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#4A453E] block mb-1">
                  Project Location / City
                </label>
                <input
                  type="text"
                  placeholder="e.g. Manhattan, NY or International"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full bg-white border border-[#E4DCCF] rounded-xl px-4 py-2.5 text-xs text-[#1A1917] focus:outline-none focus:border-[#1A1917]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#4A453E] block mb-1">
                  Project Description & Specifications
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe your project requirements, space size, timeline goals..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full bg-white border border-[#E4DCCF] rounded-xl p-3 text-xs text-[#1A1917] focus:outline-none focus:border-[#1A1917] resize-none"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-[#1A1917] text-[#F5F0E8] py-3.5 rounded-full text-xs font-semibold hover:bg-[#33302B] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <Send className="w-4 h-4" />
                <span>Submit Consultation Request</span>
              </button>
              <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#887C6C] mt-2.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C5B097]" />
                <span>Your information is protected under NDA confidentiality standards.</span>
              </div>
            </div>
          </form>
        ) : (
          <div className="p-10 text-center space-y-5 my-auto">
            <div className="w-16 h-16 bg-[#1A1917] text-[#D5C7B3] rounded-full flex items-center justify-center mx-auto shadow-lg">
              <CheckCircle className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h3 className="font-serif text-3xl font-semibold text-[#1A1917]">
                Consultation Request Received
              </h3>
              <p className="text-xs text-[#6B6358] max-w-md mx-auto font-light leading-relaxed">
                Thank you, <strong className="font-semibold text-[#1A1917]">{formData.name}</strong>. Our senior architectural consultant will review your specifications and contact you within 24 hours to finalize your initial consultation.
              </p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-[#E4DCCF] text-left text-xs text-[#5A534A] space-y-1 max-w-md mx-auto">
              <div><strong>Service:</strong> {formData.service}</div>
              <div><strong>Budget:</strong> {formData.budget}</div>
              {formData.location && <div><strong>Location:</strong> {formData.location}</div>}
            </div>

            <button
              onClick={handleResetAndClose}
              className="bg-[#1A1917] text-[#F5F0E8] px-8 py-3 rounded-full text-xs font-medium hover:bg-[#33302B] transition-all cursor-pointer"
            >
              Return to Website
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
