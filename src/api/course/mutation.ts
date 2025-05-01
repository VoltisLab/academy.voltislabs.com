import { gql } from "@apollo/client";

export const CREATE_COURSE_BASIC_INFO = gql`
  mutation CreateCourseBasicInfo(
    $title: String!
    $subtitle: String!
    $categoryId: Int!
    $subCategoryId: Int!
    $topic: String!
    $language: LanguageEnum!
    $subtitleLanguage: LanguageEnum!
    $courseLevel: CourseLevelEnum!
    $description: String!
    $duration: DurationInputType!
  ) {
    createCourseBasicInfo(
      title: $title
      subtitle: $subtitle
      categoryId: $categoryId
      subCategoryId: $subCategoryId
      topic: $topic
      language: $language
      subtitleLanguage: $subtitleLanguage
      courseLevel: $courseLevel
      description: $description
      duration: $duration
    ) {
      success
      message
      course {
      id
      language
      subtitleLanguage
      title
      topic
      createdAt
      courseLevel
      description
      category {
        id
        name
      }
      subCategory {
        id
        name
      }
    }
    }
  }
`;


// Query to fetch course categories
export const GET_CATEGORIES = gql`
  query MyQuery {
    categories {
      id
      name
    }
  }
`;

export const UPDATE_COURSE_INFO = gql`
  mutation UpdateCourseInfo(
    $courseId: Int!
    $courseRequirements: [String]!
    $courseThumbnail: String!
    $targetAudience: [String]!
    $teachingPoints: [String]!
    $description: String
  ) {
    updateCourseInfo(
      courseId: $courseId
      courseRequirements: $courseRequirements
      courseThumbnail: $courseThumbnail
      targetAudience: $targetAudience
      teachingPoints: $teachingPoints
      description: $description
    ) {
      success
      message
    }
  }
`;

export const UPDATE_COURSE_SECTIONS = gql`
  mutation UpdateCourseSections(
    $courseId: Int!
    $courseSections: [CourseSectionType!]!
  ) {
    updateCourseInfo(
      courseId: $courseId
      courseSections: $courseSections
    ) {
      success
      message
    }
  }
`;