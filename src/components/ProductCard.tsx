import React, { useState } from 'react';
import { ProductItem } from '../types';
import { VisualAsset } from './VisualAsset';
import { MessageSquare, Plus, Check, ChevronDown, ChevronUp } from 'lucide-react';

interface ProductCardProps {
  product: ProductItem;
  onAddToQuote: (product: ProductItem) => void;
  isAddedToQuote?: boolean;
  whatsappNumber: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToQuote,
  isAddedToQuote = false,
  whatsappNumber,
}) => {
  const [showSpecs, setShowSpecs] = useState(false);

  const cleanWhatsapp = whatsappNumber.replace(/\D/g, '');
  const whatsappUrl = `https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(
    `Hello S S Traders, I would like to enquire about wholesale availability and pricing for: ${product.name} (${product.brand}).`
  )}`;

  return (
    <div className="flex flex-col bg-white border border-stone-200/90 rounded-xl overflow-hidden shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
      
      {/* Product Visual Area */}
      <div className="relative">
        <VisualAsset
          type={product.category}
          title={product.brand}
          subtitle={product.name}
          aspectRatio="4:3"
        />
        {/* Maximum 1 subtle unboxed text tag */}
        <div className="absolute top-3 right-3 bg-stone-900/80 backdrop-blur-xs text-stone-200 text-[10px] font-mono px-2 py-0.5 rounded tracking-wide">
          {product.inStock ? 'In Stock' : 'Pre-Order'}
        </div>
      </div>

      {/* Card Content & Metadata */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        
        <div>
          {/* Unboxed Brand / Category metadata */}
          <div className="text-[11px] uppercase tracking-wider font-semibold text-stone-500 mb-1">
            <span>{product.brand}</span>
            <span aria-hidden="true" className="mx-1.5 text-stone-300">/</span>
            <span>{product.categoryLabel}</span>
          </div>

          {/* Product Name */}
          <h3 className="text-base font-bold text-stone-900 leading-snug">
            {product.name}
          </h3>

          {/* Description */}
          <p className="text-xs text-stone-600 mt-2 line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          {/* Collapsible Specs */}
          {product.specs && product.specs.length > 0 && (
            <div className="mt-3">
              <button
                type="button"
                onClick={() => setShowSpecs(!showSpecs)}
                className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-900 hover:text-amber-950 transition-colors"
              >
                <span>{showSpecs ? 'Hide specifications' : 'View specifications'}</span>
                {showSpecs ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>

              {showSpecs && (
                <ul className="mt-2 text-[11px] text-stone-600 space-y-1 bg-stone-50 p-2.5 rounded-lg border border-stone-100">
                  {product.specs.map((spec, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-amber-800 font-bold">·</span>
                      <span>{spec}</span>
                    </li>
                  ))}
                  <li className="pt-1 text-[10px] text-stone-400 font-mono">
                    MOQ: {product.minOrderQty}
                  </li>
                </ul>
              )}
            </div>
          )}
        </div>

        {/* Pricing & Commercial Action Row */}
        <div className="pt-3 border-t border-stone-100 flex flex-col gap-3">
          <div className="flex items-baseline justify-between">
            <div>
              <div className="text-[10px] uppercase font-mono tracking-wider text-stone-500">
                Indicative Rate
              </div>
              <div className="text-sm font-bold font-mono tabular-nums text-stone-900">
                {product.indicativePrice}
              </div>
            </div>
            <div className="text-[11px] text-stone-500 text-right">
              <span>{product.unit}</span>
            </div>
          </div>

          {/* Actions: Add to Quotation & WhatsApp Enquiry */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onAddToQuote(product)}
              className={`inline-flex items-center justify-center gap-1 px-3 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                isAddedToQuote
                  ? 'bg-emerald-800 text-white hover:bg-emerald-900'
                  : 'bg-stone-900 text-white hover:bg-stone-800'
              }`}
            >
              {isAddedToQuote ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Added</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add to Quote</span>
                </>
              )}
            </button>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1 px-3 py-2 text-xs font-semibold text-stone-800 bg-stone-100 hover:bg-stone-200 border border-stone-200 rounded-lg transition-colors whitespace-nowrap"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
              <span>WhatsApp</span>
            </a>
          </div>

        </div>

      </div>

    </div>
  );
};
