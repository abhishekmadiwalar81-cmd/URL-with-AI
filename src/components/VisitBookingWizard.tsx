import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  Building,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Share2,
  CalendarPlus,
  RefreshCw,
  Database,
} from 'lucide-react';
import { VisitBooking } from '../types';
import { getAvailableDateOptions, formatISTDate } from '../utils/time';
import { saveBookingToSupabase } from '../utils/supabaseClient';

interface SlotInfo {
  slot: string;
  available: boolean;
  remainingCapacity?: number;
  reason?: string;
}

interface VisitBookingWizardProps {
  onSuccessRedirect?: (referenceCode: string) => void;
  depotAddress: string;
  depotPhone: string;
}

export const VisitBookingWizard: React.FC<VisitBookingWizardProps> = ({
  depotAddress,
  depotPhone,
}) => {
  const [step, setStep] = useState<number>(1);
  const dateOptions = getAvailableDateOptions(21);

  // Form State
  const [purpose, setPurpose] = useState<VisitBooking['purpose']>('laminate_selection');
  const [specialist, setSpecialist] = useState<VisitBooking['specialist']>('laminate_specialist');
  const [selectedDate, setSelectedDate] = useState<string>(dateOptions[0].dateStr);
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  
  // Customer Details
  const [customerName, setCustomerName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [companyName, setCompanyName] = useState<string>('');
  const [estimatedScope, setEstimatedScope] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  // API State
  const [slotsLoading, setSlotsLoading] = useState<boolean>(false);
  const [availableSlots, setAvailableSlots] = useState<SlotInfo[]>([]);
  const [isDateBlocked, setIsDateBlocked] = useState<boolean>(false);
  const [blockReason, setBlockReason] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [createdBooking, setCreatedBooking] = useState<VisitBooking | null>(null);

  // Fetch slot availability from backend whenever selectedDate changes
  useEffect(() => {
    let isMounted = true;
    async function fetchAvailability() {
      setSlotsLoading(true);
      setSelectedSlot('');
      try {
        const res = await fetch(`/api/bookings/availability?date=${selectedDate}`);
        const data = await res.json();
        if (isMounted && data.success) {
          setIsDateBlocked(data.isBlocked);
          setBlockReason(data.blockReason || '');
          setAvailableSlots(data.slots || []);
          // Auto select first available slot if any
          const firstAvail = data.slots.find((s: SlotInfo) => s.available);
          if (firstAvail) {
            setSelectedSlot(firstAvail.slot);
          }
        }
      } catch (err) {
        console.error('Failed to load slots', err);
      } finally {
        if (isMounted) setSlotsLoading(false);
      }
    }
    fetchAvailability();
    return () => {
      isMounted = false;
    };
  }, [selectedDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    // Validation
    if (!customerName.trim()) {
      setSubmitError('Please enter your full name.');
      return;
    }
    const cleanPhone = phone.replace(/[\s-]/g, '');
    if (!/^(?:\+91|91|0)?[6-9]\d{9}$/.test(cleanPhone)) {
      setSubmitError('Please enter a valid 10-digit Indian mobile number (e.g. +91 98450 12345).');
      return;
    }
    if (!email.includes('@') || !email.includes('.')) {
      setSubmitError('Please enter a valid email address.');
      return;
    }
    if (!selectedSlot) {
      setSubmitError('Please select a visit time slot.');
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: customerName.trim(),
          phone: cleanPhone.startsWith('+91') ? cleanPhone : `+91 ${cleanPhone.replace(/^0/, '')}`,
          email: email.trim(),
          companyName: companyName.trim(),
          purpose,
          specialist,
          date: selectedDate,
          timeSlot: selectedSlot,
          estimatedScope: estimatedScope.trim(),
          notes: notes.trim(),
        }),
      });

      const resData = await response.json();

      if (!response.ok || !resData.success) {
        throw new Error(resData.error || 'Failed to register appointment');
      }

      setCreatedBooking(resData.data);
      // Mirror to Supabase client-side as well
      saveBookingToSupabase(resData.data).catch((err) => console.warn('Supabase client sync:', err));
      setStep(4); // Success step
    } catch (err: any) {
      setSubmitError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const purposes = [
    {
      id: 'laminate_selection',
      title: 'Architectural Laminates & Veneers',
      desc: 'Physical 8x4 swatch review, textured finishes, and wood grain matching.',
      defaultSpecialist: 'laminate_specialist',
    },
    {
      id: 'paint_shade_consultation',
      title: 'Paint Shades & Waterproofing',
      desc: 'Asian Paints color cards, exterior weather coatings & Dr. Fixit chemical compounds.',
      defaultSpecialist: 'paints_expert',
    },
    {
      id: 'wholesale_inquiry',
      title: 'Wholesale & Commercial Volume',
      desc: 'Direct contractor pricing, GST invoice terms, and scheduled site dispatches.',
      defaultSpecialist: 'trade_advisor',
    },
    {
      id: 'contractor_meeting',
      title: 'Contractor Trade Partnership',
      desc: 'Ongoing material supply agreements, credit terms, and dedicated depot rep.',
      defaultSpecialist: 'trade_advisor',
    },
    {
      id: 'general_store_visit',
      title: 'General Trade Counter Visit',
      desc: 'Direct inspection of plywood, hardware, safelockers, and consumables.',
      defaultSpecialist: 'hardware_consultant',
    },
  ];

  const specialists = [
    { id: 'laminate_specialist', name: 'R. K. Sharma', role: 'Architectural Surface Specialist' },
    { id: 'paints_expert', name: 'Girish Kumar', role: 'Coatings & Waterproofing Advisor' },
    { id: 'trade_advisor', name: 'Abhishek M.', role: 'Senior Commercial Accounts Manager' },
    { id: 'hardware_consultant', name: 'Basavaraj P.', role: 'Plywood & Hardware Consultant' },
  ];

  // Calendar Link Generator
  const generateGoogleCalendarUrl = (booking: VisitBooking) => {
    const startTime = booking.date.replace(/-/g, '') + 'T050000Z'; // Approximate UTC for morning slot
    const endTime = booking.date.replace(/-/g, '') + 'T060000Z';
    const text = encodeURIComponent(`S S Traders Depot Visit (${booking.referenceCode})`);
    const details = encodeURIComponent(
      `Appointment at S S Traders Depot for ${booking.purpose.replace(/_/g, ' ')}. Ref: ${booking.referenceCode}. Contact: ${depotPhone}`
    );
    const location = encodeURIComponent(depotAddress);
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${startTime}/${endTime}&details=${details}&location=${location}`;
  };

  return (
    <div className="bg-white border border-stone-200 rounded-2xl shadow-sm overflow-hidden">
      
      {/* Wizard Progress Header */}
      <div className="bg-stone-900 text-stone-100 p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-amber-400">
              Commercial Depot Scheduling
            </span>
            <h2 className="font-display text-2xl font-bold text-white mt-1">
              Schedule Showroom & Depot Visit
            </h2>
            <p className="text-xs text-stone-400 mt-1 max-w-xl">
              Inspect physical 8x4 laminate samples, test paint sheens, or finalize volume contractor pricing with our trade specialists in Bengaluru.
            </p>
          </div>

          <div className="bg-stone-800/90 border border-stone-700 px-3 py-2 rounded-lg text-right">
            <div className="text-[10px] font-mono text-stone-400">Timezone</div>
            <div className="text-xs font-semibold text-amber-300 font-mono">Asia/Kolkata (IST)</div>
          </div>
        </div>

        {/* Step Indicator */}
        {step < 4 && (
          <div className="flex items-center gap-2 mt-6 pt-4 border-t border-stone-800 text-xs">
            <span className={`px-2.5 py-1 rounded font-mono ${step === 1 ? 'bg-amber-900 text-white font-bold' : 'text-stone-400 bg-stone-800'}`}>
              01. Consultation Purpose
            </span>
            <span className="text-stone-600">→</span>
            <span className={`px-2.5 py-1 rounded font-mono ${step === 2 ? 'bg-amber-900 text-white font-bold' : 'text-stone-400 bg-stone-800'}`}>
              02. Date & IST Time Slot
            </span>
            <span className="text-stone-600">→</span>
            <span className={`px-2.5 py-1 rounded font-mono ${step === 3 ? 'bg-amber-900 text-white font-bold' : 'text-stone-400 bg-stone-800'}`}>
              03. Client Details
            </span>
          </div>
        )}
      </div>

      {/* Step Content */}
      <div className="p-6 sm:p-8">
        
        {/* STEP 1: Purpose & Specialist */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <label className="block text-sm font-bold text-stone-900 mb-3">
                Select Purpose of Showroom Visit:
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {purposes.map((p) => {
                  const isSelected = purpose === p.id;
                  return (
                    <div
                      key={p.id}
                      onClick={() => {
                        setPurpose(p.id as VisitBooking['purpose']);
                        setSpecialist(p.defaultSpecialist as VisitBooking['specialist']);
                      }}
                      className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                        isSelected
                          ? 'border-amber-900 bg-amber-50/60 ring-1 ring-amber-900 shadow-xs'
                          : 'border-stone-200 hover:border-stone-300 bg-white'
                      }`}
                    >
                      <div className="font-semibold text-stone-900 text-sm">{p.title}</div>
                      <div className="text-xs text-stone-600 mt-1">{p.desc}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-stone-900 mb-3">
                Assigned Specialist Advisor:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {specialists.map((s) => {
                  const isSelected = specialist === s.id;
                  return (
                    <div
                      key={s.id}
                      onClick={() => setSpecialist(s.id as VisitBooking['specialist'])}
                      className={`p-3 rounded-lg border text-left cursor-pointer transition-all ${
                        isSelected
                          ? 'border-amber-900 bg-stone-900 text-white shadow-xs'
                          : 'border-stone-200 hover:border-stone-300 bg-stone-50 text-stone-900'
                      }`}
                    >
                      <div className="font-bold text-xs">{s.name}</div>
                      <div className={`text-[11px] mt-0.5 ${isSelected ? 'text-stone-300' : 'text-stone-500'}`}>
                        {s.role}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-stone-200">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-semibold text-white bg-amber-900 hover:bg-amber-950 rounded-lg shadow-sm transition-colors"
              >
                <span>Continue to Date & Slot</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Date & Slot Selection */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Date selection strip */}
            <div>
              <label className="block text-sm font-bold text-stone-900 mb-2">
                1. Select Visit Date (Next 3 Weeks):
              </label>
              <p className="text-xs text-stone-500 mb-3">
                Showroom opens Mon–Sat 9:30 AM – 8:00 PM | Sun 10:00 AM – 2:00 PM IST
              </p>
              
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2 max-h-48 overflow-y-auto p-1">
                {dateOptions.map((opt) => {
                  const isSelected = selectedDate === opt.dateStr;
                  return (
                    <button
                      key={opt.dateStr}
                      type="button"
                      onClick={() => setSelectedDate(opt.dateStr)}
                      className={`p-2.5 rounded-lg border text-center transition-all ${
                        isSelected
                          ? 'border-amber-900 bg-amber-900 text-white shadow-xs font-bold'
                          : 'border-stone-200 hover:border-stone-400 bg-stone-50 text-stone-800'
                      }`}
                    >
                      <div className="text-[10px] uppercase font-mono tracking-tight opacity-80">
                        {opt.isSunday ? 'Sun (Half-Day)' : opt.label.split(' ')[0]}
                      </div>
                      <div className="text-sm font-bold mt-0.5">
                        {opt.label.split(' ').slice(1).join(' ')}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Slot selection */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-bold text-stone-900">
                  2. Select Available Time Slot for {formatISTDate(selectedDate)}:
                </label>
                <span className="text-[11px] font-mono text-stone-500">
                  IST (UTC+05:30)
                </span>
              </div>

              {slotsLoading ? (
                <div className="p-8 text-center bg-stone-50 rounded-xl border border-stone-200 text-stone-500 text-xs flex items-center justify-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin text-amber-800" />
                  <span>Checking real-time slot availability...</span>
                </div>
              ) : isDateBlocked ? (
                <div className="p-6 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-800 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Showroom Depot Closed on this date:</span>
                    <p className="mt-1">{blockReason || 'Scheduled inventory / state holiday.'}</p>
                    <p className="mt-1 text-stone-600">Please choose an alternate working day from the date selector above.</p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {availableSlots.map((slotInfo) => {
                    const isSelected = selectedSlot === slotInfo.slot;
                    return (
                      <button
                        key={slotInfo.slot}
                        type="button"
                        disabled={!slotInfo.available}
                        onClick={() => setSelectedSlot(slotInfo.slot)}
                        className={`p-3.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                          !slotInfo.available
                            ? 'bg-stone-100 border-stone-200 text-stone-400 cursor-not-allowed opacity-60'
                            : isSelected
                            ? 'border-amber-900 bg-amber-50/70 ring-1 ring-amber-900 text-stone-900 shadow-xs'
                            : 'border-stone-200 hover:border-stone-300 bg-white text-stone-800'
                        }`}
                      >
                        <div>
                          <div className="text-xs font-bold font-mono">{slotInfo.slot}</div>
                          <div className="text-[10px] mt-0.5">
                            {slotInfo.available ? (
                              <span className="text-emerald-700 font-medium">Slot Open · Desk Reserved</span>
                            ) : (
                              <span className="text-stone-500">Fully Reserved</span>
                            )}
                          </div>
                        </div>
                        <Clock className={`w-4 h-4 ${isSelected ? 'text-amber-900' : 'text-stone-400'}`} />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-stone-200">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-stone-700 hover:text-stone-900"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>

              <button
                type="button"
                disabled={!selectedSlot || isDateBlocked}
                onClick={() => setStep(3)}
                className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-semibold text-white bg-amber-900 hover:bg-amber-950 disabled:bg-stone-300 disabled:cursor-not-allowed rounded-lg shadow-sm transition-colors"
              >
                <span>Continue to Client Details</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Client Details & Submission */}
        {step === 3 && (
          <form onSubmit={handleSubmit} className="space-y-5 animate-in fade-in duration-200">
            {submitError && (
              <div className="p-3.5 bg-red-50 border border-red-200 rounded-lg text-red-800 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{submitError}</span>
              </div>
            )}

            {/* Visit Summary Card */}
            <div className="bg-stone-100 p-4 rounded-xl border border-stone-200 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div>
                <span className="text-stone-500 font-mono text-[10px] uppercase block">Scheduled Slot</span>
                <span className="font-bold text-stone-900 text-sm">
                  {formatISTDate(selectedDate)} · {selectedSlot} (IST)
                </span>
              </div>
              <div>
                <span className="text-stone-500 font-mono text-[10px] uppercase block">Focus & Specialist</span>
                <span className="font-medium text-stone-800">
                  {purposes.find(p => p.id === purpose)?.title}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  Full Name <span className="text-amber-800">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Ramesh Patil"
                    className="w-full pl-9 pr-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-900 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  Mobile Number (WhatsApp Enabled) <span className="text-amber-800">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98450 12345"
                    className="w-full pl-9 pr-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-900 bg-white"
                  />
                </div>
                <span className="text-[10px] text-stone-500 mt-0.5 block">
                  Confirmation & depot directions will be sent to this number.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  Email Address <span className="text-amber-800">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. ramesh@gmail.com"
                    className="w-full pl-9 pr-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-900 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  Architecture Firm / Company (Optional)
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Patil Interiors & Builders"
                    className="w-full pl-9 pr-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-900 bg-white"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  Estimated Project Scope (Approximate sq.ft / Units)
                </label>
                <input
                  type="text"
                  value={estimatedScope}
                  onChange={(e) => setEstimatedScope(e.target.value)}
                  placeholder="e.g. 3BHK Villa interior (35 laminate sheets + 150L paint)"
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-900 bg-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  Specific Requirements or Samples to Pre-Arrange
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Please specify specific catalog brand or thickness you want prepared for your arrival..."
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-900 bg-white"
                />
              </div>
            </div>

            {/* Policy & Terms Note */}
            <div className="text-[11px] text-stone-500 bg-stone-50 p-3 rounded-lg border border-stone-200">
              <span className="font-semibold text-stone-700">Depot Visit Policy:</span> Showroom appointments are guaranteed with dedicated specialist advisory desk. Free parking is available for contractor trucks and commercial vehicles. Rescheduling or cancellation is available anytime using your reference code.
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-stone-200">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-stone-700 hover:text-stone-900"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-semibold text-white bg-amber-900 hover:bg-amber-950 disabled:bg-stone-400 rounded-lg shadow-sm transition-colors"
              >
                {submitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Verifying Slot & Saving...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirm Depot Visit</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* STEP 4: Success & Confirmation Pass */}
        {step === 4 && createdBooking && (
          <div className="space-y-6 text-stone-900 animate-in zoom-in-95 duration-200">
            <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-600 text-white mx-auto flex items-center justify-center shadow-sm">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-display text-xl font-bold text-emerald-950">
                Showroom Visit Registered Successfully!
              </h3>
              <p className="text-xs text-emerald-800 max-w-md mx-auto">
                Your visit to S S Traders has been saved in our system. A confirmation notification has been queued for WhatsApp and SMS dispatch.
              </p>
              
              <div className="flex flex-wrap items-center justify-center gap-2">
                <div className="inline-block bg-white border border-emerald-300 px-4 py-2 rounded-xl shadow-xs">
                  <span className="text-[10px] uppercase font-mono text-stone-400 block">Unique Booking Reference</span>
                  <span className="text-base font-bold font-mono tracking-wider text-stone-950">
                    {createdBooking.referenceCode}
                  </span>
                </div>

                <div className="inline-flex items-center gap-1.5 bg-emerald-100/80 border border-emerald-300 px-3 py-2 rounded-xl text-emerald-900 text-xs font-mono">
                  <Database className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Supabase: qyoqamviapkknidyspkc</span>
                </div>
              </div>
            </div>

            {/* Visit Pass Details */}
            <div className="bg-stone-50 border border-stone-200 rounded-xl p-5 space-y-3 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <span className="text-stone-400 font-mono text-[10px] uppercase block">Client Name</span>
                  <span className="font-bold text-stone-900">{createdBooking.customerName}</span>
                </div>
                <div>
                  <span className="text-stone-400 font-mono text-[10px] uppercase block">Date & Time</span>
                  <span className="font-bold text-stone-900">{formatISTDate(createdBooking.date)}</span>
                  <span className="block font-mono text-stone-600 text-[11px]">{createdBooking.timeSlot} IST</span>
                </div>
                <div>
                  <span className="text-stone-400 font-mono text-[10px] uppercase block">Assigned Advisor</span>
                  <span className="font-medium text-stone-900">
                    {specialists.find(s => s.id === createdBooking.specialist)?.name}
                  </span>
                </div>
                <div>
                  <span className="text-stone-400 font-mono text-[10px] uppercase block">Depot Desk</span>
                  <span className="font-medium text-stone-900">Desk 01 (Commercial Counter)</span>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-200 flex flex-wrap items-center justify-between gap-2 text-stone-600">
                <div>
                  <span className="font-semibold text-stone-800">Depot Address: </span>
                  <span>{depotAddress}</span>
                </div>
                <div className="font-mono text-stone-500 text-[11px]">
                  Status: <span className="text-amber-800 font-semibold uppercase">{createdBooking.status}</span>
                </div>
              </div>
            </div>

            {/* Simulated WhatsApp / SMS Dispatch Preview */}
            <div className="bg-stone-900 text-stone-200 p-4 rounded-xl text-xs space-y-2 border border-stone-800">
              <div className="flex items-center justify-between text-stone-400 text-[10px] font-mono">
                <span className="flex items-center gap-1 text-emerald-400">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Simulated Notification Dispatched</span>
                </span>
                <span>To: {createdBooking.phone}</span>
              </div>
              <p className="font-mono text-[11px] text-stone-300 bg-stone-950/80 p-2.5 rounded border border-stone-800">
                &ldquo;Namaskara {createdBooking.customerName}! Your visit to S S Traders depot on {createdBooking.date} at {createdBooking.timeSlot} (Asia/Kolkata) is registered. Reference: {createdBooking.referenceCode}. For queries: {depotPhone}&rdquo;
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <a
                href={generateGoogleCalendarUrl(createdBooking)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-stone-800 bg-stone-100 hover:bg-stone-200 rounded-lg border border-stone-300 transition-colors"
              >
                <CalendarPlus className="w-3.5 h-3.5 text-amber-800" />
                <span>Add to Google Calendar</span>
              </a>

              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setCreatedBooking(null);
                  setSelectedSlot('');
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-amber-900 hover:text-amber-950"
              >
                <span>Book another appointment</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        )}

      </div>

    </div>
  );
};
