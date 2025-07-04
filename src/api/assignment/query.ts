import { gql } from "@apollo/client";

export const GET_ASSIGNMENT = gql`
  query GetAssignment($id: Int!) {
    getAssignment(id: $id) {
      id
      title
      description
      instructions
      dueDate
      createdAt
      estimatedDurationMinutes
      maxPoints
      instructionDownloadableResource
      instructionVideo
      solutionDownloadableResource
      solutionVideo
      questions {
        id
        order
        questionType
        text
        maxPoints
        required
        solution
        allowMultipleCorrect
        questionSolutions {
          id
          text
        }
      }
    }
  }
`;

export interface GetAssignmentVariables {
  id: number;
}

export interface GetAssignmentQuery {
  getAssignment: {
    id: number;
    title: string;
    description: string;
    instructions: string;
    dueDate: string;
    createdAt: string;
    estimatedDurationMinutes: number;
    maxPoints: number;
    instructionDownloadableResource: string | null;
    instructionVideo: string | null;
    solutionDownloadableResource: string | null;
    solutionVideo: string | null;
    questions: {
      id: number;
      order: number;
      questionType: string;
      text: string;
      maxPoints: number;
      required: boolean;
      solution: string | null;
      questionSolutions: {
        id: string;
        text: string;
      };
      allowMultipleCorrect: boolean;
    }[];
  };
}

export interface QuestionSolution {
  id: string;
  text: string;
  videoUrl: string | null;
  downloadableResourceUrl: string | null;
}

export interface NestedAssignmentQuestion {
  id: string;
  text: string;
  solution: string;
  maxPoints: number;
  allowMultipleCorrect: boolean;
  order: number;
  questionType: string;
  required: boolean;
}

export interface NestedAssignment {
  id: string;
  title: string;
  description: string;
  instructions: string;
  dueDate: string | null;
  videoUrl: string | null;
  maxPoints: number;
  estimatedDurationMinutes: number;
  downloadableResourceUrl: string | null;
  questions: NestedAssignmentQuestion[];
}

export interface AssignmentQuestion {
  id: string;
  text: string;
  solution: string;
  maxPoints: number;
  allowMultipleCorrect: boolean;
  order: number;
  questionType: string;
  required: boolean;
  assignment: NestedAssignment;
  questionSolutions: QuestionSolution[];
}

export interface GetAssignmentData {
  getAssignment: {
    id: string;
    title: string;
    description: string;
    instructions: string;
    dueDate: string | null;
    createdAt: string;
    videoUrl: string | null;
    maxPoints: number;
    estimatedDurationMinutes: number;
    downloadableResourceUrl: string | null;
    questions: AssignmentQuestion[];
    questionSolutions: {
      downloadableResourceUrl: string;
      id: string;
      text: string;
      videoUrl: string;
    };
  };
}
