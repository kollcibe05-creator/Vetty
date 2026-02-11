import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchServiceById, fetchServices, createAppointment } from '../features/serviceSlice';
import { selectCurrentService, selectServiceLoading, selectServices } from '../features/serviceSlice';
import { showNotification } from '../features/uiSlice';
import ItemCard from '../components/ItemCard';

const ServiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { items } = useSelector(selectServices);
  const service = useSelector(selectCurrentService);
  const isLoading = useSelector(selectServiceLoading);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [isBooking, setIsBooking] = useState(false);
  const [bookingDate, setBookingDate] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (id) {
      dispatch(fetchServiceById(id));
      if (items.length === 0) {
        dispatch(fetchServices());
      }
    }
  }, [dispatch, id, items.length]);

  const handleBookNow = () => {
    if (!isAuthenticated) {
      dispatch(showNotification({ type: 'error', message: 'Please login to book a treat for your pet! 🐾' }));
      return;
    }
    setIsBooking(true);
  };

  const submitBooking = async () => {
    if (!bookingDate) {
      dispatch(showNotification({ type: 'error', message: 'Please select a date and time' }));
      return;
    }
    const result = await dispatch(createAppointment({
      service_id: service.id,
      appointment_date: bookingDate,
      total_price: service.base_price || 0,
      notes
    }));
    if (createAppointment.fulfilled.match(result)) {
      setIsBooking(false);
      setBookingDate('');
      setNotes('');
      dispatch(showNotification({ type: 'success', message: 'Booking successful! We can’t wait to see your pet!' }));
    }
  };

  // --- THEME LOADING STATE ---
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FFFBF0] flex flex-col items-center justify-center">
        <div className="animate-bounce text-6xl mb-4">🦴</div>
        <p className="text-[#2D1B69] font-black uppercase tracking-widest animate-pulse">Prepping the spa...</p>
      </div>
    );
  }

  // --- THEME NOT FOUND ---
  if (!service) {
    return (
      <div className="min-h-screen bg-[#FFFBF0] flex items-center justify-center p-4">
        <div className="text-center bg-white p-12 rounded-[3rem] shadow-xl border-4 border-yellow-400 max-w-md w-full">
          <h2 className="text-3xl font-black text-[#2D1B69] mb-4">Service Not Found</h2>
          <button 
            onClick={() => navigate('/services')}
            className="w-full py-4 bg-[#2D1B69] text-white rounded-full font-black hover:bg-orange-600 transition-all"
          >
            Back to Services
          </button>
        </div>
      </div>
    );
  }

  const relatedServices = items
    .filter(item => item.category?.name === service.category?.name && item.id !== service?.id)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-[#FFFBF0] pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* LEFT COLUMN - IMAGE */}
          <div className="relative group">
            {/* Decorative background blob */}
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 group-hover:opacity-100 transition-opacity"></div>
            
            <div className="bg-white p-3 rounded-[3.5rem] shadow-xl border border-orange-50 relative overflow-hidden">
              <div className="relative h-[500px] rounded-[3rem] overflow-hidden bg-gray-100">
                {service.image_url ? (
                  <img 
                    src={service.image_url} 
                    alt={service.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-yellow-50">
                    <span className="text-9xl">✂️</span>
                  </div>
                )}
                
                {/* Duration Overlay */}
                <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-md text-[#2D1B69] px-6 py-2 rounded-full font-black text-sm shadow-lg flex items-center gap-2">
                   <span className="text-orange-500">⏱️</span> {service.duration || '60'} Minutes
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN - INFO */}
          <div className="lg:sticky lg:top-24">
            <div className="bg-white rounded-[3.5rem] p-10 shadow-sm border border-orange-50">
              {/* Category */}
              <div className="mb-6">
                <span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-yellow-400 text-[#2D1B69]">
                  {service.category?.name || 'General Care'}
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-black text-[#2D1B69] leading-tight mb-4">
                {service.name}
              </h1>

              <div className="flex items-baseline gap-2 mb-8">
                <span className="text-4xl font-black text-orange-600">Ksh. {service.base_price?.toLocaleString()}</span>
                <span className="text-gray-400 font-bold uppercase text-xs tracking-widest">/ Session</span>
              </div>

              <div className="space-y-4 mb-10">
                <h3 className="text-sm font-black text-[#2D1B69] uppercase tracking-widest flex items-center gap-2">
                  <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                  About This Service
                </h3>
                <p className="text-gray-600 leading-relaxed text-lg font-medium italic">
                  "{service.description}"
                </p>
              </div>

              <button
                onClick={handleBookNow}
                className="w-full py-5 bg-orange-500 text-white rounded-full font-black text-xl shadow-xl hover:bg-[#2D1B69] hover:shadow-orange-200 transition-all duration-300 transform active:scale-95 flex items-center justify-center gap-3"
              >
                Book a Session 🐾
              </button>
            </div>
          </div>
        </div>

        {/* RELATED SERVICES */}
        {relatedServices.length > 0 && (
          <div className="mt-24">
            <div className="flex flex-col items-center mb-12">
              <h2 className="text-3xl font-black text-[#2D1B69] mb-3">Other Treats for Your Pet</h2>
              <div className="h-1.5 w-20 bg-yellow-400 rounded-full"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
              {relatedServices.map((relatedService) => (
                <ItemCard
                  key={relatedService.id}
                  item={relatedService}
                  type="service"
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* --- THEME MODAL --- */}
      {isBooking && (
        <div className="fixed inset-0 bg-[#2D1B69]/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[3rem] p-10 max-w-md w-full shadow-2xl border-4 border-yellow-400 animate-in zoom-in duration-300">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-black text-[#2D1B69] mb-2">Book a slot</h2>
              <p className="text-orange-600 font-bold uppercase tracking-widest text-xs">{service.name}</p>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-[#2D1B69] uppercase tracking-[0.2em] mb-2 ml-2">Pick a Date & Time</label>
                <input 
                  type="datetime-local" 
                  className="w-full border-2 border-orange-50 rounded-2xl p-4 bg-[#FFFBF0] text-[#2D1B69] font-bold focus:border-orange-500 outline-none transition-all"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-[#2D1B69] uppercase tracking-[0.2em] mb-2 ml-2">Notes (Allergies, Temperament...)</label>
                <textarea 
                  placeholder="Tell us about your pet..."
                  className="w-full border-2 border-orange-50 rounded-2xl p-4 bg-[#FFFBF0] text-[#2D1B69] font-medium focus:border-orange-500 outline-none transition-all h-28"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col gap-3 mt-10">
              <button 
                onClick={submitBooking} 
                className="w-full bg-[#2D1B69] text-white py-4 rounded-full font-black text-lg shadow-lg hover:bg-orange-600 transition-all active:scale-95"
              >
                Confirm Booking
              </button>
              <button 
                onClick={() => setIsBooking(false)} 
                className="w-full bg-transparent text-gray-400 py-2 rounded-full font-bold hover:text-red-400 transition-all text-sm"
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

export default ServiceDetail;