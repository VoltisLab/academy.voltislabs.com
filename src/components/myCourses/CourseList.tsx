"use client"
import Image from "next/image";
import CourseFilterBar from "./CourseFilterBar";
import CourseCard from "../CourseCard";
import { Card_type, Course } from "./types";
import { Import } from "lucide-react";
import CourseCardDash from "./CourseCardDash";
import { usePublishedCoursesData } from "@/services/useCourseDataService";
import { useEffect } from "react";

export default function CourseList({ 
  title = "My Courses", 
  card_type = "my-courses",
  show_filter = true 
}: { 
  title?: string; 
  card_type: Card_type;
  show_filter: boolean;
}) {
  // Get all the hook data including search and filter controls
  const {
    publishedCourses,
    loading,
    error,
    search,
    setSearch,
    filters,
    setFilters,
    total
  } = usePublishedCoursesData();

  useEffect(() => {
    console.log("publishedCourses changed:", publishedCourses);
    console.log("current search:", search);
    console.log("current filters:", filters);
  }, [publishedCourses, search, filters]);

  if (error) {
    return (
      <section className="space-y-10">
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        <div className="text-red-500">Error: {error}</div>
      </section>
    );
  }

  return (
    <section className="space-y-10">
      <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
      
      {show_filter && (
        <CourseFilterBar 
          search={search}
          setSearch={setSearch}
          filters={filters}
          setFilters={setFilters}
        />
      )}
      
      {loading ? (
        <div className="text-center py-8">Loading courses...</div>
      ) : (
        <>
          <div className="text-sm text-gray-600 mb-4">
            {total} course{total !== 1 ? 's' : ''} found
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {publishedCourses?.length > 0 ? (
              publishedCourses.map((course) => (
                <CourseCardDash
                  key={`${course.id}-${course?.updatedAt}`}
                  course={course}
                  card_type={card_type}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-gray-500">
                {search || Object.keys(filters).length > 0 
                  ? "No courses found matching your search criteria" 
                  : "No courses available"}
              </div>
            )}
          </div>
        </>
      )}
    </section>
  );
}