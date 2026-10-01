import React from 'react';
import { VisualAsset } from './VisualAsset';
import { ShieldCheck, Truck, Layers, FileSpreadsheet } from 'lucide-react';

interface AboutSectionProps {
  onOpenAudit: () => void;
  onScheduleVisit: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({
  onOpenAudit,
  onScheduleVisit,
}) => {
  return (
    <section className="py-12 sm:py-20 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Top Header */}
        <div className="max-w-3xl space-y-3">
          <span className="text-[11px] font-mono uppercase tracking-widest text-amber-800">
            About S S Traders · Karnataka, India
          </span>
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-stone-950 leading-tight">
            Built on Trade Transparency, Genuine Material Batch Sourcing & Technical Reliability
          </h2>
          <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
            Operating in the heart of Karnataka&apos;s commercial building corridors, S S Traders delivers architectural surface materials, commercial paints, waterproofing chemicals, and hardware to contractors, architects, and institutions.
          </p>
        </div>

        {/* 2-Column Story & Visual Display */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Visual Asset Display */}
          <div className="lg:col-span-5 space-y-4">
            <div className="rounded-2xl overflow-hidden border border-stone-200 shadow-md">
              <VisualAsset
                type="laminates"
                title="S S Traders Swatch Studio"
                subtitle="High-Pressure Decorative Laminates & Architectural Veneers"
                aspectRatio="4:3"
              />
            </div>
            
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between text-xs text-stone-600">
              <span className="font-mono">Registered Trade Entity · Karnataka</span>
              <button
                onClick={onOpenAudit}
                className="text-amber-900 font-semibold hover:underline"
              >
                View Verification Audit →
              </button>
            </div>
          </div>

          {/* Right Column: Values & Commercial Capabilities */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              <div className="space-y-2">
                <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm text-stone-900">
                  100% Factory-Sealed Batches
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  We eliminate risks of diverted or adulterated chemicals. Every bucket of Asian Paints, can of Dr. Fixit LW+, and CenturyPly sheet is verified with authentic serial numbers and manufacturer warranties.
                </p>
              </div>

              <div className="space-y-2">
                <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center">
                  <Layers className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm text-stone-900">
                  Physical 8x4 Full-Scale Inspection
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Small catalog chips cannot replicate real daylight room illumination. Our showroom sliding racks allow clients to inspect actual 8ft x 4ft sheets before committing to wardrobe and paneling orders.
                </p>
              </div>

              <div className="space-y-2">
                <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm text-stone-900">
                  Official Karnataka GST Billing
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Clear, tax-compliant invoicing with Karnataka State Code 29. Full Input Tax Credit (ITC) reconciliation for institutional contractors and corporate infrastructure developers.
                </p>
              </div>

              <div className="space-y-2">
                <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center">
                  <Truck className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm text-stone-900">
                  Statewide Freight Network
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Scheduled dispatches to site locations across Bengaluru, Hubballi, Belagavi, Mysuru, and Mangaluru. Daily packing protocols protect laminate edges and fragile coatings.
                </p>
              </div>

            </div>

            <div className="pt-4 flex items-center gap-4">
              <button
                onClick={onScheduleVisit}
                className="px-5 py-2.5 bg-amber-900 hover:bg-amber-950 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
              >
                Schedule an In-Person Consultation
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
