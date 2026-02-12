import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAppointments } from '../features/serviceSlice';

const ServiceStats = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    upcoming: 0,
    revenue: 0
  });

  useEffect(() => {
    // In a real app, you'd dispatch(fetchAppointments())
    setStats({
      total: 12,
      completed: 8,
      upcoming: 4,
      revenue: 45000
    });
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-[#FFFBF0] pb-12">
      {/* Header Section */}
      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-[#2D1B69]">My Services 🐾</h1>
          <p className="text-orange-600 font-bold uppercase tracking-widest text-xs mt-1">
            Tracking happiness for {user?.name || 'your furry friends'}
          </p>
        </div>
        <div className="bg-yellow-400 px-6 py-2 rounded-full shadow-sm flex items-center gap-2">
          <span className="text-[#2D1B69] font-black text-sm">Member Status:</span>
          <span className="bg-white px-3 py-0.5 rounded-full text-[10px] font-black text-orange-600 uppercase">Pro Pet Parent</span>
        </div>
      </div>

      {/* Empty State */}
      {stats.total === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="text-9xl mb-6 animate-pulse">😴🐱</div>
          <h2 className="text-2xl font-black text-[#2D1B69] mb-3">No Services Booked Yet</h2>
          <p className="text-gray-500 font-medium mb-8 text-center max-w-md">
            Your pet is all cozy at home. Time to book some pampering sessions!
          </p>
          <button 
            onClick={() => window.location.href = '/services'}
            className="bg-[#2D1B69] text-white px-8 py-4 rounded-full font-black shadow-lg hover:bg-[#F97316] transition-all transform hover:-translate-y-1"
          >
            Browse Services
          </button>
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'Total Visits', val: stats.total, color: 'text-[#2D1B69]', bg: 'bg-white', icon: '🐩' },
              { label: 'Completed', val: stats.completed, color: 'text-green-500', bg: 'bg-white', icon: '✅' },
              { label: 'Upcoming', val: stats.upcoming, color: 'text-orange-500', bg: 'bg-white', icon: '🗓️' },
              { label: 'Total Spend', val: `Ksh. ${stats.revenue.toLocaleString()}`, color: 'text-purple-600', bg: 'bg-white', icon: '💰' },
            ].map((item, i) => (
              <div key={i} className={`${item.bg} rounded-[2.5rem] p-8 shadow-sm border border-orange-50 transform hover:-translate-y-1 transition-all`}>
                <div className="text-3xl mb-4">{item.icon}</div>
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">{item.label}</h3>
                <p className={`text-2xl font-black ${item.color}`}>{item.val}</p>
              </div>
            ))}
          </div>

          {/* Activity Timeline */}
          <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white rounded-[3rem] p-10 shadow-sm border border-orange-50">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-black text-[#2D1B69]">Recent Activity</h3>
                <span className="text-xs font-bold text-orange-500 hover:underline cursor-pointer">View All</span>
              </div>
              
              <div className="space-y-6">
                {[
                  { title: 'Pet Training Session', date: 'Jan 15, 2026', status: 'Completed', color: 'bg-blue-500' },
                  { title: 'Full Grooming Spa', date: 'Jan 10, 2026', status: 'Completed', color: 'bg-green-500' },
                  { title: 'Vet Consultation', date: 'Feb 12, 2026', status: 'Upcoming', color: 'bg-yellow-400' }
                ].map((activity, i) => (
                  <div key={i} className="group flex items-center p-4 rounded-2xl hover:bg-[#FFFBF0] transition-colors">
                    <div className={`w-3 h-12 ${activity.color} rounded-full mr-6`}></div>
                    <div className="flex-grow">
                      <h4 className="font-black text-[#2D1B69] group-hover:text-orange-600 transition-colors">{activity.title}</h4>
                      <p className="text-gray-500 text-sm font-medium">{activity.date}</p>
                    </div>
                    <span className="px-4 py-1 rounded-full bg-gray-100 text-[10px] font-black text-gray-500 uppercase tracking-tighter">
                      {activity.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Promo Card */}
            <div className="bg-[#2D1B69] rounded-[3rem] p-10 text-white flex flex-col justify-center relative overflow-hidden shadow-xl shadow-purple-200">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
              <span className="text-4xl mb-4">🦴</span>
              <h3 className="text-2xl font-black mb-4">Ready for another treat?</h3>
              <p className="text-purple-200 text-sm mb-8 leading-relaxed">Book a grooming session today and get 10% off your next purchase!</p>
              <button className="w-full py-4 bg-yellow-400 text-[#2D1B69] rounded-full font-black text-sm uppercase tracking-widest hover:bg-white transition-all">
                Book Service
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ServiceStats;