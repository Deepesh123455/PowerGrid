export interface Bill {
  id: number;
  billId: string;
  locationId: string;
  month: number;
  year: number;
  amountDue: number;
  dueDate: string;
  status: 'UNPAID' | 'PAID' | 'OVERDUE';
  unitsConsumed: number;
  subsidyApplied: number;
  surcharges: number;
  ratePerUnit: number;
  generatedOn: string;
}

export interface BillingHistoryRecord {
  id: number;
  billId: string;
  locationId: string;
  month: number;
  year: number;
  totalConsumptionKwh: number;
  totalPaidInr: number;
  status: 'PAID' | 'UNPAID' | 'OVERDUE';
  paidOn: string | null;
}

export interface BillingSummary {
  currentBill: Bill;
  billingHistory: BillingHistoryRecord[];
}

export interface CreateOrderResponse {
  orderId: string;
  transactionId: string;
  amount: number;
  billId: string;
  key: string;
}

export interface VerifyPaymentRequest {
  transactionId: string;
  razorpayPaymentId: string;
  razorpayOrderId: string;
  signature?: string;
}

export interface PaymentTransaction {
  id: number;
  transactionId: string;
  billId: string;
  locationId: string;
  amount: number;
  paymentMethod: string;
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
  paymentDate: string | null;
}
