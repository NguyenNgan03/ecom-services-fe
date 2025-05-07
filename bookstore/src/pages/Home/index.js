"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../../store/slices/categorySlice";
import { fetchProducts } from "../../store/slices/productSlice";
import CategoryList from "../../components/category/CategoryList";
import ProductList from "../../components/product/ProductList";
import { ArrowRight, BookOpen } from "lucide-react";

const Home = () => {
  const dispatch = useDispatch();
  const {
    categories,
    loading: categoriesLoading,
    error: categoriesError,
  } = useSelector((state) => state.categories);
  const {
    products,
    loading: productsLoading,
    error: productsError,
  } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchProducts());
  }, [dispatch]);

  // Lọc sản phẩm nổi bật
  const featuredProducts = products.filter((product) => product.featured);

  return (
    <div className="bg-[#F5ECD5] min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-[#626F47] to-[#A4B465] rounded-xl text-white p-8 mb-8 shadow-lg transform transition-all duration-500 hover:shadow-xl">
          <div className="max-w-3xl">
            <h1
              className="text-3xl md:text-4xl font-bold mb-4 opacity-0 animate-fadeIn"
              style={{ animation: "fadeIn 0.8s forwards" }}
            >
              Chào mừng đến với BookStore
            </h1>
            <p
              className="text-lg mb-6 opacity-0 animate-fadeIn"
              style={{ animation: "fadeIn 0.8s 0.4s forwards" }}
            >
              Khám phá kho tàng sách với giá cả hợp lý.
            </p>
            <button className="bg-[#F0BB78] text-[#626F47] px-6 py-3 rounded-md font-medium hover:bg-[#F5ECD5] transition-colors duration-300 flex items-center transform hover:scale-105 active:scale-95">
              Mua sắm ngay
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </div>
        </section>

        {/* Categories Section */}
        <section
          className="mb-12 opacity-0 animate-fadeIn"
          style={{ animation: "fadeIn 0.8s 0.2s forwards" }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-[#626F47]">Danh mục</h2>
            <a
              href="/categories"
              className="text-[#A4B465] hover:text-[#626F47] transition-colors duration-300 flex items-center"
            >
              Xem tất cả
              <ArrowRight className="ml-1 h-4 w-4" />
            </a>
          </div>
          <CategoryList
            categories={categories}
            loading={categoriesLoading}
            error={categoriesError}
          />
        </section>

        {/* Featured Products Section */}
        <section
          className="mb-12 opacity-0 animate-fadeIn"
          style={{ animation: "fadeIn 0.8s 0.4s forwards" }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-[#626F47]">Sách nổi bật</h2>
            <a
              href="/products"
              className="text-[#A4B465] hover:text-[#626F47] transition-colors duration-300 flex items-center"
            >
              Xem tất cả
              <ArrowRight className="ml-1 h-4 w-4" />
            </a>
          </div>
          {featuredProducts.length > 0 ? (
            <ProductList
              products={featuredProducts}
              loading={productsLoading}
              error={productsError}
            />
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <BookOpen className="h-12 w-12 mx-auto text-[#A4B465] mb-4" />
              <h3 className="text-xl font-medium text-[#626F47] mb-2">
                Không có sách nổi bật
              </h3>
              <p className="text-gray-500">
                Vui lòng quay lại sau để xem sách nổi bật.
              </p>
            </div>
          )}
        </section>

        {/* Latest Products Section */}
        <section
          className="opacity-0 animate-fadeIn"
          style={{ animation: "fadeIn 0.8s 0.6s forwards" }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-[#626F47]">Sách mới nhất</h2>
            <a
              href="/products"
              className="text-[#A4B465] hover:text-[#626F47] transition-colors duration-300 flex items-center"
            >
              Xem tất cả
              <ArrowRight className="ml-1 h-4 w-4" />
            </a>
          </div>
          <ProductList
            products={products.slice(0, 8)}
            loading={productsLoading}
            error={productsError}
          />
        </section>
      </div>
    </div>
  );
};

export default Home;
