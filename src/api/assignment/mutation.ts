import { gql } from "@apollo/client";

export const CREATE_ASSIGNMENT = gql`
  mutation CreateAssignment($sectionId: Int!, $title: String!) {
    createAssignment(sectionId: $sectionId, title: $title) {
      assignment {
        id
        title
      }
      success
    }
  }
`;
export const UPDATE_ASSIGNMENT_MUTATION = gql`
  mutation UpdateAssignment(
    $assignmentId: Int!
    $title: String
    $description: String
    $estimatedDurationMinutes: Int
    $instructions: String
    $instructionDownloadableResource: MediaInputType
    $instructionVideo: MediaInputType
    $solutionDownloadableResource: MediaInputType
    $solutionVideo: MediaInputType
  ) {
    updateAssignment(
      assignmentId: $assignmentId
      title: $title
      description: $description
      estimatedDurationMinutes: $estimatedDurationMinutes
      instructions: $instructions
      instructionDownloadableResource: $instructionDownloadableResource
      instructionVideo: $instructionVideo
      solutionDownloadableResource: $solutionDownloadableResource
      solutionVideo: $solutionVideo
    ) {
      success
      assignment {
        id
        title
        description
      }
    }
  }
`;

export const DELETE_ASSIGNMENT = gql`
  mutation DeleteAssignment($assignmentId: Int!) {
    deleteAssignment(assignmentId: $assignmentId) {
      success
    }
  }
`;

export const CREATE_ASSIGNMENT_QUESTION = gql`
  mutation CreateAssignmentQuestion(
    $assignmentId: Int!
    $maxPoints: Int
    $order: Int
    $required: Boolean
    $text: String!
  ) {
    createAssignmentQuestion(
      assignmentId: $assignmentId
      maxPoints: $maxPoints
      order: $order
      required: $required
      text: $text
    ) {
      success
      assignmentQuestion {
        id
        text
        maxPoints
        order
        required
      }
    }
  }
`;

export const UPDATE_ASSIGNMENT_QUESTION = gql`
  mutation UpdateAssignmentQuestion(
    $assignmentQuestionId: Int!
    $maxPoints: Int
    $order: Int
    $required: Boolean
    $text: String!
  ) {
    updateAssignmentQuestion(
      assignmentQuestionId: $assignmentQuestionId
      maxPoints: $maxPoints
      order: $order
      required: $required
      text: $text
    ) {
      success
      assignmentQuestion {
        id
        text
        maxPoints
        order
        required
      }
    }
  }
`;

export const DELETE_ASSIGNMENT_QUESTION = gql`
  mutation DeleteAssignmentQuestion($assignmentQuestionId: Int!) {
    deleteAssignmentQuestion(assignmentQuestionId: $assignmentQuestionId) {
      success
    }
  }
`;

export const CREATE_ASSIGNMENT_QUESTION_SOLUTION = gql`
  mutation CreateAssignmentQuestionSolution(
    $assignmentQuestionId: Int!
    $downloadableResourceUrl: String
    $text: String
    $videoUrl: String
  ) {
    createAssignmentQuestionSolution(
      assignmentQuestionId: $assignmentQuestionId
      downloadableResourceUrl: $downloadableResourceUrl
      text: $text
      videoUrl: $videoUrl
    ) {
      success
      assignmentQuestionSolution {
        id
        downloadableResourceUrl
        text
        videoUrl
      }
    }
  }
`;

export const UPDATE_ASSIGNMENT_QUESTION_SOLUTION = gql`
  mutation UpdateAssignmentQuestionSolution(
    $questionSolutionId: Int!
    $downloadableResourceUrl: String
    $text: String
    $videoUrl: String
  ) {
    updateAssignmentQuestionSolution(
      questionSolutionId: $questionSolutionId
      downloadableResourceUrl: $downloadableResourceUrl
      text: $text
      videoUrl: $videoUrl
    ) {
      success
      assignmentQuestionSolution {
        id
        text
        videoUrl
        downloadableResourceUrl
      }
    }
  }
`;

export interface CreateAssignmentVariables {
  sectionId: number;
  title: string;
}

export interface Assignment {
  id: string;
  title: string;
  description?: string;
  instructions?: string;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  maxPoints?: number;
  estimatedDurationMinutes?: number;
  videoUrl?: string;
  downloadableResourceUrl?: string;
}

export interface CreateAssignmentResponse {
  createAssignment: {
    assignment: Assignment;
    success: boolean;
    message: string;
  };
}

export interface MediaInputType {
  fileName: string;
  url: string;
}

export interface UpdateAssignmentVariables {
  assignmentId: number;
  title?: string;
  description?: string;
  estimatedDurationMinutes?: number;
  instructions?: string;
  instructionDownloadableResource?: MediaInputType;
  instructionVideo?: MediaInputType;
  solutionDownloadableResource?: MediaInputType;
  solutionVideo?: MediaInputType;
}

export interface UpdateAssignmentResponse {
  updateAssignment: {
    success: boolean;
    assignment: {
      id: number;
      title: string;
      description: string;
    };
  };
}

export interface DeleteAssignmentVariables {
  assignmentId: number;
}

export interface DeleteAssignmentResponse {
  deleteAssignment: {
    success: boolean;
  };
}

// Shared structure for assignment question input
interface BaseAssignmentQuestionInput {
  maxPoints?: number;
  order?: number;
  required?: boolean;
  text: string;
}

// Create input extends base + assignmentId
export interface CreateAssignmentQuestionVariables
  extends BaseAssignmentQuestionInput {
  assignmentId: number;
}

// Update input extends base + assignmentQuestionId
export interface UpdateAssignmentQuestionVariables
  extends BaseAssignmentQuestionInput {
  assignmentQuestionId: number;
}

// Response assignment question shape
interface AssignmentQuestion {
  id: string;
  text: string;
  maxPoints?: number;
  order: number;
  required?: boolean;
}

// Shared mutation response structure
export interface CreateAssignmentQuestionResponse {
  createAssignmentQuestion: {
    success: boolean;
    assignmentQuestion: AssignmentQuestion;
  };
}

export interface UpdateAssignmentQuestionResponse {
  updateAssignmentQuestion: {
    success: boolean;
    assignmentQuestion: AssignmentQuestion;
  };
}

export interface DeleteAssignmentQuestionVariables {
  assignmentQuestionId: number;
}
export interface DeleteAssignmentQuestionResponse {
  deleteAssignmentQuestion: {
    success: boolean;
  };
}

export interface CreateAssignmentQuestionSolutionVariables {
  assignmentQuestionId: number;
  downloadableResourceUrl?: string;
  text?: string;
  videoUrl?: string;
}

export interface CreateAssignmentQuestionSolutionResponse {
  createAssignmentQuestionSolution: {
    success: true;
    assignmentQuestionSolution: CreateAssignmentQuestionVariables;
  };
}

export interface UpdateAssignmentQuestionSolutionVariables {
  questionSolutionId: number;
  downloadableResourceUrl?: string;
  text?: string;
  videoUrl?: string;
}

export interface AssignmentQuestionSolution {
  id: number;
  text: string;
  videoUrl: string;
  downloadableResourceUrl: string;
}

export interface UpdateAssignmentQuestionSolutionResponse {
  updateAssignmentQuestionSolution: {
    success: boolean;
    assignmentQuestionSolution: AssignmentQuestionSolution;
  };
}
