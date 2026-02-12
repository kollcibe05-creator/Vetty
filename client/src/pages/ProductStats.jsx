import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

const ProductStats = () => {
  const { user } = useSelector(state => state.auth);
  const [stats, setStats] = useState({
    total: 0,
    sold: 0,
    inStock: 0,
    revenue: 0
  });

  useEffect(() => {
    // Keeping your mock data but updating values for the theme
    setStats({
      total: 156,
      sold: 89,
      inStock: 67,
      revenue: 125000
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#FFFBF0] pb-12">
      {/* Header Section */}
      <div className="mb-10">
        <h1 className="text-4xl font-black text-[#2D1B69]">Order History 📦</h1>
        <p className="text-orange-600 font-bold uppercase tracking-widest text-[10px] mt-2">
          Reviewing goodies for {user?.name || 'your furry family'}
        </p>
      </div>

      {/* Stats Grid - "Bubble" Style */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {[
          { label: 'Orders Placed', val: stats.total, color: 'text-[#2D1B69]', icon: '🛍️' },
          { label: 'Items Received', val: stats.sold, color: 'text-green-500', icon: '🐾' },
          { label: 'In Transit', val: stats.inStock, color: 'text-orange-500', icon: '🚚' },
          { label: 'Total Spend', val: `Ksh. ${stats.revenue.toLocaleString()}`, color: 'text-purple-600', icon: '💰' },
        ].map((item, i) => (
          <div key={i} className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-orange-50 hover:shadow-md transition-shadow">
            <div className="text-3xl mb-3">{item.icon}</div>
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">{item.label}</h3>
            <p className={`text-2xl font-black ${item.color}`}>{item.val}</p>
          </div>
        ))}
      </div>
      
      {/* Top Products / Recent Purchases */}
      <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-orange-50">
        <h3 className="text-xl font-black text-[#2D1B69] mb-8 flex items-center gap-2">
          <span className="w-2 h-8 bg-yellow-400 rounded-full"></span>
          Most Loved Items
        </h3>
        
        <div className="space-y-4">
          {[
            { name: 'Premium Dog Food', units: 45, price: 2069 },
            { name: 'Cat Food Premium', units: 32, price: 1151 },
            { name: 'Pet Carrier', units: 12, price: 359 }
          ].map((product, i) => (
            <div key={i} className="flex items-center justify-between p-6 bg-[#FFFBF0] rounded-[2rem] border border-transparent hover:border-orange-200 transition-all group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-xl shadow-sm">
                  🦴
                </div>
                <div>
                  <h4 className="font-black text-[#2D1B69] group-hover:text-orange-600 transition-colors">{product.name}</h4>
                  <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">{product.units} Units Purchased</p>
                </div>
              </div>
              <span className="text-orange-600 font-black text-lg">Ksh. {product.price.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductStats;