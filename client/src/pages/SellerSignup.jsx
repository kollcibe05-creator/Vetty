import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signup } from '../features/authSlice';
import { useNavigate } from 'react-router-dom';

const SellerSignup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [businessDescription, setBusinessDescription] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector(state => state.auth);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(signup({ 
      username, 
      email, 
      password, 
      role: 'Admin', // Assign Admin role for sellers
      businessName,
      businessDescription 
    })).then(action => {
      if (action.meta.requestStatus === 'fulfilled') navigate('/login');
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Seller Registration</h2>
          <p className="text-gray-600 mt-2">Join our marketplace as a seller</p>
        </div>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Business Name
            </label>
            <input
              type="text"
              placeholder="Your business name"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Business Description
            </label>
            <textarea
              placeholder="Describe your business (optional)"
              value={businessDescription}
              onChange={(e) => setBusinessDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows="3"
            />
          </div>

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
          
          <div className="bg-blue-50 p-3 rounded-md">
            <p className="text-sm text-blue-800">
              ✓ Access to seller dashboard<br/>
              ✓ Ability to add products & services<br/>
              ✓ Manage orders and appointments<br/>
              ✓ Track sales performance
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 font-medium"
          >
            {loading ? 'Creating Account...' : 'Create Seller Account'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Just looking to buy?{' '}
            <a href="/signup" className="text-indigo-600 hover:underline">Sign up as customer</a>
          </p>
        </div>

        <p className="text-center mt-4 text-gray-600">
          Already have an account?{' '}
          <a href="/login" className="text-indigo-600 hover:underline">Log in</a>
        </p>
      </div>
    </div>
  );
};

export default SellerSignup;
