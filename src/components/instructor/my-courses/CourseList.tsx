'use client'

import React, { useState, useEffect } from 'react'
import MyCourseCard from './CourseCard'
import ViewToggle from './MyCourseViewToggle'
import bg from '@/../public/education.jpg'
import { useCoursesData } from '@/services/useCourseDataService'



const MyCourseList = () => {
  const [grid, setGrid] = useState(true)

  const {
        instructorCourses,
        total,
        loading,
        search,
        setSearch,
        filters,
        setFilters,
        pageNumber,
        setPageNumber,
      } = useCoursesData();

  useEffect(() => {
    // Detect screen size and default to grid for small screens
    const mediaQuery = window.matchMedia('(min-width: 768px)') // md breakpoint
    setGrid(!mediaQuery.matches) // true if below md → grid, false if md+ → list

    const handleResize = () => {
      setGrid(!window.matchMedia('(min-width: 768px)').matches)
    }

    // Update layout on screen resize
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
   <div className="flex flex-col gap-4 p-4">
  {/* Toggle */}
  <div className="hidden md:flex mb-4 w-full items-end justify-end ">
  <ViewToggle isGrid={grid} onToggle={setGrid} />
</div>

  {/* Course Cards */}
  <div className={`${grid && 'w-full flex items-center justify-center'}`}>
    <div
      className={
        grid
          ? 'flex flex-wrap gap-10 items-center justify-center'
          : 'flex flex-col gap-4'
      }
    >
      {instructorCourses?.map((course, index) => (
        <MyCourseCard
          key={index}
          id={Number(course?.id)}
          title={course?.title}
          status={ course?.status }
          isPublic={false}
          description={course?.description}
          editUrl={`/instructor/create-new-course/basic?edit=${course?.title}&id=${course?.id}`}
          isGrid={grid}
          imageUrl={course?.banner?.thumbnail === "https://prelura.s3.eu-west-2.amazonaws.com/" ? bg : course?.banner?.thumbnail ?? bg}
          category={course?.category?.name}
        />
      ))}
    </div>
  </div>

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
