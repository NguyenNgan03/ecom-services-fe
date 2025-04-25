"use client";

import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductById } from "../../store/slices/productSlice";
import { addToCart } from "../../store/slices/cartSlice";
import {
  ShoppingCart,
  Heart,
  Share2,
  ArrowLeft,
  Star,
  BookOpen,
  Calendar,
  Tag,
} from "lucide-react";
import Button from "../../components/ui/Button";
import LoadingSpinner from "../../components/ui/LoadingSpinner";

const ProductDetail = () => {
  const { productId } = useParams();
  const dispatch = useDispatch();
  const { product, loading, error } = useSelector((state) => state.products);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (productId) {
      dispatch(fetchProductById(productId));
    }

    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, [dispatch, productId]);

  const handleAddToCart = () => {
    if (product) {
      dispatch(
        addToCart({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.imageUrl,
          quantity,
        })
      );
    }
  };

  const handleQuantityChange = (e) => {
    const value = Number.parseInt(e.target.value);
    if (value > 0) {
      setQuantity(value);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
          <p className="text-red-700">Lỗi khi tải sản phẩm: {error}</p>
        </div>
        <Link
          to="/"
          className="text-blue-600 hover:text-blue-800 flex items-center"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Quay lại trang chủ
        </Link>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-gray-500">Không tìm thấy sản phẩm.</p>
          <Link
            to="/"
            className="text-blue-600 hover:text-blue-800 mt-4 inline-block"
          >
            Quay lại trang chủ
          </Link>
        </div>
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
        Quay lại trang chủ
      </Link>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="md:flex">
          {/* Product Image */}
          <div className="md:w-1/2">
            <img
              src={product.imageUrl || "/placeholder-product.jpg"}
              alt={product.name}
              className="w-full h-auto object-cover"
            />
          </div>

          {/* Product Details */}
          <div className="md:w-1/2 p-6">
            <div className="mb-4">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                {product.name}
              </h1>
              <div className="flex items-center mb-2">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5"
                      fill={
                        i < (product.averageRating || 0)
                          ? "currentColor"
                          : "none"
                      }
                    />
                  ))}
                </div>
                <span className="text-gray-500 ml-2">
                  {product.averageRating || 0} đánh giá
                </span>
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {product.price?.toLocaleString("vi-VN")} đ
              </p>
            </div>

            <div className="mb-6">
              <p className="text-gray-600">{product.description}</p>
            </div>

            <div className="mb-6 space-y-2">
              <div className="flex items-center text-gray-600">
                <BookOpen className="h-5 w-5 mr-2 text-blue-500" />
                <span>
                  Tác giả: <span className="font-medium">{product.author}</span>
                </span>
              </div>

              <div className="flex items-center text-gray-600">
                <Tag className="h-5 w-5 mr-2 text-blue-500" />
                <span>
                  Danh mục:{" "}
                  <span className="font-medium">{product.categoryName}</span>
                </span>
              </div>

              <div className="flex items-center text-gray-600">
                <Calendar className="h-5 w-5 mr-2 text-blue-500" />
                <span>
                  Ngày cập nhật:{" "}
                  <span className="font-medium">
                    {new Date(product.updatedAt).toLocaleDateString("vi-VN")}
                  </span>
                </span>
              </div>

              <p className="text-sm text-gray-500 mt-2">
                Tình trạng:
                <span
                  className={
                    product.stock > 0
                      ? "text-green-600 ml-1"
                      : "text-red-600 ml-1"
                  }
                >
                  {product.stock > 0
                    ? `Còn hàng (${product.stock})`
                    : "Hết hàng"}
                </span>
              </p>
            </div>

            <div className="flex items-center mb-6">
              <div className="mr-4">
                <label
                  htmlFor="quantity"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Số lượng
                </label>
                <input
                  type="number"
                  id="quantity"
                  min="1"
                  max={product.stock}
                  value={quantity}
                  onChange={handleQuantityChange}
                  className="w-20 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="flex-1"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Thêm vào giỏ hàng
              </Button>
              <Button variant="outline" className="px-4">
                <Heart className="h-5 w-5" />
              </Button>
              <Button variant="outline" className="px-4">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
