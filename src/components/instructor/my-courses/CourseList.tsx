'use client'

import React, { useState, useEffect } from 'react'
import MyCourseCard from './CourseCard'
import ViewToggle from './MyCourseViewToggle'
import bg from '@/../public/education.jpg'
import { useCoursesData } from '@/services/useCourseDataService'

const sampleCourses = [
  {
    title: 'Frontend from Scratch',
    status: 'DRAFT',
    isPublic: true,
    description:
      'Build responsive and interactive user interfaces using HTML, CSS, JavaScript, and React.',
    editUrl: '/courses/edit/1',
  },
  {
    title: 'Mastering React in 30 Days',
    status: 'PUBLISHED',
    isPublic: false,
    description:
      'Advanced concepts in React including hooks, context, and performance optimization.',
    editUrl: '/courses/edit/2',
  },
  {
    title: 'TypeScript for Beginners',
    status: 'DRAFT',
    isPublic: true,
    description:
      'Understand the power of TypeScript and how to use it in modern web applications.',
    editUrl: '/courses/edit/3',
  },
  {
    title: 'Next.js Fullstack Guide',
    status: 'PUBLISHED',
    isPublic: true,
    description:
      'Create fullstack web applications using Next.js, APIs, and server-side rendering.',
    editUrl: '/courses/edit/4',
  },
  {
    title: 'Tailwind CSS Crash Course',
    status: 'DRAFT',
    isPublic: false,
    description:
      'Quickly build modern and responsive designs using Tailwind CSS utility classes.',
    editUrl: '/courses/edit/5',
  },
]

const MyCourseList = () => {
  const [grid, setGrid] = useState(true)

  const {
        instructorCourses,
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
  <div className="hidden md:block mb-4">
    <ViewToggle isGrid={grid} onToggle={setGrid} />
  </div>

  {/* Course Cards */}
  <div className={`${grid && 'w-full flex items-center justify-center'}`}>
    <div
      className={
        grid
          ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'
          : 'flex flex-col gap-4'
      }
    >
      {instructorCourses?.map((course, index) => (
        <MyCourseCard
          key={index}
          title={course?.title}
          status={ 'DRAFT' }
          isPublic={false}
          description={course?.description}
          editUrl={course?.id}
          isGrid={grid}
          imageUrl={course?.instructor?.thumbnailUrl ?? bg}
          category={course?.category?.name}
        />
      ))}
    </div>
  </div>

  {/* Pagination */}
  {instructorCourses && instructorCourses.length > 0 && (
    <div className="flex items-center justify-center mt-6 gap-3 text-sm">
      <button
        onClick={() => setPageNumber(prev => Math.max(prev - 1, 1))}
        disabled={pageNumber === 1}
        className={`px-3 py-1 border rounded-md ${
          pageNumber === 1
            ? 'text-gray-400 border-gray-300 cursor-not-allowed'
            : 'text-purple-700 border-purple-700 hover:bg-purple-50'
        }`}
      >
        Previous
      </button>

      <span className="text-gray-700">Page {pageNumber}</span>

      <button
        onClick={() => setPageNumber(prev => prev + 1)}
        className="px-3 py-1 border border-purple-700 text-purple-700 rounded-md hover:bg-purple-50"
      >
        Next
      </button>
    </div>
  )}
</div>
  )
}

export default MyCourseList
