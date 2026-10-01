import express, { Request, Response } from 'express';
import path from 'path';
import { db } from './server/db';
import { checkSupabaseHealth } from './server/supabase';

const app = express();
const PORT = process.env.PORT || 3000;
const IS_PROD = process.env.NODE_ENV === 'production';

app.use(express.json());

// Request logger for API calls
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    console.log(`[API ${req.method}] ${req.path}`);
  }
  next();
});

// --- API Endpoints ---

// Health & Timezone
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'online',
    business: 'S S Traders (Karnataka, India)',
    timezone: 'Asia/Kolkata',
    currentTimeIST: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
  });
});

// Supabase Status
app.get('/api/supabase/status', async (_req: Request, res: Response) => {
  try {
    const health = await checkSupabaseHealth();
    res.json({ success: true, data: health });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Products
app.get('/api/products', (req: Request, res: Response) => {
  const category = req.query.category as string | undefined;
  const search = req.query.search as string | undefined;
  const products = db.getProducts(category, search);
  res.json({ success: true, count: products.length, data: products });
});

app.post('/api/products', (req: Request, res: Response) => {
  try {
    const product = db.upsertProduct(req.body);
    res.json({ success: true, data: product });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.delete('/api/products/:id', (req: Request, res: Response) => {
  const deleted = db.deleteProduct(req.params.id);
  res.json({ success: deleted });
});

// Bookings / Showroom Visits
const VALID_SLOTS = [
  '10:00 AM – 11:00 AM',
  '11:30 AM – 12:30 PM',
  '02:00 PM – 03:00 PM',
  '03:30 PM – 04:30 PM',
  '05:00 PM – 06:00 PM',
  '06:30 PM – 07:30 PM',
];

// Check availability for a specific date
app.get('/api/bookings/availability', (req: Request, res: Response) => {
  const date = req.query.date as string;
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return res.status(400).json({ success: false, error: 'Valid date query param (YYYY-MM-DD) is required' });
  }

  const blockedList = db.getBlockedDates();
  const blocked = blockedList.find((b) => b.date === date);

  if (blocked) {
    return res.json({
      success: true,
      date,
      isBlocked: true,
      blockReason: blocked.reason,
      slots: VALID_SLOTS.map((slot) => ({
        slot,
        available: false,
        reason: blocked.reason,
      })),
    });
  }

  const slotStatus = VALID_SLOTS.map((slot) => {
    const avail = db.checkSlotAvailability(date, slot);
    return {
      slot,
      available: avail.available,
      remainingCapacity: avail.maxCapacity - avail.currentBookingsCount,
    };
  });

  res.json({
    success: true,
    date,
    isBlocked: false,
    slots: slotStatus,
  });
});

app.get('/api/bookings', (req: Request, res: Response) => {
  const date = req.query.date as string | undefined;
  const status = req.query.status as string | undefined;
  const search = req.query.search as string | undefined;
  const bookings = db.getBookings({ date, status, search });
  res.json({ success: true, count: bookings.length, data: bookings });
});

app.get('/api/bookings/:referenceOrId', (req: Request, res: Response) => {
  const booking = db.getBookingByReference(req.params.referenceOrId);
  if (!booking) {
    return res.status(404).json({ success: false, error: 'Visit booking record not found' });
  }
  res.json({ success: true, data: booking });
});

app.post('/api/bookings', (req: Request, res: Response) => {
  const { customerName, phone, email, purpose, specialist, date, timeSlot } = req.body;

  if (!customerName || !phone || !email || !date || !timeSlot) {
    return res.status(400).json({
      success: false,
      error: 'Please fill all mandatory fields: customer name, contact phone (+91 format), email, visit date, and time slot.',
    });
  }

  const result = db.createBooking({
    customerName,
    phone,
    email,
    companyName: req.body.companyName || '',
    purpose: purpose || 'general_store_visit',
    specialist: specialist || 'trade_advisor',
    date,
    timeSlot,
    estimatedScope: req.body.estimatedScope || '',
    notes: req.body.notes || '',
    status: 'pending', // Pending owner confirmation as required
  });

  if (!result.success) {
    return res.status(409).json({ success: false, error: result.error });
  }

  res.status(201).json({ success: true, data: result.booking });
});

app.patch('/api/bookings/:referenceOrId/status', (req: Request, res: Response) => {
  const { status, reason } = req.body;
  const updated = db.updateBookingStatus(req.params.referenceOrId, status, reason);
  if (!updated) {
    return res.status(404).json({ success: false, error: 'Booking not found' });
  }
  res.json({ success: true, data: updated });
});

app.post('/api/bookings/:referenceOrId/reschedule', (req: Request, res: Response) => {
  const { newDate, newTimeSlot } = req.body;
  if (!newDate || !newTimeSlot) {
    return res.status(400).json({ success: false, error: 'New date and time slot required' });
  }
  const result = db.rescheduleBooking(req.params.referenceOrId, newDate, newTimeSlot);
  if (!result.success) {
    return res.status(409).json({ success: false, error: result.error });
  }
  res.json({ success: true, data: result.booking });
});

// Quotations
app.get('/api/quotes', (_req: Request, res: Response) => {
  const quotes = db.getQuotes();
  res.json({ success: true, count: quotes.length, data: quotes });
});

app.post('/api/quotes', (req: Request, res: Response) => {
  const { customerName, phone, email, customerType, deliveryDistrict, items } = req.body;
  if (!customerName || !phone || !email || !deliveryDistrict || !items || !items.length) {
    return res.status(400).json({
      success: false,
      error: 'Please provide customer name, phone, email, Karnataka delivery district, and at least one product item.',
    });
  }

  const quote = db.createQuote({
    customerName,
    phone,
    email,
    companyName: req.body.companyName || '',
    customerType: customerType || 'retail_homeowner',
    deliveryDistrict,
    items,
    projectNotes: req.body.projectNotes || '',
    urgency: req.body.urgency || 'within_1_week',
  });

  res.status(201).json({ success: true, data: quote });
});

app.patch('/api/quotes/:id/status', (req: Request, res: Response) => {
  const updated = db.updateQuoteStatus(req.params.id, req.body.status);
  if (!updated) {
    return res.status(404).json({ success: false, error: 'Quotation not found' });
  }
  res.json({ success: true, data: updated });
});

// Settings & Audit
app.get('/api/settings', (_req: Request, res: Response) => {
  res.json({ success: true, data: db.getSettings() });
});

app.put('/api/settings', (req: Request, res: Response) => {
  const updated = db.updateSettings(req.body);
  res.json({ success: true, data: updated });
});

app.get('/api/audit', (_req: Request, res: Response) => {
  res.json({ success: true, data: db.getVerificationAudit() });
});

app.put('/api/audit/:id', (req: Request, res: Response) => {
  const updated = db.updateVerificationAuditItem(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ success: false, error: 'Audit item not found' });
  }
  res.json({ success: true, data: updated });
});

// Blocked Dates
app.get('/api/blocked-dates', (_req: Request, res: Response) => {
  res.json({ success: true, data: db.getBlockedDates() });
});

app.post('/api/blocked-dates', (req: Request, res: Response) => {
  const { date, reason } = req.body;
  if (!date || !reason) {
    return res.status(400).json({ success: false, error: 'Date and reason required' });
  }
  const list = db.addBlockedDate({ date, reason });
  res.json({ success: true, data: list });
});

app.delete('/api/blocked-dates/:date', (req: Request, res: Response) => {
  const list = db.removeBlockedDate(req.params.date);
  res.json({ success: true, data: list });
});

// Notifications
app.get('/api/notifications', (_req: Request, res: Response) => {
  res.json({ success: true, data: db.getNotifications() });
});

// Admin Auth (Simple secure session token)
app.post('/api/admin/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  // Default verified credentials for client review
  if (
    (email === 'admin@sstraders.in' || email === 'abhishekmadiwalar81@gmail.com') &&
    (password === 'Admin@SSTraders2026' || password === 'sstraders123')
  ) {
    return res.json({
      success: true,
      token: 'sst-admin-token-' + Date.now(),
      user: {
        name: 'S S Traders Administrator',
        email,
        role: 'owner',
      },
    });
  }
  res.status(401).json({ success: false, error: 'Invalid admin credentials. Use demo: admin@sstraders.in / Admin@SSTraders2026' });
});

// Vite middleware mounting or Static serving
async function startServer() {
  if (!IS_PROD) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`[S S Traders Server] Running on http://localhost:${PORT} in ${IS_PROD ? 'production' : 'development'} mode`);
  });
}

startServer();
