import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchServices, setFilters, searchServices } from '../features/serviceSlice';
import { selectServices, selectServiceLoading, createAppointment } from '../features/serviceSlice';
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
    }, 400)
    return () => clearTimeout(timer)
  }, [dispatch, filters]);
const handleCategoryChange = (categoryName) => {
  dispatch(setFilters({category: categoryName}))
}

  const handleSearchChange = (e) => {
    const value = e.target.value
    setSearchQuery(value)
    dispatch(setFilters({search: value}))
    // setDebouncedSearch(e.target.value);
  };


const submitBooking = async () => {
    if (!bookingDate) {
      dispatch(showNotification({ type: 'error', message: 'Please select a date' }));
      return;
    }

    const result = await dispatch(createAppointment({
      service_id: selectedService.id,
      appointment_date: bookingDate,
      total_price:selectedService.base_price || selectedService.price,
      notes
    }));

    if (createAppointment.fulfilled.match(result)) {
      setSelectedService(null);
      setBookingDate('');
      setNotes('');
    }
  };

  const categories = [...new Set(items.map(item => item.category?.name).filter(Boolean))];

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* HEADER & SEARCH SECTION */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Our Services</h1>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            Professional solutions tailored to your needs. 
          </p>
          
          <div className="relative max-w-md mx-auto">
            <input 
              type="text"
              placeholder="Search for a service..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-12 pr-4 py-3 rounded-2xl border-none bg-white shadow-md focus:ring-2 focus:ring-blue-500 transition-all outline-none"
            />
            <svg className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* CATEGORY FILTER SECTION */}
       <div className="mb-8">
  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-gray-200 pb-4">
    <CategoryFilter 
      category_type="Service" 
      // This sends the name (e.g., 'Grooming') to Redux
      onSelectedCategory={handleCategoryChange} 
    />
    
    {/* Optional: Keep the Sort Logic */}
    <select 
      className="bg-transparent text-sm font-medium text-gray-600 outline-none cursor-pointer"
      onChange={(e) => dispatch(setFilters({ sortBy: e.target.value }))}
      value={filters.sortBy}
    >
      <option value="name">Sort by Name</option>
      <option value="base_price">Sort by Price</option>
    </select>
  </div>
</div> 

      {/* --- BOOKING MODAL/FORM (Conditional Rendering) --- */}
      {selectedService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl">
            <h2 className="text-xl font-bold mb-4">Book {selectedService.name}</h2>
            
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Date & Time</label>
            <input 
              type="datetime-local" 
              className="w-full border rounded-lg p-2 mb-4"
              value={bookingDate}
              onChange={(e) => setBookingDate(e.target.value)}
            />

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
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700"
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

      {/* Services Grid (Rest of your UI) */}
      {!isLoading && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {items.map((service) => (
                <ItemCard
                  key={service.id}
                  item={service}
                  type="service"
                  onBookNow={() => {
                    if (!isAuthenticated) {
                      dispatch(showNotification({type: 'error', message: "Please login to book"}))
                      return 
                    }
                    setSelectedService(service)
                  }}
                />
              ))}
           </div>
        </div>
      )}
    </div>
  );
};

export default Services;