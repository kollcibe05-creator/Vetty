import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { showMpesaModal, showSpinner, hideSpinner, showNotification } from '../features/uiSlice';
import { processMpesaPayment } from '../features/cartSlice';
import { selectCart } from '../features/cartSlice';

const MpesaForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, totalAmount } = useSelector(selectCart);
  
  const [formData, setFormData] = useState({
    phoneNumber: '',
    amount: totalAmount.toString(),
    orderId: '', // For order payments
    appointmentId: '', // For appointment payments
    paymentType: 'order', // 'order' or 'appointment'
  });
  
  const [errors, setErrors] = useState({});

  React.useEffect(() => {
    setFormData(prev => ({
      ...prev,
      amount: totalAmount.toString()
    }));
  }, [totalAmount]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.phoneNumber) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^2547\d{8}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid M-Pesa number (2547XXXXXXXX)';
    }
    
    if (!formData.amount) {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }
    
    if (formData.paymentType === 'order' && !formData.orderId) {
      newErrors.orderId = 'Order ID is required for order payments';
    }
    
    if (formData.paymentType === 'appointment' && !formData.appointmentId) {
      newErrors.appointmentId = 'Appointment ID is required for appointment payments';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      dispatch(showSpinner({ message: 'Processing M-Pesa payment...' }));
      
      const paymentData = {
        phone_number: formData.phoneNumber,
        amount: parseFloat(formData.amount),
        payment_method: 'M-Pesa',
        ...(formData.paymentType === 'order' 
          ? { order_id: formData.orderId } 
          : { appointment_id: formData.appointmentId }
        )
      };

      await dispatch(processMpesaPayment(paymentData)).unwrap();
      
      dispatch(hideSpinner());
      dispatch(showNotification({
        type: 'success',
        title: 'Payment Initiated',
        message: 'Please check your phone for the M-Pesa prompt and enter your PIN.',
      }));
      
      // Navigate to confirmation page or back to home
      setTimeout(() => {
        navigate('/payment-confirmation');
      }, 2000);
      
    } catch (error) {
      dispatch(hideSpinner());
      dispatch(showNotification({
        type: 'error',
        title: 'Payment Failed',
        message: error.message || 'Failed to process M-Pesa payment. Please try again.',
      }));
    }
  };

  const handleQuickPayment = () => {
    if (items.length === 0) {
      dispatch(showNotification({
        type: 'warning',
        title: 'Cart Empty',
        message: 'Please add items to your cart first.',
      }));
      navigate('/products');
      return;
    }
    
    // Set up for cart checkout
    setFormData(prev => ({
      ...prev,
      amount: totalAmount.toString(),
      paymentType: 'order'
    }));
    
    dispatch(showMpesaModal());
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">M-Pesa Payment Form</h1>
          
          {/* Quick Cart Payment */}
          {items.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-blue-900">Quick Cart Payment</h3>
                  <p className="text-sm text-blue-700">
                    Pay for your cart items ({items.length} items) - KES {totalAmount}
                  </p>
                </div>
                <button
                  onClick={handleQuickPayment}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Pay Cart
                </button>
              </div>
            </div>
          )}

          {/* Payment Type Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Type
            </label>
            <div className="grid grid-cols-2 gap-4">
              <label className="flex items-center p-3 border rounded-md cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="paymentType"
                  value="order"
                  checked={formData.paymentType === 'order'}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <span>Order Payment</span>
              </label>
              <label className="flex items-center p-3 border rounded-md cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="paymentType"
                  value="appointment"
                  checked={formData.paymentType === 'appointment'}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <span>Appointment Payment</span>
              </label>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Order ID or Appointment ID */}
            {formData.paymentType === 'order' ? (
              <div>
                <label htmlFor="orderId" className="block text-sm font-medium text-gray-700 mb-1">
                  Order ID
                </label>
                <input
                  type="text"
                  id="orderId"
                  name="orderId"
                  value={formData.orderId}
                  onChange={handleInputChange}
                  placeholder="Enter order ID"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.orderId ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.orderId && (
                  <p className="mt-1 text-sm text-red-600">{errors.orderId}</p>
                )}
              </div>
            ) : (
              <div>
                <label htmlFor="appointmentId" className="block text-sm font-medium text-gray-700 mb-1">
                  Appointment ID
                </label>
                <input
                  type="text"
                  id="appointmentId"
                  name="appointmentId"
                  value={formData.appointmentId}
                  onChange={handleInputChange}
                  placeholder="Enter appointment ID"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.appointmentId ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.appointmentId && (
                  <p className="mt-1 text-sm text-red-600">{errors.appointmentId}</p>
                )}
              </div>
            )}

            {/* Phone Number */}
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                M-Pesa Phone Number
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                placeholder="2547XXXXXXXX"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.phoneNumber && (
                <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>
              )}
            </div>

            {/* Amount */}
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                Amount (KES)
              </label>
              <input
                type="number"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                placeholder="0.00"
                step="0.01"
                min="1"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.amount ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.amount && (
                <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
              )}
            </div>

            {/* M-Pesa Instructions */}
            <div className="bg-green-50 border border-green-200 rounded-md p-4">
              <h3 className="text-sm font-medium text-green-800 mb-2">Payment Instructions:</h3>
              <ol className="text-sm text-green-700 space-y-1 list-decimal list-inside">
                <li>Click "Process Payment" below</li>
                <li>Check your phone for M-Pesa prompt</li>
                <li>Enter your M-Pesa PIN to complete payment</li>
                <li>Wait for confirmation message</li>
              </ol>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                Process Payment
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MpesaForm;
