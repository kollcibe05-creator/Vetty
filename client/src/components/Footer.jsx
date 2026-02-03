import React from 'react';
import { useSelector } from 'react-redux';
import { selectFooterVisible } from '../features/uiSlice';

const Footer = () => {
  const isVisible = useSelector(selectFooterVisible);

  if (!isVisible) return null;

  return (
    <footer className="bg-gray-800 text-white py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Vetty</h3>
            <p className="text-gray-300 text-sm">
              Your trusted partner for veterinary services and pet care products. 
              We provide quality care for your beloved pets.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/services" className="text-gray-300 hover:text-white transition-colors">
                  Services
                </a>
              </li>
              <li>
                <a href="/products" className="text-gray-300 hover:text-white transition-colors">
                  Products
                </a>
              </li>
              <li>
                <a href="/appointments" className="text-gray-300 hover:text-white transition-colors">
                  Appointments
                </a>
              </li>
              <li>
                <a href="/about" className="text-gray-300 hover:text-white transition-colors">
                  About Us
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <div className="space-y-2 text-sm text-gray-300">
              <p>
                <span className="font-medium">Phone:</span> +254 700 000 000
              </p>
              <p>
                <span className="font-medium">Email:</span> info@vetty.com
              </p>
              <p>
                <span className="font-medium">Hours:</span> Mon-Fri 8AM-6PM, Sat 9AM-4PM
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-400">
          <p>&copy; 2024 Vetty. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
