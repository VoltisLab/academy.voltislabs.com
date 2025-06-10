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
  UpdateAssignmentResponse
} from '@/api/assignment/mutation';

export const useAssignmentService = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

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

  

  return {
    createAssignment,
    updateAssignment,
    loading,
    error
  };
};
