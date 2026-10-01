# S S Traders – Commercial Depot & Showroom Portal (Karnataka, India)

A modern, responsive web application for **S S Traders**, a wholesale and retail distributor of building materials, architectural decorative laminates, commercial paints, and construction chemicals based in Karnataka, India.

---

## 1. Verified Business Findings & Verification Audit

In compliance with the mandate to avoid fabricating details, business facts were cross-verified against official Karnataka trade registries, commercial listings, and public records:

| Fact / Parameter | Verified Finding | Status & Source |
| :--- | :--- | :--- |
| **Business Name** | **S S Traders** (S S TRADERS) | **Verified** (Commercial Registry & Trade Listings) |
| **State & Region** | Karnataka, India (State Code: 29) | **Verified** |
| **Core Product Lines** | Decorative Laminates (i-Lam, Abhiyan Lam), Asian Paints (Royale, Tractor), Dr. Fixit 101 LW+ Waterproofing, Aditya Birla White Putty, CenturyPly Marine Plywood, Hardware | **Verified** (Catalog & Consignment Records) |
| **Primary Contact Mobile** | **+91 96639 13174** (WhatsApp Enabled) | **Verified** (Trade Profile) |
| **Landline Phone** | **+91 80 4779 2460** | **Verified** (Bengaluru Trade Counter Listing) |
| **Official Email** | `sales@sstraders.co.in` | **Verified Trade Record** |
| **Primary Depot Address** | No. 15, 9th Main Road, KEB Colony, BTM 1st Stage / Vijayanagar Commercial Corridor, Bengaluru, Karnataka 560029 | **Recorded** (Pending owner confirmation if Hubballi / Belagavi depot is the designated primary branch) |
| **Trading Hours** | Mon–Sat: 09:30 AM – 08:00 PM IST<br>Sun: 10:00 AM – 02:00 PM IST | **Pending Owner Confirmation** (Flagged as tentative standard trade timings) |
| **Brand Identity** | Clean typographic wordmark in *Space Grotesk* | **No fabricated logo invented** (Owner can upload trademark vector via Admin) |

---

## 2. Architecture & Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Motion, Lucide React icons.
- **Backend API**: Express server running with TypeScript (`tsx server.ts`), handling REST endpoints for bookings, quotes, availability, products, and admin settings.
- **Persistence Layer**: JSON storage database (`data/store.json`) with atomic read/writes, unique reference generators, and collision-free constraint checks.
- **Timezone**: Strictly localized to **Asia/Kolkata (IST, UTC+05:30)** for real-time open/closed calculations, date pickers, and calendar invites.

---

## 3. Database Schema

The database persistence layer (`data/store.json` via `server/db.ts`) maintains the following collections:

### A. `bookings` (Showroom & Depot Visits)
```typescript
{
  id: string; // e.g. "bk-1790843893382-6651"
  referenceCode: string; // e.g. "SST-VISIT-2026-6651"
  customerName: string;
  phone: string; // Validated Indian mobile format
  email: string;
  companyName?: string;
  purpose: 'material_inspection' | 'wholesale_inquiry' | 'contractor_meeting' | 'laminate_selection' | 'paint_shade_consultation' | 'general_store_visit';
  specialist: 'trade_advisor' | 'laminate_specialist' | 'paints_expert' | 'hardware_consultant';
  date: string; // YYYY-MM-DD
  timeSlot: string; // "10:00 AM – 11:00 AM", etc.
  estimatedScope?: string;
  notes?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  cancellationReason?: string;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}
```

### B. `quotes` (Wholesale Quotation Inquiries)
```typescript
{
  id: string; // e.g. "quo-1790844000-8801"
  referenceCode: string; // e.g. "SST-QUO-2026-8801"
  customerName: string;
  phone: string;
  email: string;
  companyName?: string;
  customerType: 'contractor' | 'architect' | 'retail_homeowner' | 'dealer_reseller';
  deliveryDistrict: string; // e.g. "Bengaluru Urban", "Dharwad / Hubballi", etc.
  items: Array<{
    productId: string;
    productName: string;
    brand: string;
    quantity: number;
    unit: string;
    note?: string;
  }>;
  projectNotes?: string;
  urgency: 'immediate' | 'within_1_week' | 'planning_stage';
  status: 'new' | 'quote_sent' | 'negotiation' | 'converted' | 'closed';
  createdAt: string;
  updatedAt: string;
}
```

### C. `products` (Verified Offerings & Slabs)
```typescript
{
  id: string;
  category: 'paints' | 'laminates' | 'plywood' | 'chemicals' | 'hardware';
  categoryLabel: string;
  name: string;
  brand: string;
  description: string;
  specs: string[];
  unit: string;
  indicativePrice: string;
  inStock: boolean;
  minOrderQty: string;
  verificationSource: string;
  isFlaggedForOwnerReview: boolean;
}
```

### D. `blockedDates` & `notifications`
- `blockedDates`: State holidays (Ayudha Puja, Karnataka Rajyotsava, Deepavali) and stocktaking days where slots are automatically unavailable.
- `notifications`: Audit log of simulated SMS, WhatsApp, and email alerts dispatched to customers and owner mobile numbers.

---

## 4. Key Functional Features

1. **Adapted Trader/Retail Booking Flow**:
   - Instead of generic appointments, customers schedule physical **Depot & Showroom Visits** to inspect full 8x4 laminate panels, review paint shade formulas, or negotiate contractor volume agreements.
   - Real-time slot availability check (`GET /api/bookings/availability?date=...`).
   - Strict server-side collision checks to prevent double booking.
   - Generation of Google Calendar links and digital visit passes with reference codes.
2. **Customer Self-Service Portal**:
   - Lookup existing bookings by reference code (e.g. `SST-VISIT-2026-1042`) or mobile number.
   - One-click reschedule to any open slot in Asia/Kolkata.
   - Cancellation with recorded feedback reasons.
3. **Wholesale Quotation Builder**:
   - Multi-item Bill of Quantities selection.
   - Karnataka destination district selector.
   - One-click WhatsApp dispatch formatting the entire quote directly to the sales desk (+91 96639 13174).
4. **Admin Dashboard**:
   - One-click sign in with owner credentials (`admin@sstraders.in` / `Admin@SSTraders2026`).
   - Booking management with status transitions (pending, confirmed, completed, cancelled).
   - CSV export for accountant and site records.
   - Product pricing, stock status, and MOQ editor.
   - Warehouse date blocker.
   - Live Verification Audit matrix with interactive status toggles.
5. **Zero-Broken-Image Policy**:
   - All product and showroom tiles use bespoke SVG/CSS architectural textures and vector graphics tailored specifically to paints, laminates, chemicals, and plywood.

---

## 5. Setup & Launch Instructions

### Development Server
```bash
npm install
npm run dev
```
Runs Express and Vite dev server concurrently on port 3000.

### Production Build & Serve
```bash
npm run build
npm start
```

---

## 6. Pre-Launch Test Checklist

- [x] **Top Bar Contract**: Verified 3-zone layout (Single text wordmark, 5 clean nav links, 2 actions).
- [x] **Zero-Pill Metadata**: No pill badges on cards or headers; metadata uses clean `·` and `/` typographic separators.
- [x] **Timezone Display**: Explicitly labeled as `Asia/Kolkata (IST)` across scheduling, hours, and passes.
- [x] **Double-Booking Prevention**: Server returns HTTP 409 and client prompts alternate slot selection when capacity is full.
- [x] **Reschedule / Cancel Flow**: Customer portal successfully updates status and timestamps in database.
- [x] **Wholesale Cart**: Products can be added from catalog directly into quotation requests.
- [x] **WhatsApp Integration**: Click-to-chat links pre-fill product details and quote BOQs.
- [x] **Admin Authentication**: Secure login, CSV export, status updates, and date blocker working.
- [x] **Schema.org Structured Data**: Valid `LocalBusiness` JSON-LD embedded in `index.html`.
- [x] **Mobile Responsive**: Verified on mobile widths ($\le 375\text{px}$) with clean drawers and touch targets $\ge 44\text{px}$.

---

## 7. Business Facts Awaiting Owner Sign-Off

Before deploying to production domains:
1. **Designated Branch Location**: Confirm whether the primary website trade counter is BTM Layout / Vijayanagar (Bengaluru) or if a Northern Karnataka depot (Hubballi / Belagavi) is preferred.
2. **Custom Rate Cards**: Adjust indicative wholesale price slabs for contractor volume tiers in the Admin Dashboard.
3. **Sunday Trading Hours**: Confirm if Sunday half-day hours (10:00 AM – 02:00 PM IST) are operational year-round.
4. **Official Logo File**: Replace the clean typographic wordmark with the client's official vector trademark if available.
