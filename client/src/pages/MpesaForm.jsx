

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { showSpinner, hideSpinner, showNotification } from '../features/uiSlice';
import { processMpesaPayment, selectCart, fetchCart } from '../features/cartSlice';

const MpesaForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();


  const { items, totalAmount: cartTotal } = useSelector(selectCart);



  const { amount, appointmentId, orderId } = location.state || {};


  const finalAmount = amount !== undefined ? amount : cartTotal;


  const displayId = appointmentId
    ? `APT-${appointmentId}`
    : orderId
      ? orderId
      : `ORD-${Math.floor(Math.random() * 10000)}`;

  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');


  useEffect(() => {
    if (!appointmentId && items.length === 0) {
      dispatch(fetchCart());
    }
  }, [dispatch, appointmentId, items.length]);

  const validatePhone = (phone) => /^254\d{9}$/.test(phone);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validatePhone(phoneNumber)) {
      setError('Enter a valid number (e.g., 254712345678)');
      return;
    }

    if (finalAmount <= 0) {
      dispatch(showNotification({ type: 'error', message: 'Invalid payment amount.' }));
      return;
    }

    try {
      dispatch(showSpinner({ message: 'Requesting M-Pesa Prompt...' }));

      const paymentData = {
        phone_number: phoneNumber,
        amount: finalAmount,
        payment_method: 'M-Pesa',
        order_id: orderId || null,
        appointment_id: appointmentId || null,
      };

      await dispatch(processMpesaPayment(paymentData)).unwrap();

      dispatch(hideSpinner());
      dispatch(showNotification({
        type: 'success',
        title: 'Prompt Sent!',
        message: 'Check your phone to enter your PIN.',
      }));


      setTimeout(() => navigate('/payment-confirmation'), 3000);
    } catch (err) {
      dispatch(hideSpinner());
      dispatch(showNotification({
        type: 'error',
        title: 'Payment Failed',
        message: err?.message || 'Check your connection and try again.',
      }));
    }
  };

  const isCartEmpty = !appointmentId && (!items || items.length === 0);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-green-600 p-6 text-white text-center">
          <h2 className="text-2xl font-bold">M-Pesa Express</h2>
          <p className="opacity-90">{appointmentId ? 'Service Booking' : 'Order Checkout'}</p>
        </div>

        <div className="p-8">
          {/* Summary */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6 border-dashed border-2 border-gray-200">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Reference:</span>
              <span className="font-mono font-bold text-gray-800">{displayId}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Amount:</span>
              <span className="text-2xl font-black text-green-700">Ksh {finalAmount.toFixed(2)}</span>
            </div>
          </div>

          {/* Payment Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                M-Pesa Phone Number
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => { setPhoneNumber(e.target.value); setError(''); }}
                placeholder="254712345678"
                className={`w-full px-4 py-3 rounded-xl border-2 transition-all outline-none ${
                  error ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-green-500'
                }`}
              />
              {error && <p className="text-red-500 text-xs mt-1 ml-1 font-medium">{error}</p>}
            </div>

            <button
              type="submit"
              disabled={isCartEmpty}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl shadow-lg transform transition active:scale-95 disabled:bg-gray-400"
            >
              {appointmentId ? `Pay for Service Ksh ${finalAmount.toFixed(2)}` : `Pay for Order Ksh ${finalAmount.toFixed(2)}`}
            </button>
          </form>

          <p className="text-center text-gray-400 text-xs mt-6 px-4">
            By clicking "Pay Now", you will trigger a secure STK Push prompt to your Safaricom line.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MpesaForm;
