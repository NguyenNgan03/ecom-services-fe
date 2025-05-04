"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addReview, clearReviewErrors } from "../../store/slices/reviewSlice";
import StarRating from "./StarRating";
import Button from "../ui/Button";
import Alert from "../ui/Alert";

const ReviewForm = ({ productId, onReviewAdded }) => {
  const dispatch = useDispatch();
  const { submitting, submitError } = useSelector((state) => state.reviews);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    rating: 0,
    comment: "",
  });
  const [formErrors, setFormErrors] = useState({});

  const handleRatingChange = (rating) => {
    setFormData((prev) => ({ ...prev, rating }));
    if (formErrors.rating) {
      setFormErrors((prev) => ({ ...prev, rating: "" }));
    }
  };

  const handleCommentChange = (e) => {
    setFormData((prev) => ({ ...prev, comment: e.target.value }));
    if (formErrors.comment) {
      setFormErrors((prev) => ({ ...prev, comment: "" }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (formData.rating === 0) {
      errors.rating = "Vui lòng chọn số sao đánh giá";
    }
    if (!formData.comment.trim()) {
      errors.comment = "Vui lòng nhập nội dung đánh giá";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      setFormErrors({ auth: "Vui lòng đăng nhập để đánh giá sản phẩm" });
      return;
    }

    if (validateForm()) {
      const reviewData = {
        productId: Number.parseInt(productId),
        rating: formData.rating,
        comment: formData.comment,
      };

      dispatch(addReview(reviewData)).then((result) => {
        if (!result.error) {
          // Reset form after successful submission
          setFormData({
            rating: 0,
            comment: "",
          });

          // Callback khi thêm đánh giá thành công
          if (onReviewAdded) {
            onReviewAdded(result.payload);
          }
        }
      });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
        <p className="text-blue-700">
          Vui lòng{" "}
          <a href="/login" className="font-medium underline">
            đăng nhập
          </a>{" "}
          để đánh giá sản phẩm.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Viết đánh giá của bạn
      </h3>

      {submitError && (
        <Alert
          type="error"
          message={submitError}
          onClose={() => dispatch(clearReviewErrors())}
          className="mb-4"
        />
      )}

      {formErrors.auth && (
        <Alert type="error" message={formErrors.auth} className="mb-4" />
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Đánh giá của bạn
          </label>
          <div>
            <StarRating
              rating={formData.rating}
              onChange={handleRatingChange}
              editable={true}
              size="large"
            />
          </div>
          {formErrors.rating && (
            <p className="mt-1 text-sm text-red-600">{formErrors.rating}</p>
          )}
        </div>

        <div className="mb-4">
          <label
            htmlFor="comment"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Nhận xét của bạn
          </label>
          <textarea
            id="comment"
            rows="4"
            value={formData.comment}
            onChange={handleCommentChange}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              formErrors.comment ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
          ></textarea>
          {formErrors.comment && (
            <p className="mt-1 text-sm text-red-600">{formErrors.comment}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={submitting}
          className="w-full sm:w-auto"
        >
          {submitting ? "Đang gửi..." : "Gửi đánh giá"}
        </Button>
      </form>
    </div>
  );
};

export default ReviewForm;
