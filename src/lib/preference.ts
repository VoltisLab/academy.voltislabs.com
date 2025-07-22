export enum DateFormat {
  MM_DD_YYYY = "MM_DD_YYYY",
  DD_MM_YYYY = "DD_MM_YYYY",
}

export enum QueryLanguage {
  EN = "EN",
  ES = "ES",
  FR = "FR",
  DE = "DE",
  IT = "IT",
  PT = "PT",
  ZH = "ZH",
  JA = "JA",
  RU = "RU",
  AR = "AR",
  HI = "HI",
  BN = "BN",
  UR = "UR",
  KO = "KO",
  TR = "TR",
  SV = "SV",
  NO = "NO",
  NL = "NL",
  PL = "PL",
  SW = "SW",
  ID = "ID",
}

export enum MutationLanguage {
  ENGLISH = "ENGLISH",
  SPANISH = "SPANISH",
  FRENCH = "FRENCH",
  GERMAN = "GERMAN",
  ITALIAN = "ITALIAN",
  PORTUGUESE = "PORTUGUESE",
  CHINESE = "CHINESE",
  JAPANESE = "JAPANESE",
  RUSSIAN = "RUSSIAN",
  ARABIC = "ARABIC",
  HINDI = "HINDI",
  BENGALI = "BENGALI",
  URDU = "URDU",
  KOREAN = "KOREAN",
  TURKISH = "TURKISH",
  SWEDISH = "SWEDISH",
  NORWEGIAN = "NORWEGIAN",
  DUTCH = "DUTCH",
  POLISH = "POLISH",
  SWAHILI = "SWAHILI",
  INDONESIAN = "INDONESIAN",
}

export enum QueryTimeFormat {
  A_24_HOUR = "A_24_HOUR",
  A_12_HOUR = "A_12_HOUR",
}

export enum MutationTimeFormat {
  TIME_FORMAT_24_HOUR = "TIME_FORMAT_24_HOUR",
  TIME_FORMAT_12_HOUR = "TIME_FORMAT_12_HOUR",
}

export enum TimeZone {
  UTC = "UTC",
  EST = "EST",
  PST = "PST",
  CET = "CET",
  IST = "IST",
}

export interface UserPreference {
  id?: number;
  dateFormat: DateFormat;
  language: QueryLanguage;
  timeFormat: QueryTimeFormat;
  timezone: TimeZone;
}

export interface UpdatePreferenceInput {
  dateFormat?: DateFormat;
  language?: MutationLanguage;
  timeFormat?: MutationTimeFormat;
  timeZone?: TimeZone;
}

export interface UserPreferenceResponse {
  viewMe: {
    preference: UserPreference;
  };
}

export interface UpdatePreferenceResponse {
  updateUserPreference: {
    message: string;
    success: boolean;
  };
}
