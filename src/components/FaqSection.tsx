import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
  category: 'Orders & Delivery' | 'Pricing & Invoicing' | 'Visits & Appointments' | 'Product Authenticity';
}

const FAQS: FaqItem[] = [
  {
    category: 'Orders & Delivery',
    question: 'Does S S Traders deliver materials across Karnataka outside Bengaluru?',
    answer: 'Yes. While our primary showroom and distribution trade counter is based in Bengaluru, we regularly dispatch consolidated freight consignments across all Karnataka districts, including Hubballi-Dharwad, Belagavi, Mysuru, Kalaburagi, and Mangaluru. Full truckload (FTL) and less-than-truckload (LTL) options are coordinated via trusted regional transport lines.',
  },
  {
    category: 'Pricing & Invoicing',
    question: 'Do you provide official GST tax invoices for contractor input credit?',
    answer: 'Absolutely. Every commercial transaction is backed by a computerized GST tax invoice compliant with Karnataka Commercial Taxes (State Code 29). Contractors, infrastructure builders, and corporate interior studios can claim their 18% or 28% Input Tax Credit (ITC) with complete compliance.',
  },
  {
    category: 'Pricing & Invoicing',
    question: 'What are the accepted payment terms for wholesale orders?',
    answer: 'We accept RTGS, NEFT, IMPS, and official Business UPI transfers. For established contractors with regular ongoing supply agreements, dedicated billing terms can be structured upon verification. Direct retail sales at the depot counter can be settled via UPI, credit/debit cards, or cash.',
  },
  {
    category: 'Visits & Appointments',
    question: 'Why should I schedule a showroom visit instead of just walking in?',
    answer: 'Walk-ins are always welcome during business hours! However, scheduling a visit guarantees that a dedicated specialist (such as our Architectural Laminate Specialist or Coatings Advisor) is assigned to you with your desired 8x4 swatch panels or shade formulas pre-arranged on the desk, saving you valuable site time.',
  },
  {
    category: 'Visits & Appointments',
    question: 'Can I reschedule or cancel my visit if my site work gets delayed?',
    answer: 'Yes, easily. Using the "Lookup Visit" tool on our website, simply enter your booking reference code (e.g. SST-VISIT-2026-XXXX) or phone number to reschedule to an open slot or cancel without penalty.',
  },
  {
    category: 'Product Authenticity',
    question: 'Are Asian Paints, Dr. Fixit, and CenturyPly products 100% genuine?',
    answer: 'Yes. We strictly source through authorized regional manufacturer depots and certified distributor lines. All CenturyPly boards carry genuine IS:710 embossments and serial numbers. Paint buckets and waterproofing chemical canisters are untampered factory sealed with active batch codes.',
  },
  {
    category: 'Product Authenticity',
    question: 'Can architects and interior designers request physical laminate sample chips?',
    answer: 'Yes. Visiting architects and designers can inspect our full 8ft x 4ft sliding displays and receive curated compact swatch catalogs from i-Lam, Abhiyan Lam, and mica collections for client presentations.',
  },
];

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="py-12 sm:py-16 bg-stone-100 border-b border-stone-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-amber-900">
            <HelpCircle className="w-4 h-4 text-amber-800" />
            <span>Frequently Asked Questions</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-stone-950">
            Trading Policies, Delivery & Depot Protocols
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 max-w-xl mx-auto">
            Everything you need to know about purchasing, visits, and wholesale consignments with S S Traders in Karnataka.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 focus:outline-none"
                >
                  <span className="font-bold text-sm text-stone-900 leading-snug">
                    {faq.question}
                  </span>
                  <span className="p-1 rounded-md bg-stone-100 text-stone-600">
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </span>
                </button>

                {isOpen && (
                  <div className="px-4 pb-5 sm:px-5 text-xs sm:text-[13px] text-stone-600 leading-relaxed border-t border-stone-100 pt-3">
                    <p>{faq.answer}</p>
                    <div className="mt-2 text-[10px] font-mono text-stone-400 uppercase tracking-wide">
                      Category: {faq.category}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
