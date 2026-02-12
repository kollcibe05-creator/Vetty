// import React, { useState, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import { showSpinner, hideSpinner, showNotification } from '../features/uiSlice';
// import { processMpesaPayment, selectCart } from '../features/cartSlice';

// const MpesaForm = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { items, totalAmount } = useSelector(selectCart);
  
//   // Clean State: Only track what the user actually needs to type
//   const [phoneNumber, setPhoneNumber] = useState('');
//   const [error, setError] = useState('');

//   // Auto-set the Order ID if items exist (Simulating a generated ID for the session)
//   const [currentOrderId] = useState(`ORD-${Math.floor(Math.random() * 10000)}`);

//   const validatePhone = (phone) => {
//     const regex = /^2547\d{8}$/;
//     return regex.test(phone);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!validatePhone(phoneNumber)) {
//       setError('Enter valid number (e.g., 254712345678)');
//       return;
//     }
    

//     try {
//       dispatch(showSpinner({ message: 'Requesting M-Pesa Prompt...' }));
      
//       const paymentData = {
//         phone_number: phoneNumber,
//         amount: totalAmount, // Auto-generated from cart
//         payment_method: 'M-Pesa',
//         order_id: currentOrderId 
//       };

//       await dispatch(processMpesaPayment(paymentData)).unwrap();
      
//       dispatch(hideSpinner());
//       dispatch(showNotification({
//         type: 'success',
//         title: 'Prompt Sent!',
//         message: 'Check your phone to enter your PIN.',
//       }));
      
//       setTimeout(() => navigate('/payment-confirmation'), 3000);
      
//     } catch (err) {
//       dispatch(hideSpinner());
//       dispatch(showNotification({
//         type: 'error',
//         title: 'Payment Failed',
//         message: err.message || 'Check your connection and try again.',
//       }));
//     }
//   };


//   return (
//     <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
//       <div className="bg-white max-w-md w-full rounded-2xl shadow-xl overflow-hidden">
//         {/* Header */}
//         <div className="bg-green-600 p-6 text-white text-center">
//           <h2 className="text-2xl font-bold">M-Pesa Express</h2>
//           <p className="opacity-90">Secure Checkout</p>
//         </div>

//         <div className="p-8">
//           {/* Summary Card */}
//           <div className="bg-gray-50 rounded-lg p-4 mb-6 border-dashed border-2 border-gray-200">
//             <div className="flex justify-between mb-2">
//               <span className="text-gray-600">Order ID:</span>
//               <span className="font-mono font-bold">{currentOrderId}</span>
//             </div>
//             <div className="flex justify-between">
//               <span className="text-gray-600">Total Amount:</span>
//               <span className="text-xl font-black text-green-700">KES {totalAmount}</span>
//             </div>
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-5">
//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-2">
//                 M-Pesa Phone Number
//               </label>
//               <input
//                 type="tel"
//                 value={phoneNumber}
//                 onChange={(e) => {
//                   setPhoneNumber(e.target.value);
//                   setError('');
//                 }}
//                 placeholder="254712345678"
//                 className={`w-full px-4 py-3 rounded-xl border-2 transition-all outline-none ${
//                   error ? 'border-red-500' : 'border-gray-200 focus:border-green-500'
//                 }`}
//               />
//               {error && <p className="text-red-500 text-xs mt-1 ml-1">{error}</p>}
//             </div>

//             <button
//               type="submit"
//               disabled={items.length === 0}
//               className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl shadow-lg transform transition active:scale-95 disabled:bg-gray-400"
//             >
//               Pay KES {totalAmount} Now
//             </button>
//           </form>

//           <p className="text-center text-gray-400 text-xs mt-6">
//             You will receive an STK push prompt on your phone.
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MpesaForm;
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { showSpinner, hideSpinner, showNotification } from '../features/uiSlice';
import { processMpesaPayment, selectCart, fetchCart } from '../features/cartSlice';

const MpesaForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // 1. Get data from Redux (for regular Cart checkout)
  const { items, totalAmount: cartTotal } = useSelector(selectCart);

  // 2. Get data from Navigation State (passed from ServiceDetail.jsx)
  const { amount, appointmentId, orderId } = location.state || {};

  // 3. Determine the "Source of Truth"
  // If 'amount' was passed via navigate, use it. Otherwise, use the Redux cart total.
  const finalAmount = amount !== undefined ? amount : cartTotal;
  
  // Determine display ID (Appointment ID takes priority if it exists)
  const displayId = appointmentId 
    ? `APT-${appointmentId}` 
    : (orderId || `ORD-${Math.floor(Math.random() * 10000)}`);

  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');

  // Refresh cart only if we are NOT in a service booking flow
  useEffect(() => {
    if (!appointmentId && items.length === 0) {
      dispatch(fetchCart());
    }
  }, [dispatch, appointmentId, items.length]);

  const validatePhone = (phone) => {
    // Matches 254... format and 07/01 format
    const regex = /^(254\d{9}|07\d{8}|01\d{8})$/; 
    return regex.test(phone);
  };

  const simulatePayment = async () => {
    // Show loading spinner
    dispatch(showSpinner({ message: 'Processing payment...' }));
    
    // Simulate 3 second processing time
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Hide spinner
    dispatch(hideSpinner());
    
    // Show success message
    dispatch(showNotification({
      type: 'success',
      title: 'Payment Successful!',
      message: 'Redirecting to your orders...',
    }));
    
    // Redirect to my-orders after 2 seconds
    setTimeout(() => navigate('/my-orders'), 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validatePhone(phoneNumber)) {
      setError('Enter valid number (e.g., 254712345678, 0712345678, or 0123456789)');
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
        // Send both to backend; backend logic decides which one to associate with the transaction
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

      // Small delay before redirecting to allow user to see the success notification
      setTimeout(() => navigate('/payment-confirmation'), 3000);

    } catch (err) {
      dispatch(hideSpinner());
      dispatch(showNotification({
        type: 'error',
        title: 'Payment Failed',
        message: err || 'Check your connection and try again.',
      }));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFFBF0] py-12 px-4">
      <div className="w-full max-w-lg bg-white p-10 rounded-[3rem] shadow-sm border border-orange-50 relative overflow-hidden">
        
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-100/30 rounded-full -mr-16 -mt-16"></div>

        <div className="relative z-10">
          <header className="text-center mb-10">
            <span className="text-5xl">💳</span>
            <h2 className="text-3xl font-black text-[#2D1B69] mt-4">M-Pesa Payment</h2>
            <p className="text-orange-600 font-bold uppercase tracking-widest text-[10px] mt-2">
              {appointmentId ? 'Service Booking' : 'Order Checkout'}
            </p>
          </header>

          {/* Summary Card */}
          <div className="bg-[#FFFBF0] rounded-[2rem] p-6 mb-8 border-2 border-orange-50">
            <div className="flex justify-between mb-3">
              <span className="text-gray-600 font-medium">Reference:</span>
              <span className="font-mono font-black text-[#2D1B69]">{displayId}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 font-medium">Total Amount:</span>
              <span className="text-2xl font-black text-orange-600">Ksh {finalAmount.toFixed(2)}</span>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-xs font-bold text-center">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-black text-[#2D1B69] uppercase tracking-widest mb-3">
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
                className={`w-full px-6 py-4 rounded-full bg-gray-50 border-2 border-transparent focus:border-yellow-400 focus:bg-white outline-none transition-all font-medium text-[#2D1B69] ${
                  error ? 'border-red-500 bg-red-50' : ''
                }`}
              />
              {error && <p className="text-red-500 text-xs mt-2 ml-2 font-medium">{error}</p>}
            </div>

            <button
              type="submit"
              className="w-full bg-[#2D1B69] text-white py-4 px-6 rounded-full font-black text-sm uppercase tracking-widest hover:bg-[#F97316] shadow-lg shadow-purple-100 transition-all transform hover:-translate-y-1 disabled:opacity-50"
            >
              Pay Ksh {finalAmount.toFixed(2)} Now
            </button>
          </form>

          <div className="mt-8 text-center">
            <button
              type="button"
              onClick={simulatePayment}
              className="text-orange-600 font-bold text-sm hover:text-orange-700 underline"
            >
              Simulate Payment (Demo)
            </button>
          </div>

          <p className="text-center text-gray-400 text-xs mt-6 px-4">
            By clicking "Pay Now", you will trigger a secure STK Push prompt to your Safaricom line.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MpesaForm;