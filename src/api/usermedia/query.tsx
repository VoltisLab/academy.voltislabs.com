import { gql } from "@apollo/client";

export const GET_USER_MEDIA_QUERY = gql`
  query GetUserMedia(
    $pageCount: Int = 10
    $pageNumber: Int = 10
    $mediaType: MediaTypeEnum!
  ) {
    userMedia(pageCount: $pageCount, pageNumber: $pageNumber, mediaType: $mediaType) {
      createdAt
      extension
      fileName
      id
      url
    }
  }
`;

// Types
export interface UserMediaItem {
  id: string;
  createdAt: string;
  extension: string;
  fileName: string;
  url: string;
}

export interface GetUserMediaResponse {
  userMedia: UserMediaItem[];
}

export interface GetUserMediaVariables {
  pageCount?: number;
  pageNumber?: number;
  mediaType: "VIDEO" | "DOCUMENT"; // Adjust enum values as needed
}