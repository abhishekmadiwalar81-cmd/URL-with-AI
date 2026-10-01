import React from 'react';
import { X, Shield } from 'lucide-react';

interface PolicyModalProps {
  type: 'privacy' | 'terms' | 'booking' | null;
  onClose: () => void;
}

export const PolicyModal: React.FC<PolicyModalProps> = ({ type, onClose }) => {
  if (!type) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/75 backdrop-blur-xs animate-in fade-in duration-150 text-stone-900">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="p-6 bg-stone-900 text-stone-100 flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-900 flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base">
                {type === 'privacy' && 'Customer Data & Privacy Policy'}
                {type === 'terms' && 'Commercial Terms of Wholesale Trade'}
                {type === 'booking' && 'Depot Visit & Appointment Scheduling Policy'}
              </h3>
              <p className="text-xs text-stone-400">S S Traders · Karnataka Commercial Operations</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Policy Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs text-stone-700 leading-relaxed">
          {type === 'privacy' && (
            <>
              <h4 className="font-bold text-sm text-stone-900">1. Information Collection & Usage</h4>
              <p>
                S S Traders collects customer contact details (Name, Mobile Number, Email, and Project Requirements) solely for processing product quotation requests, scheduling showroom visits, and facilitating delivery dispatches within Karnataka. We do not sell, rent, or transfer client records to third-party telemarketers.
              </p>

              <h4 className="font-bold text-sm text-stone-900">2. Communications & Notifications</h4>
              <p>
                By booking a visit or requesting a wholesale quotation, you authorize S S Traders to dispatch order confirmations, reference codes, appointment reminders, and quotation PDFs to your designated phone number via WhatsApp and SMS in accordance with Indian telecom regulations.
              </p>

              <h4 className="font-bold text-sm text-stone-900">3. Data Security & Retention</h4>
              <p>
                Commercial records and GSTIN details are retained in secured internal databases to comply with statutory Karnataka Commercial Taxes audits and warranty validation.
              </p>
            </>
          )}

          {type === 'terms' && (
            <>
              <h4 className="font-bold text-sm text-stone-900">1. Quotations & Price Validity</h4>
              <p>
                Due to fluctuations in raw material indices (chemicals, polymers, resin, and imported timber core), wholesale rate cards issued by S S Traders remain valid for 7 calendar days from issuance unless explicitly stated otherwise in the written GST quotation.
              </p>

              <h4 className="font-bold text-sm text-stone-900">2. Minimum Order Quantities (MOQ)</h4>
              <p>
                Wholesale contractor rate tiers apply to specified minimum pack sizes (e.g. 5x 20L paint drums, 5x laminate sheets, or 100 sq.ft of marine plywood). Smaller quantities can be purchased directly over the counter at standard retail prices.
              </p>

              <h4 className="font-bold text-sm text-stone-900">3. Transit & Inspection</h4>
              <p>
                Consignments dispatched via regional Karnataka freight carriers must be inspected upon unloading at the delivery site. Any transit damage to laminate corners or leaking paint containers must be endorsed on the transporter consignment note (LR) within 24 hours.
              </p>
            </>
          )}

          {type === 'booking' && (
            <>
              <h4 className="font-bold text-sm text-stone-900">1. Showroom Appointment Protocol</h4>
              <p>
                Scheduled visits reserve a consultation desk and a dedicated materials advisor. Please arrive within 15 minutes of your chosen slot (Asia/Kolkata). If delayed, your slot remains open for 30 minutes before releasing to walk-in contractors.
              </p>

              <h4 className="font-bold text-sm text-stone-900">2. Free Rescheduling & Cancellation</h4>
              <p>
                There is zero cancellation fee. Contractors and homeowners can reschedule or cancel visits at any time using their unique reference code (e.g. SST-VISIT-2026-XXXX) via our online portal.
              </p>

              <h4 className="font-bold text-sm text-stone-900">3. Sample Availability</h4>
              <p>
                While we stock extensive samples across Asian Paints, Dr. Fixit, and decorative laminate books, rare or imported luxury veneers should be specified during online booking so our staff can prepare physical sheets from the warehouse beforehand.
              </p>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-100 border-t border-stone-200 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-stone-900 text-white rounded-lg text-xs font-semibold hover:bg-stone-800"
          >
            Close Policy
          </button>
        </div>

      </div>
    </div>
  );
};
