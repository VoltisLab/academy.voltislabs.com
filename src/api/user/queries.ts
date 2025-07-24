import { gql } from "@apollo/client";

export const GET_USER_PROFILE = gql`
  query GetUserProfile {
    viewMe {
      id
      fullName
      email
      firstName
      lastName
      bio
      dateJoined
      displayName
      dob
      gender
      isInstructor
      isVerified
      lastLogin
      location {
        locationName
        latitude
        longitude
      }
      phone {
        completed
        countryCode
        number
      }
      preference {
        dateFormat
        language
        timeFormat
        timezone
      }
      profilePictureUrl
      thumbnailUrl
      username
    }
  }
`;
