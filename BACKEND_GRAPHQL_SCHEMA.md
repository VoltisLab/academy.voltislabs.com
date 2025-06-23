# Backend GraphQL Schema for Course Creation Persistence

This file contains only the GraphQL queries and mutations that DON'T exist yet in your backend and need to be implemented for the course creation persistence system.

## Analysis of Existing Endpoints

Based on the existing codebase, these endpoints already exist:
- ✅ `createCourse` mutation
- ✅ `updateCourse` mutation  
- ✅ `updateCourseInfo` mutation (for sections)
- ✅ `courseSections` query
- ✅ `categories` query
- ✅ `instructorCourses` query (referenced in context)
- ✅ `course(id:)` query (referenced in context)

## Required Schema Extensions (NEW - Need Implementation)

### Input Types

```graphql
input BasicInfoInput {
  title: String!
  subtitle: String
  categoryId: String!
  subCategoryId: String!
  topic: String!
  language: String!
  subtitleLanguage: String!
  courseLevel: String!
  durationValue: String!
  durationUnit: String!
  description: String
}

input AdvancedInfoInput {
  courseThumbnail: String
  secondaryThumbnail: String
  courseDescription: String
  teachingPoints: [String!]
  targetAudience: [String!]
  courseRequirements: [String!]
}

input CurriculumInput {
  sections: [CourseSectionInput!]
}

input CourseSectionInput {
  id: String
  title: String!
  order: Int!
  lectures: [LectureInput!]
  quizzes: [QuizInput!]
  assignments: [AssignmentInput!]
  codingExercises: [CodingExerciseInput!]
}

input LectureInput {
  id: String
  title: String!
  description: String
  videoUrl: String
  notes: String
  duration: String
  resources: [ResourceInput!]
}

input QuizInput {
  id: String
  title: String!
  description: String
  allowMultipleAttempts: Boolean
  maxAttempts: Int
  passingScorePercent: Int
  timeLimitMinutes: Int
  questions: [QuestionInput!]
}

input AssignmentInput {
  id: String
  title: String!
  description: String
  instructions: String
  dueDate: String
  points: Int
}

input CodingExerciseInput {
  id: String
  title: String!
  description: String
  instructions: String
  testCases: [TestCaseInput!]
  solution: String
}

input QuestionInput {
  id: String
  text: String!
  answerChoices: [AnswerChoiceInput!]
}

input AnswerChoiceInput {
  id: String
  text: String!
  isCorrect: Boolean!
}

input TestCaseInput {
  id: String
  input: String!
  expectedOutput: String!
  isHidden: Boolean
  explanation: String
}

input ResourceInput {
  id: String
  type: String!
  url: String!
  title: String!
}
```

### Types

```graphql
type CourseCreationProgress {
  courseId: Int!
  currentStep: String!
  completedSteps: [String!]!
  basicInfo: BasicInfo
  advancedInfo: AdvancedInfo
  curriculum: Curriculum
  createdAt: String!
  updatedAt: String!
}

type BasicInfo {
  title: String!
  subtitle: String
  categoryId: String!
  subCategoryId: String!
  topic: String!
  language: String!
  subtitleLanguage: String!
  courseLevel: String!
  durationValue: String!
  durationUnit: String!
  description: String
}

type AdvancedInfo {
  courseThumbnail: String
  secondaryThumbnail: String
  courseDescription: String
  teachingPoints: [String!]
  targetAudience: [String!]
  courseRequirements: [String!]
}

type Curriculum {
  sections: [CourseSection!]
}

type CourseSection {
  id: String!
  title: String!
  order: Int!
  lectures: [Lecture!]
  quizzes: [Quiz!]
  assignments: [Assignment!]
  codingExercises: [CodingExercise!]
}

type Lecture {
  id: String!
  title: String!
  description: String
  videoUrl: String
  notes: String
  duration: String
  resources: [Resource!]
}

type Quiz {
  id: String!
  title: String!
  description: String
  allowMultipleAttempts: Boolean
  maxAttempts: Int
  passingScorePercent: Int
  timeLimitMinutes: Int
  questions: [Question!]
}

type Assignment {
  id: String!
  title: String!
  description: String
  instructions: String
  dueDate: String
  points: Int
}

type CodingExercise {
  id: String!
  title: String!
  description: String
  instructions: String
  testCases: [TestCase!]
  solution: String
}

type Question {
  id: String!
  text: String!
  answerChoices: [AnswerChoice!]
}

type AnswerChoice {
  id: String!
  text: String!
  isCorrect: Boolean!
}

type TestCase {
  id: String!
  input: String!
  expectedOutput: String!
  isHidden: Boolean
  explanation: String
}

type Resource {
  id: String!
  type: String!
  url: String!
  title: String!
}

type AutoSaveResponse {
  success: Boolean!
  message: String!
  progress: CourseCreationProgress
}

type UpdateStepResponse {
  success: Boolean!
  message: String!
  currentStep: String!
  completedSteps: [String!]!
}

type PublishCourseResponse {
  success: Boolean!
  message: String!
  course: Course
}
```

## Required Queries (NEW - Need Implementation)

```graphql
# Get course creation progress for a specific course
query GetCourseCreationProgress($courseId: Int!) {
  courseCreationProgress(courseId: $courseId) {
    courseId
    currentStep
    completedSteps
    basicInfo {
      title
      subtitle
      categoryId
      subCategoryId
      topic
      language
      subtitleLanguage
      courseLevel
      durationValue
      durationUnit
      description
    }
    advancedInfo {
      courseThumbnail
      secondaryThumbnail
      courseDescription
      teachingPoints
      targetAudience
      courseRequirements
    }
    curriculum {
      sections {
        id
        title
        order
        lectures {
          id
          title
          description
          videoUrl
          notes
          duration
          resources {
            id
            type
            url
            title
          }
        }
        quizzes {
          id
          title
          description
          allowMultipleAttempts
          maxAttempts
          passingScorePercent
          timeLimitMinutes
          questions {
            id
            text
            answerChoices {
              id
              text
              isCorrect
            }
          }
        }
        assignments {
          id
          title
          description
          instructions
          dueDate
          points
        }
        codingExercises {
          id
          title
          description
          instructions
          testCases {
            id
            input
            expectedOutput
            isHidden
            explanation
          }
          solution
        }
      }
    }
    createdAt
    updatedAt
  }
}
```

## Required Mutations (NEW - Need Implementation)

```graphql
# Auto-save course creation progress
mutation AutoSaveCourseProgress(
  $courseId: Int!
  $currentStep: String!
  $completedSteps: [String!]!
  $basicInfo: BasicInfoInput
  $advancedInfo: AdvancedInfoInput
  $curriculum: CurriculumInput
) {
  autoSaveCourseProgress(
    courseId: $courseId
    currentStep: $currentStep
    completedSteps: $completedSteps
    basicInfo: $basicInfo
    advancedInfo: $advancedInfo
    curriculum: $curriculum
  ) {
    success
    message
    progress {
      courseId
      currentStep
      completedSteps
      basicInfo {
        title
        subtitle
        categoryId
        subCategoryId
        topic
        language
        subtitleLanguage
        courseLevel
        durationValue
        durationUnit
        description
      }
      advancedInfo {
        courseThumbnail
        secondaryThumbnail
        courseDescription
        teachingPoints
        targetAudience
        courseRequirements
      }
      curriculum {
        sections {
          id
          title
          order
          lectures {
            id
            title
            description
            videoUrl
            notes
            duration
            resources {
              id
              type
              url
              title
            }
          }
          quizzes {
            id
            title
            description
            allowMultipleAttempts
            maxAttempts
            passingScorePercent
            timeLimitMinutes
            questions {
              id
              text
              answerChoices {
                id
                text
                isCorrect
              }
            }
          }
          assignments {
            id
            title
            description
            instructions
            dueDate
            points
          }
          codingExercises {
            id
            title
            description
            instructions
            testCases {
              id
              input
              expectedOutput
              isHidden
              explanation
            }
            solution
          }
        }
      }
      createdAt
      updatedAt
    }
  }
}

# Update course creation step
mutation UpdateCourseCreationStep(
  $courseId: Int!
  $currentStep: String!
  $completedSteps: [String!]!
) {
  updateCourseCreationStep(
    courseId: $courseId
    currentStep: $currentStep
    completedSteps: $completedSteps
  ) {
    success
    message
    currentStep
    completedSteps
  }
}

# Publish course
mutation PublishCourse($courseId: Int!) {
  publishCourse(courseId: $courseId) {
    success
    message
    course {
      id
      title
      subtitle
      topic
      status
      publishedAt
      category {
        id
        name
      }
      subCategory {
        id
        name
      }
    }
  }
}

# Delete draft course
mutation DeleteDraftCourse($courseId: Int!) {
  deleteDraftCourse(courseId: $courseId) {
    success
    message
  }
}

# Reset course creation progress
mutation ResetCourseCreationProgress($courseId: Int!) {
  resetCourseCreationProgress(courseId: $courseId) {
    success
    message
    progress {
      courseId
      currentStep
      completedSteps
    }
  }
}
```

## Database Schema Requirements (NEW)

You'll need to create this new table in your database:

```sql
CREATE TABLE course_creation_progress (
  id SERIAL PRIMARY KEY,
  course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  current_step VARCHAR(50) NOT NULL DEFAULT 'basic',
  completed_steps JSONB DEFAULT '[]',
  basic_info JSONB,
  advanced_info JSONB,
  curriculum JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add indexes for performance
CREATE INDEX idx_course_creation_progress_course_id ON course_creation_progress(course_id);
CREATE INDEX idx_course_creation_progress_current_step ON course_creation_progress(current_step);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_course_creation_progress_updated_at 
    BEFORE UPDATE ON course_creation_progress 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## Update Existing Courses Table

Add these columns to your existing `courses` table:

```sql
ALTER TABLE courses 
ADD COLUMN current_step VARCHAR(50) DEFAULT 'basic',
ADD COLUMN completed_steps JSONB DEFAULT '[]',
ADD COLUMN published_at TIMESTAMP;
```

## Implementation Priority

### High Priority (Core Persistence)
1. `courseCreationProgress` query
2. `autoSaveCourseProgress` mutation
3. `updateCourseCreationStep` mutation

### Medium Priority (Course Management)
4. `publishCourse` mutation
5. `deleteDraftCourse` mutation

### Low Priority (Advanced Features)
6. `resetCourseCreationProgress` mutation

## Notes

- The existing `instructorCourses` query should be updated to include `currentStep` and `completedSteps` fields
- The existing `course(id:)` query should be updated to include `publishedAt` field
- All new mutations should include proper authentication and authorization
- Consider adding rate limiting for the `autoSaveCourseProgress` mutation 