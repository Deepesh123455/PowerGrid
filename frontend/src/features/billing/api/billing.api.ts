import { apiClient } from '../../../lib/axios';
import type { Bill, BillingHistoryRecord, BillingSummary, CreateOrderResponse, VerifyPaymentRequest, PaymentTransaction } from '../types/billing.types';

export const billingApi = {
  getCurrentBill: async (locationId: string): Promise<Bill> => {
    const response = await apiClient.get(`/billing/current/${locationId}`);
    return response.data.data;
  },

  getBillingHistory: async (locationId: string): Promise<BillingHistoryRecord[]> => {
    const response = await apiClient.get(`/billing/history/${locationId}`);
    return response.data.data;
  },

  getBillingSummary: async (locationId: string): Promise<BillingSummary> => {
    const response = await apiClient.get(`/billing/summary/${locationId}`);
    return response.data.data;
  },

  createPaymentOrder: async (data: { billId: string; amount: number; locationId: string }): Promise<CreateOrderResponse> => {
    const response = await apiClient.post(`/billing/payment/create-order`, data);
    return response.data.data;
  },

  verifyPayment: async (data: VerifyPaymentRequest): Promise<PaymentTransaction> => {
    const response = await apiClient.post(`/billing/payment/verify`, data);
    return response.data.data;
  },

  getPaymentHistory: async (locationId: string): Promise<PaymentTransaction[]> => {
    const response = await apiClient.get(`/billing/payment-history/${locationId}`);
    return response.data.data;
  },
};
