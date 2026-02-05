import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchServiceById } from '../features/serviceSlice';
import { selectCurrentService, selectServiceLoading } from '../features/serviceSlice';
import { showNotification } from '../features/uiSlice';
import ItemCard from '../components/ItemCard';

const ServiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const service = useSelector(selectCurrentService);
  const isLoading = useSelector(selectServiceLoading);

  useEffect(() => {
    if (id) {
      dispatch(fetchServiceById(id));
    }
  }, [dispatch, id]);

  const handleBookNow = () => {
    dispatch(showNotification({
      type: 'info',
      title: 'Booking Feature',
      message: 'Service booking functionality coming soon!',
    }));
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

  // Mock related services
  const relatedServices = [
    { id: 2, name: 'Pet Walking', price: 25.00, category: { name: 'Exercise' } },
    { id: 3, name: 'Pet Training', price: 45.00, category: { name: 'Training' } },
    { id: 4, name: 'Grooming Service', price: 35.00, category: { name: 'Grooming' } },
  ];

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
                  <span className="text-3xl font-bold text-blue-600">${service.price?.toFixed(2)}</span>
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
        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;
