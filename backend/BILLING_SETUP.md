# Billing Backend Implementation - Setup Guide

## ✅ Completed Tasks

### 1. Database Schema (schema.ts)

- ✅ Added `currentBill` table - stores the current month's bill for each location
- ✅ Added `billingHistory` table - stores historical bills with unique billId for each month
- ✅ Added `paymentTransaction` table - tracks Razorpay payments with order & payment IDs
- ✅ Added relations to `locations` table for billing data

### 2. Database Seeding (seed.ts)

- ✅ Updated to seed billing data from the smart energy mock database
- ✅ Automatically creates billId for history records: `BILL-{locationId}-{month}-{year}`
- ✅ Seeds data for all 4 locations with their billing history

### 3. Billing Service (billing.service.ts)

- ✅ `getCurrentBill()` - Get current month's bill
- ✅ `getBillingHistory()` - Get all past bills
- ✅ `getCurrentBillWithHistory()` - Get both current bill and history
- ✅ `initiateBillPayment()` - Create payment transaction
- ✅ `verifyAndProcessPayment()` - Verify Razorpay payment and update bill status
- ✅ `getPaymentHistory()` - Get payment transaction history

### 4. Billing Repository (billing.repository.ts)

- ✅ All database operations for billing tables
- ✅ Methods for CRUD operations on bills and transactions

### 5. Billing Controller (billing.controller.ts)

- ✅ `GET /api/v1/billing/current/:locationId` - Get current bill
- ✅ `GET /api/v1/billing/history/:locationId` - Get billing history
- ✅ `GET /api/v1/billing/summary/:locationId` - Get current bill + history
- ✅ `POST /api/v1/billing/payment/create-order` - Create Razorpay order
- ✅ `POST /api/v1/billing/payment/verify` - Verify payment with Razorpay
- ✅ `GET /api/v1/billing/payment-history/:locationId` - Get payment history

### 6. Billing Routes (billing.routes.ts)

- ✅ All routes registered with auth protection

### 7. App Integration (app.ts)

- ✅ Billing router integrated into the main app

## 🔧 Next Steps - Installation & Setup

### Step 1: Install Razorpay Package

```bash
cd backend
npm install razorpay
```

### Step 2: Generate & Push Database Schema

```bash
npm run db:generate  # Generates migration files
npm run db:push     # Pushes schema to database
```

### Step 3: Seed the Database

```bash
npm run db:seed     # Seeds all billing data from mock JSON
```

### Step 4: Verify Environment Variables

Ensure your `.env` file has:

```
Test_Key_ID=rzp_test_SXMYKIsju0M92G
Test_Key_Secret=pi2S09hukd4Cm20ZT7G3nRRf
```

### Step 5: Test the Endpoints

#### Get Current Bill

```bash
curl -X GET http://localhost:3000/api/v1/billing/current/DL-BDP-100234567 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Get Billing History

```bash
curl -X GET http://localhost:3000/api/v1/billing/history/DL-BDP-100234567 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Create Payment Order

```bash
curl -X POST http://localhost:3000/api/v1/billing/payment/create-order \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "billId": "BILL-HOME-APR-2026",
    "amount": 3420.75,
    "locationId": "DL-BDP-100234567"
  }'
```

#### Verify Payment (After Razorpay)

```bash
curl -X POST http://localhost:3000/api/v1/billing/payment/verify \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "transactionId": 1,
    "razorpayPaymentId": "pay_1234567890",
    "razorpayOrderId": "order_1234567890"
  }'
```

## 📊 Database Schema Details

### current_bill Table

- `id` (PK)
- `bill_id` (unique) - e.g., "BILL-HOME-APR-2026"
- `location_id` (FK)
- `month`, `year`
- `amount_due`, `due_date`
- `status` - UNPAID, PAID, OVERDUE
- `units_consumed`, `subsidy_applied`, `surcharges`
- `rate_per_unit`
- `generated_on`

### billing_history Table

- `id` (PK)
- `bill_id` (unique) - e.g., "BILL-DL-BDP-100234567-4-2025"
- `location_id` (FK)
- `month`, `year`
- `total_consumption_kwh`
- `total_paid_inr`
- `status` - PAID, UNPAID, OVERDUE
- `paid_on` (timestamp)

### payment_transaction Table

- `id` (PK)
- `transaction_id` (unique)
- `bill_id` (FK)
- `location_id` (FK)
- `amount`
- `payment_method` - RAZORPAY, UPI, etc.
- `razorpay_payment_id`, `razorpay_order_id`
- `status` - PENDING, SUCCESS, FAILED
- `payment_date`

## 💰 Billing Data Summary

### 4 Locations Seeded:

1. **Home** (DL-BDP-100234567) - Domestic
   - Current Bill: ₹3,420.75

2. **Farmhouse** (DL-BDP-200345678) - Domestic Agricultural
   - Current Bill: ₹1,850.25

3. **Office** (DL-BDP-300456789) - Commercial
   - Current Bill: ₹187,450.00

4. **Shop** (DL-BDP-400567890) - Commercial
   - Current Bill: ₹6,850.00

Each location has 12 months of billing history (Apr 2025 - Mar 2026).

## 🎯 Frontend Integration Points

Your frontend can now:

- ✅ Display current bill with all details (amount, due date, units, subsidy, surcharges)
- ✅ Show billing history chart with consumption & payment trends
- ✅ Initiate Razorpay payment with `create-order` endpoint
- ✅ Handle Razorpay checkout response and verify with `verify` endpoint
- ✅ Track payment history with transaction IDs and statuses
- ✅ Display dynamic data for all 3-4 locations

## 🔐 Security Notes

- All billing endpoints are protected with `protect` middleware (requires JWT)
- Razorpay signature verification is implemented in `verifyPayment`
- Bill ID generation is automatic and unique per month/location
