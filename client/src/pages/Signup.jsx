import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signup } from '../features/authSlice';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSeller, setIsSeller] = useState(false);
  const [businessName, setBusinessName] = useState('');
  const [businessDescription, setBusinessDescription] = useState('');
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector(state => state.auth);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // CONNECTED TO DB: Removed the "coming soon" guard
    const userData = { 
      username, 
      email, 
      password,
      // Assigning the correct role based on the toggle
      role: isSeller ? 'Seller' : 'User',
      // Adding business info for the database if it's a seller
      ...(isSeller && {
        business_name: businessName,
        business_description: businessDescription
      })
    };

    dispatch(signup(userData)).then(action => {
      if (action.meta.requestStatus === 'fulfilled') {
        navigate('/login');
      }
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#FFFBF0] font-sans px-4">
      <div className="w-full max-w-lg bg-white p-10 rounded-[2.5rem] shadow-xl border border-orange-50">
        
        {/* Aesthetic Header */}
        <div className="text-center mb-8">
          <div className="inline-block p-3 bg-yellow-400 rounded-2xl mb-4 shadow-sm text-[#2D1B69]">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
             </svg>
          </div>
          <h2 className="text-4xl font-black text-[#2D1B69] tracking-tighter uppercase">Join Vetty</h2>
          <p className="text-gray-500 font-medium mt-2">Start your journey with us today</p>
        </div>
        
        {/* Toggle */}
        <div className="mb-8 flex p-1.5 bg-[#FFFBF0] rounded-full border border-orange-100 shadow-inner">
          <button
            type="button"
            onClick={() => setIsSeller(false)}
            className={`flex-1 py-3 px-4 rounded-full font-bold text-sm transition-all ${
              !isSeller 
                ? 'bg-[#2D1B69] text-white shadow-lg' 
                : 'text-[#2D1B69] hover:bg-orange-50'
            }`}
          >
            Pet Owner
          </button>
          <button
            type="button"
            onClick={() => setIsSeller(true)}
            className={`flex-1 py-3 px-4 rounded-full font-bold text-sm transition-all ${
              isSeller 
                ? 'bg-orange-500 text-white shadow-lg' 
                : 'text-[#2D1B69] hover:bg-orange-50'
            }`}
          >
            Service Provider
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl text-center text-sm font-bold border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1">
            <label className="text-xs font-black text-[#2D1B69] uppercase ml-4">Username</label>
            <input
              type="text"
              placeholder="e.g. johndoe"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-6 py-4 bg-[#FFFBF0] border border-orange-100 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-400 font-medium"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-black text-[#2D1B69] uppercase ml-4">Email Address</label>
            <input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-6 py-4 bg-[#FFFBF0] border border-orange-100 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-400 font-medium"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-black text-[#2D1B69] uppercase ml-4">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-6 py-4 bg-[#FFFBF0] border border-orange-100 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-400 font-medium"
              required
            />
          </div>

          {/* Business Info Section */}
          {isSeller && (
            <div className="p-6 bg-orange-50/50 rounded-[2rem] border border-orange-100 space-y-4 mt-6 animate-in fade-in slide-in-from-top-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">🏪</span>
                <p className="text-sm text-[#2D1B69] font-black uppercase tracking-wider">Business Details</p>
              </div>
              <input
                type="text"
                placeholder="Business Name"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full px-6 py-3 bg-white border border-orange-200 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium"
                required={isSeller}
              />
              <textarea
                placeholder="What services do you provide?"
                value={businessDescription}
                onChange={(e) => setBusinessDescription(e.target.value)}
                className="w-full px-6 py-4 bg-white border border-orange-200 rounded-[1.5rem] focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium"
                rows="3"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-5 rounded-full font-black uppercase tracking-widest text-xs transition-all shadow-xl hover:-translate-y-1 disabled:opacity-50 mt-4 ${
              isSeller 
                ? 'bg-orange-500 text-white hover:bg-orange-600' 
                : 'bg-[#2D1B69] text-white hover:bg-purple-900'
            }`}
          >
            {loading ? 'Processing...' : `Sign Up as ${isSeller ? 'Seller' : 'Buyer'}`}
          </button>
        </form>

        <div className="text-center mt-8">
          <p className="text-gray-500 font-bold text-sm">
            Already a member?{' '}
            <button onClick={() => navigate('/login')} className="text-orange-600 hover:text-orange-700 underline underline-offset-4">
              Log In Here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;