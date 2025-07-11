import { gql } from "@apollo/client";

export const CREATE_COURSE_BASIC_INFO = gql`
  mutation CreateCourse(
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
    createCourse(
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
  mutation UpdateCourse(
    $courseId: Int!
    $requirements: [String]!
    $banner: BannerInput!
    $targetAudience: [String]!
    $teachingPoints: [String]!
    $description: String
  ) {
    updateCourse(
      courseId: $courseId
      requirements: $requirements
      banner: $banner
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
    updateCourseInfo(courseId: $courseId, courseSections: $courseSections) {
      success
      message
    }
  }
`;

export const CREATE_QUIZ = gql`
  mutation CreateQuiz(
    $sectionId: Int!
    $title: String!
    $description: String
    $allowMultipleAttempts: Boolean
    $maxAttempts: Int
    $passingScorePercent: Int
    $timeLimitMinutes: Int
  ) {
    createQuiz(
      sectionId: $sectionId
      title: $title
      description: $description
      allowMultipleAttempts: $allowMultipleAttempts
      maxAttempts: $maxAttempts
      passingScorePercent: $passingScorePercent
      timeLimitMinutes: $timeLimitMinutes
    ) {
      success
      quiz {
        id
      }
    }
  }
`;

export const UPDATE_QUIZ = gql`
  mutation UpdateQuiz(
    $quizId: Int!
    $title: String
    $description: String
    $allowMultipleAttempts: Boolean
    $maxAttempts: Int
    $passingScorePercent: Int
    $timeLimitMinutes: Int
  ) {
    updateQuiz(
      quizId: $quizId
      title: $title
      description: $description
      allowMultipleAttempts: $allowMultipleAttempts
      maxAttempts: $maxAttempts
      passingScorePercent: $passingScorePercent
      timeLimitMinutes: $timeLimitMinutes
    ) {
      success
    }
  }
`;

export const DELETE_QUIZ = gql`
  mutation DeleteQuiz($quizId: Int!) {
    deleteQuiz(quizId: $quizId) {
      success
    }
  }
`;

export const ADD_QUESTION_TO_QUIZ = gql`
  mutation AddQuestionToQuiz($input: QuestionInputType!) {
    addQuestionToQuiz(input: $input) {
      success
      question {
        id
        answerChoices {
          id
        }
      }
    }
  }
`;

export const UPDATE_QUESTION = gql`
  mutation UpdateQuestion(
    $questionId: Int!
    $text: String
    $choices: [AnswerChoiceInputType]!
    $relatedLectureId: Int
    $removeRelatedLecture: Boolean
  ) {
    updateQuestion(
      questionId: $questionId
      text: $text
      choices: $choices
      relatedLectureId: $relatedLectureId
      removeRelatedLecture: $removeRelatedLecture
    ) {
      success
      question {
        relatedLecture {
          id
          title
          videoUrl
        }
      }
    }
  }
`;

export const DELETE_QUESTION = gql`
  mutation DeleteQuestion($questionId: Int!) {
    deleteQuestion(questionId: $questionId) {
      success
    }
  }
`;
