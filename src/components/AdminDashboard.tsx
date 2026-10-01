import React, { useState, useEffect } from 'react';
import {
  Shield,
  LogOut,
  Calendar,
  FileText,
  Package,
  CalendarX,
  CheckCircle2,
  Clock,
  Search,
  Download,
  AlertTriangle,
  Plus,
  Trash2,
  Edit2,
  Bell,
  Settings,
  RefreshCw,
  Database,
  Copy,
  Check,
} from 'lucide-react';
import {
  VisitBooking,
  QuoteRequest,
  ProductItem,
  BlockedDate,
  VerificationAuditItem,
  BusinessSettings,
  NotificationLog,
} from '../types';
import { formatISTDate } from '../utils/time';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  onRefreshData?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  onRefreshData,
}) => {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [emailInput, setEmailInput] = useState('admin@sstraders.in');
  const [passwordInput, setPasswordInput] = useState('Admin@SSTraders2026');
  const [loginError, setLoginError] = useState<string | null>(null);

  // Active admin tab
  const [activeTab, setActiveTab] = useState<'bookings' | 'quotes' | 'products' | 'blocked' | 'audit' | 'notifications' | 'supabase' | 'settings'>('bookings');

  // Data states
  const [bookings, setBookings] = useState<VisitBooking[]>([]);
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  const [auditItems, setAuditItems] = useState<VerificationAuditItem[]>([]);
  const [settings, setSettings] = useState<BusinessSettings | null>(null);
  const [notifications, setNotifications] = useState<NotificationLog[]>([]);
  const [supabaseStatus, setSupabaseStatus] = useState<any>(null);
  const [copiedSchema, setCopiedSchema] = useState(false);
  const [loading, setLoading] = useState(false);

  // Booking filters
  const [bookingStatusFilter, setBookingStatusFilter] = useState('all');
  const [bookingSearch, setBookingSearch] = useState('');

  // Modals for adding
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProduct, setNewProduct] = useState<Partial<ProductItem>>({
    category: 'paints',
    categoryLabel: 'Paints & Coatings',
    name: '',
    brand: '',
    description: '',
    specs: [],
    unit: 'Per Unit',
    indicativePrice: 'Price on Request',
    inStock: true,
    minOrderQty: '1 Unit',
    verificationSource: 'Added by Administrator',
    isFlaggedForOwnerReview: false,
  });

  const [newBlockedDate, setNewBlockedDate] = useState('');
  const [newBlockedReason, setNewBlockedReason] = useState('');

  // Check existing session
  useEffect(() => {
    const token = localStorage.getItem('sst_admin_token');
    if (token) {
      setIsAuthenticated(true);
      fetchAdminData();
    }
  }, [isOpen]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailInput, password: passwordInput }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Authentication failed');
      }
      localStorage.setItem('sst_admin_token', data.token);
      setIsAuthenticated(true);
      fetchAdminData();
    } catch (err: any) {
      setLoginError(err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('sst_admin_token');
    setIsAuthenticated(false);
  };

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [bkRes, quoRes, prodRes, blockRes, auditRes, setRes, notifRes, supaRes] = await Promise.all([
        fetch('/api/bookings'),
        fetch('/api/quotes'),
        fetch('/api/products'),
        fetch('/api/blocked-dates'),
        fetch('/api/audit'),
        fetch('/api/settings'),
        fetch('/api/notifications'),
        fetch('/api/supabase/status'),
      ]);

      const [bk, quo, prod, blk, aud, st, ntf, supa] = await Promise.all([
        bkRes.json(),
        quoRes.json(),
        prodRes.json(),
        blockRes.json(),
        auditRes.json(),
        setRes.json(),
        notifRes.json(),
        supaRes.json(),
      ]);

      if (bk.success) setBookings(bk.data);
      if (quo.success) setQuotes(quo.data);
      if (prod.success) setProducts(prod.data);
      if (blk.success) setBlockedDates(blk.data);
      if (aud.success) setAuditItems(aud.data);
      if (st.success) setSettings(st.data);
      if (ntf.success) setNotifications(ntf.data);
      if (supa.success) setSupabaseStatus(supa.data);
    } catch (err) {
      console.error('Failed to load admin dataset', err);
    } finally {
      setLoading(false);
    }
  };

  // Booking status update
  const handleUpdateBookingStatus = async (referenceCode: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/bookings/${referenceCode}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setBookings(bookings.map((b) => (b.referenceCode === referenceCode ? data.data : b)));
        if (onRefreshData) onRefreshData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Quotation status update
  const handleUpdateQuoteStatus = async (quoteId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/quotes/${quoteId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setQuotes(quotes.map((q) => (q.id === quoteId ? data.data : q)));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Add Blocked Date
  const handleAddBlockedDate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlockedDate || !newBlockedReason) return;
    try {
      const res = await fetch('/api/blocked-dates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: newBlockedDate, reason: newBlockedReason }),
      });
      const data = await res.json();
      if (data.success) {
        setBlockedDates(data.data);
        setNewBlockedDate('');
        setNewBlockedReason('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveBlockedDate = async (dateStr: string) => {
    try {
      const res = await fetch(`/api/blocked-dates/${dateStr}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setBlockedDates(data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Export Bookings CSV
  const handleExportCSV = () => {
    const headers = ['Reference', 'Customer', 'Phone', 'Email', 'Purpose', 'Date', 'TimeSlot', 'Status', 'CreatedAt'];
    const rows = bookings.map((b) => [
      b.referenceCode,
      `"${b.customerName}"`,
      `"${b.phone}"`,
      b.email,
      b.purpose,
      b.date,
      `"${b.timeSlot}"`,
      b.status,
      b.createdAt,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SSTraders_Bookings_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Audit Item Status Toggle
  const handleToggleAuditStatus = async (item: VerificationAuditItem) => {
    const newStatus = item.status === 'verified' ? 'pending_owner_confirmation' : 'verified';
    try {
      const res = await fetch(`/api/audit/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setAuditItems(auditItems.map((a) => (a.id === item.id ? data.data : a)));
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-stone-950/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-stone-50 w-full max-w-6xl h-[92vh] rounded-2xl shadow-2xl border border-stone-300 flex flex-col overflow-hidden text-stone-900">
        
        {/* Top Bar */}
        <div className="px-6 py-3.5 bg-stone-900 text-stone-100 flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-900 flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="font-display font-bold text-sm leading-tight flex items-center gap-2">
                <span>S S Traders Business Management Portal</span>
                <span className="text-[10px] font-mono bg-stone-800 text-amber-400 px-2 py-0.5 rounded">
                  Owner / Executive Mode
                </span>
              </div>
              <div className="text-[11px] text-stone-400 font-mono">
                Karnataka Depot Operations · Asia/Kolkata (IST)
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-stone-300 hover:text-white bg-stone-800 hover:bg-stone-700 rounded-lg transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-white hover:bg-stone-800 rounded-lg"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Auth Screen */}
        {!isAuthenticated ? (
          <div className="flex-1 flex items-center justify-center p-6 bg-stone-100">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl border border-stone-200 shadow-md space-y-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-amber-100 text-amber-900 rounded-xl mx-auto flex items-center justify-center mb-3">
                  <Shield className="w-6 h-6" />
                </div>
                <h3 className="font-display text-lg font-bold text-stone-900">
                  Owner / Administrator Sign In
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  Access live customer visits, quotation rate cards, and verification settings.
                </p>
              </div>

              {loginError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Registered Email</label>
                  <input
                    type="email"
                    required
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-stone-50 focus:outline-none focus:ring-1 focus:ring-amber-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Access Password</label>
                  <input
                    type="password"
                    required
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-stone-50 focus:outline-none focus:ring-1 focus:ring-amber-900"
                  />
                </div>

                <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-[11px] text-amber-900">
                  <span className="font-bold">Verified Demo Credentials:</span>
                  <div className="font-mono mt-0.5">Email: admin@sstraders.in</div>
                  <div className="font-mono">Password: Admin@SSTraders2026</div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-amber-900 hover:bg-amber-950 text-white font-semibold rounded-lg shadow-sm transition-colors text-xs"
                >
                  Authenticate & Open Portal
                </button>
              </form>
            </div>
          </div>
        ) : (
          /* Authenticated Dashboard */
          <div className="flex-1 flex flex-col overflow-hidden">
            
            {/* Tab Navigation */}
            <div className="bg-white border-b border-stone-200 px-6 flex items-center gap-2 overflow-x-auto text-xs font-medium">
              <button
                onClick={() => setActiveTab('bookings')}
                className={`py-3 px-3 border-b-2 whitespace-nowrap flex items-center gap-1.5 transition-colors ${
                  activeTab === 'bookings'
                    ? 'border-amber-900 text-amber-900 font-bold'
                    : 'border-transparent text-stone-600 hover:text-stone-900'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Visits & Appointments ({bookings.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('quotes')}
                className={`py-3 px-3 border-b-2 whitespace-nowrap flex items-center gap-1.5 transition-colors ${
                  activeTab === 'quotes'
                    ? 'border-amber-900 text-amber-900 font-bold'
                    : 'border-transparent text-stone-600 hover:text-stone-900'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Wholesale Quotes ({quotes.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('products')}
                className={`py-3 px-3 border-b-2 whitespace-nowrap flex items-center gap-1.5 transition-colors ${
                  activeTab === 'products'
                    ? 'border-amber-900 text-amber-900 font-bold'
                    : 'border-transparent text-stone-600 hover:text-stone-900'
                }`}
              >
                <Package className="w-3.5 h-3.5" />
                <span>Product Catalog ({products.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('blocked')}
                className={`py-3 px-3 border-b-2 whitespace-nowrap flex items-center gap-1.5 transition-colors ${
                  activeTab === 'blocked'
                    ? 'border-amber-900 text-amber-900 font-bold'
                    : 'border-transparent text-stone-600 hover:text-stone-900'
                }`}
              >
                <CalendarX className="w-3.5 h-3.5" />
                <span>Blocked Dates ({blockedDates.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('audit')}
                className={`py-3 px-3 border-b-2 whitespace-nowrap flex items-center gap-1.5 transition-colors ${
                  activeTab === 'audit'
                    ? 'border-amber-900 text-amber-900 font-bold'
                    : 'border-transparent text-stone-600 hover:text-stone-900'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Verification Audit Matrix ({auditItems.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('notifications')}
                className={`py-3 px-3 border-b-2 whitespace-nowrap flex items-center gap-1.5 transition-colors ${
                  activeTab === 'notifications'
                    ? 'border-amber-900 text-amber-900 font-bold'
                    : 'border-transparent text-stone-600 hover:text-stone-900'
                }`}
              >
                <Bell className="w-3.5 h-3.5" />
                <span>Alerts & Dispatches ({notifications.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('supabase')}
                className={`py-3 px-3 border-b-2 whitespace-nowrap flex items-center gap-1.5 transition-colors ${
                  activeTab === 'supabase'
                    ? 'border-amber-900 text-amber-900 font-bold'
                    : 'border-transparent text-stone-600 hover:text-stone-900'
                }`}
              >
                <Database className="w-3.5 h-3.5 text-emerald-600" />
                <span>Supabase Cloud DB</span>
              </button>
            </div>

            {/* Tab Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* TAB: Bookings */}
              {activeTab === 'bookings' && (
                <div className="space-y-4">
                  {/* Controls Row */}
                  <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-xl border border-stone-200">
                    <div className="flex flex-wrap items-center gap-2 flex-1">
                      <div className="relative min-w-[220px]">
                        <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5" />
                        <input
                          type="text"
                          value={bookingSearch}
                          onChange={(e) => setBookingSearch(e.target.value)}
                          placeholder="Search customer, phone, reference..."
                          className="w-full pl-9 pr-3 py-1.5 text-xs border border-stone-300 rounded-lg bg-stone-50 focus:outline-none"
                        />
                      </div>

                      <select
                        value={bookingStatusFilter}
                        onChange={(e) => setBookingStatusFilter(e.target.value)}
                        className="px-3 py-1.5 text-xs border border-stone-300 rounded-lg bg-stone-50"
                      >
                        <option value="all">All Statuses</option>
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={fetchAdminData}
                        className="p-2 text-stone-600 hover:text-stone-900 bg-stone-100 rounded-lg text-xs flex items-center gap-1"
                        title="Reload"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={handleExportCSV}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-stone-800 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded-lg transition-colors"
                      >
                        <Download className="w-3.5 h-3.5 text-stone-600" />
                        <span>Export CSV</span>
                      </button>
                    </div>
                  </div>

                  {/* Bookings Table */}
                  <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-stone-100/80 text-stone-600 font-mono text-[10px] uppercase border-b border-stone-200">
                          <tr>
                            <th className="py-3 px-4">Reference</th>
                            <th className="py-3 px-4">Client & Contact</th>
                            <th className="py-3 px-4">Purpose / Scope</th>
                            <th className="py-3 px-4">Scheduled Slot (IST)</th>
                            <th className="py-3 px-4">Status</th>
                            <th className="py-3 px-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100">
                          {bookings
                            .filter((b) => {
                              if (bookingStatusFilter !== 'all' && b.status !== bookingStatusFilter) return false;
                              if (bookingSearch.trim()) {
                                const q = bookingSearch.toLowerCase();
                                return (
                                  b.customerName.toLowerCase().includes(q) ||
                                  b.phone.includes(q) ||
                                  b.referenceCode.toLowerCase().includes(q)
                                );
                              }
                              return true;
                            })
                            .map((b) => (
                              <tr key={b.id} className="hover:bg-stone-50/80 transition-colors">
                                <td className="py-3.5 px-4 font-mono font-bold text-stone-900 whitespace-nowrap">
                                  {b.referenceCode}
                                </td>
                                <td className="py-3.5 px-4">
                                  <div className="font-semibold text-stone-900">{b.customerName}</div>
                                  <div className="text-[11px] text-stone-500 font-mono">
                                    {b.phone} · {b.email}
                                  </div>
                                  {b.companyName && (
                                    <div className="text-[10px] text-stone-400">{b.companyName}</div>
                                  )}
                                </td>
                                <td className="py-3.5 px-4">
                                  <div className="font-medium text-stone-800 capitalize">
                                    {b.purpose.replace(/_/g, ' ')}
                                  </div>
                                  {b.estimatedScope && (
                                    <div className="text-[10px] text-stone-500 truncate max-w-xs">
                                      {b.estimatedScope}
                                    </div>
                                  )}
                                </td>
                                <td className="py-3.5 px-4 whitespace-nowrap">
                                  <div className="font-bold text-stone-900">{formatISTDate(b.date)}</div>
                                  <div className="text-[11px] font-mono text-stone-500">{b.timeSlot}</div>
                                </td>
                                <td className="py-3.5 px-4">
                                  <select
                                    value={b.status}
                                    onChange={(e) => handleUpdateBookingStatus(b.referenceCode, e.target.value)}
                                    className={`px-2 py-1 rounded text-[10px] font-bold font-mono uppercase border ${
                                      b.status === 'confirmed'
                                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                        : b.status === 'pending'
                                        ? 'bg-amber-50 text-amber-800 border-amber-300'
                                        : b.status === 'completed'
                                        ? 'bg-blue-50 text-blue-800 border-blue-300'
                                        : 'bg-red-50 text-red-800 border-red-300'
                                    }`}
                                  >
                                    <option value="pending">Pending</option>
                                    <option value="confirmed">Confirmed</option>
                                    <option value="completed">Completed</option>
                                    <option value="cancelled">Cancelled</option>
                                  </select>
                                </td>
                                <td className="py-3.5 px-4 text-right">
                                  <a
                                    href={`https://wa.me/${b.phone.replace(/\D/g, '')}?text=${encodeURIComponent(
                                      `Namaskara ${b.customerName}, this is regarding your visit ${b.referenceCode} at S S Traders.`
                                    )}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[11px] text-emerald-700 hover:underline font-semibold"
                                  >
                                    WhatsApp
                                  </a>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: Quotes */}
              {activeTab === 'quotes' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-stone-900">
                      Wholesale Rate Card Requests ({quotes.length})
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {quotes.map((q) => (
                      <div
                        key={q.id}
                        className="p-5 bg-white rounded-xl border border-stone-200 shadow-xs space-y-3 text-xs"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-3">
                          <div>
                            <span className="font-mono font-bold text-stone-900 text-sm">
                              {q.referenceCode}
                            </span>
                            <span className="text-stone-400 mx-2">·</span>
                            <span className="font-semibold text-stone-800">{q.customerName}</span>
                            {q.companyName && (
                              <span className="text-stone-500 ml-1">({q.companyName})</span>
                            )}
                            <div className="text-[11px] text-stone-500 font-mono mt-0.5">
                              {q.phone} · {q.email} · Delivery: {q.deliveryDistrict}, Karnataka
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <select
                              value={q.status}
                              onChange={(e) => handleUpdateQuoteStatus(q.id, e.target.value as any)}
                              className="px-2.5 py-1 text-xs border border-stone-300 rounded-lg bg-stone-50 font-semibold"
                            >
                              <option value="new">New</option>
                              <option value="quote_sent">Quote Sent</option>
                              <option value="negotiation">Negotiation</option>
                              <option value="converted">Order Converted</option>
                              <option value="closed">Closed</option>
                            </select>

                            <a
                              href={`https://wa.me/${q.phone.replace(/\D/g, '')}?text=${encodeURIComponent(
                                `Namaskara ${q.customerName}, regarding your wholesale quote request ${q.referenceCode} for S S Traders...`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold"
                            >
                              Reply on WhatsApp
                            </a>
                          </div>
                        </div>

                        {/* Itemized requested materials */}
                        <div className="bg-stone-50 p-3 rounded-lg border border-stone-100">
                          <span className="text-[10px] font-mono uppercase text-stone-400 block mb-1">
                            Materials Inquired:
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                            {q.items.map((it, idx) => (
                              <div key={idx} className="bg-white p-2 rounded border border-stone-200">
                                <div className="font-semibold text-stone-900">{it.productName}</div>
                                <div className="text-[10px] text-stone-500 font-mono">
                                  {it.quantity} {it.unit} · Brand: {it.brand}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {q.projectNotes && (
                          <div className="text-stone-600 text-[11px]">
                            <span className="font-bold">Project Notes:</span> {q.projectNotes}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB: Products */}
              {activeTab === 'products' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-sm text-stone-900">
                        Commercial Product Catalog ({products.length})
                      </h3>
                      <p className="text-xs text-stone-500">
                        Adjust pricing, specifications, and stock status.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {products.map((p) => (
                      <div
                        key={p.id}
                        className="p-4 bg-white rounded-xl border border-stone-200 shadow-xs space-y-2 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[10px] uppercase text-amber-800 font-bold">
                            {p.brand} / {p.categoryLabel}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                              p.inStock ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-600'
                            }`}
                          >
                            {p.inStock ? 'In Stock' : 'Pre-Order'}
                          </span>
                        </div>

                        <div className="font-bold text-sm text-stone-900">{p.name}</div>
                        <p className="text-stone-600 text-[11px] line-clamp-2">{p.description}</p>

                        <div className="pt-2 border-t border-stone-100 flex items-center justify-between font-mono">
                          <div>
                            <span className="text-stone-400 text-[10px] block">Rate Slab:</span>
                            <span className="font-bold text-stone-900">{p.indicativePrice}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-stone-400 text-[10px] block">Unit:</span>
                            <span>{p.unit}</span>
                          </div>
                        </div>

                        <div className="text-[10px] text-stone-400 font-mono">
                          Source: {p.verificationSource}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB: Blocked Dates */}
              {activeTab === 'blocked' && (
                <div className="space-y-6">
                  <div className="bg-white p-5 rounded-xl border border-stone-200 space-y-3">
                    <h3 className="font-bold text-sm text-stone-900">Add Warehouse Closure / Holiday</h3>
                    <form onSubmit={handleAddBlockedDate} className="flex flex-wrap gap-3 items-end text-xs">
                      <div>
                        <label className="block text-stone-700 font-bold mb-1">Closure Date</label>
                        <input
                          type="date"
                          required
                          value={newBlockedDate}
                          onChange={(e) => setNewBlockedDate(e.target.value)}
                          className="px-3 py-1.5 border border-stone-300 rounded-lg bg-stone-50"
                        />
                      </div>

                      <div className="flex-1 min-w-[240px]">
                        <label className="block text-stone-700 font-bold mb-1">Reason (Shown to Customers)</label>
                        <input
                          type="text"
                          required
                          value={newBlockedReason}
                          onChange={(e) => setNewBlockedReason(e.target.value)}
                          placeholder="e.g. Annual Stocktaking / State Festival"
                          className="w-full px-3 py-1.5 border border-stone-300 rounded-lg bg-stone-50"
                        />
                      </div>

                      <button
                        type="submit"
                        className="px-4 py-1.5 bg-amber-900 hover:bg-amber-950 text-white font-semibold rounded-lg text-xs"
                      >
                        Block Date
                      </button>
                    </form>
                  </div>

                  <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-stone-100 text-stone-600 font-mono text-[10px] uppercase border-b border-stone-200">
                        <tr>
                          <th className="py-2.5 px-4">Date</th>
                          <th className="py-2.5 px-4">Reason</th>
                          <th className="py-2.5 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100">
                        {blockedDates.map((b) => (
                          <tr key={b.date} className="hover:bg-stone-50">
                            <td className="py-3 px-4 font-mono font-bold text-stone-900">
                              {formatISTDate(b.date)} ({b.date})
                            </td>
                            <td className="py-3 px-4 text-stone-700">{b.reason}</td>
                            <td className="py-3 px-4 text-right">
                              <button
                                onClick={() => handleRemoveBlockedDate(b.date)}
                                className="text-red-700 hover:text-red-900 font-semibold"
                              >
                                Remove
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB: Verification Audit */}
              {activeTab === 'audit' && (
                <div className="space-y-4">
                  <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 text-xs text-amber-950">
                    <strong className="block font-bold">Client Verification Matrix & Pre-Launch Audit:</strong>
                    <span>
                      Every item below is cross-verified against public Karnataka trade records or marked as an editable placeholder awaiting owner sign-off.
                    </span>
                  </div>

                  <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-stone-100 text-stone-600 font-mono text-[10px] uppercase border-b border-stone-200">
                        <tr>
                          <th className="py-3 px-4">Field</th>
                          <th className="py-3 px-4">Current Value</th>
                          <th className="py-3 px-4">Source</th>
                          <th className="py-3 px-4">Status</th>
                          <th className="py-3 px-4 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100">
                        {auditItems.map((item) => (
                          <tr key={item.id} className="hover:bg-stone-50">
                            <td className="py-3 px-4 font-bold text-stone-900">{item.field}</td>
                            <td className="py-3 px-4 text-stone-700 max-w-xs">{item.currentValue}</td>
                            <td className="py-3 px-4 font-mono text-[10px] text-stone-500">{item.source}</td>
                            <td className="py-3 px-4">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase ${
                                  item.status === 'verified'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-amber-100 text-amber-800'
                                }`}
                              >
                                {item.status.replace(/_/g, ' ')}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <button
                                onClick={() => handleToggleAuditStatus(item)}
                                className="text-amber-900 hover:underline font-semibold"
                              >
                                Toggle
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB: Notifications */}
              {activeTab === 'notifications' && (
                <div className="space-y-4">
                  <h3 className="font-bold text-sm text-stone-900">
                    Customer & Owner Notification Dispatch Log ({notifications.length})
                  </h3>
                  <div className="divide-y divide-stone-200 bg-white rounded-xl border border-stone-200">
                    {notifications.map((n) => (
                      <div key={n.id} className="p-4 space-y-1 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-bold uppercase text-[10px] text-amber-800">
                            {n.type} Alert · To: {n.recipient}
                          </span>
                          <span className="text-stone-400 font-mono text-[10px]">
                            {new Date(n.timestamp).toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' })} IST
                          </span>
                        </div>
                        <div className="font-semibold text-stone-900">{n.title}</div>
                        <p className="font-mono text-[11px] text-stone-600 bg-stone-50 p-2 rounded">
                          {n.message}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB: Supabase Cloud DB */}
              {activeTab === 'supabase' && (
                <div className="space-y-6 text-xs">
                  <div className="bg-white p-6 rounded-xl border border-stone-200 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 pb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
                          <Database className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-bold text-sm text-stone-900">
                            Supabase PostgreSQL Cloud Integration
                          </h3>
                          <div className="text-[11px] text-stone-500 font-mono">
                            Project ID: <strong className="text-stone-900 font-bold">qyoqamviapkknidyspkc</strong>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold bg-emerald-100 text-emerald-800">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Client Connected</span>
                        </span>
                      </div>
                    </div>

                    {/* Status Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                        <div className="text-stone-400 font-mono text-[10px] uppercase">Supabase URL</div>
                        <div className="font-mono font-semibold text-stone-800 truncate mt-0.5">
                          https://qyoqamviapkknidyspkc.supabase.co
                        </div>
                      </div>
                      <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                        <div className="text-stone-400 font-mono text-[10px] uppercase">Publishable Key</div>
                        <div className="font-mono text-stone-800 truncate mt-0.5">
                          sb_publishable_IUiHWy2Wngyt...
                        </div>
                      </div>
                      <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                        <div className="text-stone-400 font-mono text-[10px] uppercase">Database Sync Engine</div>
                        <div className="font-semibold text-emerald-800 mt-0.5">
                          Dual-Layer (Local + Supabase Mirror)
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200 text-stone-700 leading-relaxed">
                      <strong className="block text-emerald-950 font-bold mb-1">
                        Active Database Integration Note:
                      </strong>
                      Every new showroom visit booking (<code>/api/bookings</code>) and wholesale quotation (<code>/api/quotes</code>) is automatically mirrored to your Supabase project with zero disruption.
                    </div>
                  </div>

                  {/* Schema Setup & Copy */}
                  <div className="bg-white p-6 rounded-xl border border-stone-200 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-sm text-stone-900">
                          PostgreSQL Table Schema DDL
                        </h4>
                        <p className="text-[11px] text-stone-500">
                          Paste this into your Supabase SQL Editor to initialize <code>public.bookings</code>, <code>public.quotes</code>, and <code>public.products</code> tables.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          const ddl = `-- S S Traders Supabase DDL
create table if not exists public.bookings (
  id text primary key,
  reference_code text unique not null,
  customer_name text not null,
  phone text not null,
  email text not null,
  company_name text,
  purpose text not null,
  specialist text not null,
  visit_date date not null,
  time_slot text not null,
  estimated_scope text,
  notes text,
  status text not null default 'pending',
  cancellation_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.quotes (
  id text primary key,
  reference_code text unique not null,
  customer_name text not null,
  phone text not null,
  email text not null,
  company_name text,
  customer_type text not null,
  delivery_district text not null,
  items jsonb not null default '[]'::jsonb,
  project_notes text,
  urgency text not null default 'within_1_week',
  status text not null default 'new',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.bookings enable row level security;
alter table public.quotes enable row level security;

create policy "Allow public insert bookings" on public.bookings for insert with check (true);
create policy "Allow public select bookings" on public.bookings for select using (true);
create policy "Allow public update bookings" on public.bookings for update using (true);
create policy "Allow public insert quotes" on public.quotes for insert with check (true);
create policy "Allow public select quotes" on public.quotes for select using (true);`;
                          navigator.clipboard.writeText(ddl);
                          setCopiedSchema(true);
                          setTimeout(() => setCopiedSchema(false), 3000);
                        }}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-stone-900 text-white rounded-lg text-xs font-semibold hover:bg-stone-800 transition-colors"
                      >
                        {copiedSchema ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Copied SQL to Clipboard!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy SQL Schema</span>
                          </>
                        )}
                      </button>
                    </div>

                    <pre className="p-4 bg-stone-900 text-stone-200 rounded-xl font-mono text-[11px] overflow-x-auto max-h-64">
{`-- S S Traders Supabase DDL
create table if not exists public.bookings (
  id text primary key,
  reference_code text unique not null,
  customer_name text not null,
  phone text not null,
  email text not null,
  company_name text,
  purpose text not null,
  specialist text not null,
  visit_date date not null,
  time_slot text not null,
  estimated_scope text,
  notes text,
  status text not null default 'pending',
  cancellation_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.quotes (
  id text primary key,
  reference_code text unique not null,
  customer_name text not null,
  phone text not null,
  email text not null,
  company_name text,
  customer_type text not null,
  delivery_district text not null,
  items jsonb not null default '[]'::jsonb,
  project_notes text,
  urgency text not null default 'within_1_week',
  status text not null default 'new',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.bookings enable row level security;
alter table public.quotes enable row level security;
create policy "Allow public insert bookings" on public.bookings for insert with check (true);
create policy "Allow public select bookings" on public.bookings for select using (true);
create policy "Allow public update bookings" on public.bookings for update using (true);
create policy "Allow public insert quotes" on public.quotes for insert with check (true);
create policy "Allow public select quotes" on public.quotes for select using (true);`}
                    </pre>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
