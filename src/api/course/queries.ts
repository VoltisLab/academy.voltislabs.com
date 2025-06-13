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
