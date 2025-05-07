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

// Define more specific error types
export interface FormErrors {
  email?: string;
  password?: string;
  fullName?: string;
  otpCode?: string;
  general?: string;
  emailVerification?: string;
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

export type ContentItemType = 'video' | 'article' | 'quiz' | 'coding-exercise' | 'assignment' | 'practice' | 'role-play'| 'video-slide';

// Interface for external resources (links, references, etc.)
export interface ExternalResource {
  url: string;
  name: string;
}

// Interface for lectures - updated with code-related properties
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
  isExpanded: boolean;
  questions?: Array<Question>;
  
  // Code editor related fields
  code?: string;                    // Stores the code content for practice exercises
  codeLanguage?: string;            // Stores the programming language for the code editor
  externalResources?: ExternalResource[]; // Links to external resources related to the practice
  
  // Fields for coding challenges/evaluations
  testCases?: TestCase[];           // Test cases to validate student code
  expectedOutput?: string;          // Expected output for auto-grading
  initialCode?: string;             // Initial code template to show to students
  solutionCode?: string;            // Solution code (for instructor reference)
  
  // Assignment related fields
  dueDate?: string;
  pointsValue?: number;
}

// Interface for test cases to validate student code
export interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  isHidden?: boolean;               // Hidden test cases are not shown to students
  explanation?: string;             // Explanation of what the test case is checking
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
  isExpanded?: boolean;
  id: string;
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
  code?: boolean;           // Added for code exercises
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
    code?: string;           // Added for code practices
    codeLanguage?: string;   // Added for code practices
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

// CodeEditor related props
export interface CodeEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  sectionId: string;
  lectureId: string;
  initialCode?: string;
  language?: string;
  title?: string;
  instructions?: string;
  onSaveCode?: (sectionId: string, lectureId: string, code: string, language: string) => void;
}

export interface AttachedFile {
  url: string;
  name: string;
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
  code?: string;              // Added for code practices
  codeLanguage?: string;      // Added for code practices
  testCases?: TestCase[];     // Added for code exercises
}

export interface VideoUrlsInput {
  action: "ADD" | "UPDATE" | "REMOVE";
  videos: VideoInput[];
}

// Enum for content types - expanded with code-related types
export enum ContentType {
  DESCRIPTION = "description",
  VIDEO = "video",
  FILE = "file",
  CAPTIONS = "captions",
  LECTURE_NOTES = "lecture_notes",
  CODE = "code",             // Added for code content
  TEST_CASES = "test_cases"  // Added for code test cases
}

// Enum for resource tab types - expanded with code-related types
export enum ResourceTabType {
  DOWNLOADABLE_FILE = "downloadable",
  LIBRARY = "library",
  EXTERNAL = "external",
  SOURCE_CODE = "source-code",
  CODE_PRACTICE = "code-practice",   // Added for code practices
  VIDEO = "video",
  CAPTIONS = "captions",
  LECTURE_NOTES = "lecture-notes",
  EXTERNAL_RESOURCE = "EXTERNAL_RESOURCE"
}

// Enum for code language types
export enum CodeLanguageType {
  JAVASCRIPT = "javascript",
  TYPESCRIPT = "typescript",
  PYTHON = "python",
  JAVA = "java",
  CSHARP = "csharp",
  CPP = "cpp",
  PHP = "php",
  RUBY = "ruby",
  GO = "go",
  RUST = "rust",
  HTML = "html",
  CSS = "css",
  SQL = "sql"
}