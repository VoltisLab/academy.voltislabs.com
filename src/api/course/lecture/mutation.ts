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

// New comprehensive update mutation for content
export const UPDATE_LECTURE_CONTENT = gql`
  mutation UpdateLectureContent(
    $lectureId: Int!
    $description: String
    $videoUrl: String
    $notes: String
  ) {
    updateLecture(
      lectureId: $lectureId
      description: $description
      videoUrl: $videoUrl
      notes: $notes
    ) {
      success
      lecture {
        id
        title
        description
        videoUrl
        notes
        section {
          id
        }
      }
    }
  }
`;

export const UPDATE_LECTURE_DESCRIPTION = gql`
  mutation UpdateLecture(
    $lectureId: Int!
    $description: String
  ) {
    updateLecture(
      lectureId: $lectureId
      description: $description
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

export interface UpdateLectureDescriptionVariables {
  lectureId: number;
  description: string;
}

export interface DeleteLectureResponse {
  deleteLecture: {
    success: boolean;
  };
}

export interface UpdateLectureDescriptionResponse {
  updateLecture: {
    success: boolean;
  };
}

// New interfaces for content updates
export interface UpdateLectureContentVariables {
  lectureId: number;
  description?: string;
  videoUrl?: string;
  notes?: string;
}

export interface UpdateLectureContentResponse {
  updateLecture: {
    success: boolean;
    lecture: {
      id: string;
      title: string;
      description: string;
      videoUrl: string;
      notes: string;
      section: {
        id: string;
      };
    };
  };
}