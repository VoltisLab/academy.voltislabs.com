import { gql } from '@apollo/client';

export const GET_COURSE_SECTIONS = gql`
  query GetCourseSections($id: Int!) {
    courseSections(id: $id) {
      id
      order
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
          }
        }
      }
    }
  }
`;

export interface CourseSectionsVariables {
  id: number;
}

export interface Resource {
  id: string;
  type: string;
  url: string;
  title: string;
  createdAt: string;
}

export interface Lecture {
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
  lectures: Lecture[];
}

export interface CourseSectionsResponse {
  courseSections: CourseSection[];
}
