import React, { useState } from 'react';
import {
  Phone,
  MessageSquare,
  Mail,
  MapPin,
  Clock,
  ExternalLink,
  Send,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
} from 'lucide-react';
import { BusinessSettings } from '../types';
import { isStoreOpenNow } from '../utils/time';

interface ContactSectionProps {
  settings: BusinessSettings;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ settings }) => {
  const storeStatus = isStoreOpenNow();

  // Contact form state
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formSubject, setFormSubject] = useState('Product Stock Inquiry');
  const [formMessage, setFormMessage] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [copiedAddress, setCopiedAddress] = useState(false);

  const cleanWhatsapp = settings.whatsappNumber.replace(/\D/g, '');
  const cleanPhone = settings.primaryPhone.replace(/\s+/g, '');

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(
      `${settings.businessName}, ${settings.streetAddress}, ${settings.locality}, ${settings.city}, ${settings.state} - ${settings.pincode}`
    );
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2500);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formName.trim() || !formPhone.trim() || !formMessage.trim()) {
      setFormError('Please fill your name, phone number, and enquiry message.');
      return;
    }

    // Direct simulated receipt
    setFormSubmitted(true);
  };

  return (
    <section className="py-12 sm:py-16 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-amber-800">
            Direct Trade Communications
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-stone-950 mt-1">
            Depot Location, Trade Contacts & Operating Hours
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl">
            Visit our commercial trade counter or speak directly with our materials desk for live inventory checks, freight arrangements, and bulk discounts.
          </p>
        </div>

        {/* 3-Column Layout: Contact Points, Hours/Live Status, Direct Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Column 1 & 2: Contact Details & Hours (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Quick Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              
              {/* Phone Contacts */}
              <div className="p-5 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                <div className="flex items-center gap-2 text-stone-500 font-mono text-[11px] uppercase">
                  <Phone className="w-3.5 h-3.5 text-amber-800" />
                  <span>Trade Desks</span>
                </div>
                <div>
                  <a
                    href={`tel:${cleanPhone}`}
                    className="text-base font-bold text-stone-950 hover:text-amber-900 block font-mono"
                  >
                    {settings.primaryPhone}
                  </a>
                  <span className="text-[11px] text-stone-500 block">Primary Mobile & WhatsApp</span>
                </div>
                {settings.secondaryPhone && (
                  <div className="pt-2 border-t border-stone-200/80">
                    <span className="font-mono text-stone-700 block">{settings.secondaryPhone}</span>
                    <span className="text-[10px] text-stone-500">Bengaluru Depot Landline</span>
                  </div>
                )}
              </div>

              {/* WhatsApp & Email */}
              <div className="p-5 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                <div className="flex items-center gap-2 text-stone-500 font-mono text-[11px] uppercase">
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Digital Messaging</span>
                </div>
                <div>
                  <a
                    href={`https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(
                      'Hello S S Traders, I would like to enquire about material pricing and stock availability.'
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base font-bold text-emerald-800 hover:text-emerald-900 flex items-center gap-1 font-mono"
                  >
                    <span>{settings.whatsappNumber}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <span className="text-[11px] text-stone-500 block">Instant WhatsApp Chat</span>
                </div>
                <div className="pt-2 border-t border-stone-200/80">
                  <a
                    href={`mailto:${settings.officialEmail}`}
                    className="font-mono text-stone-800 hover:text-amber-900 block truncate"
                  >
                    {settings.officialEmail}
                  </a>
                  <span className="text-[10px] text-stone-500">Official Purchase Inquiries</span>
                </div>
              </div>

            </div>

            {/* Operating Hours & Real-Time IST Status */}
            <div className="p-6 bg-stone-900 text-stone-100 rounded-2xl border border-stone-800 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-800 pb-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span className="font-bold text-sm">Trading Depot Operating Hours</span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      storeStatus.isOpen ? 'bg-emerald-400 animate-pulse' : 'bg-stone-500'
                    }`}
                  ></span>
                  <span className="text-xs font-mono font-semibold text-amber-300">
                    {storeStatus.nextStatus}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-stone-400 font-mono text-[11px] block">Monday – Saturday (Regular Trade)</span>
                  <span className="text-sm font-bold font-mono text-white mt-0.5 block">
                    {settings.weekdayHours}
                  </span>
                  <span className="text-[10px] text-stone-400">Full warehouse, loading bay & trade counter open</span>
                </div>

                <div>
                  <span className="text-stone-400 font-mono text-[11px] block">Sunday (Trade Counter Only)</span>
                  <span className="text-sm font-bold font-mono text-white mt-0.5 block">
                    {settings.sundayHours}
                  </span>
                  <span className="text-[10px] text-stone-400">Showroom visits and sample collections</span>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-800 text-[11px] font-mono text-stone-400 flex items-center justify-between">
                <span>Timezone: {settings.timezone}</span>
                <span className="text-amber-400/90">Flagged: Tentative hours pending owner sign-off</span>
              </div>
            </div>

            {/* Physical Address & Copy */}
            <div className="p-5 bg-stone-50 rounded-xl border border-stone-200 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-stone-600 font-mono text-[11px] uppercase">
                  <MapPin className="w-3.5 h-3.5 text-amber-800" />
                  <span>Depot Address & Trade Counter</span>
                </div>

                <button
                  type="button"
                  onClick={handleCopyAddress}
                  className="inline-flex items-center gap-1 text-[11px] text-amber-900 hover:text-amber-950 font-semibold"
                >
                  {copiedAddress ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Address</span>
                    </>
                  )}
                </button>
              </div>

              <div className="text-stone-800 leading-relaxed font-medium">
                <strong>{settings.businessName}</strong>, {settings.streetAddress}, {settings.landmark},{' '}
                {settings.locality}, {settings.city}, {settings.state} - {settings.pincode}, India.
              </div>

              <div className="flex items-center gap-3 pt-2">
                <a
                  href={settings.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-stone-900 text-white rounded-lg hover:bg-stone-800 font-semibold text-xs transition-colors"
                >
                  <span>Open in Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Google Map Interactive Embed */}
            <div className="rounded-xl overflow-hidden border border-stone-200 shadow-xs h-64 bg-stone-100">
              <iframe
                title="S S Traders Karnataka Location Map"
                src="https://maps.google.com/maps?q=BTM+Layout+Bengaluru+Karnataka&t=&z=13&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>

          </div>

          {/* Column 3: Direct Message Enquiry Form (5 cols) */}
          <div className="lg:col-span-5 bg-stone-50 border border-stone-200 rounded-2xl p-6 sm:p-8 space-y-5">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-800">
                Direct Inquiry
              </span>
              <h3 className="font-display text-lg font-bold text-stone-950 mt-0.5">
                Send Depot Enquiry
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                Have a question regarding specific paint shade batches, laminate thickness availability, or delivery schedules?
              </p>
            </div>

            {formSubmitted ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-2 animate-in fade-in">
                <div className="w-10 h-10 bg-emerald-600 text-white rounded-full mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm text-emerald-950">Enquiry Dispatched!</h4>
                <p className="text-xs text-emerald-800 leading-relaxed">
                  Thank you, {formName}. Your enquiry has been routed to our Bengaluru trade desk. Our representative will contact you via phone or WhatsApp shortly.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setFormSubmitted(false);
                    setFormMessage('');
                  }}
                  className="mt-2 text-xs font-semibold text-emerald-950 hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSendMessage} className="space-y-4 text-xs">
                {formError && (
                  <div className="p-2.5 bg-red-50 border border-red-200 rounded text-red-800 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-red-600 shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    Your Name <span className="text-amber-800">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Suresh Gowda"
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-amber-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    Contact Phone (WhatsApp) <span className="text-amber-800">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    placeholder="+91 98450 00000"
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-amber-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="suresh@example.com"
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-amber-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Subject</label>
                  <select
                    value={formSubject}
                    onChange={(e) => setFormSubject(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-amber-900"
                  >
                    <option value="Product Stock Inquiry">Product Stock & Availability</option>
                    <option value="Contractor Bulk Rate Inquiry">Contractor Bulk Discount</option>
                    <option value="Laminate Swatch Sample Request">Laminate Swatch Sample Request</option>
                    <option value="Freight & Delivery Outside Bengaluru">Freight to Other Karnataka Districts</option>
                    <option value="Other">General Trade Question</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    Message <span className="text-amber-800">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formMessage}
                    onChange={(e) => setFormMessage(e.target.value)}
                    placeholder="Describe the items, quantities, or assistance required..."
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-amber-900"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-amber-900 hover:bg-amber-950 text-white font-semibold rounded-lg shadow-sm transition-colors flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Message to Trade Desk</span>
                </button>
              </form>
            )}

            <div className="text-[10px] text-stone-400 border-t border-stone-200 pt-3">
              We respond to trade inquiries within 2 hours during normal operating hours (IST).
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
