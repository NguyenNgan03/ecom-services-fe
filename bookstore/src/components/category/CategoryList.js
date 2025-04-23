import { Link } from "react-router-dom";

const CategoryList = ({ categories, loading, error }) => {
  if (loading) {
    return (
      <div className="flex overflow-x-auto space-x-4 pb-4">
        {[...Array(5)].map((_, index) => (
          <div
            key={index}
            className="flex-shrink-0 w-40 h-24 bg-gray-100 rounded-lg animate-pulse"
          ></div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
        <p className="text-red-700">Error loading categories: {error}</p>
      </div>
    );
  }

  if (!categories || categories.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-500">No categories found.</p>
      </div>
    );
  }

  return (
    <div className="flex overflow-x-auto space-x-4 pb-4">
      {categories.map((category) => (
        <Link
          key={category.id}
          to={`/category/${category.id}`}
          className="flex-shrink-0 w-40 h-24 bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:shadow-lg hover:-translate-y-1"
        >
          <div className="h-full flex flex-col items-center justify-center p-4">
            <span className="text-center font-medium text-gray-800">
              {category.name}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default CategoryList;
