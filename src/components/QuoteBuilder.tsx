import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Building,
  User,
  Phone,
  Mail,
  MapPin,
  Send,
  MessageSquare,
} from 'lucide-react';
import { ProductItem, QuoteRequest, QuoteRequestItem } from '../types';

interface QuoteBuilderProps {
  products: ProductItem[];
  selectedProductList: ProductItem[];
  onRemoveFromQuote: (productId: string) => void;
  whatsappNumber: string;
}

const KARNATAKA_DISTRICTS = [
  'Bengaluru Urban',
  'Bengaluru Rural',
  'Dharwad / Hubballi',
  'Belagavi',
  'Mysuru',
  'Dakshina Kannada (Mangaluru)',
  'Kalaburagi',
  'Ballari',
  'Tumakuru',
  'Shivamogga',
  'Udupi',
  'Vijayapura',
  'Davangere',
  'Bagalkot',
  'Other Karnataka District',
];

export const QuoteBuilder: React.FC<QuoteBuilderProps> = ({
  products,
  selectedProductList,
  onRemoveFromQuote,
  whatsappNumber,
}) => {
  // Items in the quote
  const [items, setItems] = useState<QuoteRequestItem[]>(() => {
    return selectedProductList.map((p) => ({
      productId: p.id,
      productName: p.name,
      brand: p.brand,
      quantity: 10,
      unit: p.unit,
      note: '',
    }));
  });

  // Client Details
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [customerType, setCustomerType] = useState<QuoteRequest['customerType']>('contractor');
  const [deliveryDistrict, setDeliveryDistrict] = useState(KARNATAKA_DISTRICTS[0]);
  const [urgency, setUrgency] = useState<QuoteRequest['urgency']>('within_1_week');
  const [projectNotes, setProjectNotes] = useState('');

  // Submission State
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedQuote, setSubmittedQuote] = useState<QuoteRequest | null>(null);

  // Sync when selectedProductList changes
  React.useEffect(() => {
    setItems((prev) => {
      const existingIds = new Set(prev.map((i) => i.productId));
      const newItems = [...prev];
      selectedProductList.forEach((p) => {
        if (!existingIds.has(p.id)) {
          newItems.push({
            productId: p.id,
            productName: p.name,
            brand: p.brand,
            quantity: 10,
            unit: p.unit,
            note: '',
          });
        }
      });
      return newItems;
    });
  }, [selectedProductList]);

  const handleAddItemFromDropdown = (productId: string) => {
    const prod = products.find((p) => p.id === productId);
    if (!prod) return;
    if (items.some((i) => i.productId === prod.id)) return;
    setItems([
      ...items,
      {
        productId: prod.id,
        productName: prod.name,
        brand: prod.brand,
        quantity: 10,
        unit: prod.unit,
        note: '',
      },
    ]);
  };

  const handleUpdateItem = (index: number, field: keyof QuoteRequestItem, val: any) => {
    const copy = [...items];
    copy[index] = { ...copy[index], [field]: val };
    setItems(copy);
  };

  const handleRemoveItem = (index: number, productId: string) => {
    setItems(items.filter((_, i) => i !== index));
    onRemoveFromQuote(productId);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!items.length) {
      setError('Please add at least one material item to the quote request.');
      return;
    }
    if (!customerName.trim()) {
      setError('Please enter your name.');
      return;
    }
    const cleanPhone = phone.replace(/[\s-]/g, '');
    if (!/^(?:\+91|91|0)?[6-9]\d{9}$/.test(cleanPhone)) {
      setError('Please enter a valid 10-digit Indian phone number.');
      return;
    }
    if (!email.includes('@')) {
      setError('Please enter a valid email.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: customerName.trim(),
          phone: cleanPhone.startsWith('+91') ? cleanPhone : `+91 ${cleanPhone.replace(/^0/, '')}`,
          email: email.trim(),
          companyName: companyName.trim(),
          customerType,
          deliveryDistrict,
          urgency,
          items,
          projectNotes: projectNotes.trim(),
        }),
      });

      const resData = await res.json();
      if (!res.ok || !resData.success) {
        throw new Error(resData.error || 'Failed to submit quote request');
      }
      setSubmittedQuote(resData.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Generate WhatsApp Direct Quote Text
  const generateWhatsAppQuoteText = (quote: QuoteRequest) => {
    const lines = [
      `*Wholesale Rate Card Request (${quote.referenceCode})*`,
      `*Client:* ${quote.customerName} (${quote.companyName || quote.customerType})`,
      `*Phone:* ${quote.phone}`,
      `*Delivery District:* ${quote.deliveryDistrict}, Karnataka`,
      `*Timeline:* ${quote.urgency.replace(/_/g, ' ')}`,
      ``,
      `*Requested Materials:*`,
      ...quote.items.map(
        (it, idx) =>
          `${idx + 1}. ${it.productName} (${it.brand}) — *Qty: ${it.quantity} ${it.unit}* ${
            it.note ? `[${it.note}]` : ''
          }`
      ),
      ``,
      `*Project Notes:* ${quote.projectNotes || 'None'}`,
      `Please provide lowest GST invoice wholesale pricing.`,
    ];
    return encodeURIComponent(lines.join('\n'));
  };

  const cleanWhatsapp = whatsappNumber.replace(/\D/g, '');

  return (
    <div className="bg-white border border-stone-200 rounded-2xl shadow-sm overflow-hidden">
      
      {/* Header */}
      <div className="bg-stone-900 text-stone-100 p-6 sm:p-8">
        <span className="text-[11px] font-mono uppercase tracking-widest text-amber-400">
          Direct Commercial Pricing
        </span>
        <h2 className="font-display text-2xl font-bold text-white mt-1">
          Wholesale Quotation & Rate Card Request
        </h2>
        <p className="text-xs text-stone-400 mt-1 max-w-2xl">
          Get competitive volume rate slabs for Asian Paints, Dr. Fixit chemical compounds, CenturyPly marine plywood, and 1mm decorative laminates. Deliveries dispatched across Karnataka.
        </p>
      </div>

      <div className="p-6 sm:p-8">
        
        {submittedQuote ? (
          <div className="space-y-6 animate-in zoom-in-95 duration-200 text-stone-900">
            <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-600 text-white mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-display text-xl font-bold text-emerald-950">
                Wholesale Quote Request Received!
              </h3>
              <p className="text-xs text-emerald-800 max-w-lg mx-auto">
                Reference ID: <strong className="font-mono">{submittedQuote.referenceCode}</strong>. Our commercial billing team is reviewing your Bill of Quantities and will prepare your official GST rate card.
              </p>
            </div>

            {/* Quote Summary */}
            <div className="bg-stone-50 border border-stone-200 rounded-xl p-5 space-y-3 text-xs">
              <div className="font-bold text-stone-900 text-sm border-b border-stone-200 pb-2">
                Itemized Materials ({submittedQuote.items.length})
              </div>
              <div className="divide-y divide-stone-200">
                {submittedQuote.items.map((item, idx) => (
                  <div key={idx} className="py-2.5 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-stone-900">{item.productName}</div>
                      <div className="text-[11px] text-stone-500 font-mono">
                        Brand: {item.brand} {item.note && `· Note: ${item.note}`}
                      </div>
                    </div>
                    <div className="text-right font-mono font-bold text-stone-800">
                      {item.quantity} {item.unit}
                    </div>
                  </div>
                ))}
              </div>
              <div className="pt-3 border-t border-stone-200 text-stone-600 text-[11px] flex justify-between">
                <span>Destination: {submittedQuote.deliveryDistrict}, Karnataka</span>
                <span>Urgency: {submittedQuote.urgency.replace(/_/g, ' ')}</span>
              </div>
            </div>

            {/* Direct WhatsApp Action */}
            <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs text-emerald-900">
                <strong className="block">Need immediate quotation within 30 minutes?</strong>
                <span>Dispatch your itemized request directly to our Wholesale Sales Desk on WhatsApp.</span>
              </div>

              <a
                href={`https://wa.me/${cleanWhatsapp}?text=${generateWhatsAppQuoteText(submittedQuote)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-sm transition-colors whitespace-nowrap"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Send to WhatsApp Trade Desk</span>
              </a>
            </div>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setSubmittedQuote(null);
                  setItems([]);
                }}
                className="text-xs font-semibold text-amber-900 hover:underline"
              >
                Create Another Wholesale Quote
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8 text-xs">
            
            {error && (
              <div className="p-3.5 bg-red-50 border border-red-200 rounded-lg text-red-800 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* SECTION 1: Materials List */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-200 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-stone-900">1. Bill of Quantities / Required Materials</h3>
                  <p className="text-[11px] text-stone-500">
                    Add verified catalog items or specify customized volume requirements.
                  </p>
                </div>

                {/* Dropdown to add more products */}
                <select
                  onChange={(e) => {
                    if (e.target.value) {
                      handleAddItemFromDropdown(e.target.value);
                      e.target.value = '';
                    }
                  }}
                  className="px-3 py-1.5 text-xs border border-stone-300 rounded-lg bg-stone-50 focus:outline-none focus:ring-1 focus:ring-amber-900"
                >
                  <option value="">+ Add Product from Catalog</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.brand})
                    </option>
                  ))}
                </select>
              </div>

              {items.length === 0 ? (
                <div className="p-8 text-center bg-stone-50 rounded-xl border border-dashed border-stone-300 text-stone-500">
                  <FileText className="w-8 h-8 mx-auto text-stone-400 mb-2" />
                  <p className="font-medium">Your quote cart is currently empty.</p>
                  <p className="text-[11px] text-stone-400 mt-1">
                    Select a product from the dropdown above or browse our verified catalog to add items.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {items.map((item, index) => (
                    <div
                      key={item.productId}
                      className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center"
                    >
                      <div className="sm:col-span-5">
                        <div className="font-bold text-stone-900">{item.productName}</div>
                        <div className="text-[11px] text-stone-500 font-mono">Brand: {item.brand}</div>
                      </div>

                      <div className="sm:col-span-3 flex items-center gap-2">
                        <label className="text-stone-500 text-[10px] uppercase font-mono">Qty:</label>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) =>
                            handleUpdateItem(index, 'quantity', parseInt(e.target.value) || 1)
                          }
                          className="w-20 px-2 py-1 bg-white border border-stone-300 rounded text-center font-mono font-bold"
                        />
                        <span className="text-stone-500 text-[11px] truncate">{item.unit}</span>
                      </div>

                      <div className="sm:col-span-3">
                        <input
                          type="text"
                          value={item.note || ''}
                          onChange={(e) => handleUpdateItem(index, 'note', e.target.value)}
                          placeholder="Shade code / thickness..."
                          className="w-full px-2 py-1 bg-white border border-stone-300 rounded text-[11px]"
                        />
                      </div>

                      <div className="sm:col-span-1 text-right">
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(index, item.productId)}
                          className="p-1 text-stone-400 hover:text-red-700 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* SECTION 2: Customer & Delivery Details */}
            <div className="space-y-4 pt-4 border-t border-stone-200">
              <h3 className="text-sm font-bold text-stone-900">2. Commercial Buyer & Delivery Information</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-stone-800 mb-1">
                    Contact Person Name <span className="text-amber-800">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Anand Kulkarni"
                      className="w-full pl-9 pr-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-900 bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-stone-800 mb-1">
                    Mobile Phone (WhatsApp Enabled) <span className="text-amber-800">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 94480 12345"
                      className="w-full pl-9 pr-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-900 bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-stone-800 mb-1">
                    Official Email (For GST Quote PDF) <span className="text-amber-800">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="anand@kulkarni-infra.in"
                      className="w-full pl-9 pr-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-900 bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-stone-800 mb-1">
                    Company / Firm Name
                  </label>
                  <div className="relative">
                    <Building className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g. Kulkarni Infrastructure LLP"
                      className="w-full pl-9 pr-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-900 bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-stone-800 mb-1">Buyer Profile</label>
                  <select
                    value={customerType}
                    onChange={(e) => setCustomerType(e.target.value as any)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-amber-900"
                  >
                    <option value="contractor">Commercial / Painting Contractor</option>
                    <option value="architect">Architect & Interior Consultant</option>
                    <option value="dealer_reseller">Retail Hardware / Paint Store Dealer</option>
                    <option value="retail_homeowner">Residential Individual Homeowner</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-800 mb-1">
                    Delivery District (Karnataka)
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                    <select
                      value={deliveryDistrict}
                      onChange={(e) => setDeliveryDistrict(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 border border-stone-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-amber-900"
                    >
                      {KARNATAKA_DISTRICTS.map((dist) => (
                        <option key={dist} value={dist}>
                          {dist}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="sm:col-span-2 lg:col-span-3">
                  <label className="block font-bold text-stone-800 mb-1">
                    Project Location Details & Delivery Instructions
                  </label>
                  <textarea
                    rows={2}
                    value={projectNotes}
                    onChange={(e) => setProjectNotes(e.target.value)}
                    placeholder="Specific unloading requirements, site address, GSTIN if ready for billing..."
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-amber-900"
                  />
                </div>
              </div>
            </div>

            {/* Submit Action */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-stone-200">
              <div className="text-stone-500 text-[11px]">
                Official GST 18% / 28% Input Tax Credit available on all commercial invoices.
              </div>

              <button
                type="submit"
                disabled={submitting || items.length === 0}
                className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-semibold text-white bg-amber-900 hover:bg-amber-950 disabled:bg-stone-300 rounded-lg shadow-sm transition-colors whitespace-nowrap"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{submitting ? 'Generating Rate Card...' : 'Submit Wholesale Quotation Request'}</span>
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
