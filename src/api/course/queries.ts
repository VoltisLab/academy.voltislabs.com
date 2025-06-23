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
      description
      instructor {
        id
        thumbnailUrl
      }
      category {
        id
        name
      }
      createdAt
      updatedAt
    }
  }
`;


// Root response type
export interface GetInstructorCoursesResponse {
  instructorCourses: InstructorCourse[];
}

// Individual course item
export interface InstructorCourse {
  id: string;
  title: string;
  banner: string;
  description: string;
  instructor: Instructor;
  category: CourseCategory;
  createdAt: string;
  updatedAt: string;
}

// Instructor object
export interface Instructor {
  id: string;
  thumbnailUrl: string;
}

// Course category object
export interface CourseCategory {
  id: string;
  name: string;
}

// Query variables
export interface GetInstructorCoursesVariables {
  search?: string;
  pageNumber?: number;
  pageCount?: number;
  filters?: CourseFiltersInput;
}

// Filters input type (based on naming convention – update as needed)
export interface CourseFiltersInput {
  categoryIds?: string[];
  status?: 'DRAFT' | 'PUBLISHED';
  isPublic?: boolean;
}
