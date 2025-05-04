import api from "../config/axios";

const reviewService = {
  // Lấy tất cả đánh giá của một sản phẩm
  getProductReviews: async (productId) => {
    const response = await api.get(`/api/reviews/product/${productId}`);
    return response.data;
  },

  // Lấy chi tiết đánh giá
  getReviewById: async (reviewId) => {
    const response = await api.get(`/api/reviews/${reviewId}`);
    return response.data;
  },

  // Thêm đánh giá mới - Backend sẽ lấy userId từ JWT token
  addReview: async (reviewData) => {
    const response = await api.post(`/api/reviews`, reviewData);
    return response.data;
  },

  // Cập nhật đánh giá - Backend sẽ lấy userId từ JWT token
  updateReview: async (reviewId, reviewData) => {
    const response = await api.put(`/api/reviews/${reviewId}`, reviewData);
    return response.data;
  },

  // Xóa đánh giá - Backend sẽ lấy userId từ JWT token
  deleteReview: async (reviewId) => {
    const response = await api.delete(`/api/reviews/${reviewId}`);
    return response.data;
  },
};

export default reviewService;
