import React, { useState } from 'react';
import { X, Search, Calendar, Clock, AlertTriangle, CheckCircle2, RotateCcw, XCircle, RefreshCw } from 'lucide-react';
import { VisitBooking } from '../types';
import { getAvailableDateOptions, formatISTDate } from '../utils/time';

interface BookingLookupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookingUpdated?: () => void;
}

export const BookingLookupModal: React.FC<BookingLookupModalProps> = ({
  isOpen,
  onClose,
  onBookingUpdated,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [booking, setBooking] = useState<VisitBooking | null>(null);

  // Reschedule state
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleSlot, setRescheduleSlot] = useState('');
  const [rescheduleError, setRescheduleError] = useState<string | null>(null);
  const [rescheduleSlots, setRescheduleSlots] = useState<{ slot: string; available: boolean }[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);

  // Cancellation state
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const dateOptions = getAvailableDateOptions(14);

  if (!isOpen) return null;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setLoading(true);
    setError(null);
    setBooking(null);
    setActionSuccess(null);
    setIsRescheduling(false);
    setIsCancelling(false);

    try {
      const res = await fetch(`/api/bookings/${encodeURIComponent(searchTerm.trim())}`);
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'No visit found matching this reference code or phone number.');
      }
      setBooking(data.data);
      setRescheduleDate(data.data.date);
    } catch (err: any) {
      setError(err.message || 'Lookup failed. Please check the reference code.');
    } finally {
      setLoading(false);
    }
  };

  const loadSlotsForReschedule = async (dateStr: string) => {
    setRescheduleDate(dateStr);
    setSlotsLoading(true);
    setRescheduleSlot('');
    try {
      const res = await fetch(`/api/bookings/availability?date=${dateStr}`);
      const data = await res.json();
      if (data.success && data.slots) {
        setRescheduleSlots(data.slots);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSlotsLoading(false);
    }
  };

  const handleConfirmReschedule = async () => {
    if (!booking || !rescheduleDate || !rescheduleSlot) {
      setRescheduleError('Please select both a date and a time slot.');
      return;
    }
    setLoading(true);
    setRescheduleError(null);
    try {
      const res = await fetch(`/api/bookings/${booking.referenceCode}/reschedule`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          newDate: rescheduleDate,
          newTimeSlot: rescheduleSlot,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Could not reschedule visit');
      }
      setBooking(data.data);
      setIsRescheduling(false);
      setActionSuccess('Your visit has been successfully rescheduled to ' + formatISTDate(rescheduleDate) + ' at ' + rescheduleSlot + ' (Asia/Kolkata).');
      if (onBookingUpdated) onBookingUpdated();
    } catch (err: any) {
      setRescheduleError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmCancel = async () => {
    if (!booking) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/bookings/${booking.referenceCode}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'cancelled',
          reason: cancelReason || 'Customer requested cancellation via portal',
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to cancel appointment');
      }
      setBooking(data.data);
      setIsCancelling(false);
      setActionSuccess('Your visit has been cancelled. You may schedule a new visit at your convenience.');
      if (onBookingUpdated) onBookingUpdated();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-xl border border-stone-200 overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 bg-stone-900 text-stone-100 flex items-center justify-between">
          <div>
            <h3 className="font-display text-base font-bold">Lookup Existing Depot Visit</h3>
            <p className="text-xs text-stone-400">View confirmation, reschedule, or cancel your visit</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-6 border-b border-stone-200 bg-stone-50">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Enter Reference (e.g. SST-VISIT-2026-1042) or Phone"
                className="w-full pl-9 pr-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-900 bg-white"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !searchTerm.trim()}
              className="px-4 py-2 text-xs font-semibold text-white bg-amber-900 hover:bg-amber-950 disabled:bg-stone-300 rounded-lg transition-colors whitespace-nowrap"
            >
              {loading ? 'Searching...' : 'Find Record'}
            </button>
          </form>

          {error && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {actionSuccess && (
            <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{actionSuccess}</span>
            </div>
          )}
        </div>

        {/* Result Area */}
        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4 text-xs">
          {booking ? (
            <div className="space-y-4">
              
              {/* Status Header */}
              <div className="flex items-center justify-between p-3.5 bg-stone-100 rounded-xl border border-stone-200">
                <div>
                  <span className="text-[10px] font-mono uppercase text-stone-500 block">Reference Code</span>
                  <span className="text-sm font-bold font-mono text-stone-900">{booking.referenceCode}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono uppercase text-stone-500 block">Current Status</span>
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-bold uppercase font-mono ${
                      booking.status === 'confirmed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : booking.status === 'pending'
                        ? 'bg-amber-100 text-amber-900'
                        : booking.status === 'completed'
                        ? 'bg-blue-100 text-blue-900'
                        : 'bg-red-100 text-red-900'
                    }`}
                  >
                    {booking.status}
                  </span>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-3 p-3 bg-white border border-stone-200 rounded-xl">
                <div>
                  <span className="text-stone-400 text-[10px] uppercase font-mono block">Customer Name</span>
                  <span className="font-semibold text-stone-900">{booking.customerName}</span>
                </div>
                <div>
                  <span className="text-stone-400 text-[10px] uppercase font-mono block">Contact Phone</span>
                  <span className="font-semibold text-stone-900">{booking.phone}</span>
                </div>
                <div>
                  <span className="text-stone-400 text-[10px] uppercase font-mono block">Scheduled Date</span>
                  <span className="font-semibold text-stone-900">{formatISTDate(booking.date)}</span>
                </div>
                <div>
                  <span className="text-stone-400 text-[10px] uppercase font-mono block">Time Slot (Asia/Kolkata)</span>
                  <span className="font-semibold text-stone-900">{booking.timeSlot}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-stone-400 text-[10px] uppercase font-mono block">Consultation Purpose</span>
                  <span className="font-semibold text-stone-900 capitalize">{booking.purpose.replace(/_/g, ' ')}</span>
                </div>
                {booking.cancellationReason && (
                  <div className="col-span-2 p-2 bg-red-50 text-red-800 rounded border border-red-200 text-[11px]">
                    <span className="font-bold">Cancellation Reason:</span> {booking.cancellationReason}
                  </div>
                )}
              </div>

              {/* Actions: Reschedule or Cancel */}
              {booking.status !== 'cancelled' && booking.status !== 'completed' && !isRescheduling && !isCancelling && (
                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={() => {
                      setIsRescheduling(true);
                      loadSlotsForReschedule(booking.date);
                    }}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-stone-800 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded-lg transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-amber-800" />
                    <span>Reschedule Visit</span>
                  </button>

                  <button
                    onClick={() => setIsCancelling(true)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Cancel Visit</span>
                  </button>
                </div>
              )}

              {/* Reschedule View */}
              {isRescheduling && (
                <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl space-y-3">
                  <div className="font-bold text-amber-950 text-xs">Choose New Date & Slot:</div>
                  
                  {rescheduleError && (
                    <div className="p-2 bg-red-100 text-red-800 rounded text-[11px]">
                      {rescheduleError}
                    </div>
                  )}

                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5 max-h-32 overflow-y-auto">
                    {dateOptions.map((opt) => (
                      <button
                        key={opt.dateStr}
                        type="button"
                        onClick={() => loadSlotsForReschedule(opt.dateStr)}
                        className={`p-1.5 rounded text-center border text-[11px] ${
                          rescheduleDate === opt.dateStr
                            ? 'bg-amber-900 text-white font-bold border-amber-900'
                            : 'bg-white text-stone-800 border-stone-200 hover:bg-stone-100'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>

                  <div>
                    <span className="text-[11px] font-semibold text-stone-700 block mb-1">
                      Available Slots for {formatISTDate(rescheduleDate)}:
                    </span>
                    {slotsLoading ? (
                      <div className="p-3 text-center text-stone-500 flex items-center justify-center gap-1">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-800" />
                        <span>Checking availability...</span>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-1.5">
                        {rescheduleSlots.map((s) => (
                          <button
                            key={s.slot}
                            type="button"
                            disabled={!s.available}
                            onClick={() => setRescheduleSlot(s.slot)}
                            className={`p-2 rounded text-left border text-[11px] ${
                              !s.available
                                ? 'bg-stone-100 text-stone-400 opacity-60 border-stone-200'
                                : rescheduleSlot === s.slot
                                ? 'bg-amber-900 text-white font-bold border-amber-900'
                                : 'bg-white text-stone-800 border-stone-200 hover:border-stone-400'
                            }`}
                          >
                            {s.slot}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsRescheduling(false)}
                      className="px-3 py-1.5 text-stone-600 hover:text-stone-900"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      disabled={!rescheduleSlot || loading}
                      onClick={handleConfirmReschedule}
                      className="px-4 py-1.5 bg-amber-900 text-white font-semibold rounded-lg hover:bg-amber-950 disabled:bg-stone-300"
                    >
                      {loading ? 'Rescheduling...' : 'Confirm Reschedule'}
                    </button>
                  </div>
                </div>
              )}

              {/* Cancellation View */}
              {isCancelling && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl space-y-3">
                  <div className="font-bold text-red-950 text-xs">Cancel this appointment?</div>
                  <p className="text-[11px] text-stone-600">
                    Your reserved slot will be freed up for other contractors. Please provide a brief reason:
                  </p>
                  <textarea
                    rows={2}
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    placeholder="e.g. Schedule conflict, project postponed..."
                    className="w-full p-2 border border-stone-300 rounded text-xs bg-white focus:outline-none"
                  />
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsCancelling(false)}
                      className="px-3 py-1.5 text-stone-600 hover:text-stone-900"
                    >
                      Keep Appointment
                    </button>
                    <button
                      type="button"
                      disabled={loading}
                      onClick={handleConfirmCancel}
                      className="px-4 py-1.5 bg-red-700 text-white font-semibold rounded-lg hover:bg-red-800"
                    >
                      {loading ? 'Cancelling...' : 'Confirm Cancellation'}
                    </button>
                  </div>
                </div>
              )}

            </div>
          ) : (
            <div className="py-8 text-center text-stone-400">
              <Calendar className="w-10 h-10 mx-auto text-stone-300 mb-2" />
              <p>Enter your reference code (e.g. SST-VISIT-2026-1042) or mobile number to manage your visit.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-100 border-t border-stone-200 text-right">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-stone-700 hover:text-stone-900 bg-white border border-stone-300 rounded-lg"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
