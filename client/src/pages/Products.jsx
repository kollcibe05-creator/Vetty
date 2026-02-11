import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts, setFilters, searchProducts, selectProducts, selectProductLoading } from '../features/productSlice';
<<<<<<< HEAD
import { addToCart } from '../features/cartSlice';
import ItemCard from '../components/ItemCard';
=======
import { showSpinner, hideSpinner, showNotification } from '../features/uiSlice';
import ItemCard from '../components/ItemCard';
import { addToCart } from '../features/cartSlice';
import CategoryFilter from '../components/CategoryFilter';

>>>>>>> origin/suleiman

const Products = () => {
  const dispatch = useDispatch();
  const { items, filters } = useSelector(selectProducts);
  const isLoading = useSelector(selectProductLoading);

  const [searchQuery, setSearchQuery] = useState('');

<<<<<<< HEAD
  useEffect(() => {
    dispatch(fetchProducts(filters));
  }, [dispatch, filters]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (debouncedSearch.trim()) {
        dispatch(searchProducts(debouncedSearch));
      }
    }, 500);
=======
  // 1. Fetch products when filters change
  useEffect(() => {
    const timer = setTimeout(() => {
        dispatch(fetchProducts(filters));
    }, 400);
>>>>>>> origin/suleiman
    return () => clearTimeout(timer);
  }, [dispatch, filters]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    dispatch(setFilters({ search: value }));
  };

<<<<<<< HEAD
  const handleCategoryChange = (category) => dispatch(setFilters({ category }));
  const handleSortChange = (sortBy) => dispatch(setFilters({ sortBy }));
  const handleAddToCart = (product) => dispatch(addToCart({ productId: product.id, quantity: 1 }));
=======
  // 2. Updated handler to match the reusable CategoryFilter prop
  const handleCategoryChange = (categoryName) => {
    dispatch(setFilters({ category: categoryName }));
  };

  const handleAddToCart = (product) => {
    dispatch(addToCart({ productId: product.id, quantity: 1 }));
  };
>>>>>>> origin/suleiman

  return (
<<<<<<< HEAD
    <div className="min-h-screen bg-[#FFFBF0]"> {/* Consistent Theme Background */}
      
      {/* --- HERO SECTION --- */}
      <section className="bg-yellow-400 py-16 px-4 rounded-b-[4rem] md:rounded-b-[6rem] shadow-sm mb-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-black text-[#2D1B69] mb-4">
            The Pet Shop
          </h1>
          <p className="text-[#2D1B69] opacity-80 text-lg font-bold mb-8">
            Premium treats, toys, and essentials for your best friends.
          </p>
          
          <div className="relative max-w-lg mx-auto transform hover:scale-105 transition-all duration-300">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search for kibble, toys, or treats..."
              className="w-full pl-14 pr-6 py-4 rounded-full border-none bg-white shadow-xl focus:ring-4 focus:ring-orange-300 outline-none text-[#2D1B69] font-medium"
            />
            <div className="absolute inset-y-0 left-5 flex items-center">
              <svg className="h-6 w-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* --- FILTER & SORT BAR --- */}
        <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-orange-100 mb-10 flex flex-wrap gap-6 items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-[#2D1B69] font-black uppercase text-xs tracking-widest">Filter By</span>
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => handleCategoryChange("")}
                className={`px-5 py-2 rounded-full text-sm font-bold transition ${!filters.category ? 'bg-[#2D1B69] text-white shadow-md' : 'bg-purple-50 text-[#2D1B69] hover:bg-orange-100'}`}
              >
                All
              </button>
              {categories.map(cat => (
                <button 
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`px-5 py-2 rounded-full text-sm font-bold transition ${filters.category === cat ? 'bg-[#2D1B69] text-white shadow-md' : 'bg-purple-50 text-[#2D1B69] hover:bg-orange-100'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 bg-orange-50 px-4 py-2 rounded-full border border-orange-100">
            <span className="text-xs font-black text-orange-700 uppercase">Sort:</span>
            <select
              value={filters.sortBy || 'name'}
              onChange={(e) => handleSortChange(e.target.value)}
              className="bg-transparent text-sm font-bold text-[#2D1B69] outline-none cursor-pointer"
            >
              <option value="name">Name (A-Z)</option>
              <option value="price">Price (Low-High)</option>
              <option value="created_at">Newest Arrivals</option>
            </select>
          </div>
        </div>

        {/* --- PRODUCT GRID --- */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
             <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-orange-500 mb-4"></div>
             <p className="text-[#2D1B69] font-bold animate-pulse">Sniffing out products...</p>
          </div>
        ) : (
          /* Increased gap to 12 to fix overlapping and removed the wrapper styling */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12 pb-24">
            {items.map((product, index) => (
              <div
                key={product.id}
                className="flex justify-center h-full"
                style={{ 
                  animation: `fade-in-up 0.6s ease-out ${index * 0.05}s both` 
                }}
              >
                <ItemCard
                  item={product}
                  type="product"
                  onAddToCart={handleAddToCart}
                />
              </div>
=======
    <div className="min-h-screen bg-gray-50">
      {/* Header & Search */}
      <div className="mb-10 text-center pt-10">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Shop Products</h1>
        <p className="text-gray-600 max-w-2xl mx-auto mb-8">
          Quality supplies delivered to your door.
        </p>
        
        <div className="relative max-w-md mx-auto px-4">
          <input 
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full pl-12 pr-4 py-3 rounded-2xl border-none bg-white shadow-md focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <svg className="absolute left-8 top-3.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* REUSABLE CATEGORY FILTER SECTION */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-gray-200 pb-4">
          <CategoryFilter 
            category_type="Product" 
            activeCategory={filters.category} 
            onSelectedCategory={handleCategoryChange} 
          />
          
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-500">Sort:</span>
            <select 
              className="bg-transparent text-sm font-medium text-gray-600 outline-none cursor-pointer"
              onChange={(e) => dispatch(setFilters({ sortBy: e.target.value }))}
              value={filters.sortBy}
            >
              <option value="name">Name</option>
              <option value="price">Price</option>
              <option value="created_at">Newest</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No products found matching your criteria.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((product) => (
              <ItemCard
                key={product.id}
                item={product}
                type="product"
                onAddToCart={() => handleAddToCart(product)}
              />
>>>>>>> origin/suleiman
            ))}
          </div>
        )}
      </div>
<<<<<<< HEAD

      <style jsx>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
=======
>>>>>>> origin/suleiman
    </div>
  );
};

export default Products;