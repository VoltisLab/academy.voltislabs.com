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
