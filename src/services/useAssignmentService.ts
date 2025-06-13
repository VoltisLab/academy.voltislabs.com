// services/useAssignmentService.ts
import { useState } from 'react';
import { ApolloError } from '@apollo/client';
import { apolloClient } from '@/lib/apollo-client';
import { toast } from 'react-hot-toast';
import { 
  CREATE_ASSIGNMENT, 
  UPDATE_ASSIGNMENT_MUTATION,
  CreateAssignmentVariables,
  CreateAssignmentResponse, 
  UpdateAssignmentVariables,
  UpdateAssignmentResponse,
  DELETE_ASSIGNMENT,
  DeleteAssignmentResponse,
  DeleteAssignmentVariables,
  CREATE_ASSIGNMENT_QUESTION,
  CreateAssignmentQuestionResponse,
  CreateAssignmentQuestionVariables,
  UpdateAssignmentQuestionVariables,
  UpdateAssignmentQuestionResponse,
  UPDATE_ASSIGNMENT_QUESTION,
  DELETE_ASSIGNMENT_QUESTION,
  DeleteAssignmentQuestionVariables,
  DeleteAssignmentQuestionResponse,
  CreateAssignmentQuestionSolutionVariables,
  CreateAssignmentQuestionSolutionResponse,
  CREATE_ASSIGNMENT_QUESTION_SOLUTION,
  UpdateAssignmentQuestionSolutionVariables,
  UpdateAssignmentQuestionSolutionResponse,
  UPDATE_ASSIGNMENT_QUESTION_SOLUTION
} from '@/api/assignment/mutation';
import { GET_ASSIGNMENT, GetAssignmentData, GetAssignmentVariables } from '@/api/assignment/query';

export const useAssignmentService = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

//creating an assignment
  const createAssignment = async (variables: CreateAssignmentVariables) => {
    try {
      setLoading(true);
      setError(null);

      const { data, errors } = await apolloClient.mutate<CreateAssignmentResponse>({
        mutation: CREATE_ASSIGNMENT,
        variables,
        context: {
          includeAuth: true
        },
        fetchPolicy: 'no-cache'
      });



      if (errors) {
        console.error("GraphQL errors:", errors);
        throw new Error(errors[0]?.message || "An error occurred during assignment creation");
      }

      if (!data?.createAssignment.success) {
        throw new Error(data?.createAssignment.message || "Failed to create assignment");
      }

      toast.success("Assignment created successfully!");
      return data;
    } catch (err) {
      console.error("Assignment creation error:", err);

      if (err instanceof ApolloError) {
        const errorMessage = err.message || "Network error. Please check your connection and try again.";
        setError(new Error(errorMessage));
        toast.error(errorMessage);
      } else if (err instanceof Error) {
        setError(err);
        toast.error(err.message);
      } else {
        const genericError = new Error("An unexpected error occurred");
        setError(genericError);
        toast.error(genericError.message);
      }

      throw err;
    } finally {
      setLoading(false);
    }
  };

//updating an assignment
  const updateAssignment = async (variables: UpdateAssignmentVariables) => {
    try {
      setLoading(true);
      setError(null);

      const { data, errors } = await apolloClient.mutate<UpdateAssignmentResponse>({
        mutation: UPDATE_ASSIGNMENT_MUTATION,
        variables,
        context: {
          includeAuth: true
        },
        fetchPolicy: 'no-cache'
      });

      if (errors) {
        console.error("GraphQL errors:", errors);
        throw new Error(errors[0]?.message || "An error occurred during assignment update");
      }

      if (!data?.updateAssignment.success) {
        throw new Error("Failed to update assignment");
      }

      toast.success("Assignment updated successfully!");
      return data;
    } catch (err) {
      console.error("Assignment update error:", err);

      if (err instanceof ApolloError) {
        const errorMessage = err.message || "Network error. Please check your connection and try again.";
        setError(new Error(errorMessage));
        toast.error(errorMessage);
      } else if (err instanceof Error) {
        setError(err);
        toast.error(err.message);
      } else {
        const genericError = new Error("An unexpected error occurred");
        setError(genericError);
        toast.error(genericError.message);
      }

      throw err;
    } finally {
      setLoading(false);
    }
  };

//deleteing an assignment
  const deleteAssignment = async (variables: DeleteAssignmentVariables) => {
  try {
    setLoading(true);
    setError(null);

    const { data, errors } = await apolloClient.mutate<DeleteAssignmentResponse>({
      mutation: DELETE_ASSIGNMENT,
      variables,
      context: {
        includeAuth: true
      },
      fetchPolicy: 'no-cache'
    });

    if (errors) {
      console.error("GraphQL errors:", errors);
      throw new Error(errors[0]?.message || "An error occurred during assignment deletion");
    }

    if (!data?.deleteAssignment.success) {
      throw new Error("Failed to delete assignment");
    }

    toast.success("Assignment deleted successfully!");
    return data;
  } catch (err) {
    console.error("Assignment deletion error:", err);

    if (err instanceof ApolloError) {
      const errorMessage = err.message || "Network error. Please check your connection and try again.";
      setError(new Error(errorMessage));
      toast.error(errorMessage);
    } else if (err instanceof Error) {
      setError(err);
      toast.error(err.message);
    } else {
      const genericError = new Error("An unexpected error occurred");
      setError(genericError);
      toast.error(genericError.message);
    }

    throw err;
  } finally {
    setLoading(false);
  }
};


//adding new question to assignment
const createAssignmentQuestion = async (variables: CreateAssignmentQuestionVariables) => {
  try {
    setLoading(true);
    setError(null);

    const { data, errors } = await apolloClient.mutate<CreateAssignmentQuestionResponse>({
      mutation: CREATE_ASSIGNMENT_QUESTION,
      variables,
      context: {
        includeAuth: true,
      },
      fetchPolicy: 'no-cache',
    });

    if (errors) {
      console.error("GraphQL errors:", errors);
      throw new Error(errors[0]?.message || "An error occurred during question creation");
    }

    if (!data?.createAssignmentQuestion.success) {
      throw new Error("Failed to create assignment question");
    }

    toast.success("Assignment question created successfully!");
    return data;
  } catch (err) {
    console.error("Question creation error:", err);

    if (err instanceof ApolloError) {
      const errorMessage = err.message || "Network error. Please check your connection and try again.";
      setError(new Error(errorMessage));
      toast.error(errorMessage);
    } else if (err instanceof Error) {
      setError(err);
      toast.error(err.message);
    } else {
      const genericError = new Error("An unexpected error occurred");
      setError(genericError);
      toast.error(genericError.message);
    }

    throw err;
  } finally {
    setLoading(false);
  }
};
//updating assignment questions
  const updateAssignmentQuestion = async (variables: UpdateAssignmentQuestionVariables) => {
  try {
    setLoading(true);
    setError(null);

    const { data, errors } = await apolloClient.mutate<UpdateAssignmentQuestionResponse>({
      mutation: UPDATE_ASSIGNMENT_QUESTION,
      variables,
      context: {
        includeAuth: true,
      },
      fetchPolicy: 'no-cache',
    });

    if (errors) {
      console.error("GraphQL errors:", errors);
      throw new Error(errors[0]?.message || "An error occurred during question update");
    }

    if (!data?.updateAssignmentQuestion.success) {
      throw new Error("Failed to update assignment question");
    }

    toast.success("Assignment question updated successfully!");
    return data;
  } catch (err) {
    console.error("Question update error:", err);

    if (err instanceof ApolloError) {
      const errorMessage = err.message || "Network error. Please check your connection and try again.";
      setError(new Error(errorMessage));
      toast.error(errorMessage);
    } else if (err instanceof Error) {
      setError(err);
      toast.error(err.message);
    } else {
      const genericError = new Error("An unexpected error occurred");
      setError(genericError);
      toast.error(genericError.message);
    }

    throw err;
  } finally {
    setLoading(false);
  }
};
//deleting assignment question
const deleteAssignmentQuestion = async (variables: DeleteAssignmentQuestionVariables) => {
  try {
    setLoading(true);
    setError(null);

    const { data, errors } = await apolloClient.mutate<DeleteAssignmentQuestionResponse>({
      mutation: DELETE_ASSIGNMENT_QUESTION,
      variables,
      context: {
        includeAuth: true,
      },
      fetchPolicy: 'no-cache',
    });

    if (errors) {
      console.error('GraphQL errors:', errors);
      throw new Error(errors[0]?.message || 'An error occurred during question deletion');
    }

    if (!data?.deleteAssignmentQuestion.success) {
      throw new Error('Failed to delete assignment question');
    }

    toast.success('Assignment question deleted successfully!');
    return data;
  } catch (err) {
    console.error('Question deletion error:', err);

    if (err instanceof ApolloError) {
      const errorMessage = err.message || 'Network error. Please check your connection and try again.';
      setError(new Error(errorMessage));
      toast.error(errorMessage);
    } else if (err instanceof Error) {
      setError(err);
      toast.error(err.message);
    } else {
      const genericError = new Error('An unexpected error occurred');
      setError(genericError);
      toast.error(genericError.message);
    }

    throw err;
  } finally {
    setLoading(false);
  }
};
//creating assignmentquestion solution
const createAssignmentQuestionSolution = async (
  variables: CreateAssignmentQuestionSolutionVariables
) => {
  try {
    setLoading(true);
    setError(null);

    const { data, errors } = await apolloClient.mutate<CreateAssignmentQuestionSolutionResponse>({
      mutation: CREATE_ASSIGNMENT_QUESTION_SOLUTION,
      variables,
      context: {
        includeAuth: true,
      },
      fetchPolicy: 'no-cache',
    });

    if (errors) {
      console.error('GraphQL errors:', errors);
      throw new Error(errors[0]?.message || 'An error occurred while creating the solution');
    }

    if (!data?.createAssignmentQuestionSolution.success) {
      throw new Error('Failed to create assignment question solution');
    }

    toast.success('Solution created successfully!');
    return data;
  } catch (err) {
    console.error('Solution creation error:', err);

    if (err instanceof ApolloError) {
      const errorMessage = err.message || 'Network error. Please check your connection and try again.';
      setError(new Error(errorMessage));
      toast.error(errorMessage);
    } else if (err instanceof Error) {
      setError(err);
      toast.error(err.message);
    } else {
      const genericError = new Error('An unexpected error occurred');
      setError(genericError);
      toast.error(genericError.message);
    }

    throw err;
  } finally {
    setLoading(false);
  }
};
//updating assignment question solution
const updateAssignmentQuestionSolution = async (
  variables: UpdateAssignmentQuestionSolutionVariables
) => {
  try {
    setLoading(true);
    setError(null);

    const { data, errors } = await apolloClient.mutate<UpdateAssignmentQuestionSolutionResponse>({
      mutation: UPDATE_ASSIGNMENT_QUESTION_SOLUTION,
      variables,
      context: {
        includeAuth: true,
      },
      fetchPolicy: 'no-cache',
    });

    if (errors) {
      console.error('GraphQL errors:', errors);
      throw new Error(errors[0]?.message || 'An error occurred while updating the solution');
    }

    if (!data?.updateAssignmentQuestionSolution.success) {
      throw new Error('Failed to update assignment question solution');
    }

    toast.success('Solution updated successfully!');
    return data;
  } catch (err) {
    console.error('Solution update error:', err);

    if (err instanceof ApolloError) {
      const errorMessage = err.message || 'Network error. Please check your connection and try again.';
      setError(new Error(errorMessage));
      toast.error(errorMessage);
    } else if (err instanceof Error) {
      setError(err);
      toast.error(err.message);
    } else {
      const genericError = new Error('An unexpected error occurred');
      setError(genericError);
      toast.error(genericError.message);
    }

    throw err;
  } finally {
    setLoading(false);
  }
};

//getting assignment by ID
const getAssignment = async (variables: GetAssignmentVariables) => {
  try {
    setLoading(true);
    setError(null);

    const { data, errors } = await apolloClient.query<GetAssignmentData, GetAssignmentVariables>({
      query: GET_ASSIGNMENT,
      variables,
      context: {
        includeAuth: true,
      },
      fetchPolicy: 'no-cache',
    });

    if (errors && errors.length > 0) {
      console.error('GraphQL errors:', errors);
      throw new Error(errors[0]?.message || 'An error occurred while fetching the assignment');
    }

    if (!data?.getAssignment) {
      throw new Error('Assignment not found');
    }

    return data.getAssignment;
  } catch (err) {
    console.error('Assignment fetch error:', err);

    if (err instanceof ApolloError) {
      const errorMessage = err.message || 'Network error. Please check your connection and try again.';
      setError(new Error(errorMessage));
      toast.error(errorMessage);
    } else if (err instanceof Error) {
      setError(err);
      toast.error(err.message);
    } else {
      const genericError = new Error('An unexpected error occurred');
      setError(genericError);
      toast.error(genericError.message);
    }

    throw err;
  } finally {
    setLoading(false);
  }
};
  return {
    createAssignment,
    updateAssignment,
    deleteAssignment,
    createAssignmentQuestion,
    updateAssignmentQuestion,
    deleteAssignmentQuestion,
    createAssignmentQuestionSolution,
    updateAssignmentQuestionSolution,
    getAssignment,
    loading,
    error
  };
};
