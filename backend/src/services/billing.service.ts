import { BillingRepository } from '../repositories/billing.repository.js';
import AppError from '../utils/AppError.js';
import { CurrentBill, BillingHistoryRecord, PaymentTransaction } from '../db/schema.js';
import logger from '../utils/logger.js';

export class BillingService {
  private billingRepository: BillingRepository;

  constructor() {
    this.billingRepository = new BillingRepository();
  }

  async getCurrentBill(locationId: string): Promise<CurrentBill> {
    const bill = await this.billingRepository.getCurrentBill(locationId);
    
    if (!bill) {
      throw new AppError('No current bill found for this location', 404);
    }

    return bill;
  }

  async getBillingHistory(locationId: string): Promise<BillingHistoryRecord[]> {
    const history = await this.billingRepository.getBillingHistory(locationId);
    
    if (!history || history.length === 0) {
      throw new AppError('No billing history found for this location', 404);
    }

    return history;
  }

  async getCurrentBillWithHistory(locationId: string) {
    // We use the repository directly here because we don't want to throw a 404 
    // if a location simply doesn't have an active bill or history yet
    const currentBillData = await this.billingRepository.getCurrentBill(locationId);
    const history = await this.billingRepository.getBillingHistory(locationId);

    return {
      currentBill: currentBillData,
      billingHistory: history || [],
    };
  }

  async initiateBillPayment(billId: string, amount: number, locationId: string) {
    const bill = await this.billingRepository.getCurrentBill(locationId);
    
    if (!bill) {
      throw new AppError('Bill not found', 404);
    }

    if (bill.billId !== billId) {
      throw new AppError('Bill ID mismatch', 400);
    }

    if (bill.status === 'PAID') {
      throw new AppError('This bill has already been paid', 400);
    }

    // Generate a unique transaction ID
    const transactionId = `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Create a payment transaction record
    const transaction = await this.billingRepository.createPaymentTransaction({
      transactionId,
      billId: bill.billId,
      locationId: bill.locationId,
      amount: amount.toString(),
      paymentMethod: 'RAZORPAY',
      status: 'PENDING',
    });

    return transaction;
  }

  async verifyAndProcessPayment(
    transactionId: string,
    razorpayPaymentId: string,
    razorpayOrderId: string
  ): Promise<PaymentTransaction> {
    const transaction = await this.billingRepository.getPaymentTransaction(transactionId);

    if (!transaction) {
      throw new AppError('Transaction not found', 404);
    }

    // Update transaction with Razorpay details
    const updatedTransaction = await this.billingRepository.updatePaymentTransaction(transactionId, {
      razorpayPaymentId,
      razorpayOrderId,
      status: 'SUCCESS',
      paymentDate: new Date(),
    });

    if (!updatedTransaction) {
      throw new AppError('Failed to update transaction', 500);
    }

    // Update bill status to PAID
    await this.billingRepository.updateCurrentBill(transaction.billId!, {
      status: 'PAID',
    });

    logger.info(`✅ Payment processed successfully for bill: ${transaction.billId}`);

    return updatedTransaction;
  }

  async getPaymentHistory(locationId: string): Promise<PaymentTransaction[]> {
    return await this.billingRepository.getAllPaymentTransactions(locationId);
  }
}
