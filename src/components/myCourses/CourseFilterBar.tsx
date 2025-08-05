"use client"
import { Search, Filter, BarChart2, LayoutGrid, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { apolloClient } from "@/lib/apollo-client";
import { GET_CATEGORIES } from "@/api/course/mutation";
import { CourseCategory, GetCategoriesResponse } from "@/lib/types";

interface CourseFilterBarProps {
  search: string;
  setSearch: (search: string) => void;
  filters: any;
  setFilters: (filters: any) => void;
}

export default function CourseFilterBar({
  search,
  setSearch,
  filters,
  setFilters
}: CourseFilterBarProps) {
  // Categories state
  const [categories, setCategories] = useState<CourseCategory[]>([]);
  const [categoryLoading, setCategoryLoading] = useState<boolean>(true);
  const [categoryError, setCategoryError] = useState<Error | null>(null);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  // Fetch categories when component mounts
  useEffect(() => {
    fetchCategories();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showCategoryDropdown) {
        const target = event.target as Element;
        if (!target.closest('.relative')) {
          setShowCategoryDropdown(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCategoryDropdown]);

  // Fetch categories from the backend (same logic as BasicInformationForm)
  const fetchCategories = async () => {
    try {
      setCategoryLoading(true);
      setCategoryError(null);

      const { data, errors } = await apolloClient.query<GetCategoriesResponse>({
        query: GET_CATEGORIES,
        context: {
          includeAuth: true,
        },
        fetchPolicy: "network-only",
      });

      if (errors) {
        console.log("GraphQL errors fetching categories:", errors);
        console.log(errors[0]?.message || "Failed to fetch categories");
      }

      if (data && data.categories) {
        setCategories(data.categories);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
      setCategoryError(
        err instanceof Error ? err : new Error("Failed to fetch categories")
      );
    } finally {
      setCategoryLoading(false);
    }
  };

  const handleCategorySelect = (categoryId: string) => {
    setFilters({
      ...filters,
      category: categoryId ? parseInt(categoryId) : undefined
    });
    setShowCategoryDropdown(false);
  };

  // Helper function to format category names
  const formatCategoryName = (name: string) => {
    return name
      .replace(/_/g, ' ') // Replace underscores with spaces
      .toLowerCase() // Convert to lowercase
      .replace(/\b\w/g, l => l.toUpperCase()); // Capitalize first letter of each word
  };

  const selectedCategory = categories.find(
    cat => cat.id === filters.category?.toString()
  );

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
        {/* Search Box */}
        <div className="relative flex-1">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Course Name, Mentor...."
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#04A4F4]"
          />
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
        </div>

        {/* Category Filter Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
            className="flex items-center gap-2 rounded-xl border border-gray-300 px-4 py-2 text-sm text-gray-700 bg-white hover:bg-gray-50 min-w-[140px] justify-between"
            disabled={categoryLoading}
          >
            <div className="flex items-center gap-1">
              <BarChart2 className="w-4 h-4" />
              <span>
                {categoryLoading 
                  ? "Loading..." 
                  : selectedCategory 
                    ? formatCategoryName(selectedCategory.name)
                    : "All Categories"
                }
              </span>
            </div>
            <ChevronDown 
              className={`w-4 h-4 transition-transform ${
                showCategoryDropdown ? 'rotate-180' : ''
              }`} 
            />
          </button>

          {/* Dropdown Menu */}
          {showCategoryDropdown && !categoryLoading && (
            <div className="absolute top-full left-0 mt-1 w-full min-w-[200px] bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto">
              <button
                onClick={() => handleCategorySelect("")}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                  !filters.category ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                }`}
              >
                All Categories
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategorySelect(category.id)}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                    filters.category?.toString() === category.id 
                      ? 'bg-blue-50 text-blue-700' 
                      : 'text-gray-700'
                  }`}
                >
                  {formatCategoryName(category.name)}
                </button>
              ))}
            </div>
          )}

          {/* Error State */}
          {categoryError && (
            <div className="absolute top-full left-0 mt-1 w-full bg-red-50 border border-red-200 rounded-xl p-2 z-50">
              <p className="text-xs text-red-600">
                Error loading categories
              </p>
            </div>
          )}
        </div>

        {/* Level Filter */}
        <div className="relative">
          <select
            value={filters.level || ''}
            onChange={(e) => setFilters({
              ...filters,
              level: e.target.value || undefined
            })}
            className="rounded-xl border border-gray-300 px-4 py-2 text-sm text-gray-700 bg-white hover:bg-gray-50 appearance-none pr-8"
          >
            <option value="">All</option>
            <option value="BEGINNER">Beginner</option>
            <option value="INTERMEDIATE">Intermediate</option>
            <option value="ADVANCED">Advanced</option>
            <option value="ALL_LEVELS">All Levels</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>

        {/* Sort Button */}
        <button className="ml-auto flex items-center gap-2 rounded-xl border border-gray-300 px-4 py-2 text-sm text-gray-700 bg-white hover:bg-gray-50">
          <Filter className="w-4 h-4" />
          Sort by: <span className="font-medium">Popular</span>
        </button>
      </div>

      {/* Active Filters Display */}
      {(filters.category || filters.level) && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-gray-600">Active filters:</span>
          {filters.category && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
              {formatCategoryName(selectedCategory?.name || '')}
              <button
                onClick={() => handleCategorySelect("")}
                className="ml-1 hover:text-blue-900"
              >
                ×
              </button>
            </span>
          )}
          {filters.level && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full">
              {filters.level}
              <button
                onClick={() => setFilters({...filters, level: undefined})}
                className="ml-1 hover:text-green-900"
              >
                ×
              </button>
            </span>
          )}
          <button
            onClick={() => setFilters({})}
            className="text-xs text-gray-500 hover:text-gray-700 underline"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}