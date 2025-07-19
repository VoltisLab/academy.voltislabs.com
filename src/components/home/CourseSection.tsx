"use client";

import { motion } from "framer-motion";
import CourseCard from "@/components/CourseCard";
import { usePublishedCoursesData } from "@/services/useCourseDataService";
import Link from "next/link";
import { useState, useEffect } from "react";

const categories = [
  { id: null, name: "All Programs" },
  { id: 27, name: "Web Development" },
  { id: 2, name: "Business" },
  { id: 28, name: "Mobile Development" },
  { id: 7, name: "Design" },
  { id: 8, name: "Marketing" },
  { id: 15, name: "Data Science" },
];
export default function CourseSection() {
  const {
    publishedCourses,
    loading,
    setFilters,
    setPageNumber,
    filters,
    error,
  } = usePublishedCoursesData();

  console.log(publishedCourses, loading);

  const [activeCategory, setActiveCategory] = useState<number | null>(null);

  useEffect(() => {
    setPageNumber(1);
    setFilters({
      ...filters,
      category: activeCategory || undefined,
    });
  }, [activeCategory, setFilters, setPageNumber]);

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

  // Show only 6 courses on the homepage
  const displayedCourses = publishedCourses?.slice(0, 6);

  return (
    <section className="py-16 text-white bg-white overflow-hidden">
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
            Discover Courses & Bootcamps
          </motion.h2>
          <Link href="/programmes">
            <motion.button
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-pink-500 border border-pink-500 px-5 py-2 rounded-full hover:bg-pink-600 hover:text-white transition text-sm"
            >
              Show All
            </motion.button>
          </Link>
        </div>

        {/* Category Filters */}
        <motion.div
          variants={containerVariants}
          className="flex flex-wrap gap-3 mb-10"
        >
          {categories.map((cat, i) => (
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
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {displayedCourses?.map((course, i) => (
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
                  students={0}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}
