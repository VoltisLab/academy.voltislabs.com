"use client";
import { useCoursesData } from "@/services/useCourseDataService";

export default function InstructorCourseList() {
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

  return (
    <div>
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search courses..."
      />

      <select
        onChange={(e) =>
          setFilters({ ...filters, level: e.target.value as any })
        }
      >
        <option value="ALL_LEVELS">All Levels</option>
        <option value="BEGINNER">Beginner</option>
        <option value="INTERMEDIATE">Intermediate</option>
        <option value="ADVANCED">Advanced</option>
      </select>

      <div className="grid grid-cols-2 gap-4">
        {loading ? (
          <p>Loading...</p>
        ) : instructorCourses.length === 0 ? (
          <p>No courses found.</p>
        ) : (
          instructorCourses.map((course) => (
            <div key={course.id}>
              <img src={course.banner} alt={course.title} />
              <h3>{course.title}</h3>
              <p>Category: {course.category?.name}</p>
            </div>
          ))
        )}
      </div>

      <div className="mt-4 flex gap-4">
        <button onClick={() => setPageNumber((p) => Math.max(p - 1, 1))}>
          Prev
        </button>
        <span>Page {pageNumber}</span>
        <button onClick={() => setPageNumber((p) => p + 1)}>Next</button>
      </div>
    </div>
  );
}
