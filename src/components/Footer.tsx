import React from 'react';
import { MapPin, Phone, Mail, Shield, CheckCircle2, FileText, CalendarCheck } from 'lucide-react';
import { BusinessSettings } from '../types';

interface FooterProps {
  settings: BusinessSettings;
  onNavigate: (tabId: string) => void;
  onOpenLookup: () => void;
  onOpenAudit: () => void;
  onOpenPolicy: (type: 'privacy' | 'terms' | 'booking') => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  settings,
  onNavigate,
  onOpenLookup,
  onOpenAudit,
  onOpenPolicy,
  onOpenAdmin,
}) => {
  return (
    <footer className="bg-stone-900 text-stone-300 text-xs border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-12">
        
        {/* Main 4-Column Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
          
          {/* Column 1: Brand & Verified Identity (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <span className="font-display text-2xl font-bold tracking-tight text-white block">
              {settings.businessName}
            </span>
            <p className="text-stone-400 text-xs leading-relaxed max-w-sm">
              Wholesale distributor and retailer of architectural decorative laminates, commercial paints, waterproofing chemicals, and hardware materials across Karnataka, India.
            </p>

            <div className="flex items-center gap-2 text-[11px] text-stone-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>Karnataka Trade Verification Compliant (State Code 29)</span>
            </div>

            <div className="pt-1">
              <button
                onClick={onOpenAudit}
                className="inline-flex items-center gap-1.5 text-[11px] text-amber-300 hover:text-amber-200 underline underline-offset-2"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>View Verification Audit & Fact Sheet</span>
              </button>
            </div>
          </div>

          {/* Column 2: Trade Navigation (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-mono text-[11px] uppercase tracking-wider text-stone-400 font-bold">
              Trade Services
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigate('products')}
                  className="hover:text-white transition-colors"
                >
                  Verified Products
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('booking')}
                  className="hover:text-white transition-colors"
                >
                  Schedule Depot Visit
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('quote')}
                  className="hover:text-white transition-colors"
                >
                  Wholesale Quotations
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('gallery')}
                  className="hover:text-white transition-colors"
                >
                  Showroom Gallery
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenLookup}
                  className="hover:text-white transition-colors text-amber-300 font-semibold"
                >
                  Lookup Existing Visit
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Legal & Policies (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-mono text-[11px] uppercase tracking-wider text-stone-400 font-bold">
              Trade Governance & Policies
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onOpenPolicy('booking')}
                  className="hover:text-white transition-colors"
                >
                  Depot Visit & Reschedule Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenPolicy('terms')}
                  className="hover:text-white transition-colors"
                >
                  Terms of Wholesale Trade
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenPolicy('privacy')}
                  className="hover:text-white transition-colors"
                >
                  Customer Privacy & Data Protection
                </button>
              </li>
              <li>
                <a
                  href={settings.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Official Google Maps Listing →
                </a>
              </li>
              <li>
                <button
                  onClick={onOpenAdmin}
                  className="hover:text-amber-300 transition-colors text-stone-400 flex items-center gap-1"
                >
                  <Shield className="w-3 h-3" />
                  <span>Owner Administration</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Hours Snapshot (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-mono text-[11px] uppercase tracking-wider text-stone-400 font-bold">
              Depot Desk (Asia/Kolkata)
            </h4>
            <div className="space-y-1.5 text-stone-300 text-xs">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span className="leading-snug">
                  {settings.streetAddress}, {settings.city}, Karnataka - {settings.pincode}
                </span>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="font-mono">{settings.primaryPhone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="font-mono truncate">{settings.officialEmail}</span>
              </div>
            </div>

            <div className="pt-2 text-[11px] text-stone-400 border-t border-stone-800">
              <div>Mon–Sat: {settings.weekdayHours}</div>
              <div>Sunday: {settings.sundayHours}</div>
            </div>
          </div>

        </div>

        {/* Quiet Bottom Copyright Bar */}
        <div className="pt-8 border-t border-stone-800 flex flex-wrap items-center justify-between gap-4 text-stone-500 text-[11px]">
          <div>
            &copy; {new Date().getFullYear()} {settings.businessName}. All rights reserved. Commercial distributor in Karnataka, India.
          </div>
          <div className="flex items-center gap-4">
            <span>Timezone: Asia/Kolkata (IST)</span>
            <span>·</span>
            <span>IS:710 Marine Certified</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
