import { API } from '../context/AuthContext';

export const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

export const payForCareRequest = async ({ elderCareId, user }) => {
  const configRes = await API.get('/payment/config');
  if (!configRes.data.configured) {
    throw new Error('Payment is not configured yet. Add Razorpay keys to the backend .env file.');
  }

  const orderRes = await API.post('/payment/create-order', { elderCareId });
  const { order, key } = orderRes.data;

  const loaded = await loadRazorpayScript();
  if (!loaded) throw new Error('Could not load payment gateway. Check your connection.');

  return new Promise((resolve, reject) => {
    const options = {
      key,
      amount: order.amount,
      currency: order.currency,
      name: 'ServeHub',
      description: 'Elder Care Service Payment',
      order_id: order.id,
      prefill: {
        name: user.name,
        email: user.email,
        contact: user.phone || '',
      },
      theme: { color: '#2D6A4F' },
      handler: async (response) => {
        try {
          const verifyRes = await API.post('/payment/verify', {
            elderCareId,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });
          resolve(verifyRes.data.request);
        } catch (err) {
          reject(err);
        }
      },
      modal: {
        ondismiss: () => reject(Object.assign(new Error('Payment cancelled'), { cancelled: true })),
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', (response) => {
      reject(new Error(response.error?.description || 'Payment failed'));
    });
    rzp.open();
  });
};

export const isUnpaid = (req) => req.budget > 0 && req.paymentStatus === 'unpaid';
export const isPaidRequest = (req) => req.budget > 0 && req.paymentStatus === 'paid';
export const isFreeRequest = (req) => !req.budget || req.budget <= 0;
