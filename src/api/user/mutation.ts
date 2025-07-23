import { gql } from "@apollo/client";

export const GET_USER_PREFERENCES = gql`
  query GetUserPreferences {
    viewMe {
      preference {
        dateFormat
        id
        language
        timeFormat
        timezone
      }
    }
  }
`;

export const UPDATE_USER_PREFERENCES = gql`
  mutation UpdateUserPreference(
    $dateFormat: DateFormatEnum
    $language: LanguageEnum
    $timeFormat: TimeFormatEnum
    $timezone: TimeZoneEnum
  ) {
    updateUserPreference(
      dateFormat: $dateFormat
      language: $language
      timeFormat: $timeFormat
      timeZone: $timezone
    ) {
      message
      success
    }
  }
`;
