import React, { useState } from 'react';
import { VisualAsset } from './VisualAsset';
import { Maximize2, X, CheckCircle2 } from 'lucide-react';

interface GalleryItem {
  id: string;
  type: 'showroom' | 'paints' | 'laminates' | 'plywood' | 'chemicals' | 'warehouse';
  title: string;
  category: 'Showroom' | 'Paints' | 'Laminates' | 'Materials' | 'Logistics';
  caption: string;
  location: string;
  verificationBadge: string;
}

const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'gal-1',
    type: 'showroom',
    title: 'Architectural Laminate Display & Swatch Racks',
    category: 'Showroom',
    caption: 'Full-size 8ft x 4ft sliding display racks for designers to inspect textures, matte finishes, and synchronized wood grains under natural daylight.',
    location: 'Bengaluru Trade Showroom',
    verificationBadge: 'Verified Trade Display',
  },
  {
    id: 'gal-2',
    type: 'paints',
    title: 'Commercial Paint Dispensing & Tinting Station',
    category: 'Paints',
    caption: 'Asian Paints automated color mixing setup enabling precise contractor shade matching for interior Royale and exterior Apex formulations.',
    location: 'Trade Depot Tinting Counter',
    verificationBadge: 'Authorized Reseller Stock',
  },
  {
    id: 'gal-3',
    type: 'laminates',
    title: '1.0mm Decorative Laminate Consignment',
    category: 'Laminates',
    caption: 'Curated collection of high-pressure decorative sheets from i-Lam, Abhiyan Lam, and premium mica collections ready for immediate delivery.',
    location: 'Bengaluru Depot',
    verificationBadge: 'Wholesale Inventory',
  },
  {
    id: 'gal-4',
    type: 'plywood',
    title: 'CenturyPly Marine IS:710 Plywood Stacks',
    category: 'Materials',
    caption: 'BWP boiling waterproof marine grade plywood pallets stored in dry, climate-regulated warehouse conditions.',
    location: 'Karnataka Central Warehouse',
    verificationBadge: 'Certified IS:710 Stock',
  },
  {
    id: 'gal-5',
    type: 'chemicals',
    title: 'Dr. Fixit Integral Waterproofing Compound Drums',
    category: 'Materials',
    caption: 'Consignments of 20L and 200L Pidilite Dr. Fixit 101 LW+ liquid admixtures for large infrastructure and residential concrete casting.',
    location: 'Chemical Storage Bay',
    verificationBadge: 'Direct Factory Consignment',
  },
  {
    id: 'gal-6',
    type: 'warehouse',
    title: 'Daily Logistics & Transport Vehicle Loading Bay',
    category: 'Logistics',
    caption: 'Heavy truck loading bay facilitating scheduled freight shipments across Bengaluru, Hubballi-Dharwad, Belagavi, and Mysuru.',
    location: 'Karnataka Logistics Bay',
    verificationBadge: 'Active Operations',
  },
];

export const GallerySection: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  const filters = ['All', 'Showroom', 'Paints', 'Laminates', 'Materials', 'Logistics'];

  const filteredItems =
    activeFilter === 'All'
      ? GALLERY_ITEMS
      : GALLERY_ITEMS.filter((item) => item.category === activeFilter);

  return (
    <section className="py-12 sm:py-16 bg-stone-50 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Section Header */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-amber-800">
              Commercial Depot & Facility
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-stone-950 mt-1">
              Showroom, Warehouse & Material Displays
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-xl">
              Authentic visual overview of S S Traders facilities, physical sample counters, and wholesale material stocks in Karnataka.
            </p>
          </div>

          {/* Interactive Filter Tabs (functional segmented control) */}
          <div className="flex items-center gap-1 p-1 bg-stone-200/80 rounded-xl overflow-x-auto text-xs">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap ${
                  activeFilter === filter
                    ? 'bg-white text-stone-950 shadow-xs font-bold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className="group cursor-pointer bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="relative">
                <VisualAsset
                  type={item.type}
                  title={item.title}
                  subtitle={item.location}
                  aspectRatio="4:3"
                />
                <div className="absolute inset-0 bg-stone-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="bg-stone-900/90 text-white p-2 rounded-full shadow-lg">
                    <Maximize2 className="w-4 h-4" />
                  </span>
                </div>
              </div>

              <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-[11px] font-mono text-stone-400 uppercase tracking-wide">
                    {item.location} · {item.category}
                  </div>
                  <h3 className="font-bold text-sm text-stone-900 mt-0.5 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">
                    {item.caption}
                  </p>
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
                  <span className="flex items-center gap-1 text-emerald-700 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{item.verificationBadge}</span>
                  </span>
                  <span className="font-mono text-amber-900 font-semibold group-hover:underline">
                    View Detail →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Lightbox Modal */}
      {selectedItem && (
        <div
          onClick={() => setSelectedItem(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-xs animate-in fade-in duration-150"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl border border-stone-300"
          >
            <div className="relative">
              <VisualAsset
                type={selectedItem.type}
                title={selectedItem.title}
                subtitle={selectedItem.location}
                aspectRatio="16:9"
              />
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 bg-stone-900/80 hover:bg-stone-900 text-white p-1.5 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-3">
              <div className="flex items-center justify-between text-xs text-stone-500 font-mono">
                <span>{selectedItem.location}</span>
                <span className="text-emerald-700 font-bold">{selectedItem.verificationBadge}</span>
              </div>
              <h3 className="font-display text-xl font-bold text-stone-900">
                {selectedItem.title}
              </h3>
              <p className="text-sm text-stone-700 leading-relaxed">
                {selectedItem.caption}
              </p>
              <div className="pt-4 border-t border-stone-200 text-xs text-stone-500 flex justify-between items-center">
                <span>All facilities and sample racks are accessible during regular trade hours.</span>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="px-4 py-1.5 bg-stone-900 text-white text-xs font-semibold rounded-lg"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
