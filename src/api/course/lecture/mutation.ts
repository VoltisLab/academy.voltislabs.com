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
    $title: String
    $description: String
    $duration: Int
    $notes: String
    $videoUrl: String
    $resources: [LectureResourceInputType]
  ) {
    updateLecture(
      lectureId: $lectureId
      title: $title
      description: $description
      duration: $duration
      notes: $notes
      videoUrl: $videoUrl
      resources: $resources
    ) {
      success
      lecture {
        id
        title
        description
        duration
        notes
        videoUrl
        resources
        section {
          id
          title
        }
        codingexerciseSet {
          id
        }
        questionSet {
          id
        }
      }
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
export const ADD_LECTURE_RESOURCES = gql`
  mutation AddLectureResources($lectureId: Int!, $resources: [LectureResourceInputType!]!) {
    addLectureResources(lectureId: $lectureId, resources: $resources) {
      success
      message
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

export interface ResourceInput {
  title: string;
  type: string;
  url: string;
  action: string;
}

export interface UpdateLectureVariables {
  lectureId: number;
  title?: string;
  description?: string;
  duration?: number;
  notes?: string;
  videoUrl?: string;
  resources?: ResourceInput[];
}

export interface UpdateLectureResponse {
  updateLecture: {
    success: boolean;
    lecture: {
      id: number;
      title: string;
      description: string;
      duration: number;
      notes: string;
      videoUrl: string;
      resources: {
        title: string;
        type: string;
        url: string;
        action: string;
      }[];
      section: {
        id: number;
        title: string;
      };
      codingexerciseSet: {
        id: number;
      } | null;
      questionSet: {
        id: number;
      } | null;
    };
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

export const UPDATE_LECTURE_RESOURCE = gql`
  mutation UpdateLectureResource(
    $lectureId: Int!
    $type: LectureResourceTypeEnum!
    $url: String!
    $title: String!
  ) {
    updateLecture(
      lectureId: $lectureId
      resource: {
        type: $type
        url: $url
        title: $title
      }
    ) {
      success
      lecture {
        id
        title
      }
    }
  }
`;

export type LectureResourceTypeEnum = 'DOWNLOADABLE_FILES' | 'EXTERNAL_RESOURCES' | 'SOURCE_CODE';

export interface UpdateLectureResourceVariables {
  lectureId: number;
  type: LectureResourceTypeEnum;
  url: string;
  title: string;
}

export interface UpdateLectureResourceResponse {
  updateLecture: {
    success: boolean;
    lecture: {
      id: string;
      title: string;
    };
  };
}

export interface AddLectureResourcesVariables {
  lectureId: number;
  resources: {
    type: string; 
    url: string;
    title?: string;
    action?: string; 
  }[];
}

export interface AddLectureResourcesResponse {
  addLectureResources: {
    success: boolean;
    message: string;
  };
}
