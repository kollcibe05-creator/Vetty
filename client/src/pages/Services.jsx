import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchServices, setFilters, searchServices } from '../features/serviceSlice';
import { selectServices, selectServiceFilters, selectServiceLoading } from '../features/serviceSlice';
import { showSpinner, hideSpinner, showNotification } from '../features/uiSlice';
import ItemCard from '../components/ItemCard';

const Services = () => {
  const dispatch = useDispatch();
  const { items, loading, filters } = useSelector(selectServices);
  const isLoading = useSelector(selectServiceLoading);

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Fetch services on mount and when filters change
  useEffect(() => {
    dispatch(fetchServices(filters));
  }, [dispatch, filters]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (debouncedSearch.trim()) {
        dispatch(searchServices(debouncedSearch));
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [debouncedSearch, dispatch]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setDebouncedSearch(value);
  };

  const handleCategoryChange = (category) => {
    dispatch(setFilters({ category }));
  };

  const handleSortChange = (sortBy) => {
    dispatch(setFilters({ sortBy }));
  };

  const handleBookNow = (service) => {
    // This would typically navigate to a booking form or open a modal
    dispatch(showNotification({
      type: 'info',
      title: 'Booking Feature',
      message: 'Service booking functionality coming soon!',
    }));
  };

  const categories = [...new Set(items.map(item => item.category?.name).filter(Boolean))];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h1 className="text-2xl font-bold text-gray-900">Services</h1>
            
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search services..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 0V3m-8 0v4m0 8h8M9 21l3-3m0 0l-3 3m3-3v12m0-8l-3-3"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap gap-4 items-center">
            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Category:</span>
              <select
                value={filters.category || ''}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Sort by:</span>
              <select
                value={filters.sortBy || 'name'}
                onChange={(e) => handleSortChange(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="name">Name</option>
                <option value="price">Price</option>
                <option value="duration">Duration</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* Services Grid */}
      {!isLoading && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 0V3m-8 0v4m0 8h8M9 21l3-3m0 0l-3 3m3-3v12m0-8l-3-3"></path>
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">No services found</h3>
              <p className="mt-2 text-gray-600">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in">
              {items.map((service, index) => (
                <div
                  key={service.id}
                  className="transform transition-all duration-500"
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animation: 'fade-in 0.5s ease-out forwards'
                  }}
                >
                  <ItemCard
                    item={service}
                    type="service"
                    onBookNow={handleBookNow}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Fade-in animation styles */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default Services;
