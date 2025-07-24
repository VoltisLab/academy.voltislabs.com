"use client"
import MyCourseList from '@/components/instructor/my-courses/CourseList'
import { useCoursesData } from '@/services/useCourseDataService';
import React, { useEffect } from 'react'

const page = () => {
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

  console.log("instructorData===", instructorCourses)
  return (
    <div className='p-4'>
     <MyCourseList/>
    </div>
  )
}

export default page  