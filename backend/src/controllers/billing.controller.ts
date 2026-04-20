import { Request, Response, NextFunction } from 'express';
import { BillingService } from '../services/billing.service.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';
import Razorpay from 'razorpay';

const billingService = new BillingService();

const razorpay = new Razorpay({
  key_id: process.env.Test_Key_ID || '',
  key_secret: process.env.Test_Key_Secret || '',
});

export const getCurrentBill = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { locationId } = req.params;

  if (!locationId) {
    return next(new AppError('Location ID is required', 400));
  }

  const bill = await billingService.getCurrentBill(locationId);

  res.status(200).json({
    status: 'success',
    data: bill,
  });
});

export const getBillingHistory = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { locationId } = req.params;

  if (!locationId) {
    return next(new AppError('Location ID is required', 400));
  }

  const history = await billingService.getBillingHistory(locationId);

  res.status(200).json({
    status: 'success',
    data: history,
  });
});

export const getCurrentBillWithHistory = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { locationId } = req.params;

  if (!locationId) {
    return next(new AppError('Location ID is required', 400));
  }

  const data = await billingService.getCurrentBillWithHistory(locationId);

  res.status(200).json({
    status: 'success',
    data,
  });
});

export const createPaymentOrder = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  console.log('🔵 createPaymentOrder called');
  console.log('Request body:', req.body);
  const { billId, amount, locationId } = req.body;

  if (!billId || !amount || !locationId) {
    console.log('❌ Missing required fields');
    return next(new AppError('Bill ID, amount, and location ID are required', 400));
  }

  console.log('✅ All required fields present');
  console.log('Razorpay instance:', razorpay);

  // Create Razorpay order
  const order = await razorpay.orders.create({
    amount: Math.round(amount * 100), // Convert to paise
    currency: 'INR',
    receipt: billId,
    notes: {
      billId,
      locationId,
    },
  });

  console.log('✅ Razorpay order created:', order.id);

  // Create transaction record
  const transaction = await billingService.initiateBillPayment(billId, amount, locationId);

  console.log('✅ Transaction created:', transaction);

  res.status(201).json({
    status: 'success',
    data: {
      orderId: order.id,
      transactionId: transaction.transactionId,
      amount,
      billId,
      key: process.env.Test_Key_ID,
    },
  });
});

export const verifyPayment = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  console.log('🔵 verifyPayment called');
  console.log('Request body:', req.body);
  const { transactionId, razorpayPaymentId, razorpayOrderId, signature } = req.body;

  if (!transactionId || !razorpayPaymentId || !razorpayOrderId) {
    console.log('❌ Missing required fields:', { transactionId, razorpayPaymentId, razorpayOrderId });
    return next(new AppError('Transaction ID, payment ID, and order ID are required', 400));
  }

  try {
    console.log('✅ All required fields present');
    // Verify signature (optional but recommended for security)
    const crypto = await import('crypto');
    const generatedSignature = crypto.default
      .createHmac('sha256', process.env.Test_Key_Secret || '')
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');

    console.log('Signature check:', { provided: signature, generated: generatedSignature, match: signature === generatedSignature });

    if (signature && generatedSignature !== signature) {
      console.log('❌ Signature mismatch');
      return next(new AppError('Payment verification failed', 400));
    }

    console.log('✅ Processing payment...');
    // Process payment
    const transaction = await billingService.verifyAndProcessPayment(
      transactionId,
      razorpayPaymentId,
      razorpayOrderId
    );

    console.log('✅ Payment processed successfully:', transaction);

    res.status(200).json({
      status: 'success',
      message: 'Payment verified and processed successfully',
      data: transaction,
    });
  } catch (error: any) {
    console.log('❌ Error in verifyPayment:', error.message);
    return next(new AppError(error.message || 'Payment verification failed', 400));
  }
});

export const getPaymentHistory = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { locationId } = req.params;

  if (!locationId) {
    return next(new AppError('Location ID is required', 400));
  }

  const payments = await billingService.getPaymentHistory(locationId);

  res.status(200).json({
    status: 'success',
    data: payments,
  });
});
