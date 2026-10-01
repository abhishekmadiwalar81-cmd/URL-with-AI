import React, { useState } from 'react';
import { ProductItem } from '../types';
import { ProductCard } from './ProductCard';
import { Search, ShoppingBag, ArrowRight } from 'lucide-react';

interface ProductCatalogSectionProps {
  products: ProductItem[];
  onAddToQuote: (product: ProductItem) => void;
  quoteItems: ProductItem[];
  onRequestQuoteClick: () => void;
  whatsappNumber: string;
}

export const ProductCatalogSection: React.FC<ProductCatalogSectionProps> = ({
  products,
  onAddToQuote,
  quoteItems,
  onRequestQuoteClick,
  whatsappNumber,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    { id: 'all', label: 'All Offerings' },
    { id: 'paints', label: 'Paints & Coatings' },
    { id: 'laminates', label: 'Decorative Laminates' },
    { id: 'plywood', label: 'Plywood & Boards' },
    { id: 'chemicals', label: 'Waterproofing & Chemicals' },
    { id: 'hardware', label: 'Hardware & Storage' },
  ];

  const filteredProducts = products.filter((p) => {
    if (selectedCategory !== 'all' && p.category !== selectedCategory) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const quoteItemIds = new Set(quoteItems.map((q) => q.id));

  return (
    <section className="py-12 sm:py-16 bg-stone-50 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Section Header */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-amber-800">
              Verified Product Lines
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-stone-950 mt-1">
              Building Materials, Decorative Laminates & Coatings
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-xl">
              Strictly verified trade offerings sourced directly from manufacturer consignments in Karnataka.
            </p>
          </div>

          {/* Quote Cart Badge / Quick Action */}
          {quoteItems.length > 0 && (
            <button
              onClick={onRequestQuoteClick}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-amber-900 hover:bg-amber-950 rounded-xl shadow-xs transition-colors"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Quote Cart ({quoteItems.length} items)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Controls & Search */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white p-3 rounded-2xl border border-stone-200">
          
          {/* Segmented Control Filter Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto p-1 text-xs">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap ${
                  selectedCategory === c.id
                    ? 'bg-stone-900 text-white shadow-xs font-bold'
                    : 'text-stone-600 hover:text-stone-950 hover:bg-stone-100'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search paints, laminates, putty..."
              className="w-full pl-9 pr-3 py-2 text-xs border border-stone-300 rounded-xl bg-stone-50 focus:outline-none focus:ring-1 focus:ring-amber-900"
            />
          </div>

        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-2xl border border-stone-200 text-stone-500 text-xs">
            <p className="font-semibold text-stone-700">No products match your current filter.</p>
            <p className="mt-1 text-stone-400">Try clearing the search query or selecting &apos;All Offerings&apos;.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToQuote={onAddToQuote}
                isAddedToQuote={quoteItemIds.has(product.id)}
                whatsappNumber={whatsappNumber}
              />
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
