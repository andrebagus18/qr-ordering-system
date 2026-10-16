import { Button } from "@/components/ui/button";

const CategoryTabs = ({ categories, activeCategory, onSelect }) => {
  return (
    <div className="sticky top-12 z-40 -mx-4 overflow-x-auto scrollbar-none bg-white mt-2">
      <div className="flex min-w-max border-b">
        {categories.map((category) => (
          <div
            key={category}
            className="relative flex h-12 items-center justify-center"
          >
            <Button
              onClick={() => onSelect(category)}
              variant="ghost"
              className={`h-full rounded-none px-5 text-sm font-semibold ${activeCategory === category ? "text-amber-600" : "text-gray-500"}`}
            >
              {category}
              {activeCategory === category && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-1 rounded-full bg-amber-600" />
              )}
            </Button>
            {/* {index === 0 && (
              <span className="absolute bottom-0 w-20 h-1 rounded-full bg-amber-600" />
            )} */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryTabs;
