"use client";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../../store/slices/cartSlice";
import { ShoppingCart } from "lucide-react";
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
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1">
      <Link to={`/product/${product.id}`}>
        <img
          src={product.imageUrl || "/placeholder-product.jpg"}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
      </Link>
      <div className="p-4">
        <Link to={`/product/${product.id}`}>
          <h3 className="text-lg font-semibold text-gray-800 hover:text-blue-600 truncate">
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

        <div className="flex items-center justify-between mt-3">
          <span className="text-lg font-bold text-gray-900">
            {product.price.toLocaleString("vi-VN")} đ
          </span>
          <Button
            variant="primary"
            size="sm"
            onClick={handleAddToCart}
            className="flex items-center"
          >
            <ShoppingCart className="h-4 w-4 mr-1" />
            Thêm
          </Button>
        </div>
        {product.stock <= 0 && (
          <p className="text-sm text-red-500 mt-2">Hết hàng</p>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
