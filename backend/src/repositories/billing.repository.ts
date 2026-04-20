import { db } from '../db/index.js';
import { currentBill, billingHistory, paymentTransaction, CurrentBill, BillingHistoryRecord, PaymentTransaction } from '../db/schema.js';
import { eq, and } from 'drizzle-orm';
import logger from '../utils/logger.js';

export class BillingRepository {
  async getCurrentBill(locationId: string): Promise<CurrentBill | null> {
    const result = await db
      .select()
      .from(currentBill)
      .where(eq(currentBill.locationId, locationId))
      .limit(1);
    return result[0] || null;
  }

  async getBillingHistory(locationId: string): Promise<BillingHistoryRecord[]> {
    return await db
      .select()
      .from(billingHistory)
      .where(eq(billingHistory.locationId, locationId));
  }

  async getBillingHistoryByMonth(locationId: string, month: number, year: number): Promise<BillingHistoryRecord | null> {
    const result = await db
      .select()
      .from(billingHistory)
      .where(
        and(
          eq(billingHistory.locationId, locationId),
          eq(billingHistory.month, month),
          eq(billingHistory.year, year)
        )
      )
      .limit(1);
    return result[0] || null;
  }

  async createCurrentBill(data: Partial<CurrentBill>): Promise<CurrentBill> {
    const result = await db
      .insert(currentBill)
      .values(data as any)
      .returning();
    return result[0];
  }

  async updateCurrentBill(billId: string, data: Partial<CurrentBill>): Promise<CurrentBill | null> {
    const result = await db
      .update(currentBill)
      .set(data)
      .where(eq(currentBill.billId, billId))
      .returning();
    return result[0] || null;
  }

  async createBillingHistory(data: Partial<BillingHistoryRecord>): Promise<BillingHistoryRecord> {
    const result = await db
      .insert(billingHistory)
      .values(data as any)
      .returning();
    return result[0];
  }

  async createPaymentTransaction(data: Partial<PaymentTransaction>): Promise<PaymentTransaction> {
    const result = await db
      .insert(paymentTransaction)
      .values(data as any)
      .returning();
    return result[0];
  }

  async getPaymentTransaction(transactionId: string): Promise<PaymentTransaction | null> {
    const result = await db
      .select()
      .from(paymentTransaction)
      .where(eq(paymentTransaction.transactionId, transactionId))
      .limit(1);
    return result[0] || null;
  }

  async getPaymentTransactionByBillId(billId: string): Promise<PaymentTransaction | null> {
    const result = await db
      .select()
      .from(paymentTransaction)
      .where(eq(paymentTransaction.billId, billId))
      .limit(1);
    return result[0] || null;
  }

  async updatePaymentTransaction(transactionId: string, data: Partial<PaymentTransaction>): Promise<PaymentTransaction | null> {
    const result = await db
      .update(paymentTransaction)
      .set(data)
      .where(eq(paymentTransaction.transactionId, transactionId))
      .returning();
    return result[0] || null;
  }

  async getAllPaymentTransactions(locationId: string): Promise<PaymentTransaction[]> {
    return await db
      .select()
      .from(paymentTransaction)
      .where(eq(paymentTransaction.locationId, locationId));
  }
}
