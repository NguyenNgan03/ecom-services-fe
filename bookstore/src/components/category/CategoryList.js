import { Link } from "react-router-dom";
import { BookOpen } from "lucide-react";

const CategoryList = ({ categories, loading, error }) => {
  if (loading) {
    return (
      <div className="flex overflow-x-auto space-x-4 pb-4">
        {[...Array(5)].map((_, index) => (
          <div
            key={index}
            className="flex-shrink-0 w-40 h-24 bg-white rounded-lg animate-pulse"
            style={{ animationDelay: `${index * 0.1}s` }}
          ></div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4 rounded-md">
        <p className="text-red-700">Lỗi khi tải danh mục: {error}</p>
      </div>
    );
  }

  if (!categories || categories.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-500">Không tìm thấy danh mục nào.</p>
      </div>
    );
  }

  return (
    <div className="flex overflow-x-auto space-x-4 pb-4 hide-scrollbar">
      {categories.map((category, index) => (
        <div
          key={category.id}
          className="opacity-0 animate-fadeIn"
          style={{ animation: `fadeIn 0.5s ${index * 0.1}s forwards` }}
        >
          <Link
            to={`/category/${category.id}`}
            className="flex-shrink-0 w-40 h-24 bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:bg-[#F5ECD5] group"
          >
            <div className="h-full flex flex-col items-center justify-center p-4 relative">
              <BookOpen className="h-8 w-8 text-[#A4B465] mb-2 group-hover:text-[#626F47] transition-colors duration-300" />
              <span className="text-center font-medium text-[#626F47] group-hover:text-[#A4B465] transition-colors duration-300">
                {category.name}
              </span>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default CategoryList;
