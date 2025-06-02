// mutations/sectionMutations.ts
import { gql } from '@apollo/client';

export const CREATE_SECTION = gql`
  mutation CreateSection(
    $courseId: Int!
    $order: Int!
    $title: String!
    $description: String!
  ) {
    createSection(
      courseId: $courseId
      order: $order
      title: $title
      description: $description
    ) {
      success
      message
      section {
        id
        description
        title
        course {
          id
        }
        order
        createdAt
      }
    }
  }
`;

export const UPDATE_SECTION = gql`
  mutation UpdateSection(
    $sectionId: Int!
    $order: Int!
    $title: String!
    $description: String!
  ) {
    updateSection(
      sectionId: $sectionId
      order: $order
      title: $title
      description: $description
    ) {
      message
      success
    }
  }
`;


// TypeScript interfaces
export interface CreateSectionVariables {
  courseId: number;
  order: number;
  title: string;
  description: string | undefined;
}

export interface CreateSectionResponse {
  createSection: {
    success: boolean;
    message: string;
    section: {
      id: string;
      description: string;
      title: string;
      course: {
        id: string;
      };
      order: number;
      createdAt: string;
    };
  };
}

export interface UpdateSectionVariables {
  sectionId: number;
  order: number | undefined;
  title: string;
  description: string | undefined;
}

export interface UpdateSectionResponse {
  updateSection: {
    message: string;
    success: boolean;
  };
}