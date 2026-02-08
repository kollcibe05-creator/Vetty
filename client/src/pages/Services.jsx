import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchServices, setFilters, searchServices } from '../features/serviceSlice';
import { selectServices, selectServiceLoading } from '../features/serviceSlice';
import { showNotification } from '../features/uiSlice';
import ItemCard from '../components/ItemCard';

const Services = () => {
  const dispatch = useDispatch();
  const { items, filters } = useSelector(selectServices);
  const isLoading = useSelector(selectServiceLoading);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  
  // --- NEW STATE FOR BOOKING ---
  const [selectedService, setSelectedService] = useState(null);
  const [bookingDate, setBookingDate] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    dispatch(fetchServices(filters));
  }, [dispatch, filters]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (debouncedSearch.trim()) {
        dispatch(searchServices(debouncedSearch));
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [debouncedSearch, dispatch]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setDebouncedSearch(e.target.value);
  };

  // --- REFACTORED BOOKING LOGIC ---
  const handleBookNow = (service) => {
    if (!isAuthenticated) {
      dispatch(showNotification({ type: 'error', message: 'Please login to book an appointment' }));
      return;
    }
    // Open the booking form for authenticated users
    setSelectedService(service);
  };

  const submitBooking = async () => {
    if (!bookingDate) {
      dispatch(showNotification({ type: 'error', message: 'Please select a date' }));
      return;
    }

    // Validate that we have a valid datetime-local value
    const dateObj = new Date(bookingDate);
    if (isNaN(dateObj.getTime())) {
      dispatch(showNotification({ type: 'error', message: 'Invalid date format' }));
      return;
    }

    try {
      const response = await fetch('http://localhost:5555/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id: selectedService.id,
          appointment_date: bookingDate,
          total_price: selectedService.base_price || 0,
          notes: notes
        }),
        credentials: 'include'
      });

      if (response.ok) {
        dispatch(showNotification({ type: 'success', message: 'Appointment booked successfully!' }));
        setSelectedService(null); // Close form
        setBookingDate('');
        setNotes('');
      } else {
        const err = await response.json();
        dispatch(showNotification({ type: 'error', message: err.error }));
      }
    } catch (error) {
      dispatch(showNotification({ type: 'error', message: 'Server error. Try again later.' }));
    }
  };

  const categories = [...new Set(items.map(item => item.category?.name).filter(Boolean))];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ... (Search and Header remain the same) ... */}

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
                  onBookNow={() => handleBookNow(service)}
                />
              ))}
           </div>
        </div>
      )}
    </div>
  );
};

export default Services;