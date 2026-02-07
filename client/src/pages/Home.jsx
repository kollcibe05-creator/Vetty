import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchCart } from '../features/cartSlice';
import { showSpinner, hideSpinner, showNotification, showMpesaModal } from '../features/uiSlice';
import { selectCart } from '../features/cartSlice';

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, loading, totalAmount } = useSelector(selectCart);

  React.useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const handleCheckout = () => {
    if (items.length === 0) {
      dispatch(showNotification({
        type: 'warning',
        title: 'Cart Empty',
        message: 'Please add items to your cart before checkout.',
      }));
      return;
    }
    
    // Navigate to checkout or show M-Pesa modal directly
    dispatch(showMpesaModal());
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Welcome to Vetty
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Your trusted partner for veterinary services and pet care products
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/services')}
              className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Browse Services
            </button>
            <button
              onClick={() => navigate('/products')}
              className="px-8 py-3 bg-blue-700 text-white rounded-lg font-semibold hover:bg-blue-800 transition-colors border border-blue-500"
            >
              Shop Products
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Vetty?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality Care</h3>
              <p className="text-gray-600">Professional veterinary services with compassionate care for your pets</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Premium Products</h3>
              <p className="text-gray-600">Wide range of pet care products from trusted brands</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy Booking</h3>
              <p className="text-gray-600">Simple online appointment scheduling and M-Pesa payments</p>
            </div>
          </div>
        </div>
      </section>

      {/* Cart Summary */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8">Your Cart</h2>
            
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading cart...</p>
              </div>
            ) : items.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                </svg>
                <p className="text-gray-600 mb-4">Your cart is empty</p>
                <button
                  onClick={() => navigate('/products')}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map(item => (
                  <div key={item.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-4">
                      {item.product.image_url ? (
                        <img src={item.product.image_url} alt={item.product.name} className="w-12 h-12 object-cover rounded" />
                      ) : (
                        <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                          </svg>
                        </div>
                      )}
                      <div>
                        <h4 className="font-medium">{item.product.name}</h4>
                        <p className="text-sm text-gray-600">Qty: {item.quantity} × KES {item.product.price}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">KES {item.quantity * item.product.price}</p>
                    </div>
                  </div>
                ))}
                
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-semibold">Total:</span>
                    <span className="text-2xl font-bold text-blue-600">KES {totalAmount}</span>
                  </div>
                  <button
                    onClick={handleCheckout}
                    className="w-full py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
                  >
                    Proceed to Payment
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
