import { Router } from 'express';
import {
  getCurrentBill,
  getBillingHistory,
  getCurrentBillWithHistory,
  createPaymentOrder,
  verifyPayment,
  getPaymentHistory,
} from '../controllers/billing.controller.js';


const router = Router();

// Get current bill for a location
router.get('/current/:locationId', getCurrentBill);

// Get billing history for a location
router.get('/history/:locationId', getBillingHistory);

// Get current bill with history for a location
router.get('/summary/:locationId', getCurrentBillWithHistory);

// Create payment order (Razorpay)
router.post('/payment/create-order', createPaymentOrder);

// Verify payment (after Razorpay payment)
router.post('/payment/verify', verifyPayment);

// Get payment history for a location
router.get('/payment-history/:locationId', getPaymentHistory);

export default router;
