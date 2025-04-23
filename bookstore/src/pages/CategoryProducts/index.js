"use client";

import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductsByCategory } from "../../store/slices/productSlice";
import { fetchCategoryById } from "../../store/slices/categorySlice";
import ProductList from "../../components/product/ProductList";
import { ArrowLeft } from "lucide-react";
import LoadingSpinner from "../../components/ui/LoadingSpinner";

const CategoryProducts = () => {
  const { categoryId } = useParams();
  const dispatch = useDispatch();
  const {
    products,
    loading: productsLoading,
    error: productsError,
  } = useSelector((state) => state.products);
  const {
    category,
    loading: categoryLoading,
    error: categoryError,
  } = useSelector((state) => state.categories);

  useEffect(() => {
    if (categoryId) {
      dispatch(fetchCategoryById(categoryId));
      dispatch(fetchProductsByCategory(categoryId));
    }

    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, [dispatch, categoryId]);

  if (productsLoading || categoryLoading) {
    return <LoadingSpinner />;
  }

  const error = productsError || categoryError;
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
          <p className="text-red-700">Error: {error}</p>
        </div>
        <Link
          to="/"
          className="text-blue-600 hover:text-blue-800 flex items-center"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        to="/"
        className="text-blue-600 hover:text-blue-800 flex items-center mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to Home
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          {category?.name || "Category"}
        </h1>
        <p className="text-gray-600">{category?.description}</p>
      </div>

      <ProductList
        products={products}
        loading={productsLoading}
        error={productsError}
      />
    </div>
  );
};

export default CategoryProducts;
