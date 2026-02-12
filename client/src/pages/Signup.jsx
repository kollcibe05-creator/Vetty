import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signup } from '../features/authSlice';
import { useNavigate, Link } from 'react-router-dom';

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
    const userData = { 
      username, 
      email, 
      password,
      // Mapping to 'User' or 'Seller' (Case sensitive to match your Router allowedRoles)
      role: isSeller ? 'Seller' : 'User', 
      businessName: isSeller ? businessName : undefined,
      businessDescription: isSeller ? businessDescription : undefined
    };
    dispatch(signup(userData)).then(action => {
      if (action.meta.requestStatus === 'fulfilled') navigate('/login');
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFFBF0] py-12 px-4">
      <div className="w-full max-w-lg bg-white p-10 rounded-[3rem] shadow-sm border border-orange-50 relative overflow-hidden">
        
        {/* Decorative background paw print or circle */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-100/30 rounded-full -mr-16 -mt-16"></div>

        <div className="relative z-10">
          <header className="text-center mb-10">
            <span className="text-5xl">🎉</span>
            <h2 className="text-3xl font-black text-[#2D1B69] mt-4">Join the Family</h2>
            <p className="text-orange-600 font-bold uppercase tracking-widest text-[10px] mt-2">
              The best place for pets and their humans
            </p>
          </header>
          
          {/* Custom Role Toggle */}
          <div className="mb-8 p-2 bg-[#FFFBF0] rounded-full flex items-center justify-between border border-orange-100">
            <button
              type="button"
              onClick={() => setIsSeller(false)}
              className={`flex-1 py-3 px-6 rounded-full font-black text-xs uppercase tracking-widest transition-all ${
                !isSeller 
                  ? 'bg-[#2D1B69] text-white shadow-lg' 
                  : 'text-gray-400 hover:text-[#2D1B69]'
              }`}
            >
              🐾 Pet Owner
            </button>
            <button
              type="button"
              onClick={() => setIsSeller(true)}
              className={`flex-1 py-3 px-6 rounded-full font-black text-xs uppercase tracking-widest transition-all ${
                isSeller 
                  ? 'bg-[#F97316] text-white shadow-lg' 
                  : 'text-gray-400 hover:text-[#2D1B69]'
              }`}
            >
              🏪 Provider
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-xs font-bold text-center">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-6 py-4 rounded-full bg-gray-50 border-2 border-transparent focus:border-yellow-400 focus:bg-white outline-none transition-all font-medium text-[#2D1B69]"
                required
              />
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-6 py-4 rounded-full bg-gray-50 border-2 border-transparent focus:border-yellow-400 focus:bg-white outline-none transition-all font-medium text-[#2D1B69]"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-6 py-4 rounded-full bg-gray-50 border-2 border-transparent focus:border-yellow-400 focus:bg-white outline-none transition-all font-medium text-[#2D1B69]"
                required
              />
            </div>

            {/* Dynamic Seller Fields */}
            {isSeller && (
              <div className="mt-6 p-6 bg-orange-50/50 border border-orange-100 rounded-[2rem] space-y-4 animate-in fade-in slide-in-from-top-4">
                <p className="text-[10px] font-black text-orange-600 uppercase tracking-[0.2em] ml-2">Business Profile</p>
                <input
                  type="text"
                  placeholder="Business Name"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full px-6 py-4 rounded-full bg-white border-2 border-transparent focus:border-orange-400 outline-none transition-all font-medium"
                  required={isSeller}
                />
                <textarea
                  placeholder="Tell us about your services..."
                  value={businessDescription}
                  onChange={(e) => setBusinessDescription(e.target.value)}
                  className="w-full px-6 py-4 rounded-[2rem] bg-white border-2 border-transparent focus:border-orange-400 outline-none transition-all font-medium"
                  rows="3"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-5 rounded-full font-black text-sm uppercase tracking-widest shadow-xl transition-all transform hover:-translate-y-1 active:scale-95 disabled:opacity-50 mt-4 ${
                isSeller 
                  ? 'bg-[#F97316] text-white shadow-orange-100 hover:bg-orange-600' 
                  : 'bg-[#2D1B69] text-white shadow-purple-100 hover:bg-purple-900'
              }`}
            >
              {loading ? 'Creating Magic...' : `Sign up as ${isSeller ? 'Seller' : 'Buyer'}`}
            </button>
          </form>

          <footer className="text-center mt-10">
            <p className="text-gray-400 text-xs font-bold">
              Already have an account?{' '}
              <Link to="/login" className="text-[#2D1B69] underline font-black">
                Log in
              </Link>
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default Signup;