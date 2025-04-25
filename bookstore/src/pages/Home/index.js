"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../../store/slices/categorySlice";
import { fetchProducts } from "../../store/slices/productSlice";
import CategoryList from "../../components/category/CategoryList";
import ProductList from "../../components/product/ProductList";
import { ShoppingBag } from "lucide-react";

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
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl text-white p-8 mb-8">
        <div className="max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Chào mừng đến với Bookstore
          </h1>
          <p className="text-lg mb-6">
            Khám phá kho tàng sách với giá cả hợp lý.
          </p>
          <button className="bg-white text-blue-600 px-6 py-2 rounded-md font-medium hover:bg-gray-100 transition-colors">
            Mua sắm ngay
          </button>
        </div>
      </section>

      {/* Categories Section */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Danh mục</h2>
          <a href="/categories" className="text-blue-600 hover:text-blue-800">
            Xem tất cả
          </a>
        </div>
        <CategoryList
          categories={categories}
          loading={categoriesLoading}
          error={categoriesError}
        />
      </section>

      {/* Featured Products Section */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Sách nổi bật</h2>
          <a href="/products" className="text-blue-600 hover:text-blue-800">
            Xem tất cả
          </a>
        </div>
        {featuredProducts.length > 0 ? (
          <ProductList
            products={featuredProducts}
            loading={productsLoading}
            error={productsError}
          />
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <ShoppingBag className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-700 mb-2">
              Không có sách nổi bật
            </h3>
            <p className="text-gray-500">
              Vui lòng quay lại sau để xem sách nổi bật.
            </p>
          </div>
        )}
      </section>

      {/* Latest Products Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Sách mới nhất</h2>
          <a href="/products" className="text-blue-600 hover:text-blue-800">
            Xem tất cả
          </a>
        </div>
        <ProductList
          products={products.slice(0, 8)}
          loading={productsLoading}
          error={productsError}
        />
      </section>
    </div>
  );
};

export default Home;
