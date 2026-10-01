import React from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';

interface TrustHeaderBannerProps {
  onOpenAudit: () => void;
  onOpenAdmin: () => void;
}

export const TrustHeaderBanner: React.FC<TrustHeaderBannerProps> = ({
  onOpenAudit,
  onOpenAdmin,
}) => {
  return (
    <div className="bg-stone-900 text-stone-300 text-xs py-2 px-4 border-b border-stone-800">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Verified Trade Listing</span>
          </span>
          <span className="text-stone-600 hidden sm:inline">·</span>
          <span className="hidden sm:inline text-stone-400">
            Karnataka, India · Architectural Laminates, Paints & Construction Supplies
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenAudit}
            className="inline-flex items-center gap-1 text-amber-300 hover:text-amber-200 transition-colors text-xs underline underline-offset-2"
          >
            <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>Verification Audit & Owner Notice</span>
          </button>
          <span className="text-stone-700 hidden sm:inline">|</span>
          <button
            onClick={onOpenAdmin}
            className="hidden sm:inline text-stone-400 hover:text-stone-200 transition-colors text-xs"
          >
            Owner Console
          </button>
        </div>
      </div>
    </div>
  );
};
