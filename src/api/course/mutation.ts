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