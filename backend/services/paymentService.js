const Razorpay = require('razorpay');
const crypto = require('crypto');

// Initialize Razorpay instance with env credentials
const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/**
 * Create a new Razorpay order
 * @param {number} amount - Amount in rupees (e.g., 150)
 * @returns {Promise<Object>} Razorpay order details
 */
exports.createOrder = async (amount) => {
  const options = {
    amount: amount * 100, // Convert to paise
    currency: 'INR',
    receipt: crypto.randomBytes(10).toString('hex'),
    payment_capture: '0',
    notes: {
      // Optional: add notes for reference
      notes: 'ElderCare request payment',
    },
  };

  const order = await instance.order.create(options);
  return order;
};

/**
 * Verify Razorpay payment signature
 * @param {Object} payload - Payment verification payload from webhook
 * @returns {Promise<Object>} Verified payment details
 */
exports.verifyPayment = async (payload) => {
  const {
    razorpay_payment_id,
    razorpay_order_id,
    razorpay_signature,
    amount,
  } = payload;

  // Prepare verification data
  const body = razorpay_order_id + '|' + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest('hex');

  // Compare signatures securely
  const isSignatureValid = crypto.timingSafeEqual(
    Buffer.from(expectedSignature, 'hex'),
    Buffer.from(razorpay_signature, 'hex')
  );

  if (!isSignatureValid) {
    throw new Error('Invalid payment signature');
  }

  // Optional: verify amount (if needed)
  if (parseInt(amount) !== parseInt(process.env.EXPECTED_AMOUNT)) {
    throw new Error('Amount mismatch');
  }

  return {
    razorpay_payment_id,
    razorpay_order_id,
    amount,
  };
};

/**
 * Helper to safely parse JSON string (fallback for older Node versions)
 */
function safeParse(jsonString) {
  try {
    return JSON.parse(jsonString);
  } catch {
    return {};
  }
}