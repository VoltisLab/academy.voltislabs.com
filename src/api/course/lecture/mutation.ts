// mutations/lectureMutations.ts
import { gql } from '@apollo/client';

export const CREATE_LECTURE = gql`
  mutation CreateLecture(
    $sectionId: Int!
    $title: String!
  ) {
    createLecture(
      sectionId: $sectionId
      title: $title
    ) {
      success
      lecture {
        id
      }
    }
  }
`;

export const UPDATE_LECTURE = gql`
  mutation UpdateLecture(
    $lectureId: Int!
    $title: String!
  ) {
    updateLecture(
      lectureId: $lectureId
      title: $title
    ) {
      success
    }
  }
`;

export const DELETE_LECTURE = gql`
  mutation DeleteLecture(
    $lectureId: Int!
  ) {
    deleteLecture(
      lectureId: $lectureId
    ) {
      success
    }
  }
`;

export const DELETE_SECTION = gql`
  mutation DeleteSection(
    $sectionId: Int!
  ) {
    deleteSection(
      sectionId: $sectionId
    ) {
      success
    }
  }
`;

// TypeScript interfaces
export interface CreateLectureVariables {
  sectionId: number;
  title: string;
}

export interface CreateLectureResponse {
  createLecture: {
    success: boolean;
    lecture: {
      id: string;
    };
  };
}

export interface UpdateLectureVariables {
  lectureId: number;
  title: string;
}

export interface UpdateLectureResponse {
  updateLecture: {
    success: boolean;
  };
}

export interface DeleteLectureVariables {
  lectureId: number;
}

export interface DeleteLectureResponse {
  deleteLecture: {
    success: boolean;
  };
}

export interface DeleteSectionVariables {
  sectionId: number;
}

export interface DeleteSectionResponse {
  deleteSection: {
    success: boolean;
  };
}