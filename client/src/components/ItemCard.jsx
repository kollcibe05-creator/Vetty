import React from 'react';
import { useNavigate } from 'react-router-dom';

const ItemCard = ({ 
  item, 
  type = 'product', 
  onAddToCart,
  onBookNow,
  className = '' 
}) => {
  const navigate = useNavigate();
  const isProduct = type === 'product';
  
  const handleClick = () => {
    if (isProduct) {
      navigate(`/products/${item.id}`);
    } else {
      navigate(`/services/${item.id}`);
    }
  };

  const handleAction = (e) => {
    e.stopPropagation();
    if (isProduct && onAddToCart) {
      onAddToCart(item);
    } else if (!isProduct && onBookNow) {
      onBookNow(item);
    }
  };

  return (
    <div 
      className={`
        bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 
        border border-gray-100 overflow-hidden group cursor-pointer
        transform hover:scale-105
        ${className}
      `}
      onClick={handleClick}
    >
      {/* Image Section */}
      <div className="relative h-48 bg-gray-50 overflow-hidden">
        {item.image_url ? (
          <img 
            src={item.image_url} 
            alt={item.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
          </div>
        )}
        
        {/* Category Badge */}
        {item.category && (
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
            <span className="text-xs font-medium text-gray-700">
              {item.category.name}
            </span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-5 space-y-3">
        {/* Title */}
        <h3 className="font-semibold text-gray-900 text-lg leading-tight line-clamp-2">
          {item.name}
        </h3>

        {/* Description */}
        {item.description && (
          <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        )}

        {/* Price */}
        <div className="flex items-baseline justify-between">
          <div className="flex items-baseline">
            <span className="text-2xl font-bold text-gray-900">
             {isProduct?  `Ksh. ${item.price?.toFixed(2) || '0.00'}` : `Ksh. ${item.base_price?.toFixed(2) || '0.00'}` }
            </span>
            <span className="text-sm text-gray-500 ml-1">
              {isProduct ? '/unit' : '/session'}
            </span>
          </div>
          
          {/* Stock/Availability */}
          {isProduct && item.stock_quantity !== undefined && (
            <div className={`text-xs font-medium ${
              item.stock_quantity > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {item.stock_quantity > 0 ? `${item.stock_quantity} in stock` : 'Out of stock'}
            </div>
          )}
        </div>

        {/* Action Button */}
        <button
          onClick={handleAction}
          disabled={isProduct && item.stock_quantity === 0}
          className={`
            w-full py-2.5 px-4 rounded-lg font-medium text-sm
            transition-all duration-200 transform active:scale-95
            ${
              isProduct && item.stock_quantity === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow-md'
            }
          `}
        >
          {isProduct ? (
            item.stock_quantity > 0 ? 'Add to Cart' : 'Out of Stock'
          ) : (
            'Book Now'
          )}
        </button>
      </div>
    </div>
  );
};

export default ItemCard;