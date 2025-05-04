import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import reviewService from "../../services/reviewService";

// Async thunks
export const fetchProductReviews = createAsyncThunk(
  "reviews/fetchProductReviews",
  async (productId, { rejectWithValue }) => {
    try {
      return await reviewService.getProductReviews(productId);
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch reviews");
    }
  }
);

export const addReview = createAsyncThunk(
  "reviews/addReview",
  async (reviewData, { rejectWithValue }) => {
    try {
      return await reviewService.addReview(reviewData);
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to add review");
    }
  }
);

export const updateReview = createAsyncThunk(
  "reviews/updateReview",
  async ({ reviewId, reviewData }, { rejectWithValue }) => {
    try {
      return await reviewService.updateReview(reviewId, reviewData);
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to update review");
    }
  }
);

export const deleteReview = createAsyncThunk(
  "reviews/deleteReview",
  async (reviewId, { rejectWithValue }) => {
    try {
      await reviewService.deleteReview(reviewId);
      return reviewId;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to delete review");
    }
  }
);

const initialState = {
  reviews: [],
  loading: false,
  error: null,
  submitting: false,
  submitError: null,
};

const reviewSlice = createSlice({
  name: "reviews",
  initialState,
  reducers: {
    clearReviewErrors: (state) => {
      state.error = null;
      state.submitError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch product reviews
      .addCase(fetchProductReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload;
      })
      .addCase(fetchProductReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add review
      .addCase(addReview.pending, (state) => {
        state.submitting = true;
        state.submitError = null;
      })
      .addCase(addReview.fulfilled, (state, action) => {
        state.submitting = false;
        state.reviews.push(action.payload);
      })
      .addCase(addReview.rejected, (state, action) => {
        state.submitting = false;
        state.submitError = action.payload;
      })
      // Update review
      .addCase(updateReview.pending, (state) => {
        state.submitting = true;
        state.submitError = null;
      })
      .addCase(updateReview.fulfilled, (state, action) => {
        state.submitting = false;
        const index = state.reviews.findIndex(
          (review) => review.id === action.payload.id
        );
        if (index !== -1) {
          state.reviews[index] = action.payload;
        }
      })
      .addCase(updateReview.rejected, (state, action) => {
        state.submitting = false;
        state.submitError = action.payload;
      })
      // Delete review
      .addCase(deleteReview.pending, (state) => {
        state.submitting = true;
        state.submitError = null;
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.submitting = false;
        state.reviews = state.reviews.filter(
          (review) => review.id !== action.payload
        );
      })
      .addCase(deleteReview.rejected, (state, action) => {
        state.submitting = false;
        state.submitError = action.payload;
      });
  },
});

export const { clearReviewErrors } = reviewSlice.actions;
export default reviewSlice.reducer;
