const CategoryFilter = ({ categories, activeCategory, onChange }) => {
  return (
    <div
      className="sticky top-20 z-40 w-full bg-white/95 backdrop-blur-sm gap-3 mb-4 border-b border-gray-100 py-3 pb-3"
      role="tablist"
      aria-label="Product categories"
    >

      <div className="flex gap-3 flex-wrap overflow-x-auto pb-2">

      {categories.map((category) => {
        const isActive = activeCategory === category;

        return (
          <button
          key={category}
          role="tab"
          aria-selected={isActive}
          onClick={() => onChange(category)}
          className={`
           md:px-4 px-2 py-2 rounded-full text-sm md:text-xl font-medium
              transition-all focus:outline-none 
              ${
                isActive
                  ? "bg-black text-white shadow-sm"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }
              `}
              >
            {category}
          </button>
        );
      })}
      </div>
    </div>
  );
};

export default CategoryFilter;
