'use client'

import React, { useState, useEffect } from 'react'
import MyCourseCard from './CourseCard'
import ViewToggle from './MyCourseViewToggle'
import bg from '@/../public/education.jpg'

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
      {/* Show toggle only on md+ */}
      <div className="hidden md:block mb-4">
        <ViewToggle isGrid={grid} onToggle={setGrid} />
      </div>

      <div className={`${grid && 'w-full flex items-center justify-center'}`}>
        <div
          className={
            grid
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'
              : 'flex flex-col gap-4'
          }
        >
          {sampleCourses.map((course, index) => (
            <MyCourseCard
              key={index}
              title={course.title}
              status={course.status as 'DRAFT' | 'PUBLISHED'}
              isPublic={course.isPublic}
              description={course.description}
              editUrl={course.editUrl}
              isGrid={grid}
              imageUrl={bg}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default MyCourseList
