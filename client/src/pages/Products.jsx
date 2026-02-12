import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts, setFilters, searchProducts, selectProducts, selectProductLoading } from '../features/productSlice';
import { showSpinner, hideSpinner, showNotification } from '../features/uiSlice';
import ItemCard from '../components/ItemCard';
import { addToCart } from '../features/cartSlice';
import CategoryFilter from '../components/CategoryFilter';
import { fetchReviews, selectReviews } from '../features/reviewSlice' //, setFilters


const Products = () => {
  const dispatch = useDispatch();
  const { items, filters } = useSelector(selectProducts);
  const isLoading = useSelector(selectProductLoading);
  const {items: reviews} = useSelector(selectReviews)

  useEffect(() => {
    dispatch(fetchReviews()); 
  }, [dispatch]);

  const [searchQuery, setSearchQuery] = useState('');


  useEffect(() => {
    const timer = setTimeout(() => {
        dispatch(fetchProducts(filters));
    }, 400);
    return () => clearTimeout(timer);
  }, [dispatch, filters]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    dispatch(setFilters({ search: value }));
  };

  const handleCategoryChange = (categoryName) => {
    dispatch(setFilters({ category: categoryName }));
  };

  const handleAddToCart = (product) => {
    dispatch(addToCart({ productId: product.id, quantity: 1 }));
    dispatch(showNotification({
            type: 'success',
            message: `Woot! ${product.name} is now in your cart! 🐾`,
          }));
  };

  return (
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;