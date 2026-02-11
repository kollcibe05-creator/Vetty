import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { showNotification } from '../features/uiSlice';

const ItemCard = ({ 
  item, 
  type = 'product', 
  onAddToCart,
  onBookNow,
  className = '' 
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const isProduct = type === 'product';
  const isAdmin = user?.role?.name === 'Admin';
  
  const handleClick = () => {
    if (isProduct) {
      navigate(`/products/${item.id}`);
    } else {
      navigate(`/services/${item.id}`);
    }
  };

  const handleAction = (e) => {
    e.stopPropagation();
    
    if (isAdmin) {
      dispatch(showNotification({ type: 'warning', message: 'Admin users should use the dashboard for management' }));
      return;
    }
    
    if (isProduct && onAddToCart) {
      if (!isAuthenticated) {
        dispatch(showNotification({ type: 'error', message: 'Please login to add items to your cart' }));
        return;
      }
      onAddToCart(item);
    } else if (!isProduct && onBookNow) {
      onBookNow(item);
    }
  };

  return (
    <div 
      className={`
        bg-white rounded-[2rem] shadow-sm hover:shadow-[0_15px_40px_rgba(255,165,0,0.15)] 
        transition-all duration-300 border border-orange-50 overflow-hidden group cursor-pointer
        flex flex-col h-full transform hover:-translate-y-2
        ${className}
      `}
      onClick={handleClick}
    >
      {/* Image Section */}
      <div className="relative h-52 bg-[#FFFBF0] overflow-hidden m-2 rounded-[1.8rem]">
        {item.image_url ? (
          <img 
            src={item.image_url} 
            alt={item.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-yellow-50">
            <span className="text-4xl">🐾</span>
          </div>
        )}
        
        {/* Category Badge - Orange/Yellow theme */}
        {item.category && (
          <div className="absolute top-3 left-3 bg-yellow-400 px-3 py-1 rounded-full shadow-sm">
            <span className="text-[10px] font-black text-[#2D1B69] uppercase tracking-wider">
              {item.category.name}
            </span>
          </div>
        )}

        {/* Price Tag Overlay */}
        <div className="absolute bottom-3 right-3 bg-[#2D1B69] text-white px-3 py-1 rounded-lg font-bold text-sm shadow-lg">
           Ksh. {isProduct ? item.price?.toLocaleString() : item.base_price?.toLocaleString()}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 flex flex-col flex-grow">
        {/* Title - Deep Purple */}
        <h3 className="font-extrabold text-[#2D1B69] text-lg leading-tight mb-2 group-hover:text-orange-600 transition-colors">
          {item.name}
        </h3>

        {/* Description */}
        {item.description && (
          <p className="text-gray-500 text-xs line-clamp-2 leading-relaxed mb-4 italic">
            {item.description}
          </p>
        )}

        <div className="mt-auto pt-2">
          {/* Availability / Stock */}
          {isProduct && (
            <div className={`text-[10px] font-bold uppercase tracking-widest mb-3 ${
              item.stock_quantity > 0 ? 'text-green-500' : 'text-red-400'
            }`}>
              {item.stock_quantity > 0 ? `● ${item.stock_quantity} in stock` : '● Out of stock'}
            </div>
          )}

          {/* Action Button - Vibrant Orange/Purple */}
          <button
            onClick={handleAction}
            disabled={isProduct && ((item.stock_quantity === 0) || isAdmin || !item.stock_quantity)}
            className={`
              w-full py-3 px-4 rounded-2xl font-black text-xs uppercase tracking-widest
              transition-all duration-300 transform active:scale-95 shadow-sm
              ${
                isProduct && item.stock_quantity === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : isAdmin
                  ? 'bg-purple-50 text-purple-300 cursor-not-allowed'
                  : 'bg-orange-500 text-white hover:bg-[#2D1B69] hover:shadow-orange-200'
              }
            `}
          >
            {isProduct ? (
              isAdmin ? 'Admin View' :
              item.stock_quantity > 0 ? 'Add to Cart' : 'Out of Stock'
            ) : (
              isAdmin ? 'Admin View' : 'Book Appointment'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;