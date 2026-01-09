// frontend/src/components/CategorySelect.jsx
import { useState, useEffect } from "react";
import { useGetCategoriesQuery } from "../../api/postsAPI";
import { Check, ChevronDown, Search } from "lucide-react";
import { toast } from "react-toastify";

export default function CategorySelect({
  selected = [],
  onChange,
  maxSelections = 3,
  placeholder = "Select categories...",
}) {
  const {
    data: categoriesResponse,
    isLoading,
    error,
  } = useGetCategoriesQuery({ limit: 50 });
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (categoriesResponse?.categories) {
      setCategories(categoriesResponse.categories);
    }
  }, [categoriesResponse]);

  useEffect(() => {
    if (error) {
      toast.error("Failed to load categories");
    }
  }, [error]);

  const toggleCategory = (category) => {
    if (selected.find((c) => c._id === category._id)) {
      // Remove category
      onChange(selected.filter((c) => c._id !== category._id));
    } else {
      // Add category if not at max
      if (selected.length >= maxSelections) {
        toast.info(`Maximum ${maxSelections} categories allowed`);
        return;
      }
      onChange([...selected, category]);
    }
  };

  const removeCategory = (categoryId) => {
    onChange(selected.filter((c) => c._id !== categoryId));
  };

  const filteredCategories = categories.filter((category) =>
    category.title.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="border border-gray-300 rounded-lg px-4 py-3 bg-gray-50">
        <div className="animate-pulse flex space-x-4">
          <div className="rounded-full bg-gray-200 h-6 w-6"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Selected Categories Display */}
      <div className="flex flex-wrap gap-2 mb-2">
        {selected.map((category) => (
          <span
            key={category._id}
            className="inline-flex items-center px-3 py-1.5 bg-emerald-100 text-emerald-800 text-sm font-medium rounded-full"
          >
            {category.title}
            <button
              type="button"
              onClick={() => removeCategory(category._id)}
              className="ml-2 text-emerald-600 hover:text-emerald-800"
            >
              ×
            </button>
          </span>
        ))}
      </div>

      {/* Dropdown Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 border border-gray-300 rounded-lg bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors"
      >
        <span
          className={selected.length > 0 ? "text-gray-900" : "text-gray-500"}
        >
          {selected.length > 0 ? `${selected.length} selected` : placeholder}
        </span>
        <ChevronDown
          className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg">
          {/* Search Input */}
          <div className="p-3 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search categories..."
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                autoFocus
              />
            </div>
          </div>

          {/* Category List */}
          <div className="max-h-64 overflow-y-auto">
            {filteredCategories.length === 0 ? (
              <div className="px-4 py-3 text-gray-500 text-center">
                No categories found
              </div>
            ) : (
              <ul className="py-1">
                {filteredCategories.map((category) => {
                  const isSelected = selected.find(
                    (c) => c._id === category._id
                  );
                  return (
                    <li key={category._id}>
                      <button
                        type="button"
                        onClick={() => toggleCategory(category)}
                        className={`w-full text-left px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors ${
                          isSelected ? "bg-emerald-50" : ""
                        }`}
                      >
                        <div className="flex items-center">
                          <div
                            className={`w-5 h-5 border rounded mr-3 flex items-center justify-center ${
                              isSelected
                                ? "bg-emerald-500 border-emerald-500"
                                : "border-gray-300"
                            }`}
                          >
                            {isSelected && (
                              <Check className="w-3 h-3 text-white" />
                            )}
                          </div>
                          <span
                            className={
                              isSelected
                                ? "text-emerald-700 font-medium"
                                : "text-gray-700"
                            }
                          >
                            {category.title}
                          </span>
                        </div>
                        {category.description && (
                          <span className="text-xs text-gray-500 ml-2 truncate max-w-[200px]">
                            {category.description}
                          </span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 p-3 text-xs text-gray-500">
            <div className="flex justify-between">
              <span>Select up to {maxSelections} categories</span>
              <span>
                {selected.length}/{maxSelections} selected
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close */}
      {isOpen && (
        <div className="fixed inset-0 z-0" onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
}
