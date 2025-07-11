import { gql } from "@apollo/client";

export const GET_COURSE_SECTIONS = gql`
  query GetCourseSections($id: Int!) {
    courseSections(id: $id) {
      id
      order
      title
      description
      lectures {
        id
        videoUrl
        title
        notes
        duration
        description

        resources {
          id
          type
          url
          title
          createdAt
        }
      }
      assignment {
        title
        id
      }
      practiceSet {
        id
        title
      }
      codingExercises {
        id
        title
      }
      quiz {
        description
        id
        title
        questions {
          id
          text
          order
          answerChoices {
            explanation
            id
            isCorrect
            order
            text
          }
          relatedLecture {
            title
            id
            videoUrl
          }
        }
      }
    }
  }
`;

export interface CourseSectionsVariables {
  id: number;
}

export interface CourseSectionAssignnments {
  id: string;
  title: string;
}
export interface CourseSectionQuiz {
  id: string;
  title: string;
  description: string;
  questions: CourseSectionQuizQuestion[];
}

export interface CourseSectionQuizQuestion {
  id: string;
  text: string;
  order: number;
  answerChoices: CourseSectionAnswerChoice[];
  relatedLectureId: number;
}

export interface CourseSectionAnswerChoice {
  id: string;
  text: string;
  order: number;
  isCorrect: boolean;
  explanation: string;
}
export interface Resource {
  id: string;
  type: string;
  url: string;
  title: string;
  createdAt: string;
}

export interface CourseSectionLecture {
  id: string;
  videoUrl: string;
  title: string;
  notes: string;
  duration: number;
  description: string;
  resources: Resource[];
}

export interface CourseSection {
  id: string;
  order: number;
  title: string;
  quiz: CourseSectionQuiz[];
  lectures: CourseSectionLecture[];
  assignment: CourseSectionAssignnments[];
  description: string;
  codingExercises: CourseSectionAssignnments[];
  practiceSet: CourseSectionAssignnments[];
}

export interface CourseSectionsResponse {
  courseSections: CourseSection[];
}
