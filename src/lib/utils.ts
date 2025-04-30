import { OptionType } from "./types";

export function cn(
  ...classes: (string | boolean | undefined | null)[]
): string {
  return classes.filter(Boolean).join(" ");
}


export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): string | undefined => {
  if (password.length < 8) {
    return "Password must be at least 8 characters long";
  }
  if (!/[A-Z]/.test(password)) {
    return "Password must contain at least one uppercase letter";
  }
  if (!/[a-z]/.test(password)) {
    return "Password must contain at least one lowercase letter";
  }
  if (!/[0-9]/.test(password)) {
    return "Password must contain at least one number";
  }
  return undefined;
};

export interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
}



export const isAllowedDomain = (email: string): boolean => {
  const allowedDomains = ['voltislab.com', 'academy.voltislab.com'];
  const domain = email.split('@')[1]?.toLowerCase();
  return allowedDomains.includes(domain);
};

export enum CourseLevelEnum {
  BEGINNER = "BEGINNER",
  INTERMEDIATE = "INTERMEDIATE",
  ADVANCED = "ADVANCED",
  ALL_LEVELS = "ALL_LEVELS"
}

export enum LanguageEnum {
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
  INDONESIAN = "INDONESIAN"
}

export enum DurationUnitEnum {
  DAY = "DAY",
  WEEK = "WEEK",
  MONTH = "MONTH"
}

// Course level options
export const COURSE_LEVELS: OptionType[] = [
  { value: CourseLevelEnum.BEGINNER, label: "Beginner" },
  { value: CourseLevelEnum.INTERMEDIATE, label: "Intermediate" },
  { value: CourseLevelEnum.ADVANCED, label: "Advanced" },
  { value: CourseLevelEnum.ALL_LEVELS, label: "All Levels" }
];

// Language options
export const LANGUAGES: OptionType[] = [
  { value: LanguageEnum.ENGLISH, label: "English" },
  { value: LanguageEnum.SPANISH, label: "Spanish" },
  { value: LanguageEnum.FRENCH, label: "French" },
  { value: LanguageEnum.GERMAN, label: "German" },
  { value: LanguageEnum.ITALIAN, label: "Italian" },
  { value: LanguageEnum.PORTUGUESE, label: "Portuguese" },
  { value: LanguageEnum.CHINESE, label: "Chinese" },
  { value: LanguageEnum.JAPANESE, label: "Japanese" },
  { value: LanguageEnum.RUSSIAN, label: "Russian" },
  { value: LanguageEnum.ARABIC, label: "Arabic" },
  { value: LanguageEnum.HINDI, label: "Hindi" },
  { value: LanguageEnum.BENGALI, label: "Bengali" },
  { value: LanguageEnum.URDU, label: "Urdu" },
  { value: LanguageEnum.KOREAN, label: "Korean" },
  { value: LanguageEnum.TURKISH, label: "Turkish" },
  { value: LanguageEnum.SWEDISH, label: "Swedish" },
  { value: LanguageEnum.NORWEGIAN, label: "Norwegian" },
  { value: LanguageEnum.DUTCH, label: "Dutch" },
  { value: LanguageEnum.POLISH, label: "Polish" },
  { value: LanguageEnum.SWAHILI, label: "Swahili" },
  { value: LanguageEnum.INDONESIAN, label: "Indonesian" }
];

export const DURATION_UNITS: OptionType[] = [
  { value: DurationUnitEnum.DAY, label: "Day" },
  { value: DurationUnitEnum.WEEK, label: "Week" },
  { value: DurationUnitEnum.MONTH, label: "Month" }
];