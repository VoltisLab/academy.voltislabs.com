import { gql } from "@apollo/client";

export const GET_ALL_INSTRUCTOR_COURSES = gql`
  query GetInstructorCourses(
    $search: String
    $pageNumber: Int
    $pageCount: Int
    $filters: CourseFiltersInput
  ) {
    instructorCourses(
      search: $search
      pageNumber: $pageNumber
      pageCount: $pageCount
      filters: $filters
    ) {
      id
      title
      banner
      category {
        id
        name
      }
      createdAt
      updatedAt
    }
  }
`;
