import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchServiceById, fetchServices, createAppointment } from '../features/serviceSlice';
import { selectCurrentService, selectServiceLoading, selectServices } from '../features/serviceSlice';
import { showNotification } from '../features/uiSlice';
import ItemCard from '../components/ItemCard';
import { fetchReviews, selectReviews } from '../features/reviewSlice';
import ReviewStars from '../components/ReviewStars';
import ReviewSection from '../components/ReviewSection';

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
  const [zones, setZones] = useState([]);
  const [exactLocation, setExactLocation] = useState('');
  const [selectedZoneId, setSelectedZoneId] = useState('');

  const { items: reviews } = useSelector(selectReviews);

  useEffect(() => {
    dispatch(fetchReviews());
  }, [dispatch]);

  const serviceReviews = reviews.filter((r) => r.service_id === service?.id);
  const avgRating = serviceReviews.length
    ? serviceReviews.reduce((sum, r) => sum + r.rating, 0) / serviceReviews.length
    : 0;

  useEffect(() => {
    if (isBooking) {
      axios.get('http://127.0.0.1:5555/delivery-zones', {
        headers: {
          'ngrok-skip-browser-warning': 'true',
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      }).then((res) => setZones(res.data));
    }
  }, [isBooking]);

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
      dispatch(showNotification({ type: 'error', message: 'Please login to book' }));
      return;
    }
    setIsBooking(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFFBF0]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2D1B69]"></div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFFBF0]">
        <div className="text-center">
          <h2 className="text-2xl font-black text-[#2D1B69] uppercase">Service not found</h2>
          <button
            onClick={() => navigate('/services')}
            className="mt-4 px-8 py-3 bg-[#2D1B69] text-white rounded-full font-bold hover:bg-purple-900 transition-all"
          >
            Back to Services
          </button>
        </div>
      </div>
    );
  }

  const submitBooking = async () => {
    if (!bookingDate || !selectedZoneId || !exactLocation.trim()) {
      dispatch(showNotification({ type: 'error', message: 'Please select a date, time, location and exact address' }));
      return;
    }
    const zone = zones.find((z) => z.id === parseInt(selectedZoneId));
    const finalPrice = (service.base_price || 0) + (zone?.delivery_fee || 0);

    const result = await dispatch(createAppointment({
      service_id: service.id,
      appointment_date: bookingDate,
      delivery_zone_id: selectedZoneId,
      exact_location: exactLocation,
      total_price: finalPrice,
      notes,
    }));
    if (createAppointment.fulfilled.match(result)) {
      setIsBooking(false);
      setBookingDate('');
      setNotes('');
      setExactLocation('');
      navigate('/mpesaForm', {
        state: {
          amount: finalPrice,
          appointmentId: result.payload.id,
        },
      });
    }
  };

  const relatedServices = items.filter((item) => item.category?.name === service.category?.name && item.id !== service?.id);

  return (
    <div className="min-h-screen bg-[#FFFBF0] py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Content Card */}
        <div className="bg-white rounded-[3rem] shadow-xl shadow-orange-100/50 overflow-hidden border border-orange-50">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            
            {/* Left: Image Section */}
            <div className="relative h-[400px] lg:h-auto bg-gray-100">
              {service.image_url ? (
                <img
                  src={service.image_url}
                  alt={service.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-50 to-yellow-50">
                  <span className="text-6xl">🐾</span>
                </div>
              )}
              {/* Duration Badge */}
              <div className="absolute top-6 left-6">
                <div className="px-4 py-2 rounded-full text-xs font-black bg-white/90 backdrop-blur-md text-[#2D1B69] shadow-sm flex items-center gap-2 border border-orange-100">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  {service.duration || '60'} MIN SESSION
                </div>
              </div>
            </div>

            {/* Right: Info Section */}
            <div className="p-10 lg:p-16 flex flex-col justify-center">
              <div className="mb-6">
                {service.category && (
                  <span className="inline-block px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest bg-purple-100 text-[#2D1B69] uppercase mb-4">
                    {service.category.name}
                  </span>
                )}
                <h1 className="text-5xl font-black text-[#2D1B69] tracking-tighter leading-tight mb-2">
                  {service.name}
                </h1>
                
                <div className="flex items-center gap-4">
                    <span className="text-3xl font-black text-orange-500">
                      Ksh. {service.base_price?.toLocaleString()}
                    </span>
                    <span className="text-gray-400 font-bold text-sm">/ session</span>
                </div>
              </div>

              {/* Star Rating */}
              {avgRating > 0 && (
                <div className="flex items-center mb-8 bg-orange-50 self-start px-4 py-2 rounded-2xl border border-orange-100">
                  <ReviewStars rating={avgRating} size={4} />
                  <span className="text-xs font-black text-[#2D1B69] ml-2">({serviceReviews.length} REVIEWS)</span>
                </div>
              )}

              {service.description && (
                <div className="mb-10">
                  <h3 className="text-xs font-black text-[#2D1B69] uppercase tracking-widest mb-3">About this service</h3>
                  <p className="text-gray-500 font-medium leading-relaxed text-lg">
                    {service.description}
                  </p>
                </div>
              )}

              <button
                onClick={handleBookNow}
                className="w-full py-5 px-8 rounded-full font-black text-white bg-[#2D1B69] hover:bg-purple-900 shadow-2xl shadow-purple-200 transition-all transform hover:-translate-y-1 active:scale-95 uppercase tracking-widest text-sm"
              >
                Book Now
              </button>
            </div>
          </div>
        </div>

        {/* Review Section Refactored */}
        <section className="mt-20">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-[#2D1B69] tracking-tighter uppercase">Customer Feedback</h2>
            <div className="w-20 h-1.5 bg-orange-500 mx-auto mt-4 rounded-full"></div>
          </div>
          <ReviewSection serviceId={id} />
        </section>

        {/* Related Services */}
        {relatedServices.length > 0 && (
          <div className="mt-24">
            <h2 className="text-2xl font-black text-[#2D1B69] uppercase tracking-tighter mb-8">You might also like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
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

        {/* Booking Modal Refactored */}
        {isBooking && (
          <div className="fixed inset-0 bg-[#2D1B69]/40 backdrop-blur-md flex items-center justify-center z-[100] p-4">
            <div className="bg-white rounded-[2.5rem] p-10 max-w-md w-full shadow-2xl border border-orange-50 animate-in fade-in zoom-in duration-300">
              <h2 className="text-3xl font-black text-[#2D1B69] tracking-tighter uppercase mb-6 text-center">Finalize Booking</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black text-[#2D1B69] uppercase ml-4 mb-1 block">Select Date & Time</label>
                  <input 
                    type="datetime-local" 
                    className="w-full bg-[#FFFBF0] border border-orange-100 rounded-full px-6 py-3 font-bold text-[#2D1B69] focus:outline-none focus:ring-2 focus:ring-orange-400"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black text-[#2D1B69] uppercase ml-4 mb-1 block">Service Location</label>
                  <select 
                    className="w-full bg-[#FFFBF0] border border-orange-100 rounded-full px-6 py-3 font-bold text-[#2D1B69] focus:outline-none focus:ring-2 focus:ring-orange-400"
                    value={selectedZoneId}
                    onChange={(e) => setSelectedZoneId(e.target.value)}
                    required
                  >
                    <option value="">Choose Area...</option>
                    {zones.map(z => (
                      <option key={z.id} value={z.id}>{z.zone_name} (+ Ksh {z.delivery_fee})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-black text-[#2D1B69] uppercase ml-4 mb-1 block">Exact Address</label>
                  <input
                    type="text"
                    className="w-full bg-[#FFFBF0] border border-orange-100 rounded-full px-6 py-3 font-bold text-[#2D1B69] focus:outline-none focus:ring-2 focus:ring-orange-400"
                    placeholder="e.g. Apartment/House No"
                    value={exactLocation}
                    onChange={(e) => setExactLocation(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black text-[#2D1B69] uppercase ml-4 mb-1 block">Notes for Provider</label>
                  <textarea 
                    className="w-full bg-[#FFFBF0] border border-orange-100 rounded-[1.5rem] px-6 py-4 font-bold text-[#2D1B69] focus:outline-none focus:ring-2 focus:ring-orange-400"
                    placeholder="Any special instructions?"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows="2"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3 mt-8">
                <button 
                  onClick={submitBooking} 
                  className="w-full bg-orange-500 text-white py-4 rounded-full font-black uppercase tracking-widest text-xs hover:bg-orange-600 transition-all shadow-lg shadow-orange-100"
                >
                  Confirm & Pay
                </button>
                <button 
                  onClick={() => setIsBooking(false)} 
                  className="w-full bg-gray-100 text-gray-400 py-4 rounded-full font-black uppercase tracking-widest text-[10px] hover:bg-gray-200 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceDetail;