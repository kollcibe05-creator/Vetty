import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchServices, setFilters, selectServices, selectServiceLoading, createAppointment } from '../features/serviceSlice';
import { showNotification } from '../features/uiSlice';
import ItemCard from '../components/ItemCard';
import CategoryFilter from '../components/CategoryFilter';

const Services = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const { items, filters } = useSelector(selectServices);
  const isLoading = useSelector(selectServiceLoading);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedService, setSelectedService] = useState(null);
  const [bookingDate, setBookingDate] = useState('');
  const [notes, setNotes] = useState('');

  //added
  const [zones, setZones] = useState([]);
  const [selectedZoneId, setSelectedZoneId] = useState('');
  useEffect(() => {
    if (selectedService) {
      axios.get('https://thallous-nongraduated-doris.ngrok-free.dev/delivery-zones', {
        headers: { 
          'ngrok-skip-browser-warning': 'true',
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })
      .then(res => setZones(res.data))
      .catch(err => console.error("Error fetching zones:", err));
    }
  }, [selectedService]);

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
    if (!bookingDate || !selectedZoneId) {
      dispatch(showNotification({ type: 'error', message: 'Please select a date, time and location' }));
      return;
    }

    const zone = zones.find(z => z.id === parseInt(selectedZoneId));
    const finalPrice = (selectedService.base_price || 0) + (zone?.delivery_fee || 0);

    const result = await dispatch(createAppointment({
      service_id: selectedService.id,
      appointment_date: bookingDate,
      delivery_zone_id: selectedZoneId,
      total_price: finalPrice,
      notes
    }));
    if (createAppointment.fulfilled.match(result)) {
      const newAppointment = result.payload
      setSelectedService(null);
      setBookingDate('');
      setNotes('');

      navigate('/mpesaForm', {
        state: {
          amount: finalPrice,
          appointmentId: newAppointment.id
        }
      });
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {isLoading ? (
            <div className="col-span-full flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : items.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-500">
              No services found matching your criteria.
            </div>
          ) : (
            items.map((service) => (
              <ItemCard
                key={service.id}
                item={service}
                type="service"
                onBookNow={() => setSelectedService(service)}
              />
            ))
          )}
        </div>
      </div>

      {/* --- BOOKING MODAL --- */}
      {selectedService && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[2rem] p-8 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Book {selectedService.name}</h3>
            
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Date & Time</label>
            <input 
              type="datetime-local" 
              className="w-full border rounded-lg p-2 mb-4"
              value={bookingDate}
              onChange={(e) => setBookingDate(e.target.value)}
            />
            
            <label className="block text-sm font-medium text-gray-700 mb-1">Service Location/Zone</label>
            <select 
              className="w-full border rounded-lg p-2 mb-4"
              value={selectedZoneId}
              onChange={(e) => setSelectedZoneId(e.target.value)}
              required
            >
              <option value="">Select Location...</option>
              {zones.map(z => (
                <option key={z.id} value={z.id}>{z.zone_name} (+ Ksh {z.delivery_fee})</option>
              ))}
            </select>

            <label className="block text-sm font-medium text-gray-700 mb-1">Notes for the provider</label>
            <textarea 
              className="w-full border rounded-lg p-2 mb-4"
              placeholder="Any specific requests?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />

            <div className="flex gap-3">
              <button 
                onClick={submitBooking}
                className="flex-1 bg-[#2D1B69] text-white py-2 rounded-lg font-semibold hover:bg-purple-700"
              >
                Confirm Booking
              </button>
              <button 
                onClick={() => setSelectedService(null)}
                className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg font-semibold hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Services;