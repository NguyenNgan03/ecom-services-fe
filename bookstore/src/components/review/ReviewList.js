"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductReviews } from "../../store/slices/reviewSlice";
import StarRating from "./StarRating";
import { User, Calendar } from "lucide-react";

const ReviewList = ({ productId, reviews = null }) => {
  const dispatch = useDispatch();
  const {
    reviews: storeReviews,
    loading,
    error,
  } = useSelector((state) => state.reviews);

  // Sử dụng reviews từ props nếu có, nếu không thì lấy từ store
  const displayReviews = reviews || storeReviews;

  useEffect(() => {
    if (productId && !reviews) {
      dispatch(fetchProductReviews(productId));
    }
  }, [dispatch, productId, reviews]);

  if (loading) {
    return (
      <div className="flex justify-center py-4">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
        <p className="text-red-700">Lỗi khi tải đánh giá: {error}</p>
      </div>
    );
  }

  if (!displayReviews || displayReviews.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-500">Chưa có đánh giá nào cho sản phẩm này.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {displayReviews.map((review) => (
        <div key={review.id} className="border-b border-gray-200 pb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                <User className="h-6 w-6 text-gray-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">
                  {review.userName || "Người dùng ẩn danh"}
                </p>
                <div className="flex items-center mt-1">
                  <StarRating rating={review.rating} />
                  <span className="ml-2 text-sm text-gray-500">
                    {review.rating}/5
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="h-4 w-4 mr-1" />
              {new Date(review.createdAt).toLocaleDateString("vi-VN")}
            </div>
          </div>
          <p className="text-gray-700 mt-2">{review.comment}</p>
        </div>
      ))}
    </div>
  );
};

export default ReviewList;
