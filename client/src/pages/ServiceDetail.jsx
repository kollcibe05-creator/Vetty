import React, { useEffect, useState } from 'react';
import axios from 'axios';
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

const {items} = useSelector(selectServices)
const service = useSelector(selectCurrentService);
const isLoading = useSelector(selectServiceLoading);
const {isAuthenticated} = useSelector((state) => state.auth)

const [isBooking, setIsBooking] = useState(false)
  
const [bookingDate, setBookingDate] = useState('');
const [notes, setNotes] = useState('');
  

  //added
  const [zones, setZones] = useState([]);
  const [selectedZoneId, setSelectedZoneId] = useState('');

  useEffect(() => {
    if (isBooking) {
      axios.get('https://thallous-nongraduated-doris.ngrok-free.dev/delivery-zones', {
        headers: { 
          'ngrok-skip-browser-warning': 'true',
          'Accept': 'application/json',
          "Content-Type": 'application/json'
        }
      })
      .then(res => setZones(res.data));
    }
  }, [isBooking]);


 

  useEffect(() => {
    if (id) {
      dispatch(fetchServiceById(id));
      if(items.length === 0){
        dispatch(fetchServices())
      }
    }
  }, [dispatch, id, items.length]);

  const handleBookNow = () => {
    if (!isAuthenticated) {
      dispatch(showNotification({type: 'error', message: 'Please login to book'}))
      return 
    }
    setIsBooking(true)
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900">Service not found</h2>
          <button 
            onClick={() => navigate('/services')}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Services
          </button>
        </div>
      </div>
    );
  }

  const submitBooking = async () => {
    if (!bookingDate || !selectedZoneId) {
      dispatch(showNotification({type: 'error', message: 'Please select a date, time and location'}) )
      return
    }
    const zone = zones.find(z => z.id === parseInt(selectedZoneId));
    const finalPrice = (service.base_price || 0) + (zone?.delivery_fee || 0);

    const result = await dispatch(createAppointment({
        service_id: service.id,
        appointment_date: bookingDate,
        delivery_zone_id: selectedZoneId,
        total_price: finalPrice,
        notes
    }));
    if (createAppointment.fulfilled.match(result)) {
      setIsBooking(false)
      setBookingDate('')
      setNotes('')
      navigate('/mpesaForm', {state: {
        amount: finalPrice,
        appointmentId: result.payload.id
      }})
    }
  }


  const relatedServices = items
    .filter(item => item.category?.name == service.category?.name && item.id !== service?.id)
    // .slice(0, 4);



  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Image */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="relative h-96 bg-gray-50">
                {service.image_url ? (
                  <img 
                    src={service.image_url} 
                    alt={service.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
                    <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 0V3m-8 0v4m0 8h8M9 21l3-3m0 0l-3 3m3-3v12m0-8l-3-3"></path>
                    </svg>
                  </div>
                )}
              </div>

              {/* Duration Badge */}
              <div className="p-4">
                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m0 0l-3 3m3-3v12m0-8l-3-3"></path>
                  </svg>
                  {service.duration || '60'} min
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Info */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              {/* Title and Price */}
              <div className="flex items-start justify-between mb-4">
                <h1 className="text-3xl font-bold text-gray-900 flex-1">{service.name}</h1>
                <div className="text-right">
                  <span className="text-3xl font-bold text-blue-600">Ksh. {service.base_price?.toFixed(2)}</span>
                  <span className="text-sm text-gray-500 ml-1">/session</span>
                </div>
              </div>

              {/* Category */}
              {service.category && (
                <div className="mb-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {service.category.name}
                  </span>
                </div>
              )}

              {/* Description */}
              {service.description && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">About this service</h3>
                  <p className="text-gray-600 leading-relaxed">{service.description}</p>
                </div>
              )}

              {/* Book Now Button */}
              <button
                onClick={handleBookNow}
                className="w-full py-3 px-6 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all duration-200 transform active:scale-95"
              >
                Book Now
              </button>
              
            </div>
          </div>
        </div>

        {/* Related Services */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Services</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedServices.map((relatedService) => (
              <ItemCard
                key={relatedService.id}
                item={relatedService}
                type="service"
              />
            ))}
          </div>
          {isBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl">
            <h2 className="text-xl font-bold mb-4">Book {service.name}</h2>
            
            <label className="block text-sm font-medium mb-1">Select Date & Time</label>
            <input 
              type="datetime-local" 
              className="w-full border rounded-lg p-2 mb-4"
              value={bookingDate}
              onChange={(e) => setBookingDate(e.target.value)}
            />
            <label className="block text-sm font-medium mb-1">Service Location/Zone</label>
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

            <label className="block text-sm font-medium mb-1">Notes</label>
            <textarea 
              className="w-full border rounded-lg p-2 mb-4"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />

            <div className="flex gap-3">
              <button onClick={submitBooking} className="flex-1 bg-blue-600 text-white py-2 rounded-lg">Confirm</button>
              <button onClick={() => setIsBooking(false)} className="flex-1 bg-gray-200 py-2 rounded-lg">Cancel</button>
            </div>
          </div>
        </div>
      )}
        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;
