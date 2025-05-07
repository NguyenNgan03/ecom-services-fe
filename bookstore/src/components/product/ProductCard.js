"use client";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../../store/slices/cartSlice";
import { ShoppingCart, Heart } from "lucide-react";
import Button from "../ui/Button";
import StarRating from "../review/StarRating";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.imageUrl,
        quantity: 1,
      })
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 h-full flex flex-col transform hover:-translate-y-2 hover:shadow-xl">
      <Link to={`/product/${product.id}`} className="relative overflow-hidden">
        <div className="absolute top-0 right-0 m-2 z-10">
          <button className="p-2 bg-white/80 backdrop-blur-sm rounded-full text-[#F0BB78] hover:text-[#626F47] transition-colors duration-300 transform hover:scale-110 active:scale-90">
            <Heart className="h-5 w-5" />
          </button>
        </div>
        <img
          src={product.imageUrl || "/placeholder-product.jpg"}
          alt={product.name}
          className="w-full h-48 object-cover transition-transform duration-500 hover:scale-105"
        />
      </Link>
      <div className="p-4 flex-grow flex flex-col">
        <Link to={`/product/${product.id}`}>
          <h3 className="text-lg font-semibold text-[#626F47] hover:text-[#A4B465] transition-colors duration-300 truncate">
            {product.name}
          </h3>
        </Link>
        <p className="text-sm text-gray-600 mb-1">{product.author}</p>
        <p className="text-xs text-gray-500 mb-2">
          Danh mục: {product.categoryName}
        </p>
        <p className="text-sm text-gray-500 mb-2 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center mb-2">
          <StarRating rating={product.averageRating || 0} size="small" />
          <span className="text-xs text-gray-500 ml-1">
            ({product.averageRating || 0})
          </span>
        </div>

        <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
          <span className="text-lg font-bold text-[#F0BB78]">
            {product.price?.toLocaleString("vi-VN")} đ
          </span>
          <div className="transform hover:scale-105 active:scale-95 transition-transform duration-200">
            <Button
              variant="primary"
              size="sm"
              onClick={handleAddToCart}
              className="flex items-center bg-[#A4B465] hover:bg-[#626F47] text-white transition-colors duration-300"
              disabled={product.stock <= 0}
            >
              <ShoppingCart className="h-4 w-4 mr-1" />
              {product.stock > 0 ? "Thêm" : "Hết hàng"}
            </Button>
          </div>
        </div>
        {product.stock <= 0 && (
          <p className="text-sm text-red-500 mt-2">Hết hàng</p>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
