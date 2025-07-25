'use client'

import React, { useState, useEffect } from 'react'
import MyCourseCard from './CourseCard'
import ViewToggle from './MyCourseViewToggle'
import bg from '@/../public/education.jpg'
import { useCoursesData } from '@/services/useCourseDataService'
import { Loader } from './LoadingState' // adjust path
import { EmptyCourses } from './EmprtyState' // adjust path
import { StatusSegmentedControl } from './StatusSegmentedControl' // adjust path
import Link from 'next/link'

const MyCourseList = () => {
  const [grid, setGrid] = useState(true)

  const {
    instructorCourses,
    total,
    loading,
    filters,
    setFilters,
    pageNumber,
    setPageNumber,
  } = useCoursesData();

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 768px)');
    const handleResize = () => {
      if (!mediaQuery.matches) setGrid(true);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex flex-col gap-4 p-4 md:p-0">

      {/* View Toggle */}
      <div className="hidden md:flex mb-2 w-full items-end justify-end ">
        <ViewToggle isGrid={grid} onToggle={setGrid} />
      </div>

      {/* Status Filter */}
      <StatusSegmentedControl
        filters={filters}
        setFilters={setFilters}
        setPageNumber={setPageNumber}
      />

      {/* Main content: Loader, Empty State, or Course Cards */}
      {loading ? (
        <Loader />
      ) : instructorCourses && instructorCourses.length === 0 ? (
        <EmptyCourses status={filters?.status ?? "ALL"} />

      ) : (
        <div className={`${grid && 'w-full flex '}`}>
          <div
            className={
              grid
                ? ' flex flex-wrap gap-4  '
                : 'flex flex-col gap-4'
            }
          >
            {instructorCourses?.map((course, index) => (
              <Link href={`/instructor/my-courses/${course?.id}`}>
              <MyCourseCard
                key={index}
                id={Number(course?.id)}
                title={course?.title}
                status={course?.status}
                isPublic={false}
                progressPercent={course?.status === "PUBLISHED" ? 100 : course?.status === "DRAFT" ? 65 : 50}
                description={course?.description}
                editUrl={`/instructor/create-new-course/basic?edit=${course?.title}&id=${course?.id}`}
                isGrid={grid}
                imageUrl={
                  course?.banner?.thumbnail === "https://prelura.s3.eu-west-2.amazonaws.com/"
                    ? bg
                    : course?.banner?.thumbnail ?? bg
                }
                category={course?.category?.name}
              />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Pagination */}
      {instructorCourses && instructorCourses.length > 0 && (
        <div className="flex items-center justify-center mt-6 gap-3 text-sm">
          <button
            onClick={() => setPageNumber((prev) => Math.max(prev - 1, 1))}
            disabled={pageNumber === 1}
            className={`px-3 py-1 border rounded-md transition ${
              pageNumber === 1
                ? 'text-gray-400 border-gray-300 cursor-not-allowed'
                : 'text-purple-700 border-purple-700 hover:bg-purple-50'
            }`}
          >
            Previous
          </button>
          <span className="text-gray-700">
            Page {pageNumber} of {Math.ceil(total / 10)}
          </span>
          <button
            onClick={() => setPageNumber((prev) => prev + 1)}
            disabled={pageNumber >= Math.ceil(total / 10)}
            className={`px-3 py-1 border rounded-md transition ${
              pageNumber >= Math.ceil(total / 10)
                ? 'text-gray-400 border-gray-300 cursor-not-allowed'
                : 'text-purple-700 border-purple-700 hover:bg-purple-50'
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}

export default MyCourseList
