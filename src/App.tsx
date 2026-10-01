/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { TrustHeaderBanner } from './components/TrustHeaderBanner';
import { Hero } from './components/Hero';
import { AboutSection } from './components/AboutSection';
import { ProductCatalogSection } from './components/ProductCatalogSection';
import { VisitBookingWizard } from './components/VisitBookingWizard';
import { QuoteBuilder } from './components/QuoteBuilder';
import { GallerySection } from './components/GallerySection';
import { ContactSection } from './components/ContactSection';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { BookingLookupModal } from './components/BookingLookupModal';
import { AdminDashboard } from './components/AdminDashboard';
import { VerificationAuditModal } from './components/VerificationAuditModal';
import { PolicyModal } from './components/PolicyModal';
import { ProductItem, BusinessSettings, VerificationAuditItem } from './types';
import { ArrowRight, Layers, ShieldCheck, Truck, RefreshCw } from 'lucide-react';

const FALLBACK_SETTINGS: BusinessSettings = {
  businessName: 'S S Traders',
  registeredEntity: 'S S Traders Commercial & Trading Enterprises',
  tradeCategory: 'Building Materials, Architectural Laminates, Paints & Hardware',
  primaryPhone: '+91 96639 13174',
  secondaryPhone: '+91 80 4779 2460',
  whatsappNumber: '+91 96639 13174',
  officialEmail: 'sales@sstraders.co.in',
  streetAddress: 'No. 15, 9th Main Road, KEB Colony, BTM 1st Stage Commercial Corridor',
  landmark: 'Near Govt Bus Route & KEB Substation',
  locality: 'BTM Layout / Vijayanagar Hub',
  city: 'Bengaluru',
  district: 'Bengaluru Urban',
  state: 'Karnataka',
  pincode: '560029',
  googleMapsUrl: 'https://maps.google.com/?q=S+S+Traders+KEB+Colony+Bengaluru+Karnataka',
  googleMapsEmbedQuery: 'S S Traders, KEB Colony, Bengaluru, Karnataka 560029',
  weekdayHours: '09:30 AM – 08:00 PM IST',
  sundayHours: '10:00 AM – 02:00 PM IST',
  timezone: 'Asia/Kolkata (UTC+05:30)',
  gstinPlaceholder: '29XXXXX0000X1ZX (Verified Karnataka State Code: 29)',
  notificationSettings: {
    sendSmsAlerts: true,
    sendWhatsappAlerts: true,
    ownerEmailAlerts: true,
    ownerPhoneAlert: '+91 96639 13174',
  },
};

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [settings, setSettings] = useState<BusinessSettings>(FALLBACK_SETTINGS);
  const [auditItems, setAuditItems] = useState<VerificationAuditItem[]>([]);
  const [quoteBasket, setQuoteBasket] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Modal controls
  const [isLookupOpen, setIsLookupOpen] = useState<boolean>(false);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [isAuditOpen, setIsAuditOpen] = useState<boolean>(false);
  const [activePolicy, setActivePolicy] = useState<'privacy' | 'terms' | 'booking' | null>(null);

  const fetchData = async () => {
    try {
      const [prodRes, setRes, audRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/settings'),
        fetch('/api/audit'),
      ]);

      const [prodData, setData, audData] = await Promise.all([
        prodRes.json(),
        setRes.json(),
        audRes.json(),
      ]);

      if (prodData.success) setProducts(prodData.data);
      if (setData.success) setSettings(setData.data);
      if (audData.success) setAuditItems(audData.data);
    } catch (err) {
      console.warn('Backend API connection initialized or using local cache:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddToQuote = (product: ProductItem) => {
    if (!quoteBasket.some((p) => p.id === product.id)) {
      setQuoteBasket([...quoteBasket, product]);
    } else {
      // Toggle off if already added
      setQuoteBasket(quoteBasket.filter((p) => p.id !== product.id));
    }
  };

  const handleRemoveFromQuote = (productId: string) => {
    setQuoteBasket(quoteBasket.filter((p) => p.id !== productId));
  };

  const navigateTo = (tab: string) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900 selection:bg-amber-900 selection:text-white">
      
      {/* 1. Verified Trade & Owner Trust Banner */}
      <TrustHeaderBanner
        onOpenAudit={() => setIsAuditOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* 2. Top Bar Navigation (Strict 3-zone contract) */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={navigateTo}
        onOpenLookup={() => setIsLookupOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        phone={settings.primaryPhone}
      />

      {/* 3. Main Views */}
      <main className="flex-1">
        {loading ? (
          <div className="py-24 text-center text-xs text-stone-500 flex flex-col items-center justify-center gap-3">
            <RefreshCw className="w-6 h-6 animate-spin text-amber-900" />
            <p>Loading verified trade depot records for S S Traders, Karnataka...</p>
          </div>
        ) : (
          <>
            {/* VIEW: HOME */}
            {activeTab === 'home' && (
              <div className="space-y-0">
                {/* Hero */}
                <Hero
                  onScheduleVisit={() => navigateTo('booking')}
                  onRequestQuote={() => navigateTo('quote')}
                  onExploreProducts={() => navigateTo('products')}
                />

                {/* Trade Verticals Bento Overview */}
                <section className="py-12 bg-white border-b border-stone-200">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                    <div className="flex flex-wrap items-end justify-between gap-4">
                      <div>
                        <span className="text-[11px] font-mono uppercase tracking-widest text-amber-800">
                          Core Wholesale Verticals
                        </span>
                        <h2 className="font-display text-2xl font-bold text-stone-950 mt-1">
                          Verified Material Consignments
                        </h2>
                      </div>
                      <button
                        onClick={() => navigateTo('products')}
                        className="text-xs font-semibold text-amber-900 hover:text-amber-950 inline-flex items-center gap-1"
                      >
                        <span>View complete catalog ({products.length} lines)</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      
                      <div
                        onClick={() => navigateTo('products')}
                        className="p-5 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100/80 cursor-pointer transition-all space-y-3 group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-amber-900 text-white flex items-center justify-center">
                          <Layers className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className="font-bold text-sm text-stone-900 group-hover:text-amber-900 transition-colors">
                            Decorative Laminates
                          </h3>
                          <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                            1.0mm & 0.8mm high-pressure sheets, suede textures & synchronized wood grains (i-Lam / Abhiyan Lam).
                          </p>
                        </div>
                        <div className="text-[11px] text-amber-900 font-semibold flex items-center gap-1 pt-1">
                          <span>Browse 8x4 collections</span>
                          <span>→</span>
                        </div>
                      </div>

                      <div
                        onClick={() => navigateTo('products')}
                        className="p-5 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100/80 cursor-pointer transition-all space-y-3 group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-amber-900 text-white flex items-center justify-center">
                          <ShieldCheck className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className="font-bold text-sm text-stone-900 group-hover:text-amber-900 transition-colors">
                            Asian Paints Systems
                          </h3>
                          <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                            Royale Luxury Emulsions, Tractor Emulsion contractor packs, primers, and computerized shade mixing.
                          </p>
                        </div>
                        <div className="text-[11px] text-amber-900 font-semibold flex items-center gap-1 pt-1">
                          <span>Inspect paint formulations</span>
                          <span>→</span>
                        </div>
                      </div>

                      <div
                        onClick={() => navigateTo('products')}
                        className="p-5 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100/80 cursor-pointer transition-all space-y-3 group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-amber-900 text-white flex items-center justify-center">
                          <ShieldCheck className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className="font-bold text-sm text-stone-900 group-hover:text-amber-900 transition-colors">
                            Waterproofing Chemicals
                          </h3>
                          <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                            Dr. Fixit 101 LW+ integral compounds, acrylic polymers, and Aditya Birla white wall putty consignments.
                          </p>
                        </div>
                        <div className="text-[11px] text-amber-900 font-semibold flex items-center gap-1 pt-1">
                          <span>Review technical specs</span>
                          <span>→</span>
                        </div>
                      </div>

                      <div
                        onClick={() => navigateTo('products')}
                        className="p-5 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100/80 cursor-pointer transition-all space-y-3 group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-amber-900 text-white flex items-center justify-center">
                          <Truck className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className="font-bold text-sm text-stone-900 group-hover:text-amber-900 transition-colors">
                            Marine Plywood & Safes
                          </h3>
                          <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                            CenturyPly Club Prime IS:710 Marine boards, roller consignment packs, and Godrej digital safes.
                          </p>
                        </div>
                        <div className="text-[11px] text-amber-900 font-semibold flex items-center gap-1 pt-1">
                          <span>Explore hardware & boards</span>
                          <span>→</span>
                        </div>
                      </div>

                    </div>
                  </div>
                </section>

                {/* About & Values */}
                <AboutSection
                  onOpenAudit={() => setIsAuditOpen(true)}
                  onScheduleVisit={() => navigateTo('booking')}
                />

                {/* Featured Products Showcase */}
                <ProductCatalogSection
                  products={products}
                  onAddToQuote={handleAddToQuote}
                  quoteItems={quoteBasket}
                  onRequestQuoteClick={() => navigateTo('quote')}
                  whatsappNumber={settings.whatsappNumber}
                />

                {/* Direct Depot Visit Scheduler */}
                <section className="py-12 sm:py-16 bg-white border-b border-stone-200">
                  <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <VisitBookingWizard
                      depotAddress={`${settings.streetAddress}, ${settings.city}, Karnataka - ${settings.pincode}`}
                      depotPhone={settings.primaryPhone}
                    />
                  </div>
                </section>

                {/* Gallery */}
                <GallerySection />

                {/* FAQ */}
                <FaqSection />

                {/* Contact & Map */}
                <ContactSection settings={settings} />
              </div>
            )}

            {/* VIEW: PRODUCTS */}
            {activeTab === 'products' && (
              <ProductCatalogSection
                products={products}
                onAddToQuote={handleAddToQuote}
                quoteItems={quoteBasket}
                onRequestQuoteClick={() => navigateTo('quote')}
                whatsappNumber={settings.whatsappNumber}
              />
            )}

            {/* VIEW: BOOKING / SCHEDULE VISIT */}
            {activeTab === 'booking' && (
              <div className="py-12 sm:py-16 bg-stone-100 min-h-[80vh]">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="font-display text-2xl sm:text-3xl font-bold text-stone-950">
                        Schedule Showroom & Depot Visit
                      </h1>
                      <p className="text-xs sm:text-sm text-stone-600 mt-1">
                        Meet dedicated material advisors, review physical 8x4 swatch sheets, or negotiate volume contractor pricing.
                      </p>
                    </div>

                    <button
                      onClick={() => setIsLookupOpen(true)}
                      className="px-3 py-1.5 text-xs font-semibold text-stone-700 bg-white border border-stone-300 rounded-lg hover:bg-stone-50"
                    >
                      Lookup Existing Visit
                    </button>
                  </div>

                  <VisitBookingWizard
                    depotAddress={`${settings.streetAddress}, ${settings.city}, Karnataka - ${settings.pincode}`}
                    depotPhone={settings.primaryPhone}
                  />
                </div>
              </div>
            )}

            {/* VIEW: WHOLESALE QUOTE */}
            {activeTab === 'quote' && (
              <div className="py-12 sm:py-16 bg-stone-100 min-h-[80vh]">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                  <div>
                    <h1 className="font-display text-2xl sm:text-3xl font-bold text-stone-950">
                      Wholesale Rate Card & Quotation Request
                    </h1>
                    <p className="text-xs sm:text-sm text-stone-600 mt-1">
                      Direct B2B quotes for architects, interior designers, painting contractors, and developers across Karnataka.
                    </p>
                  </div>

                  <QuoteBuilder
                    products={products}
                    selectedProductList={quoteBasket}
                    onRemoveFromQuote={handleRemoveFromQuote}
                    whatsappNumber={settings.whatsappNumber}
                  />
                </div>
              </div>
            )}

            {/* VIEW: GALLERY */}
            {activeTab === 'gallery' && (
              <div>
                <GallerySection />
              </div>
            )}

            {/* VIEW: CONTACT */}
            {activeTab === 'contact' && (
              <div>
                <ContactSection settings={settings} />
              </div>
            )}
          </>
        )}
      </main>

      {/* 4. Footer */}
      <Footer
        settings={settings}
        onNavigate={navigateTo}
        onOpenLookup={() => setIsLookupOpen(true)}
        onOpenAudit={() => setIsAuditOpen(true)}
        onOpenPolicy={(policyType) => setActivePolicy(policyType)}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Modals */}
      <BookingLookupModal
        isOpen={isLookupOpen}
        onClose={() => setIsLookupOpen(false)}
        onBookingUpdated={fetchData}
      />

      <AdminDashboard
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        onRefreshData={fetchData}
      />

      <VerificationAuditModal
        isOpen={isAuditOpen}
        onClose={() => setIsAuditOpen(false)}
        auditItems={auditItems}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      <PolicyModal
        type={activePolicy}
        onClose={() => setActivePolicy(null)}
      />

    </div>
  );
}
