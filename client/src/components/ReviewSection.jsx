import React, { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createReview, deleteReview } from '../features/reviewSlice';
import { selectReviews, selectReviewLoading } from '../features/reviewSlice';
import { showNotification } from '../features/uiSlice';
import ReviewStars from '../components/ReviewStars';

const ReviewSection = ({ productId, serviceId }) => {
  const dispatch = useDispatch();
  const { items } = useSelector(selectReviews);
  const isLoading = useSelector(selectReviewLoading);
  const currentUser = useSelector((state) => state.auth?.user);

  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [showReviewForm, setShowReviewForm] = useState(false);


  const { filteredReviews, averageRating } = useMemo(() => {
    const reviews = items.filter(review => 
      productId ? review.product_id === parseInt(productId) : review.service_id === parseInt(serviceId)
    );
    const avg = reviews.length > 0 
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
      : 0;
    return { filteredReviews: reviews, averageRating: avg };
  }, [items, productId, serviceId]);


  const handleSubmit = (e) => {
    e.preventDefault();
    if (!currentUser) {
        dispatch(showNotification({ type: 'error', title: 'Login Required', message: 'Please login to leave a review' }));
        return;
    }

    const reviewData = {
      ...newReview,
      ...(productId && { product_id: parseInt(productId) }),
      ...(serviceId && { service_id: parseInt(serviceId) }),
    };

    dispatch(createReview(reviewData)).unwrap().then(() => {
      dispatch(showNotification({ type: 'success', title: 'Success', message: 'Thank you for your review!' }));
      setNewReview({ rating: 5, comment: '' });
      setShowReviewForm(false);
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Recently";
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "Recently" : date.toLocaleDateString(undefined, {
        year: 'numeric', month: 'short', day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      {/* SECTION HEADER */}
      <div className="p-8 border-b border-gray-50 bg-gray-50/50">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Customer Feedback</h3>
            <div className="flex items-center mt-3 gap-4">
              <div className="flex flex-col">
                <span className="text-4xl font-black text-gray-900">{averageRating.toFixed(1)}</span>
                <ReviewStars rating={averageRating} size={4} />
              </div>
              <div className="h-10 w-px bg-gray-200 mx-2"></div>
              <p className="text-gray-500 text-sm font-medium">
                Based on {filteredReviews.length} {filteredReviews.length === 1 ? 'review' : 'reviews'}
              </p>
            </div>
          </div>
          
          {!showReviewForm && (
            <button 
              onClick={() => setShowReviewForm(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
            >
              Write a Review
            </button>
          )}
        </div>
      </div>

      {/* REVIEW FORM */}
      {showReviewForm && (
        <div className="p-8 bg-blue-50/30 border-b border-blue-100 animate-in slide-in-from-top duration-300">
          <form onSubmit={handleSubmit} className="max-w-2xl space-y-4">
            <h4 className="font-bold text-blue-900">Your Experience</h4>
            
            <div className="flex items-center gap-2 bg-white p-3 rounded-xl border border-blue-100 w-fit">
              {[1, 2, 3, 4, 5].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setNewReview(prev => ({ ...prev, rating: num }))}
                  className={`text-2xl transition-transform active:scale-90 ${num <= newReview.rating ? 'text-yellow-400' : 'text-gray-200'}`}
                >
                  ★
                </button>
              ))}
              <span className="ml-2 font-bold text-gray-600">{newReview.rating}/5</span>
            </div>

            <textarea
              value={newReview.comment}
              onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
              placeholder="What did you like or dislike?"
              className="w-full p-4 rounded-2xl border border-blue-100 focus:ring-4 focus:ring-blue-100 outline-none transition-all resize-none"
              rows="4"
              required
            />

            <div className="flex gap-3">
              <button type="submit" disabled={isLoading} className="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold disabled:opacity-50">
                {isLoading ? 'Posting...' : 'Post Review'}
              </button>
              <button type="button" onClick={() => setShowReviewForm(false)} className="px-6 py-2 text-gray-500 font-medium">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* REVIEWS LIST */}
      <div className="divide-y divide-gray-50">
        {filteredReviews.length === 0 ? (
          <div className="p-20 text-center">
            <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">★</div>
            <p className="text-gray-400 font-medium">No reviews yet. Start the conversation!</p>
          </div>
        ) : (
          filteredReviews.map((review) => (
            <div key={review.id} className="p-8 hover:bg-gray-50/50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-md shadow-blue-100">
                    {(review.user?.username || 'A')[0].toUpperCase()}
                  </div>
                  <div>
                    <h5 className="font-bold text-gray-900">{review.user?.username || 'Anonymous User'}</h5>
                    <div className="flex items-center gap-2 mt-1">
                      <ReviewStars rating={review.rating} size={3} />
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                        {formatDate(review.created_at)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <p className="mt-4 text-gray-600 leading-relaxed text-lg italic">"{review.comment}"</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReviewSection;