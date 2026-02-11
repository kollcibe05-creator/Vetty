import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchServices, setFilters, selectServices, selectServiceLoading, createAppointment } from '../features/serviceSlice';
import { showNotification } from '../features/uiSlice';
import ItemCard from '../components/ItemCard';
import CategoryFilter from '../components/CategoryFilter';

const Services = () => {
  const dispatch = useDispatch();
  const { items, filters } = useSelector(selectServices);
  const isLoading = useSelector(selectServiceLoading);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedService, setSelectedService] = useState(null);
  const [bookingDate, setBookingDate] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(fetchServices(filters));      
    }, 400);
    return () => clearTimeout(timer);
  }, [dispatch, filters]);

  const handleCategoryChange = (categoryName) => {
    dispatch(setFilters({category: categoryName}));
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    dispatch(setFilters({search: value}));
  };

  const submitBooking = async () => {
    if (!bookingDate) {
      dispatch(showNotification({ type: 'error', message: 'Please select a date' }));
      return;
    }
    const result = await dispatch(createAppointment({
      service_id: selectedService.id,
      appointment_date: bookingDate,
      total_price: selectedService.base_price || selectedService.price,
      notes
    }));
    if (createAppointment.fulfilled.match(result)) {
      setSelectedService(null);
      setBookingDate('');
      setNotes('');
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFBF0]"> {/* Match Homepage Background */}
      
      {/* --- HERO HEADER --- */}
      <section className="bg-yellow-400 py-16 px-4 rounded-b-[3rem] md:rounded-b-[5rem] shadow-sm mb-12 relative overflow-hidden">
        {/* Decorative Blob */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-orange-400 rounded-full opacity-20 blur-2xl"></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-black text-[#2D1B69] mb-4">
            Our Services
          </h1>
          <p className="text-[#2D1B69] opacity-80 text-lg font-medium max-w-xl mx-auto mb-8">
            Because every pet deserves the best care. From grooming to vet care, we've got you covered.
          </p>
          
          {/* Stylized Search Bar */}
          <div className="relative max-w-lg mx-auto transform hover:scale-105 transition-transform duration-300">
            <input 
              type="text"
              placeholder="What does your pet need today?"
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-14 pr-6 py-4 rounded-full border-2 border-transparent bg-white shadow-xl focus:border-orange-500 focus:ring-0 transition-all outline-none text-[#2D1B69] font-medium"
            />
            <svg className="absolute left-5 top-4.5 h-6 w-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* --- FILTERS SECTION --- */}
        <div className="mb-12 flex flex-col md:flex-row items-center justify-between gap-6 bg-white p-6 rounded-[2rem] shadow-sm border border-orange-50">
          <div className="flex-1 w-full">
            <CategoryFilter 
              category_type="Service" 
              onSelectedCategory={handleCategoryChange} 
            />
          </div>
          
          <div className="flex items-center gap-3 bg-purple-50 px-4 py-2 rounded-full border border-purple-100">
            <span className="text-sm font-bold text-purple-700">Sort:</span>
            <select 
              className="bg-transparent text-sm font-bold text-[#2D1B69] outline-none cursor-pointer"
              onChange={(e) => dispatch(setFilters({ sortBy: e.target.value }))}
              value={filters.sortBy}
            >
              <option value="name">Name (A-Z)</option>
              <option value="base_price">Price (Low-High)</option>
            </select>
          </div>
        </div>

        {/* --- SERVICES GRID --- */}
        {!isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 pb-20">
            {items.map((service) => (
              <div key={service.id} className="transform hover:-translate-y-2 transition-all duration-300">
                <ItemCard
                  item={service}
                  type="service"
                  onBookNow={() => {
                    if (!isAuthenticated) {
                      dispatch(showNotification({type: 'error', message: "Please login to book"}));
                      return;
                    }
                    setSelectedService(service);
                  }}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex justify-center py-20">
            <div className="animate-bounce text-4xl">🐾</div>
          </div>
        )}
      </div>

      {/* --- RE-STYLED BOOKING MODAL --- */}
      {selectedService && (
        <div className="fixed inset-0 bg-[#2D1B69]/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[2.5rem] p-8 max-w-md w-full shadow-2xl border-4 border-yellow-400 transform scale-100 animate-in fade-in zoom-in duration-300">
            <h2 className="text-3xl font-black text-[#2D1B69] mb-2 text-center">Book Now!</h2>
            <p className="text-orange-600 text-center font-bold mb-6">{selectedService.name}</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-[#2D1B69] mb-1 ml-2">Preferred Date</label>
                <input 
                  type="datetime-local" 
                  className="w-full border-2 border-purple-50 rounded-2xl p-3 focus:border-orange-500 outline-none transition"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#2D1B69] mb-1 ml-2">Special Notes</label>
                <textarea 
                  className="w-full border-2 border-purple-50 rounded-2xl p-3 focus:border-orange-500 outline-none transition h-24"
                  placeholder="Tell us about your pet's needs..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col gap-3 mt-8">
              <button 
                onClick={submitBooking}
                className="w-full bg-[#2D1B69] text-white py-4 rounded-full font-black text-lg hover:bg-orange-600 transition shadow-lg active:scale-95"
              >
                Confirm Appointment
              </button>
              <button 
                onClick={() => setSelectedService(null)}
                className="w-full bg-gray-100 text-[#2D1B69] py-3 rounded-full font-bold hover:bg-gray-200 transition"
              >
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Services;