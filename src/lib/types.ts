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

export interface CreateCourseBasicInfoVariables {
  title: string;
  subtitle: string;
  categoryId: number;
  subCategoryId: number;
  topic: string;
  language: LanguageEnum;
  subtitleLanguage: LanguageEnum;
  courseLevel: CourseLevelEnum;
  description: string;
  duration: {
    value: number;
    unit: DurationUnitEnum;
  };
}

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



export interface CreateCourseBasicInfoResponse {
  createCourseBasicInfo: {
    message: string;
    success: boolean;
  };
}
export interface CourseCategory {
  id: string;
  name: string;
  subcategories: Subcategory[];
}

interface Subcategory {
  id: string;
  name: string;
}

export interface GetCategoriesResponse {
  categories: CourseCategory[];
}

export interface UploadResponse {
  upload: {
    baseUrl: string;
    data: string;
    success: boolean;
  };
}

export interface UploadVariables {
  files: string;
  filetype: string;
}

export interface BasicInformationFormProps {
  onSaveNext: () => void;
  courseId?: number;
}

export interface CourseInfo {
  courseThumbnail: string;
  secondaryThumbnail: string;
  courseDescription: string;
  teachingPoints: string[];
  targetAudience: string[];
  courseRequirements: string[];
}

export type ContentItemType = 'video' | 'article' | 'quiz' | 'coding-exercise' | 'assignment' | 'practice' | 'role-play'| "video-slide"

export interface Lecture {
  title?: string;
  id: string;
  name?: string;
  description: string;
  captions: string;
  lectureNotes: string;
  attachedFiles: AttachedFile[];
  videos: Video[];
  contentType: ContentItemType;
  isExpanded: boolean
  questions?: Array<Question>;
}

export interface Question {
  id: string;
  text: string;
  answers: Array<{
    text: string;
    explanation: string;
  }>;
  correctAnswerIndex: number;
  relatedLecture?: string;
  type: string;
}


export interface Section {
  name: string;
  lectures: Lecture[];
  editing: boolean;
  lectureEditing: boolean[];
}

export interface ContentDropdownState {
  section: number;
  lecture: number;
}

export interface ModalConfig {
  type: string;
  title: string;
  sectionIndex: number;
  lectureIndex: number;
}

export interface ContentStatus {
  video: boolean;
  file: boolean;
  captions: boolean;
  description: boolean;
  notes: boolean;
}

export interface CourseSectionData {
  sectionName: string;
  lectures: {
    name: string;
    description: string;
    captions: string;
    lectureNotes: string;
    attachedFiles: {
      action: string;
      attachedFile: { url: string }[];
    };
    videoUrls: {
      action: string;
      videos: { url: string }[];
    };
  }[];
}

export interface UpdateCourseResult {
  updateCourseInfo: {
    success: boolean;
    message: string;
  };
}

export interface CourseSectionsBuilderProps {
  onSaveNext?: () => void;
  courseId: number;
}

export interface ContentSummaryProps {
  lecture: Lecture;
  sectionIndex: number;
  lectureIndex: number;
}

export interface ContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: ModalConfig;
}

// types.ts
export interface AttachedFile {
  url: string;
}

export interface FileOperation {
  attachedFile: AttachedFile[];
  action: 'ADD' | 'REMOVE';
}

export interface VideoOperation {
  videos: Video[];
  action: 'ADD' | 'REMOVE';
}

export interface CourseSectionInput {
  sectionName: string;
  lectures: LectureInput[];
}

export interface UpdateCourseSectionsVariables {
  courseId: number | undefined;
  courseSections: CourseSectionInput[];
}

export interface UpdateCourseSectionsResponse {
  updateCourseInfo: {
    success: boolean;
    message: string;
  };
}


export interface CourseSectionBuilderProps {
  onSaveNext?: () => void;
  courseId: number | undefined;
}

export interface Video {
  url: string;
  name: string;
}

export interface AttachedFile {
  url: string;
  name: string;
}

export interface Section {
  id: string;
  name: string;
  lectures: Lecture[];
  isExpanded: boolean;
}

// Input types for API calls
export interface AttachedFileInput {
  url: string;
}

export interface VideoInput {
  url: string;
}

export interface AttachedFilesInput {
  action: "ADD" | "UPDATE" | "REMOVE";
  attachedFile: AttachedFileInput[];
}

export interface LectureInput {
  name: string;
  description: string;
  captions: string;
  lectureNotes: string;
  attachedFiles: AttachedFilesInput;
  videoUrls: VideoUrlsInput;
}

export interface VideoUrlsInput {
  action: "ADD" | "UPDATE" | "REMOVE";
  videos: VideoInput[];
}

export interface CourseSectionInput {
  sectionName: string;
  lectures: LectureInput[];
}

// Enum for content types
export enum ContentType {
  VIDEO = "video",
  FILE = "file",
  DESCRIPTION = "description",
  CAPTIONS = "captions",
  LECTURE_NOTES = "lectureNotes"
}

// Enum for resource tab types
export enum ResourceTabType {
  DOWNLOADABLE_FILE = "downloadable",
  LIBRARY = "library",
  EXTERNAL = "external",
  SOURCE_CODE = "source-code",
  VIDEO= "video",
  CAPTIONS = "captions",
  LECTURE_NOTES = "lecture-notes"
}
