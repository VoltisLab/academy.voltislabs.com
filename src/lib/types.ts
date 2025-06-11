import { ReactNode } from "react";
import { CourseLevelEnum, DurationUnitEnum, LanguageEnum } from "./utils";

// Authentication related types
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
    errors: string[];
  };
}

export interface LoginResponse {
  isInstructor?: boolean;
  login: {
    isInstructor?: boolean;
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

// Category related types
export interface CategoryItem {
  id: string;
  label: string;
  count: number;
  checked?: boolean;
}

export interface BaseCategory {
  id: string;
  title: string;
  icon?: React.ElementType;
  isCollapsible?: boolean;
  isOpen?: boolean;
}

export interface Category extends BaseCategory {
  items?: (CategoryItem | Category)[];
}

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

// Course creation related types
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

// Content type definitions
export type ContentItemType =
  | "video"
  | "article"
  | "quiz"
  | "coding-exercise"
  | "assignment"
  | "practice"
  | "role-play"
  | "video-slide";

export type PreviewType =
  | "video"
  | "article"
  | "quiz"
  | "assignment"
  | "coding-exercise";

// FIXED: Unified resource interfaces
export interface AttachedFile {
  url: string;
  name: string;
  size?: string;
  filename?: string;
}

export interface SourceCodeFile {
  lectureId?: string;
  filename?: string;
  name?: string;
  type?: string;
}

// FIXED: Single ExternalResourceItem interface with consistent typing
export interface ExternalResourceItem {
  title: string; // FIXED: Always string, not ReactNode
  url: string;
  name: string;
  lectureId?: string;
  filename?: string;
}

// Legacy interface for backward compatibility - will be converted to ExternalResourceItem
export interface ExternalResource {
  lectureId?: string;
  title: ReactNode;
  url: string;
  name: string;
}

// FIXED: Single SelectedVideoDetails interface
export interface SelectedVideoDetails {
  id: string;
  filename: string;
  duration?: string;
  thumbnailUrl: string;
  isDownloadable: boolean;
  url?: string;
}

// Video and content interfaces
export interface VideoContent {
  uploadTab: { selectedFile: File | null };
  libraryTab: {
    searchQuery: string;
    selectedVideo: string | null;
    videos: StoredVideo[];
  };
  activeTab: string;
  selectedVideoDetails: SelectedVideoDetails | null;
}

export interface VideoSlideContent {
  video: {
    selectedFile: File | null;
  };
  presentation: {
    selectedFile: File | null;
  };
  step: number;
}

export interface ArticleContent {
  text: string;
}

export interface StoredVideo {
  id: string;
  filename: string;
  type: string;
  status: string;
  date: string;
  url?: string;
  duration?: string;
}

export interface LibraryFileWithSize extends StoredVideo {
  size?: string;
}

// Test case and question interfaces
export interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  isHidden?: boolean;
  explanation?: string;
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

export interface AssignmentQuestion {
  id: string;
  content: string;
  order: number;
  solution?: {
    id?: string,
    text?: string
  };

  
}

// UPDATED: Base Lecture interface
export interface Lecture {
  id: string;
  name?: string;
  title?: string;
  description?: string;
  captions?: string;
  lectureNotes?: string;
  attachedFiles: AttachedFile[];
  videos: Video[];
  contentType?: ContentItemType;
  isExpanded?: boolean;
  questions?: Question[];
  isCompleted?: boolean;
  hasResources?: boolean;
  duration?: string;
  language?: string;
  version?: string;

  // Code editor related fields
  code?: string;
  codeLanguage?: string;
  externalResources?: ExternalResource[];
  testCases?: TestCase[];
  expectedOutput?: string;
  initialCode?: string;
  solutionCode?: string;

  // Assignment related fields
  dueDate?: string;
  pointsValue?: number;
  assignmentTitle?: string;
  assignmentDescription?: string;
  estimatedDuration?: number;
  durationUnit?: "minutes" | "hours" | "days";
  assignmentInstructions?: string;
  instructionalVideo?: {
    file: File | null;
    url?: string;
  };
  downloadableResource?: {
    file: File | null;
    url?: string;
    name?: string;
  };
  assignmentQuestions?: AssignmentQuestion[];
  solutionVideo?: {
    file: File | null;
    url?: string;
  };
  isPublished?: boolean;
}

// FIXED: Enhanced Lecture interface with proper resource structure
export interface EnhancedLecture extends Lecture {
  // Content type detection properties
  actualContentType?:
    | "video"
    | "article"
    | "quiz"
    | "assignment"
    | "coding-exercise";
  hasVideoContent?: boolean;
  hasArticleContent?: boolean;

  // Enhanced content storage
  articleContent?: ArticleContent;
  videoDetails?: SelectedVideoDetails;

  // Content metadata
  contentMetadata?: {
    createdAt: Date;
    lastModified: Date;
    contentSize?: number;
    videoDuration?: string;
    articleWordCount?: number;
  };

  // FIXED: Added lectureResources property with proper typing
  lectureResources?: {
    uploadedFiles: Array<{ name: string; size: string; lectureId: string }>;
    sourceCodeFiles: SourceCodeFile[];
    externalResources: ExternalResourceItem[]; // FIXED: Use ExternalResourceItem, not ExternalResource
  };
}

export interface ExtendedLecture extends Lecture {
  assignmentTitle?: string;
  assignmentDescription?: string;
  estimatedDuration?: number;
  durationUnit?: "minutes" | "hours" | "days";
  assignmentInstructions?: string;
  instructionalVideo?: {
    file: File | null;
    url?: string;
  };
  instructionalResource?: {
    file: File | null;
    url?: string;
    name?: string;
  };
  solutionResource?: {
    file: File | null;
    url?: string;
    name?: string;
  };
  assignmentQuestions?: AssignmentQuestion[];
  solutionVideo?: {
    file: File | null;
    url?: string;
  };
  isPublished?: boolean;
}

// ENHANCED: Content Type Detector utility class
export class ContentTypeDetector {
  static detectLectureContentType(
    lecture: EnhancedLecture
  ):
    | "video"
    | "article"
    | "quiz"
    | "assignment"
    | "coding-exercise"
    | "unknown" {
    // Priority 1: Check for explicit actualContentType
    if (lecture.actualContentType) {
      return lecture.actualContentType;
    }

    // Priority 2: Check for non-video/article content types first
    if (lecture.contentType === "quiz") {
      return "quiz";
    }

    if (lecture.contentType === "assignment") {
      return "assignment";
    }

    if (lecture.contentType === "coding-exercise") {
      return "coding-exercise";
    }

    // Priority 3: Check for content presence flags
    if (lecture.hasVideoContent && lecture.videoDetails) {
      return "video";
    }

    if (lecture.hasArticleContent && lecture.articleContent?.text) {
      return "article";
    }

    // Priority 4: Check stored content directly
    if (
      lecture.videoDetails?.url ||
      (lecture.videos && lecture.videos.length > 0)
    ) {
      return "video";
    }

    if (
      lecture.articleContent?.text &&
      lecture.articleContent.text.trim() !== ""
    ) {
      return "article";
    }

    // Priority 5: Check legacy contentType
    if (lecture.contentType === "article") {
      return "article";
    }

    if (lecture.contentType === "video" || !lecture.contentType) {
      return "video"; // Default fallback
    }

    return "unknown";
  }

  static updateLectureContentType(
    lecture: EnhancedLecture,
    contentType:
      | "video"
      | "article"
      | "quiz"
      | "assignment"
      | "coding-exercise",
    contentData?: any
  ): EnhancedLecture {
    const now = new Date();

    return {
      ...lecture,
      actualContentType: contentType,
      contentType: contentType,
      hasVideoContent: contentType === "video",
      hasArticleContent: contentType === "article",
      ...(contentType === "video" &&
        contentData && {
          videoDetails: contentData,
          articleContent: undefined, // Clear article content when setting video
        }),
      ...(contentType === "article" &&
        contentData && {
          articleContent: contentData,
          videoDetails: undefined, // Clear video content when setting article
        }),
      contentMetadata: {
        ...lecture.contentMetadata,
        lastModified: now,
        createdAt: lecture.contentMetadata?.createdAt || now,
        ...(contentType === "article" &&
          contentData?.text && {
            articleWordCount: contentData.text.split(/\s+/).length,
          }),
        ...(contentType === "video" &&
          contentData?.duration && {
            videoDuration: contentData.duration,
          }),
      },
    };
  }

  // Helper method to create enhanced lecture from regular lecture
  static createEnhancedLecture(
    lecture: Lecture,
    videoContent?: VideoContent,
    articleContent?: ArticleContent
  ): EnhancedLecture {
    const hasVideoContent = !!videoContent?.selectedVideoDetails;
    const hasArticleContent = !!(
      articleContent?.text && articleContent.text.trim() !== ""
    );

    let actualContentType:
      | "video"
      | "article"
      | "quiz"
      | "assignment"
      | "coding-exercise" = "video";

    // Determine actual content type based on available content
    if (lecture.contentType === "quiz") {
      actualContentType = "quiz";
    } else if (lecture.contentType === "assignment") {
      actualContentType = "assignment";
    } else if (lecture.contentType === "coding-exercise") {
      actualContentType = "coding-exercise";
    } else if (hasArticleContent && !hasVideoContent) {
      actualContentType = "article";
    } else if (hasVideoContent) {
      actualContentType = "video";
    } else if (lecture.contentType === "article") {
      actualContentType = "article";
    }

    const enhancedLecture: EnhancedLecture = {
      ...lecture,
      actualContentType,
      hasVideoContent,
      hasArticleContent,
      articleContent: hasArticleContent ? articleContent : undefined,
      videoDetails: hasVideoContent
        ? videoContent?.selectedVideoDetails || undefined
        : undefined,
      contentMetadata: {
        createdAt: new Date(),
        lastModified: new Date(),
        ...(articleContent?.text && {
          articleWordCount: articleContent.text.split(/\s+/).length,
        }),
        ...(videoContent?.selectedVideoDetails?.duration && {
          videoDuration: videoContent.selectedVideoDetails.duration,
        }),
      },
    };

    return enhancedLecture;
  }

  // FIXED: Helper function to convert ExternalResource to ExternalResourceItem
  static convertExternalResource(
    resource: ExternalResource
  ): ExternalResourceItem {
    return {
      title:
        typeof resource.title === "string" ? resource.title : resource.name,
      url: resource.url,
      name: resource.name,
      lectureId: resource.lectureId,
    };
  }
}

// Section and preview interfaces
export interface Section {
  name: string;
  lectures: Lecture[];
  editing: boolean;
  lectureEditing: boolean[];
  isExpanded?: boolean;
  id: string;
}

export interface PreviewSection {
  id: string;
  name: string;
  lectures: Lecture[];
  quizzes: PreviewQuiz[];
  assignments: PreviewAssignment[];
  codingExercises: PreviewCodingExercise[];
  isExpanded: boolean;
}

export interface PreviewQuiz {
  id: string;
  name: string;
  description?: string;
  questions?: Question[];
  duration?: string;
  contentType: "quiz";
}

export interface PreviewAssignment {
  id: string;
  name: string;
  description?: string;
  duration?: string;
  contentType: "assignment";
  estimatedDuration?: number;
  durationUnit?: "minutes" | "hours" | "days";
}

export interface PreviewCodingExercise {
  id: string;
  name: string;
  description?: string;
  duration?: string;
  contentType: "coding-exercise";
  language?: string;
  version?: string;
}

export interface SectionItem {
  id: string;
  name: string;
  type: PreviewType;
  duration: string;
  hasResources: boolean;
  isCompleted: boolean;
  description?: string;
}

// Resource and modal interfaces
export interface ResourcesData {
  downloadableFiles: AttachedFile[];
  sourceCodeFiles: SourceCodeFile[];
  externalResources: ExternalResourceItem[];
}

export interface ResourceWithLecture {
  lectureId: string;
  name: string;
  size?: string;
  type?: string;
  url?: string;
  title?: string;
  filename?: string;
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
  code?: boolean;
}

export interface ContentDropdownState {
  section: number;
  lecture: number;
}

// API related interfaces
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
    code?: string;
    codeLanguage?: string;
  }[];
}

export interface UpdateCourseResult {
  updateCourse: {
    success: boolean;
    message: string;
  };
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
  updateCourse: {
    success: boolean;
    message: string;
  };
}

export interface Video {
  url: string;
  name: string;
}

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
  code?: string;
  codeLanguage?: string;
  testCases?: TestCase[];
}

export interface VideoUrlsInput {
  action: "ADD" | "UPDATE" | "REMOVE";
  videos: VideoInput[];
}

export interface FileOperation {
  attachedFile: AttachedFile[];
  action: "ADD" | "REMOVE";
}

export interface VideoOperation {
  videos: Video[];
  action: "ADD" | "REMOVE";
}

// Component prop interfaces
export interface CourseSectionsBuilderProps {
  onSaveNext?: () => void;
  courseId: number;
}

export interface CourseSectionBuilderProps {
  onSaveNext?: () => void;
  courseId: number | undefined;
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

export interface CodeEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  sectionId: string;
  lectureId: string;
  initialCode?: string;
  language?: string;
  title?: string;
  instructions?: string;
  onSaveCode?: (
    sectionId: string,
    lectureId: string,
    code: string,
    language: string
  ) => void;
}

export type ContentButtonProps = {
  section: Section;
  lecture: Lecture;
  onContentTypeSelect: (type: ContentItemType) => void;
};

// UPDATED: LectureItemProps with enhanced functionality
export interface LectureItemProps {
  lecture: Lecture;
  lectureIndex: number;
  totalLectures: number;
  sectionId: string;
  editingLectureId: string | null;
  setEditingLectureId: (id: string | null) => void;
  updateLectureName: (
    sectionId: string,
    lectureId: string,
    newName: string
  ) => void;
  deleteLecture: (sectionId: string, lectureId: string) => void;
  moveLecture: (
    sectionId: string,
    lectureId: string,
    direction: "up" | "down"
  ) => void;
  updateLectureContent?: (
    sectionId: string,
    lectureId: string,
    updatedLecture: EnhancedLecture
  ) => void;
  toggleContentSection?: (sectionId: string, lectureId: string) => void;
  toggleAddResourceModal?: (sectionId: string, lectureId: string) => void;
  toggleDescriptionEditor?: (
    sectionId: string,
    lectureId: string,
    currentText: string
  ) => void;
  activeContentSection?: { sectionId: string; lectureId: string } | null;
  activeResourceSection?: { sectionId: string; lectureId: string } | null;
  activeDescriptionSection?: { sectionId: string; lectureId: string } | null;
  isDragging: boolean;
  handleDragStart: (
    e: React.DragEvent,
    sectionId: string,
    lectureId?: string
  ) => void;
  handleDragOver: (e: React.DragEvent) => void;
  handleDrop: (
    e: React.DragEvent,
    targetSectionId: string,
    targetLectureId?: string
  ) => void;
  handleDragEnd?: () => void;
  handleDragLeave?: () => void;
  draggedLecture?: string | null;
  dragTarget?: { sectionId: string | null; lectureId: string | null };
  sections?: any[];
  updateCurrentDescription?: (description: string) => void;
  saveDescription?: () => void;
  currentDescription?: string;
  children?: React.ReactNode;
  onEditAssignment?: (lecture: ExtendedLecture) => void;
  allSections: PreviewSection[];
  globalUploadedFiles?: Array<{
    name: string;
    size: string;
    lectureId: string;
  }>;
  globalSourceCodeFiles?: SourceCodeFile[];
  globalExternalResources?: ExternalResourceItem[];
  addUploadedFile?: (file: {
    name: string;
    size: string;
    lectureId: string;
  }) => void;
  removeUploadedFile?: (fileName: string, lectureId: string) => void;
  addSourceCodeFile?: (file: SourceCodeFile) => void;
  removeSourceCodeFile?: (fileName: string | undefined, lectureId: string) => void;
  addExternalResource?: (resource: ExternalResourceItem) => void;
  removeExternalResource?: (title: string, lectureId: string) => void;
}

// Tab interfaces
export interface TabInterface {
  label: string;
  key: string;
}

// Enums
export enum ContentType {
  DESCRIPTION = "description",
  VIDEO = "video",
  FILE = "file",
  CAPTIONS = "captions",
  LECTURE_NOTES = "lecture_notes",
  CODE = "code",
  TEST_CASES = "test_cases",
}

export enum ResourceTabType {
  DOWNLOADABLE_FILE = "downloadable",
  LIBRARY = "library",
  EXTERNAL = "external",
  SOURCE_CODE = "source-code",
  CODE_PRACTICE = "code-practice",
  VIDEO = "video",
  CAPTIONS = "captions",
  LECTURE_NOTES = "lecture-notes",
  EXTERNAL_RESOURCE = "EXTERNAL_RESOURCE",
}

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
  SQL = "sql",
}

// Language type
export type Language = {
  id: string;
  name: string;
  deprecated?: boolean;
  hasVersions?: boolean;
  versions?: string[];
  additionalInfo?: string;
  isNew?: boolean;
};

export interface CodingExercisePreviewData {
  exercise: {
    id: string;
    title: string;
    language: string;
    version: string;
    learningObjective: string;
    contentType: "coding-exercise";
  };
  content: {
    instructions: string;
    hints: string;
    solutionExplanation: string;
    files: {
      id: string;
      name: string;
      content: string;
      language: string;
      isTestFile: boolean;
    }[];
    solutionCode: string;
    testCode: string;
  };
  testResults: {
    success: boolean;
    message: string;
    results: {
      name: string;
      passed: boolean;
      error?: string;
    }[];
  } | null;
}


export type VideoNote = {
  id: string;
  timestamp: number;
  formattedTime: string;
  content: string;
  lectureId: string;
  lectureName?: string;
  sectionName: string;
  createdAt: Date;
};
