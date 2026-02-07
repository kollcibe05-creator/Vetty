import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { hideMpesaModal, showSpinner, hideSpinner, showNotification } from '../features/uiSlice';
import { selectModals } from '../features/uiSlice';
import { processMpesaPayment } from '../features/cartSlice';

const MpesaModal = () => {
  const dispatch = useDispatch();
  const { mpesa: isOpen } = useSelector(selectModals);
  
  const [formData, setFormData] = useState({
    phoneNumber: '',
    amount: '',
  });
  
  const [errors, setErrors] = useState({});

  const handleClose = () => {
    dispatch(hideMpesaModal());
    setFormData({ phoneNumber: '', amount: '' });
    setErrors({});
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
        payment_method: 'M-Pesa'
      };

      // Dispatch the payment processing action
      await dispatch(processMpesaPayment(paymentData)).unwrap();
      
      dispatch(hideSpinner());
      dispatch(showNotification({
        type: 'success',
        title: 'Payment Initiated',
        message: 'Please check your phone for the M-Pesa prompt and enter your PIN.',
      }));
      
      handleClose();
    } catch (error) {
      dispatch(hideSpinner());
      dispatch(showNotification({
        type: 'error',
        title: 'Payment Failed',
        message: error.message || 'Failed to process M-Pesa payment. Please try again.',
      }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">M-Pesa Payment</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
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
            <h3 className="text-sm font-medium text-green-800 mb-2">How to pay:</h3>
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
              onClick={handleClose}
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
  );
};

export default MpesaModal;
