

import React from 'react';

const ReviewStars = ({ rating, size = 5 }) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = Math.max(0, 5 - fullStars - (halfStar ? 1 : 0));


  const starPath = "M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z";

  return (
    <div className="flex items-center space-x-1">
      {/* Full stars */}
      {[...Array(fullStars)].map((_, i) => (
        <svg
          key={`full-${i}`}
          style={{ width: `${size * 4}px`, height: `${size * 4}px` }}
          className="text-yellow-400"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d={starPath} />
        </svg>
      ))}

      {/* Half star */}
      {halfStar && (
        <svg
          style={{ width: `${size * 4}px`, height: `${size * 4}px` }}
          className="text-yellow-400"
          viewBox="0 0 24 24"
        >
          <defs>
            <linearGradient id="halfGrad">
              <stop offset="50%" stopColor="currentColor" />
              <stop offset="50%" stopColor="#D1D5DB" /> {/* gray-300 */}
            </linearGradient>
          </defs>
          <path fill="url(#halfGrad)" d={starPath} />
        </svg>
      )}

      {/* Empty stars */}
      {[...Array(emptyStars)].map((_, i) => (
        <svg
          key={`empty-${i}`}
          style={{ width: `${size * 4}px`, height: `${size * 4}px` }}
          className="text-gray-300"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d={starPath} />
        </svg>
      ))}
      <span className="text-sm font-medium text-gray-600 ml-1">
        {rating ? rating.toFixed(1) : "0.0"}
      </span>
    </div>
  );
};

export default ReviewStars;