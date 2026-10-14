import { Button } from "@/components/ui/button";

const categories = ["Makanan", "Snack", "Minuman"];

const CategoryTabs = ({ categories, activeCategory, onSelect }) => {
  return (
    <div className="sticky top-12 z-40 -mx-4 overflow-x-auto scrollbar-none bg-white mb-5">
      <div className="flex min-w-max border-b">
        {categories.map((category) => (
          <div className="relative flex h-12 items-center justify-center">
            <Button
              key={category}
              onClick={() => onSelect(category)}
              variant="ghost"
              className={`h-full rounded-none px-5 text-sm font-semibold ${activeCategory === category ? "border-b-2 border-amber-600 text-amber-600" : "text-gray-500"}`}
            >
              {category}
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
