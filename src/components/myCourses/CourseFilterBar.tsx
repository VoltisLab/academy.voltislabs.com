import { Search, Filter, SlidersVertical, LayoutGrid } from "lucide-react";

export default function CourseFilterBar() {
  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
        {/* Search Box */}
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search Course Name, Mentor...."
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#04A4F4]"
          />
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-3 text-sm text-gray-600 whitespace-nowrap">
        <button className="flex items-center gap-1 border rounded-xl border-[#313273] py-2 px-3">
            <LayoutGrid className="w-4 h-4" />
            <span className="text-[#313273] font-medium">Categories</span>
          </button>
          <button className="flex items-center gap-1 border rounded-xl border-[#313273] py-2 px-3">
            <SlidersVertical className="w-4 h-4" />
            <span className="text-[#313273] font-medium">Filter</span>
          </button>
        </div>

        {/* Sort Button */}
        <button className="ml-auto flex items-center gap-2 rounded-xl border border-gray-300 px-4 py-2 text-sm text-gray-700 bg-white hover:bg-gray-50">
          <Filter className="w-4 h-4" />
          Sort by: <span className="font-medium">Popular</span>
        </button>
      </div>
    </div>
  );
}
