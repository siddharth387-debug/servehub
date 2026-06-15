const crypto = require('crypto');
const Razorpay = require('razorpay');
const ElderCare = require('../models/ElderCare');

const razorpay = new Razorpay({
  key_id: process.env.KEY_ID,
  key_secret: process.env.KEY_SECRET,
});

const isConfigured = () => Boolean(process.env.KEY_ID && process.env.KEY_SECRET);

// @GET /api/payment/config
exports.getConfig = (req, res) => {
  res.json({
    success: true,
    configured: isConfigured(),
    key: isConfigured() ? process.env.KEY_ID : null,
  });
};

// @POST /api/payment/create-order
exports.createOrder = async (req, res) => {
  try {
    if (!isConfigured()) {
      return res.status(503).json({ message: 'Payment gateway is not configured' });
    }

    const { elderCareId } = req.body;
    if (!elderCareId) {
      return res.status(400).json({ message: 'Care request ID is required' });
    }

    const request = await ElderCare.findById(elderCareId);
    if (!request) return res.status(404).json({ message: 'Care request not found' });
    if (request.requestedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to pay for this request' });
    }
    if (!request.isPaymentRequired()) {
      return res.status(400).json({ message: 'This request does not require payment' });
    }
    if (request.paymentStatus === 'paid') {
      return res.status(400).json({ message: 'Payment already completed' });
    }

    const order = await razorpay.orders.create({
      amount: Math.round(request.budget * 100),
      currency: 'INR',
      receipt: `elder_${request._id}_${Date.now()}`,
      notes: {
        elderCareId: request._id.toString(),
        userId: req.user.id,
      },
    });

    request.razorpayOrderId = order.id;
    await request.save();

    res.json({
      success: true,
      order,
      key: process.env.KEY_ID,
      amount: request.budget,
    });
  } catch (err) {
    console.error('Create order error:', err);
    res.status(500).json({ message: 'Failed to create payment order' });
  }
};

// @POST /api/payment/verify
exports.verifyPayment = async (req, res) => {
  try {
    if (!isConfigured()) {
      return res.status(503).json({ message: 'Payment gateway is not configured' });
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, elderCareId } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !elderCareId) {
      return res.status(400).json({ message: 'Missing payment verification fields' });
    }

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: 'Invalid payment signature' });
    }

    const request = await ElderCare.findById(elderCareId);
    if (!request) return res.status(404).json({ message: 'Care request not found' });
    if (request.requestedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    if (request.razorpayOrderId && request.razorpayOrderId !== razorpay_order_id) {
      return res.status(400).json({ message: 'Order ID mismatch' });
    }

    request.paymentStatus = 'paid';
    request.razorpayPaymentId = razorpay_payment_id;
    request.razorpayOrderId = razorpay_order_id;
    await request.save();

    res.json({ success: true, message: 'Payment verified successfully', request });
  } catch (err) {
    console.error('Verify payment error:', err);
    res.status(500).json({ message: 'Payment verification failed' });
  }
};
