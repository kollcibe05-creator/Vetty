import React from 'react';
import { useSelector } from 'react-redux';
import { selectFooterVisible } from '../features/uiSlice';
import { Link } from 'react-router-dom';
// Optional: Install react-icons if you haven't: npm install react-icons
import { FaInstagram, FaTwitter, FaFacebookF, FaWhatsapp } from 'react-icons/fa';

const Footer = () => {
  const isVisible = useSelector(selectFooterVisible);

  if (!isVisible) return null;

  return (
    <footer className="bg-[#2D1B69] text-white py-12 mt-auto rounded-t-[3rem]">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🐾</span>
              <h3 className="text-2xl font-black tracking-tighter">VETTY</h3>
            </div>
            <p className="text-purple-200 text-sm leading-relaxed font-medium">
              We want to make pets as happy as they make us. 
              Your trusted partner for premium care and quality products.
            </p>
            {/* Social Links */}
            <div className="flex space-x-4 pt-2">
              <a href="#" className="w-10 h-10 bg-purple-800 rounded-full flex items-center justify-center hover:bg-[#F97316] transition-all shadow-lg">
                <FaInstagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 bg-purple-800 rounded-full flex items-center justify-center hover:bg-[#F97316] transition-all shadow-lg">
                <FaTwitter size={18} />
              </a>
              <a href="#" className="w-10 h-10 bg-purple-800 rounded-full flex items-center justify-center hover:bg-[#F97316] transition-all shadow-lg">
                <FaFacebookF size={18} />
              </a>
              <a href="#" className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center hover:bg-green-500 transition-all shadow-lg">
                <FaWhatsapp size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-orange-400 text-xs font-black uppercase tracking-[0.2em] mb-6">Explore</h3>
            <ul className="space-y-3 text-sm font-bold">
              <li>
                <Link to="/services" className="text-purple-100 hover:text-orange-400 transition-colors">Services</Link>
              </li>
              <li>
                <Link to="/products" className="text-purple-100 hover:text-orange-400 transition-colors">Products</Link>
              </li>
              <li>
                <Link to="/about" className="text-purple-100 hover:text-orange-400 transition-colors">About Us</Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-orange-400 text-xs font-black uppercase tracking-[0.2em] mb-6">Support</h3>
            <ul className="space-y-3 text-sm font-bold">
              <li>
                <Link to="/profile/service-stats" className="text-purple-100 hover:text-orange-400 transition-colors">My Appointments</Link>
              </li>
              <li>
                <Link to="/profile/product-stats" className="text-purple-100 hover:text-orange-400 transition-colors">My Orders</Link>
              </li>
              <li>
                <Link to="/faq" className="text-purple-100 hover:text-orange-400 transition-colors">Help Center</Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="bg-purple-900/50 p-6 rounded-[2rem] border border-purple-700">
            <h3 className="text-orange-400 text-xs font-black uppercase tracking-[0.2em] mb-4">Get in Touch</h3>
            <div className="space-y-4 text-sm font-medium text-purple-100">
              <p className="flex items-center space-x-2">
                <span className="text-orange-500 font-bold">P:</span>
                <span>+254 700 000 000</span>
              </p>
              <p className="flex items-center space-x-2">
                <span className="text-orange-500 font-bold">E:</span>
                <span>info@vetty.com</span>
              </p>
              <div className="pt-2">
                <p className="text-[10px] text-purple-300 uppercase font-black">Open Hours</p>
                <p className="text-xs">Mon-Fri 8AM-6PM</p>
                <p className="text-xs">Sat 9AM-4PM</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-purple-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-[11px] font-bold text-purple-400 uppercase tracking-widest">
          <p>&copy; 2026 VETTY MARKETPLACE. ALL RIGHTS RESERVED.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy" className="hover:text-white">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;