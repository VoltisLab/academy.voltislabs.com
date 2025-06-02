// services/useSectionService.ts
import { useState } from 'react';
import { ApolloError } from '@apollo/client';
import { apolloClient } from '@/lib/apollo-client';
import { toast } from 'react-hot-toast';
import { 
  CREATE_SECTION, 
  UPDATE_SECTION,
  CreateSectionVariables,
  CreateSectionResponse,
  UpdateSectionVariables,
  UpdateSectionResponse
} from '@/api/course/section/mutation';

export const useSectionService = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createSection = async (variables: CreateSectionVariables) => {
    try {
      setLoading(true);
      setError(null);

      const { data, errors } = await apolloClient.mutate<CreateSectionResponse>({
        mutation: CREATE_SECTION,
        variables,
        context: {
          includeAuth: true
        },
        fetchPolicy: 'no-cache'
      });

      if (errors) {
        console.error("GraphQL errors:", errors);
        throw new Error(errors[0]?.message || "An error occurred during section creation");
      }

      if (!data?.createSection.success) {
        throw new Error(data?.createSection.message || "Failed to create section");
      }

      toast.success("Section created successfully!");
      return data;
    } catch (err) {
      console.error("Section creation error:", err);
      
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

  const updateSection = async (variables: UpdateSectionVariables) => {
    try {
      setLoading(true);
      setError(null);

      const { data, errors } = await apolloClient.mutate<UpdateSectionResponse>({
        mutation: UPDATE_SECTION,
        variables,
        context: {
          includeAuth: true
        },
        fetchPolicy: 'no-cache'
      });

      if (errors) {
        console.error("GraphQL errors:", errors);
        throw new Error(errors[0]?.message || "An error occurred during section update");
      }

      if (!data?.updateSection.success) {
        throw new Error(data?.updateSection.message || "Failed to update section");
      }

      toast.success("Section updated successfully!");
      return data;
    } catch (err) {
      console.error("Section update error:", err);
      
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
    createSection,
    updateSection,
    loading,
    error
  };
};