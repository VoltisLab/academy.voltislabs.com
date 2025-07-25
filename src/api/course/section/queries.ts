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
        videoFileName
        title
        notes
        duration
        description
        isContentCompleted
        resources {
          id
          type
          url
          title
          createdAt
        }
      }
      course {
        title
      }
      assignment {
        title
        id
        isPublished
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
        isContentCompleted
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
  isPublished: boolean;
}
export interface CourseSectionQuiz {
  id: string;
  title: string;
  description: string;
  questions: CourseSectionQuizQuestion[];
  isContentCompleted?: boolean;
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
  videoFileName: string;
  title: string;
  notes: string;
  duration: number;
  description: string;
  resources: Resource[];
  isContentCompleted: boolean;
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
  course: {
    title: string;
  };
}

export interface CourseSectionsResponse {
  courseSections: CourseSection[];
}
