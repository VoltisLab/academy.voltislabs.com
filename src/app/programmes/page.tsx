"use client";

import { motion } from "framer-motion";
import CourseCard from "@/components/CourseCard";
import { usePublishedCoursesData } from "@/services/useCourseDataService";
import { useState, useEffect } from "react";
import { FiSearch, FiChevronDown, FiChevronUp } from "react-icons/fi";
// Define top categories separately
const topCategories = [
  { id: null, name: "All Programs" },
  { id: 27, name: "Web Development" },
  { id: 2, name: "Business" },
  { id: 28, name: "Mobile Development" },
  { id: 7, name: "Design" },
  { id: 8, name: "Marketing" },
];

// All other categories
const otherCategories = [
  { id: 1, name: "Development" },
  { id: 3, name: "Finance & Accounting" },
  { id: 4, name: "IT & Software" },
  { id: 5, name: "Office Productivity" },
  { id: 6, name: "Personal Development" },
  { id: 9, name: "Lifestyle" },
  { id: 10, name: "Photography & Video" },
  { id: 11, name: "Health & Fitness" },
  { id: 12, name: "Music" },
  { id: 13, name: "Teaching & Academics" },
  { id: 14, name: "Language Learning" },
  { id: 15, name: "Data Science" },
  { id: 16, name: "Machine Learning" },
  { id: 17, name: "Network & Security" },
  { id: 18, name: "Cloud Computing" },
  { id: 19, name: "Software Testing" },
  { id: 20, name: "Project Management" },
  { id: 21, name: "Human Resources" },
  { id: 22, name: "Sales" },
  { id: 23, name: "Communication" },
  { id: 24, name: "Entrepreneurship" },
  { id: 25, name: "Digital Marketing" },
  { id: 26, name: "Graphic Design" },
  { id: 29, name: "Game Development" },
  { id: 30, name: "Databases" },
  { id: 31, name: "Cyber Security" },
  { id: 32, name: "AWS Certification" },
  { id: 33, name: "DevOps" },
  { id: 34, name: "Blockchain" },
  { id: 35, name: "Cryptocurrency" },
  { id: 36, name: "Video Editing" },
  { id: 37, name: "Art & Crafts" },
  { id: 38, name: "Food & Beverage" },
  { id: 39, name: "Beauty & Makeup" },
  { id: 40, name: "Pets & Animal Care" },
  { id: 41, name: "Travel" },
  { id: 42, name: "Mental Health" },
  { id: 43, name: "Fitness" },
  { id: 44, name: "Yoga" },
  { id: 45, name: "Parenting & Relationships" },
  { id: 46, name: "Test Prep" },
];

const levels = [
  { id: null, name: "All" },
  { id: "BEGINNER", name: "Beginner" },
  { id: "INTERMEDIATE", name: "Intermediate" },
  { id: "ADVANCED", name: "Advanced" },
  { id: "ALL_LEVELS", name: "All Levels" },
];

export default function AllCoursesPage() {
  const {
    publishedCourses,
    loading,
    error,
    setSearch,
    setFilters,
    filters,
    pageNumber,
    setPageNumber,
    total,
  } = usePublishedCoursesData();

  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [activeLevel, setActiveLevel] = useState<
    "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "ALL_LEVELS" | null
  >(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [showAllCategories, setShowAllCategories] = useState(false);
  const [searchCategories, setSearchCategories] = useState("");

  // Filter other categories based on search
  const filteredOtherCategories = otherCategories.filter((cat) =>
    cat.name.toLowerCase().includes(searchCategories.toLowerCase())
  );

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, setSearch]);

  useEffect(() => {
    setPageNumber(1);
    setFilters({
      ...filters,
      category: activeCategory || undefined,
      level: activeLevel || undefined,
    });
  }, [activeCategory, activeLevel, setFilters, setPageNumber]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <section className="py-16 text-white bg-white overflow-hidden min-h-screen">
      <motion.div
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="max-w-7xl mx-auto px-4"
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <motion.h2
            variants={itemVariants}
            className="text-3xl md:text-[40px] font-bold text-[#090D2C] leading-snug"
          >
            All Programmes & Bootcamps
          </motion.h2>
        </div>

        {/* Search Bar */}
        <motion.div variants={itemVariants} className="relative mb-8">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-black"
          />
        </motion.div>

        {/* Filters */}
        {/* Filters */}
        <motion.div variants={containerVariants} className="mb-10">
          <h3 className="text-lg font-medium text-[#090D2C] mb-3">
            Filter by Category
          </h3>

          {/* Top Categories */}
          <div className="flex flex-wrap gap-3 mb-3">
            {topCategories.map((cat, i) => (
              <motion.button
                key={i}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-full font-medium text-sm transition ${
                  activeCategory === cat.id
                    ? "bg-pink-600 text-white"
                    : "bg-white border border-[#ccc] text-black hover:bg-pink-100"
                }`}
              >
                {cat.name}
              </motion.button>
            ))}
          </div>

          {/* Show More/Less Categories */}
          <div className="mb-3">
            <button
              onClick={() => setShowAllCategories(!showAllCategories)}
              className="flex items-center text-pink-600 font-medium text-sm hover:underline"
            >
              {showAllCategories ? (
                <>
                  <FiChevronUp className="mr-1" /> Show fewer categories
                </>
              ) : (
                <>
                  <FiChevronDown className="mr-1" /> Show all categories
                </>
              )}
            </button>
          </div>

          {/* Other Categories - Only shown when expanded */}
          {showAllCategories && (
            <div className="mb-6">
              {/* Category search for when there are many */}
              <div className="relative mb-3 max-w-md">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search categories..."
                  value={searchCategories}
                  onChange={(e) => setSearchCategories(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-black text-sm"
                />
              </div>

              <div className="flex flex-wrap gap-3">
                {filteredOtherCategories.map((cat, i) => (
                  <motion.button
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setActiveCategory(cat.id);
                      setShowAllCategories(false);
                    }}
                    className={`px-3 py-1.5 rounded-full font-medium text-xs transition ${
                      activeCategory === cat.id
                        ? "bg-pink-600 text-white"
                        : "bg-white border border-[#ccc] text-black hover:bg-pink-100"
                    }`}
                  >
                    {cat.name}
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {/* Level Filter (unchanged) */}
          <h3 className="text-lg font-medium text-[#090D2C] mb-3">
            Filter by Level
          </h3>
          <div className="flex flex-wrap gap-3">
            {levels.map((level: any, i) => (
              <motion.button
                key={i}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveLevel(level.id)}
                className={`px-4 py-2 rounded-full font-medium text-sm transition ${
                  activeLevel === level.id
                    ? "bg-pink-600 text-white"
                    : "bg-white border border-[#ccc] text-black hover:bg-pink-100"
                }`}
              >
                {level.name}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Results Count */}
        <motion.div variants={itemVariants} className="text-gray-600 mb-6">
          Showing {publishedCourses?.length} of {total} courses
        </motion.div>

        {/* Course Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="bg-gray-200 rounded-xl h-[400px] animate-pulse"
              />
            ))}
          </div>
        ) : error ? (
          <motion.div
            variants={itemVariants}
            className="text-red-500 text-center py-10"
          >
            {error}
          </motion.div>
        ) : publishedCourses?.length === 0 ? (
          <motion.div
            variants={itemVariants}
            className="text-gray-500 text-center py-10"
          >
            No courses found matching your criteria
          </motion.div>
        ) : (
          <>
            <motion.div
              variants={containerVariants}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {publishedCourses?.map((course, i) => (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  whileHover={{
                    y: -10,
                    transition: { duration: 0.3 },
                  }}
                >
                  <CourseCard
                    title={course.title}
                    date={new Date(course.createdAt).toLocaleDateString()}
                    description={course.description}
                    image={course.banner?.thumbnail || "/education.jpg"}
                    students={0} // You can add this data if available
                  />
                </motion.div>
              ))}
            </motion.div>

            {/* Pagination */}
            {total > 0 && (
              <motion.div
                variants={itemVariants}
                className="flex items-center justify-center mt-10 gap-4"
              >
                <button
                  onClick={() => setPageNumber((prev) => Math.max(prev - 1, 1))}
                  disabled={pageNumber === 1}
                  className={`px-4 py-2 rounded-full border transition ${
                    pageNumber === 1
                      ? "text-gray-400 border-gray-300 cursor-not-allowed"
                      : "text-pink-600 border-pink-600 hover:bg-pink-50"
                  }`}
                >
                  Previous
                </button>

                <div className="flex gap-2">
                  {Array.from(
                    { length: Math.min(5, Math.ceil(total / 10)) },
                    (_, i) => {
                      let pageNum;
                      if (Math.ceil(total / 10) <= 5) {
                        pageNum = i + 1;
                      } else if (pageNumber <= 3) {
                        pageNum = i + 1;
                      } else if (pageNumber >= Math.ceil(total / 10) - 2) {
                        pageNum = Math.ceil(total / 10) - 4 + i;
                      } else {
                        pageNum = pageNumber - 2 + i;
                      }

                      return (
                        <button
                          key={i}
                          onClick={() => setPageNumber(pageNum)}
                          className={`w-10 h-10 rounded-full transition ${
                            pageNumber === pageNum
                              ? "bg-pink-600 text-white"
                              : "border border-gray-300 text-gray-700 hover:bg-pink-50"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    }
                  )}
                </div>

                <button
                  onClick={() => setPageNumber((prev) => prev + 1)}
                  disabled={pageNumber >= Math.ceil(total / 10)}
                  className={`px-4 py-2 rounded-full border transition ${
                    pageNumber >= Math.ceil(total / 10)
                      ? "text-gray-400 border-gray-300 cursor-not-allowed"
                      : "text-pink-600 border-pink-600 hover:bg-pink-50"
                  }`}
                >
                  Next
                </button>
              </motion.div>
            )}
          </>
        )}
      </motion.div>
    </section>
  );
}
