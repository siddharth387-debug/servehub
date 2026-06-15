import React, { useState } from 'react';                                                                                                    
import { useAuth } from '../context/AuthContext';                                                                                           

const Payment = () => {
  const { user } = useAuth();
  // Safe destructuring with fallback in case user context is loading
  const id = user?.id;
  const email = user?.email || '';
  
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://razorpay.com';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const createPayment = async (e) => {
    e.preventDefault(); // Prevent standard <a> link navigation
    setLoading(true);
    setPaymentStatus(null);

    // 1. Load Razorpay SDK
    const isScriptLoaded = await loadRazorpayScript();
    if (!isScriptLoaded) {
      alert('Razorpay SDK failed to load. Are you offline?');
      setLoading(false);
      return;
    }

    try {
      // 2. Fetch order ID from your backend server
      // const response = await fetch('/api/create-order', { method: 'POST' });
      // const orderData = await response.json();

      // 3. Configure Razorpay options
      const options = {
        key: '', // Replace with your Test/Live Key ID
        amount: '50000', // Amount in paise (e.g., 50000 paise = ₹500)
        currency: 'INR',
        name: 'Your Company Name',
        description: `Payment for ${email}`,
        image: '/assets/logo.png',
        order_id: 'order_ABC123XYZ', // Pass the order_id generated from your backend
        handler: function (response) {
          // This executes upon successful payment
          setPaymentStatus('success');
          console.log('Payment ID:', response.razorpay_payment_id);
          console.log('Order ID:', response.razorpay_order_id);
          console.log('Signature:', response.razorpay_signature);
          // Send these details to your backend to verify signature and capture payment
        },
        prefill: {
          email: email,
          contact: '', // Optional: Add user phone number if available
        },
        theme: {
          color: '#3399cc',
        },
      };

      // 4. Open Checkout modal
      const rzp = new window.Razorpay(options);
      
      rzp.on('payment.failed', function (response) {
        setPaymentStatus('error');
        console.error('Payment failed details:', response.error);
      });

      rzp.open();
      setPaymentStatus('payment_initiated');
    } catch (error) {
      console.error('Payment error:', error);
      setPaymentStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-page">
      <h1>Payment Processing</h1>
      <div style={{ padding: '20px' }}>
        <button 
          className="payment-button" 
          onClick={createPayment}
          disabled={loading}
          style={{ cursor: loading ? 'not-allowed' : 'pointer' }}
        >
          {loading ? 'Loading Box...' : 'Initiate Payment'}
        </button>
      </div>

      <div style={{ marginTop: '20px' }}>
        {paymentStatus === 'payment_initiated' && (
          <p>Payment modal opened. Complete transaction in the popup window.</p>
        )}
        {paymentStatus === 'success' && (
          <p style={{ color: 'green' }}>Payment successful! Your transaction is complete.</p>
        )}
        {paymentStatus === 'error' && (
          <p style={{ color: 'red' }}>Payment initiation failed. Please try again.</p>
        )}
      </div>
    </div>
  );
};

export default Payment;
