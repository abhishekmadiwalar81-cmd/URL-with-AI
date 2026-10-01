import React, { useState } from 'react';
import { Menu, X, CalendarCheck, Phone, Shield } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenLookup: () => void;
  onOpenAdmin: () => void;
  phone: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenLookup,
  onOpenAdmin,
  phone,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-stone-50/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => handleNavClick('home')}
          className="font-display text-xl sm:text-2xl font-bold tracking-tight text-stone-900 hover:text-amber-800 transition-colors whitespace-nowrap focus:outline-none"
        >
          S S Traders
        </button>

        {/* Zone 2: Clean text navigation links (4-5 items) */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-stone-700">
          <button
            onClick={() => handleNavClick('products')}
            className={`transition-colors hover:text-stone-950 whitespace-nowrap ${
              activeTab === 'products' ? 'text-amber-900 font-semibold underline underline-offset-8 decoration-2 decoration-amber-800' : ''
            }`}
          >
            Products
          </button>
          <button
            onClick={() => handleNavClick('booking')}
            className={`transition-colors hover:text-stone-950 whitespace-nowrap ${
              activeTab === 'booking' ? 'text-amber-900 font-semibold underline underline-offset-8 decoration-2 decoration-amber-800' : ''
            }`}
          >
            Schedule Visit
          </button>
          <button
            onClick={() => handleNavClick('quote')}
            className={`transition-colors hover:text-stone-950 whitespace-nowrap ${
              activeTab === 'quote' ? 'text-amber-900 font-semibold underline underline-offset-8 decoration-2 decoration-amber-800' : ''
            }`}
          >
            Wholesale Quote
          </button>
          <button
            onClick={() => handleNavClick('gallery')}
            className={`transition-colors hover:text-stone-950 whitespace-nowrap ${
              activeTab === 'gallery' ? 'text-amber-900 font-semibold underline underline-offset-8 decoration-2 decoration-amber-800' : ''
            }`}
          >
            Showroom & Depot
          </button>
          <button
            onClick={() => handleNavClick('contact')}
            className={`transition-colors hover:text-stone-950 whitespace-nowrap ${
              activeTab === 'contact' ? 'text-amber-900 font-semibold underline underline-offset-8 decoration-2 decoration-amber-800' : ''
            }`}
          >
            Contact
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={onOpenLookup}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-700 hover:text-stone-950 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors whitespace-nowrap"
            title="Check existing visit booking or quotation status"
          >
            <CalendarCheck className="w-3.5 h-3.5 text-amber-800" />
            <span>Lookup Visit</span>
          </button>

          <button
            onClick={() => handleNavClick('booking')}
            className="inline-flex items-center justify-center px-4 py-2 text-xs font-semibold text-white bg-amber-900 hover:bg-amber-950 rounded-lg shadow-sm transition-colors whitespace-nowrap"
          >
            Schedule Visit
          </button>
        </div>

        {/* Mobile Hamburger & Quick Action */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={onOpenLookup}
            className="p-2 text-stone-700 hover:text-stone-900 bg-stone-100 rounded-lg"
            aria-label="Lookup booking"
          >
            <CalendarCheck className="w-4 h-4 text-amber-900" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-stone-700 hover:text-stone-900 rounded-lg focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-stone-200 bg-stone-50 px-4 pt-3 pb-6 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col space-y-2 text-sm font-medium">
            <button
              onClick={() => handleNavClick('home')}
              className="text-left px-3 py-2 rounded-md hover:bg-stone-100 text-stone-800"
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick('products')}
              className="text-left px-3 py-2 rounded-md hover:bg-stone-100 text-stone-800"
            >
              Verified Products
            </button>
            <button
              onClick={() => handleNavClick('booking')}
              className="text-left px-3 py-2 rounded-md bg-amber-50 text-amber-900 font-semibold"
            >
              Schedule Depot Visit
            </button>
            <button
              onClick={() => handleNavClick('quote')}
              className="text-left px-3 py-2 rounded-md hover:bg-stone-100 text-stone-800"
            >
              Wholesale Quotation
            </button>
            <button
              onClick={() => handleNavClick('gallery')}
              className="text-left px-3 py-2 rounded-md hover:bg-stone-100 text-stone-800"
            >
              Showroom & Depot Gallery
            </button>
            <button
              onClick={() => handleNavClick('contact')}
              className="text-left px-3 py-2 rounded-md hover:bg-stone-100 text-stone-800"
            >
              Contact & Directions
            </button>
          </div>

          <div className="pt-3 border-t border-stone-200 flex flex-col gap-2">
            <a
              href={`tel:${phone.replace(/\s+/g, '')}`}
              className="flex items-center justify-center gap-2 w-full py-2.5 px-4 text-xs font-semibold text-stone-800 bg-stone-200 rounded-lg"
            >
              <Phone className="w-3.5 h-3.5 text-stone-700" />
              <span>Call Depot: {phone}</span>
            </a>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="flex items-center justify-center gap-2 w-full py-2 text-xs font-medium text-stone-600 hover:text-stone-900"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Management Portal</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
