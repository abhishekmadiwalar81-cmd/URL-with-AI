export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface ProductItem {
  id: string;
  category: 'paints' | 'laminates' | 'plywood' | 'chemicals' | 'hardware';
  categoryLabel: string;
  name: string;
  brand: string;
  description: string;
  specs: string[];
  unit: string;
  indicativePrice: string; // e.g. "₹240 - ₹380 / liter" or "Price on Request"
  inStock: boolean;
  minOrderQty: string;
  verificationSource: string;
  isFlaggedForOwnerReview: boolean;
}

export interface VisitBooking {
  id: string;
  referenceCode: string; // e.g. SST-VISIT-2026-4821
  customerName: string;
  phone: string;
  email: string;
  companyName?: string;
  purpose: 'material_inspection' | 'wholesale_inquiry' | 'contractor_meeting' | 'laminate_selection' | 'paint_shade_consultation' | 'general_store_visit';
  specialist: 'trade_advisor' | 'laminate_specialist' | 'paints_expert' | 'hardware_consultant';
  date: string; // YYYY-MM-DD
  timeSlot: string; // e.g. "10:30 AM - 11:30 AM"
  estimatedScope?: string; // e.g. "Residential Villa (3,500 sq.ft)"
  notes?: string;
  status: BookingStatus;
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface QuoteRequestItem {
  productId: string;
  productName: string;
  brand: string;
  quantity: number;
  unit: string;
  note?: string;
}

export interface QuoteRequest {
  id: string;
  referenceCode: string; // e.g. SST-QUO-2026-8912
  customerName: string;
  phone: string;
  email: string;
  companyName?: string;
  customerType: 'contractor' | 'architect' | 'retail_homeowner' | 'dealer_reseller';
  deliveryDistrict: string; // e.g. "Bengaluru Urban", "Dharwad / Hubballi", "Belagavi", "Mysuru"
  items: QuoteRequestItem[];
  projectNotes?: string;
  urgency: 'immediate' | 'within_1_week' | 'planning_stage';
  status: 'new' | 'quote_sent' | 'negotiation' | 'converted' | 'closed';
  createdAt: string;
  updatedAt: string;
}

export interface BlockedDate {
  date: string; // YYYY-MM-DD
  reason: string;
}

export interface VerificationAuditItem {
  id: string;
  category: 'Identity' | 'Contact' | 'Address' | 'Hours' | 'Products' | 'Branding';
  field: string;
  currentValue: string;
  source: 'Google Maps Listing' | 'Karnataka Commercial Registry' | 'IndiaMART Trade Directory' | 'Editable Placeholder';
  status: 'verified' | 'pending_owner_confirmation';
  notes: string;
}

export interface BusinessSettings {
  businessName: string;
  registeredEntity: string;
  tradeCategory: string;
  primaryPhone: string;
  secondaryPhone: string;
  whatsappNumber: string;
  officialEmail: string;
  streetAddress: string;
  landmark: string;
  locality: string;
  city: string;
  district: string;
  state: string;
  pincode: string;
  googleMapsUrl: string;
  googleMapsEmbedQuery: string;
  weekdayHours: string;
  sundayHours: string;
  timezone: string;
  gstinPlaceholder: string;
  notificationSettings: {
    sendSmsAlerts: boolean;
    sendWhatsappAlerts: boolean;
    ownerEmailAlerts: boolean;
    ownerPhoneAlert: string;
  };
}

export interface NotificationLog {
  id: string;
  type: 'sms' | 'whatsapp' | 'email';
  recipient: string;
  title: string;
  message: string;
  status: 'delivered' | 'queued' | 'simulated';
  timestamp: string;
  referenceCode: string;
}
