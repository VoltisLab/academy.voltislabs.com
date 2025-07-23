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
      subtitle
      banner
      status
      requirements
    targetAudience
    teachingPoints
      description
      instructor {
        id
        fullName
        thumbnailUrl
      }
      category {
        id
        name
      }
        subCategory {
      id
      name
    }
      topic
      subtitleLanguage
      language
      level
      duration
      sections {
      title
      lectures {
        id
        duration
        title
      }
        assignment {
          description
          instructionDownloadableResource
          dueDate
          id
        }
        id
      }
      createdAt
      updatedAt
    }
  }
`;

export const GET_ALL_COURSES = gql`
  query GetAllCourses(
    $search: String
    $pageNumber: Int
    $pageCount: Int
    $filters: CourseFiltersInput
  ) {
    courses(
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
      sections {
        assignment {
          description
          instructionDownloadableResource
          dueDate
          id
        }
        id
      }
      createdAt
      updatedAt
    }
  }
`;

export const GET_INSTRUCTOR_COURSES_TOTAL = gql`
  query GetInstructorCoursesTotal {
    instructorCoursesTotalNumber
  }
`;
export const GET_LECTURE_NOTES = gql`
  query UserLectureVideoNotes($lectureId: Int!) {
    userLectureVideoNotes(lectureId: $lectureId ) {
      createdAt
      id
      notes
      lecture {
      title
      section {
        title
      }
      }
      time
      updatedAt
    }
  }
`;

export const GET_COURSES_TOTAL = gql`
  query GetCoursesTotal {
    coursesTotalNumber
  }
`;

export const GET_USER_LEARNING_REMINDER = gql`
  query GetUserLearningReminder($pageCount: Int!, $pageNumber: Int!) {
    userLearningReminder(pageCount: $pageCount, pageNumber: $pageNumber) {
      calendarService
      createdAt
      description
      icsFile
      id
      schedule
      serviceEventId
      updatedAt
      course {
        id
        title
      }
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
  subtitle: string;
  banner: {
    thumbnail: string;
    url: string;
  };
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
  status?: "DRAFT" | "PUBLISHED";
  isPublic?: boolean;
}
//instructorresponse
export interface GetInstructorCoursesTotalResponse {
  instructorCoursesTotalNumber: number;
}
