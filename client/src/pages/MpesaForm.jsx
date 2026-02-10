import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { showSpinner, hideSpinner, showNotification } from '../features/uiSlice';
import { processMpesaPayment, selectCart } from '../features/cartSlice';

const MpesaForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, totalAmount } = useSelector(selectCart);
  
  // Clean State: Only track what the user actually needs to type
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');

  // Auto-set the Order ID if items exist (Simulating a generated ID for the session)
  const [currentOrderId] = useState(`ORD-${Math.floor(Math.random() * 10000)}`);

  const validatePhone = (phone) => {
    const regex = /^2547\d{8}$/;
    return regex.test(phone);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validatePhone(phoneNumber)) {
      setError('Enter valid number (e.g., 254712345678)');
      return;
    }

    try {
      dispatch(showSpinner({ message: 'Requesting M-Pesa Prompt...' }));
      
      const paymentData = {
        phone_number: phoneNumber,
        amount: totalAmount, // Auto-generated from cart
        payment_method: 'M-Pesa',
        order_id: currentOrderId 
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
        message: err.message || 'Check your connection and try again.',
      }));
    }
  };


  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-green-600 p-6 text-white text-center">
          <h2 className="text-2xl font-bold">M-Pesa Express</h2>
          <p className="opacity-90">Secure Checkout</p>
        </div>

        <div className="p-8">
          {/* Summary Card */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6 border-dashed border-2 border-gray-200">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Order ID:</span>
              <span className="font-mono font-bold">{currentOrderId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Amount:</span>
              <span className="text-xl font-black text-green-700">KES {totalAmount}</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                M-Pesa Phone Number
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => {
                  setPhoneNumber(e.target.value);
                  setError('');
                }}
                placeholder="254712345678"
                className={`w-full px-4 py-3 rounded-xl border-2 transition-all outline-none ${
                  error ? 'border-red-500' : 'border-gray-200 focus:border-green-500'
                }`}
              />
              {error && <p className="text-red-500 text-xs mt-1 ml-1">{error}</p>}
            </div>

            <button
              type="submit"
              disabled={!items || items.length === 0}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl shadow-lg transform transition active:scale-95 disabled:bg-gray-400"
            >
              Pay KES {totalAmount} Now
            </button>
          </form>

          <p className="text-center text-gray-400 text-xs mt-6">
            You will receive an STK push prompt on your phone.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MpesaForm;