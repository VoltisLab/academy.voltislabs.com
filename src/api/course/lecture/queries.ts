import { gql } from "@apollo/client";

export const GET_SECTION_LECTURES = gql`
  query GetSectionLectures($sectionId: Int!) {
    sectionLectures(id: $sectionId) {
      id
      title
      description
      videoUrl
      notes
    }
  }
`;

export const GET_LECTURE_RESOURCECS = gql`
  query GetLectureResources($lectureId: Int!) {
    getLecture(id: $lectureId) {
      resources
    }
  }
`;

export const GET_LECTURE_RESOURCES_LIST = gql`
  query GetLectureResources($id: Int!) {
    getLecture(id: $id) {
      resources {
        createdAt
        type
        title
        url
      }
    }
  }
`;

export interface GetLectureResourcesVariables {
  lectureId: number; // Use lowercase to match GraphQL convention
}

export interface GetLectureResourcesResponse {
  getLecture: {
    resource: string;
  };
}

export interface GetLectureResourcesListVariables {
  id: number;
}

export interface GetLectureResourcesListResponse {
  getLecture: {
    resources: {
      createdAt: string;
      type: string;
      title: string;
      url: string;
    }[];
  };
}
