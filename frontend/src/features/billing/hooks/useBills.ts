import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { billingApi } from '../api/billing.api';
import type { VerifyPaymentRequest } from '../types/billing.types';

export const billingKeys = {
  all: ['billing'] as const,
  current: (locationId: string) => [...billingKeys.all, 'current', locationId] as const,
  history: (locationId: string) => [...billingKeys.all, 'history', locationId] as const,
  summary: (locationId: string) => [...billingKeys.all, 'summary', locationId] as const,
  payments: (locationId: string) => [...billingKeys.all, 'payments', locationId] as const,
};

export const useCurrentBill = (locationId: string | undefined) => {
  return useQuery({
    queryKey: billingKeys.current(locationId || ''),
    queryFn: () => billingApi.getCurrentBill(locationId!),
    enabled: !!locationId,
  });
};

export const useBillingHistory = (locationId: string | undefined) => {
  return useQuery({
    queryKey: billingKeys.history(locationId || ''),
    queryFn: () => billingApi.getBillingHistory(locationId!),
    enabled: !!locationId,
  });
};

export const useBillingSummary = (locationId: string | undefined) => {
  return useQuery({
    queryKey: billingKeys.summary(locationId || ''),
    queryFn: () => billingApi.getBillingSummary(locationId!),
    enabled: !!locationId,
  });
};

export const useCreatePaymentOrder = () => {
  return useMutation({
    mutationFn: (data: { billId: string; amount: number; locationId: string }) =>
      billingApi.createPaymentOrder(data),
  });
};

export const useVerifyPayment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: VerifyPaymentRequest) => billingApi.verifyPayment(data),
    onSuccess: () => {
      // Invalidate all billing queries for this location if possible, 
      // or just invalidate all billing data to be safe
      queryClient.invalidateQueries({ queryKey: billingKeys.all });
    },
  });
};

export const usePaymentHistory = (locationId: string | undefined) => {
  return useQuery({
    queryKey: billingKeys.payments(locationId || ''),
    queryFn: () => billingApi.getPaymentHistory(locationId!),
    enabled: !!locationId,
  });
};
