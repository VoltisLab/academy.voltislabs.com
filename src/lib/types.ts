import { CourseLevelEnum, DurationUnitEnum, LanguageEnum } from "./utils";

// If you don't have this already, make sure these types are defined:
export interface SignUpData {
    fullName: string;
    email: string;
    password: string;
    otpCode: String;
    isInstructor: boolean;
  }
  
  export interface LoginData {
    email: string;
    password: string;
  }
  
  export interface SignUpResponse {
    register: {
      success: boolean;
      token: string;
      refreshToken: string;
      errors: string[]
    };
  }
  
  export interface LoginResponse {
    login: {
      success: boolean;
      token: string;
      refreshToken: string;
      errors: string[];
      user?: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        username: string;
        isVerified: boolean;
        verified: boolean;
        isInstructor: boolean;
      };
    };
  }
  
    
    export interface UserData {
      verified: boolean;
      username: string;
      lastName: string;
      isVerified: boolean;
      firstName: string;
      email: string;
      id: string;
    }
  
    
    export interface ApiClientOptions {
        includeAuth?: boolean;
        credentials?: RequestCredentials;
      }
      
      export interface ApiResponse<T> {
        data?: T;
        errors?: Array<{ message: string }>;
      }
// Define the structure for category items with checkboxes
export interface CategoryItem {
  id: string;
  label: string;
  count: number;
  checked?: boolean;
}

// Define the base Category interface
export interface BaseCategory {
  id: string;
  title: string;
  icon?: React.ElementType;
  isCollapsible?: boolean;
  isOpen?: boolean;
}

// Define recursive Category type that can contain items or nested categories
export interface Category extends BaseCategory {
  items?: (CategoryItem | Category)[];
}

export interface UserData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  username: string;
  verified: boolean;
  isVerified: boolean;
}

// Define more specific error types
export interface FormErrors {
  email?: string;
  password?: string;
  fullName?: string;
  otpCode?: string;
  general?: string;
  emailVerification?: string; // Added this property
}


// Define types for form data and options
export interface FormData {
  title: string;
  subtitle: string;
  categoryId: string;
  subCategoryId: string;
  topic: string;
  language: string;
  subtitleLanguage: string;
  courseLevel: string;
  durationValue: string;
  durationUnit: DurationUnitEnum;
  description: string;
}

export interface OptionType {
  value: string;
  label: string;
}

export interface CategoryOption {
  value: number;
  label: string;
}

export interface DurationInput {
  value: number;
  unit: DurationUnitEnum;
}

// Types for GraphQL mutation
export interface CreateCourseBasicInfoVariables {
  title: string;
  subtitle?: string;
  categoryId: number;
  subCategoryId: number;
  topic: string;
  language: LanguageEnum;
  subtitleLanguage?: LanguageEnum | null;
  courseLevel: CourseLevelEnum;
  duration: DurationInput;
  description?: string;
}

export interface CreateCourseBasicInfoResponse {
  createCourseBasicInfo: {
    message: string;
    success: boolean;
  };
}

