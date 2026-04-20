import {
  pgTable,
  varchar,
  timestamp,
  boolean,
  numeric,
  integer,
  serial,
  real,
  jsonb,
  text,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// --- CORE TABLES ---

export const users = pgTable('users', {
  userId: varchar('user_id', { length: 50 }).primaryKey(),
  phoneNumber: varchar('phone_number', { length: 20 }),
  passwordHash: varchar('password_hash', { length: 255 }),
  name: varchar('name', { length: 100 }),
  email: varchar('email', { length: 100 }),
  profilePicUrl: varchar('profile_pic_url', { length: 255 }),
  p2pWalletBalance: numeric('p2p_wallet_balance', { precision: 10, scale: 2 }),
  joinedDate: timestamp('joined_date', { withTimezone: true }),
  kycVerified: boolean('kyc_verified').default(false),
  preferredLanguage: varchar('preferred_language', { length: 10 }),
  notificationsEnabled: boolean('notifications_enabled').default(true),
});

export const locations = pgTable('locations', {
  locationId: varchar('location_id', { length: 50 }).primaryKey(),
  userId: varchar('user_id', { length: 50 }).references(() => users.userId),
  locationName: varchar('location_name', { length: 100 }),
  locationType: varchar('location_type', { length: 50 }),
  address: varchar('address', { length: 255 }),
  lat: numeric('lat', { precision: 10, scale: 6 }),
  lng: numeric('lng', { precision: 10, scale: 6 }),
  meterNumber: varchar('meter_number', { length: 50 }),
  connectedSince: timestamp('connected_since', { withTimezone: true }),
  sanctionedLoad: real('sanctioned_load'),
  tariffSlab: varchar('tariff_slab', { length: 50 }),

  // Kept general dashboard metrics as JSONB, but removed EV insights from here
  dashboardMetrics: jsonb('dashboard_metrics'),
});

export const billingForecast = pgTable('billing_forecast', {
  id: serial('id').primaryKey(),
  locationId: varchar('location_id', { length: 50 })
    .references(() => locations.locationId)
    .unique(),
  billForecast: real('bill_forecast'), // Changed from mysql-core float
  aiConfidenceScore: real('ai_confidence_score'),
  forecastedDate: timestamp('forecasted_date', { withTimezone: true }),
  vsLastMonth: real('vs_last_month'),
});

// --- INSIGHTS TABLES (NEW) ---

export const evInsights = pgTable('ev_insights', {
  id: serial('id').primaryKey(),
  locationId: varchar('location_id', { length: 50 }).references(() => locations.locationId).unique(),
  chargingNow: boolean('charging_now'),
  currentChargingKw: real('current_charging_kw'),
  evSharePercentage: real('ev_share_percentage'),
  totalEvEnergyKwh: real('total_ev_energy_kwh'),
  totalEvCostInr: real('total_ev_cost_inr'),
  avgCostPerKwh: real('avg_cost_per_kwh'),
  co2SavedKg: real('co2_saved_kg'),
  // Battery Storage tied to EV system
  batteryCapacityKwh: real('battery_capacity_kwh'),
  batteryCurrentLevelPercent: real('battery_current_level_percent'),
  batteryCurrentLevelKwh: real('battery_current_level_kwh'),
  batteryCyclesCompleted: integer('battery_cycles_completed'),
  batteryHealthPercent: real('battery_health_percent'),
});

export const acInsights = pgTable('ac_insights', {
  id: serial('id').primaryKey(),
  locationId: varchar('location_id', { length: 50 }).references(() => locations.locationId).unique(),
  coolingNow: boolean('cooling_now'),
  currentCoolingKw: real('current_cooling_kw'),
  acSharePercentage: real('ac_share_percentage'),
  totalAcEnergyKwh: real('total_ac_energy_kwh'),
  totalAcCostInr: real('total_ac_cost_inr'),
  avgCostPerKwh: real('avg_cost_per_kwh'),
  hoursRunLast30Days: real('hours_run_last_30_days'),
});

// --- ACTIVITY & GRAPH TABLES ---

export const activeAppliances = pgTable('active_appliances', {
  applianceId: varchar('appliance_id', { length: 50 }).primaryKey(),
  locationId: varchar('location_id', { length: 50 }).references(() => locations.locationId),
  name: varchar('name', { length: 100 }),
  type: varchar('type', { length: 50 }),
  currentDrawKw: real('current_draw_kw'),
  startedAt: timestamp('started_at', { withTimezone: true }),
  isDetectedByAI: boolean('is_detected_by_ai'),
});

export const loadGraphs = pgTable('load_graphs', {
  id: serial('id').primaryKey(),
  locationId: varchar('location_id', { length: 50 }).references(() => locations.locationId),
  intervalType: varchar('interval_type', { length: 20 }), // 'daily', 'weekly', 'monthly'
  timestamp: timestamp('timestamp', { withTimezone: true }),
  label: varchar('label', { length: 10 }), // Optional field for display labels
  weatherSensitiveLoad: real('weather_sensitive_load'),
  timeSensitiveLoad: real('time_sensitive_load'),
  normalLoad: real('normal_load'),
  totalLoad: real('total_load'),
});

export const applianceSessions = pgTable('appliance_sessions', {
  sessionId: varchar('session_id', { length: 50 }).primaryKey(),
  locationId: varchar('location_id', { length: 50 }).references(() => locations.locationId),
  applianceType: varchar('appliance_type', { length: 20 }), // 'EV', 'AC', etc.
  date: varchar('date', { length: 20 }),
  startTime: varchar('start_time', { length: 20 }),
  endTime: varchar('end_time', { length: 20 }),
  energyKwh: real('energy_kwh'),
  estimatedCostInr: real('estimated_cost_inr'),
  confidenceScore: integer('confidence_score'),
  status: varchar('status', { length: 50 }),
  avgPowerKw: real('avg_power_kw'),
});

export const alerts = pgTable('alerts', {
  alertId: varchar('alert_id', { length: 50 }).primaryKey(),
  locationId: varchar('location_id', { length: 50 }).references(() => locations.locationId),
  title: varchar('title', { length: 150 }),
  message: text('message'),
  severity: varchar('severity', { length: 20 }), // INFO, WARNING, URGENT
  category: varchar('category', { length: 20 }), // EV, USAGE, BILLING, OUTAGE, TARIFF
  timestamp: timestamp('timestamp', { withTimezone: true }),
  isRead: boolean('is_read').default(false),
});

// --- BILLING TABLES ---

export const currentBill = pgTable('current_bill', {
  id: serial('id').primaryKey(),
  billId: varchar('bill_id', { length: 50 }).unique(),
  locationId: varchar('location_id', { length: 50 })
    .references(() => locations.locationId)
    .unique(),
  month: integer('month'),
  year: integer('year'),
  amountDue: numeric('amount_due', { precision: 10, scale: 2 }),
  dueDate: timestamp('due_date', { withTimezone: true }),
  status: varchar('status', { length: 20 }), // UNPAID, PAID, OVERDUE
  unitsConsumed: real('units_consumed'),
  subsidyApplied: numeric('subsidy_applied', { precision: 10, scale: 2 }),
  surcharges: numeric('surcharges', { precision: 10, scale: 2 }),
  ratePerUnit: real('rate_per_unit'),
  generatedOn: timestamp('generated_on', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const billingHistory = pgTable('billing_history', {
  id: serial('id').primaryKey(),
  billId: varchar('bill_id', { length: 50 }).unique(),
  locationId: varchar('location_id', { length: 50 }).references(() => locations.locationId),
  month: integer('month'),
  year: integer('year'),
  totalConsumptionKwh: real('total_consumption_kwh'),
  totalPaidInr: numeric('total_paid_inr', { precision: 10, scale: 2 }),
  status: varchar('status', { length: 20 }), // PAID, UNPAID, OVERDUE
  paidOn: timestamp('paid_on', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const paymentTransaction = pgTable('payment_transaction', {
  id: serial('id').primaryKey(),
  transactionId: varchar('transaction_id', { length: 50 }).unique(),
  billId: varchar('bill_id', { length: 50 }).references(() => currentBill.billId),
  locationId: varchar('location_id', { length: 50 }).references(() => locations.locationId),
  amount: numeric('amount', { precision: 10, scale: 2 }),
  paymentMethod: varchar('payment_method', { length: 50 }), // RAZORPAY, UPI, etc.
  razorpayPaymentId: varchar('razorpay_payment_id', { length: 100 }),
  razorpayOrderId: varchar('razorpay_order_id', { length: 100 }),
  status: varchar('status', { length: 20 }), // PENDING, SUCCESS, FAILED
  paymentDate: timestamp('payment_date', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});


// --- RELATIONS ---

export const usersRelations = relations(users, ({ many }) => ({
  locations: many(locations),
}));

export const locationsRelations = relations(locations, ({ one, many }) => ({
  user: one(users, {
    fields: [locations.userId],
    references: [users.userId],
  }),
  evInsights: one(evInsights, {
    fields: [locations.locationId],
    references: [evInsights.locationId],
  }),
  billingForecast: one(billingForecast, {
    fields: [locations.locationId],
    references: [billingForecast.locationId],
  }),
  acInsights: one(acInsights, {
    fields: [locations.locationId],
    references: [acInsights.locationId],
  }),
  appliances: many(activeAppliances),
  loadGraphs: many(loadGraphs),
  applianceSessions: many(applianceSessions),
  alerts: many(alerts),
  currentBill: one(currentBill, {
    fields: [locations.locationId],
    references: [currentBill.locationId],
  }),
  billingHistory: many(billingHistory),
  paymentTransactions: many(paymentTransaction),
}));

// --- TYPE EXPORTS ---

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Location = typeof locations.$inferSelect;
export type NewLocation = typeof locations.$inferInsert;

export type EvInsight = typeof evInsights.$inferSelect;
export type NewEvInsight = typeof evInsights.$inferInsert;

export type AcInsight = typeof acInsights.$inferSelect;
export type NewAcInsight = typeof acInsights.$inferInsert;

export type ActiveAppliance = typeof activeAppliances.$inferSelect;
export type NewActiveAppliance = typeof activeAppliances.$inferInsert;

export type LoadGraph = typeof loadGraphs.$inferSelect;
export type NewLoadGraph = typeof loadGraphs.$inferInsert;

export type BillingForecast = typeof billingForecast.$inferSelect;
export type NewBillingForecast = typeof billingForecast.$inferInsert;
export type ApplianceSession = typeof applianceSessions.$inferSelect;
export type NewApplianceSession = typeof applianceSessions.$inferInsert;
export type Alert = typeof alerts.$inferSelect;
export type NewAlert = typeof alerts.$inferInsert;

export type CurrentBill = typeof currentBill.$inferSelect;
export type NewCurrentBill = typeof currentBill.$inferInsert;

export type BillingHistoryRecord = typeof billingHistory.$inferSelect;
export type NewBillingHistoryRecord = typeof billingHistory.$inferInsert;

export type PaymentTransaction = typeof paymentTransaction.$inferSelect;
export type NewPaymentTransaction = typeof paymentTransaction.$inferInsert;