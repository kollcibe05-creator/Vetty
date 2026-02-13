import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectCart, fetchCart, processCheckout, selectCartTotal } from '../features/cartSlice';
import CartItem from '../components/CartItem';
import axios from 'axios';
import api from '../api/axios';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const  {items = []} = useSelector(selectCart);
  const  totalAmount  = useSelector(selectCartTotal);
  
  const [zones, setZones] = useState([]);
  const [formData, setFormData] = useState({ zone_id: '', address: '' });

  useEffect(() => {
    dispatch(fetchCart());

    api.get('/delivery-zones')
      .then(res => setZones(res.data));
  }, [dispatch]);

  const handleCheckout = async (e) => {
    e.preventDefault();
    try {

      const result = await dispatch(processCheckout({ 
        delivery_zone_id: formData.zone_id, 
        exact_location: formData.address 
      })).unwrap();

      navigate('/mpesaForm', {
        state: {
          orderId: result.order_id,
          amount: finalTotal
        }
      });
    } catch (err) {
      console.error("Checkout failed", err);
    }
  };

  if (items.length === 0) return (
    <div className="text-center py-20">
      <h2 className="text-2xl font-bold text-gray-400">Your cart is empty</h2>
      <button onClick={() => navigate('/products')} className="mt-4 text-blue-600 underline">Go Shopping</button>
    </div>
  );


const selectedZone = zones.find(z => z.id === Number(formData.zone_id));
const deliveryFee = selectedZone ? selectedZone.delivery_fee : 0;

const finalTotal = Number(totalAmount) + Number(deliveryFee);


  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left: Cart Items */}
      <div className="lg:col-span-2">
        <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>
        {items.map(item => <CartItem key={item.id} item={item} />)}
      </div>

      {/* Right: Checkout Form */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit sticky top-20">
        <h2 className="text-xl font-bold mb-4">Delivery Details</h2>
        <form onSubmit={handleCheckout} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Delivery Zone</label>
            <select 
              required
              className="w-full mt-1 p-3 border rounded-xl"
              onChange={(e) => setFormData({...formData, zone_id: e.target.value})}
            >
              <option value="">Select a zone...</option>
              {zones.map(z => <option key={z.id} value={z.id}>{z.zone_name} (KES {z.delivery_fee})</option>)}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Specific Address/Apartment</label>
            <textarea 
              required
              className="w-full mt-1 p-3 border rounded-xl"
              placeholder="e.g. Green Estate, House 4B"
              onChange={(e) => setFormData({...formData, address: e.target.value})}
            />
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between text-lg font-bold">
              <span>Total Amount:</span>
              <span className="text-blue-600">KES {finalTotal.toLocaleString()}</span>
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-all"
          >
            Proceed to Payment
          </button>
        </form>
      </div>
    </div>
  );
};

export default Cart;