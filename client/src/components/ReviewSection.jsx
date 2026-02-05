import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createReview } from '../features/reviewSlice';
import { selectReviews, selectReviewLoading } from '../features/reviewSlice';
import { showNotification } from '../features/uiSlice';

const ReviewSection = ({ productId, serviceId }) => {
  const dispatch = useDispatch();
  const { items, loading } = useSelector(selectReviews);
  const isLoading = useSelector(selectReviewLoading);

  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: '',
  });

  const [showReviewForm, setShowReviewForm] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const reviewData = {
      rating: newReview.rating,
      comment: newReview.comment,
      ...(productId && { product_id: productId }),
      ...(serviceId && { service_id: serviceId }),
    };

    dispatch(createReview(reviewData)).then(() => {
      dispatch(showNotification({
        type: 'success',
        title: 'Review Submitted',
        message: 'Your review has been submitted successfully!',
      }));
      setNewReview({ rating: 5, comment: '' });
      setShowReviewForm(false);
    });
  };

  const handleRatingChange = (rating) => {
    setNewReview(prev => ({ ...prev, rating }));
  };

  const handleCommentChange = (e) => {
    setNewReview(prev => ({ ...prev, comment: e.target.value }));
  };

  // Filter reviews for current product/service
  const filteredReviews = items.filter(review => {
    if (productId) return review.product_id === productId;
    if (serviceId) return review.service_id === serviceId;
    return false;
  });

  const averageRating = filteredReviews.length > 0 
    ? filteredReviews.reduce((sum, review) => sum + review.rating, 0) / filteredReviews.length
    : 0;

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Reviews</h3>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">
            {filteredReviews.length} {filteredReviews.length === 1 ? 'Review' : 'Reviews'}
          </span>
          {averageRating > 0 && (
            <div className="flex items-center">
              <span className="text-sm text-gray-600">Average:</span>
              <div className="flex items-center ml-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className={`w-4 h-4 ${star <= averageRating ? 'text-yellow-400' : 'text-gray-300'}`}
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-1.91-1.91-1.91-5.09-1.91-1.91-6.26L12 2z" />
                  </svg>
                ))}
                <span className="ml-1 text-sm font-medium text-gray-900">
                  {averageRating.toFixed(1)}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Review Form */}
      <div className="mb-6">
        {!showReviewForm ? (
          <button
            onClick={() => setShowReviewForm(true)}
            className="w-full py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            Write a Review
          </button>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Rating Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating
              </label>
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => handleRatingChange(rating)}
                    className={`p-1 rounded-full transition-colors ${
                      rating <= newReview.rating
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-1.91-1.91-1.91-5.09-1.91-1.91-6.26L12 2z" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>

            {/* Comment Textarea */}
            <div>
              <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                Your Review
              </label>
              <textarea
                id="comment"
                rows={4}
                value={newReview.comment}
                onChange={handleCommentChange}
                placeholder="Share your experience with this service/product..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                required
              />
            </div>

            {/* Submit Button */}
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => setShowReviewForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No reviews yet. Be the first to share your experience!
          </div>
        ) : (
          filteredReviews.map((review) => (
            <div key={review.id} className="border-b border-gray-200 pb-4 last:border-b-0">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    <span className="font-medium text-gray-900">{review.user?.username}</span>
                    <span className="text-sm text-gray-500">
                      {new Date(review.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        className={`w-4 h-4 ${star <= review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-1.91-1.91-1.91-5.09-1.91-1.91-6.26L12 2z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
              
              {review.comment && (
                <p className="text-gray-600 leading-relaxed">{review.comment}</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReviewSection;