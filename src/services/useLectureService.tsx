// services/useLectureService.ts
import { useState } from 'react';
import { ApolloError } from '@apollo/client';
import { apolloClient } from '@/lib/apollo-client';
import { toast } from 'react-hot-toast';
import { 
  CREATE_LECTURE, 
  UPDATE_LECTURE,
  DELETE_LECTURE,
  CreateLectureVariables,
  CreateLectureResponse,
  UpdateLectureVariables,
  UpdateLectureResponse,
  DeleteLectureVariables,
  DeleteLectureResponse,
  UpdateLectureDescriptionVariables,
  UPDATE_LECTURE_DESCRIPTION,
  UpdateLectureDescriptionResponse,
} from '@/api/course/lecture/mutation';

export const useLectureService = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createLecture = async (variables: CreateLectureVariables) => {
    try {
      setLoading(true);
      setError(null);

      const { data, errors } = await apolloClient.mutate<CreateLectureResponse>({
        mutation: CREATE_LECTURE,
        variables,
        context: {
          includeAuth: true
        },
        fetchPolicy: 'no-cache'
      });

      if (errors) {
        console.error("GraphQL errors:", errors);
        throw new Error(errors[0]?.message || "An error occurred during lecture creation");
      }

      if (!data?.createLecture.success) {
        throw new Error("Failed to create lecture");
      }
      return data;
    } catch (err) {
      console.error("Lecture creation error:", err);
      
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

  const updateLecture = async (variables: UpdateLectureVariables) => {
    try {
      setLoading(true);
      setError(null);

      const { data, errors } = await apolloClient.mutate<UpdateLectureResponse>({
        mutation: UPDATE_LECTURE,
        variables,
        context: {
          includeAuth: true
        },
        fetchPolicy: 'no-cache'
      });

      if (errors) {
        console.error("GraphQL errors:", errors);
        throw new Error(errors[0]?.message || "An error occurred during lecture update");
      }

      if (!data?.updateLecture.success) {
        throw new Error("Failed to update lecture");
      }

      toast.success("Lecture updated successfully!");
      return data;
    } catch (err) {
      console.error("Lecture update error:", err);
      
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

  const deleteLecture = async (variables: DeleteLectureVariables) => {
    try {
      setLoading(true);
      setError(null);

      const { data, errors } = await apolloClient.mutate<DeleteLectureResponse>({
        mutation: DELETE_LECTURE,
        variables,
        context: {
          includeAuth: true
        },
        fetchPolicy: 'no-cache'
      });

      if (errors) {
        console.error("GraphQL errors:", errors);
        throw new Error(errors[0]?.message || "An error occurred during lecture deletion");
      }

      if (!data?.deleteLecture.success) {
        throw new Error("Failed to delete lecture");
      }

      toast.success("Lecture deleted successfully!");
      return data;
    } catch (err) {
      console.error("Lecture deletion error:", err);
      
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

  const updateLectureDescription = async (variables: UpdateLectureDescriptionVariables) => {
    try {
      setLoading(true);
      setError(null);

      const { data, errors } = await apolloClient.mutate<UpdateLectureDescriptionResponse>({
        mutation: UPDATE_LECTURE_DESCRIPTION,
        variables,
        context: {
          includeAuth: true
        },
        fetchPolicy: 'no-cache'
      });

      if (errors) {
        console.error("GraphQL errors:", errors);
        throw new Error(errors[0]?.message || "An error occurred during lecture deletion");
      }

      if (!data?.updateLecture.success) {
        throw new Error("Failed to delete lecture");
      }

      toast.success("Lecture deleted successfully!");
      return data;
    } catch (err) {
      console.error("Lecture deletion error:", err);
      
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
    createLecture,
    updateLecture,
    deleteLecture,
    updateLectureDescription,
    loading,
    error
  };
};