import React from 'react';
import { ArrowRight, Calendar, FileText, CheckCircle2, MapPin, Clock } from 'lucide-react';
import { VisualAsset } from './VisualAsset';
import { isStoreOpenNow } from '../utils/time';

interface HeroProps {
  onScheduleVisit: () => void;
  onRequestQuote: () => void;
  onExploreProducts: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onScheduleVisit,
  onRequestQuote,
  onExploreProducts,
}) => {
  const storeStatus = isStoreOpenNow();

  return (
    <section className="relative overflow-hidden bg-stone-100 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Editorial Value Proposition & Actions */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Clean unboxed metadata with typographic separators */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-stone-600 font-medium">
              <span className="flex items-center gap-1 text-amber-900">
                <MapPin className="w-3.5 h-3.5" />
                <span>Karnataka, India</span>
              </span>
              <span aria-hidden="true" className="text-stone-400">·</span>
              <span>Commercial & Retail Trading</span>
              <span aria-hidden="true" className="text-stone-400">·</span>
              <span>GST Registered</span>
              <span aria-hidden="true" className="text-stone-400">·</span>
              <span className="flex items-center gap-1 text-emerald-800">
                <Clock className="w-3.5 h-3.5" />
                <span>{storeStatus.nextStatus}</span>
              </span>
            </div>

            {/* Main Headline with text-wrap: balance */}
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-stone-950 leading-[1.15] text-balance">
              Wholesale & Retail Building Materials, Architectural Laminates & Paints
            </h1>

            {/* Sub-prose */}
            <p className="text-base sm:text-lg text-stone-700 max-w-2xl leading-relaxed">
              Serving contractors, architects, interior designers, and commercial builders across Karnataka. Official trade consignments of Asian Paints, Dr. Fixit waterproofing, CenturyPly BWP plywood, and premium 1mm decorative laminates.
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onScheduleVisit}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-amber-900 hover:bg-amber-950 rounded-lg shadow-sm transition-all duration-150 whitespace-nowrap"
              >
                <Calendar className="w-4 h-4" />
                <span>Schedule Depot Visit</span>
              </button>

              <button
                onClick={onRequestQuote}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-stone-900 bg-white hover:bg-stone-50 border border-stone-300 rounded-lg shadow-xs transition-all duration-150 whitespace-nowrap"
              >
                <FileText className="w-4 h-4 text-amber-800" />
                <span>Request Wholesale Quote</span>
              </button>

              <button
                onClick={onExploreProducts}
                className="inline-flex items-center gap-1 text-xs font-semibold text-stone-600 hover:text-stone-950 px-2 py-2 transition-colors whitespace-nowrap"
              >
                <span>Browse verified catalog</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Trust indicators & verified trade assurances */}
            <div className="pt-6 border-t border-stone-200/80 grid grid-cols-3 gap-4 text-stone-800">
              <div>
                <div className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-stone-900">
                  100%
                </div>
                <div className="text-xs text-stone-500 font-medium mt-0.5">
                  Genuine Batch Sourcing
                </div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-stone-900">
                  IS:710
                </div>
                <div className="text-xs text-stone-500 font-medium mt-0.5">
                  Certified Marine Standards
                </div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-stone-900">
                  State 29
                </div>
                <div className="text-xs text-stone-500 font-medium mt-0.5">
                  Karnataka GST Invoicing
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Visual Focal Point showcasing trade products */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl overflow-hidden shadow-lg border border-stone-300/80 bg-white p-2">
              <VisualAsset
                type="showroom"
                title="S S Traders Trade Depot & Sample Studio"
                subtitle="Bengaluru Commercial Corridor, Karnataka"
                aspectRatio="4:3"
                className="rounded-xl"
              />
              <div className="p-4 bg-white rounded-b-xl flex items-center justify-between text-xs text-stone-600">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Physical Trade Counter & Material Displays</span>
                </div>
                <span className="font-mono text-stone-400">Bengaluru · KA</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
