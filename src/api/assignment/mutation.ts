import { gql } from "@apollo/client";


export const CREATE_ASSIGNMENT= gql`
    mutation CreateAssignment($sectionId: Int!, $title: String!) {
  createAssignment(sectionId: $sectionId, title: $title) {
    assignment {
      id
      title
      description
      instructions
      dueDate
      createdAt
      updatedAt
      maxPoints
      estimatedDurationMinutes
      videoUrl
      downloadableResourceUrl
      
    }
    success
  }
}

`
export const UPDATE_ASSIGNMENT_MUTATION = gql`
  mutation UpdateAssignment(
    $assignmentId: Int!
    $description: String
    $estimatedDurationMinutes: Int
    $instructions: String
    $resourceUrl: String
    $title: String
    $videoUrl: String
  ) {
    updateAssignment(
      assignmentId: $assignmentId
      description: $description
      estimatedDurationMinutes: $estimatedDurationMinutes
      instructions: $instructions
      resourceUrl: $resourceUrl
      title: $title
      videoUrl: $videoUrl
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
  mutation DeleteAssignmentQuestion(
    $assignmentQuestionId: Int!
  ){
    deleteAssignmentQuestion(
    assignmentQuestionId: $assignmentQuestionId
      
    ) {
      success
     
    }
  }
`

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

// Input variables for the mutation
export interface UpdateAssignmentVariables {
  assignmentId: number;
  description?: string;
  estimatedDurationMinutes?: number;
  instructions?: string;
  resourceUrl?: string;
  title?: string;
  videoUrl?: string;
}

// Response from the mutation
export interface UpdateAssignmentResponse {
  updateAssignment: {
    success: boolean;
    assignment: {
      id: string;
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
export interface CreateAssignmentQuestionVariables extends BaseAssignmentQuestionInput {
  assignmentId: number;
}

// Update input extends base + assignmentQuestionId
export interface UpdateAssignmentQuestionVariables extends BaseAssignmentQuestionInput {
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
export interface DeleteAssignmentQuestionResponse{
  
  deleteAssignmentQuestion:{
    success: boolean
  }
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
    assignmentQuestionSolution: CreateAssignmentQuestionVariables
  }
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