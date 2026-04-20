import { useCallback } from 'react';
import { useVerifyPayment } from './useBills';
import { useBillingStore } from '../../../store/useBillingStore';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: any) => void;
  prefill: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme: {
    color: string;
  };
  modal?: {
    ondismiss?: () => void;
  };
}

export const useRazorpay = () => {
  const { mutateAsync: verifyPayment } = useVerifyPayment();
  const setLastPaymentStatus = useBillingStore((state) => state.setLastPaymentStatus);

  const openCheckout = useCallback(
    async (orderData: {
      key: string;
      amount: number;
      orderId: string;
      transactionId: string;
      billId: string;
      userName?: string;
      userEmail?: string;
      userContact?: string;
    }) => {
      return new Promise((resolve, reject) => {
        const options: RazorpayOptions = {
          key: orderData.key,
          amount: orderData.amount * 100, // Razorpay expects paise
          currency: 'INR',
          name: 'Powergrid',
          description: `Payment for Bill ${orderData.billId}`,
          order_id: orderData.orderId,
          handler: async (response: any) => {
            try {
              setLastPaymentStatus('PENDING');
              await verifyPayment({
                transactionId: orderData.transactionId,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                signature: response.razorpay_signature,
              });
              setLastPaymentStatus('SUCCESS');
              resolve(response);
            } catch (error) {
              setLastPaymentStatus('FAILED');
              reject(error);
            }
          },
          prefill: {
            name: orderData.userName,
            email: orderData.userEmail,
            contact: orderData.userContact,
          },
          theme: {
            color: '#52ded1',
          },
          modal: {
            ondismiss: () => {
              reject(new Error('Payment cancelled by user'));
            },
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      });
    },
    [verifyPayment, setLastPaymentStatus]
  );

  return { openCheckout };
};
