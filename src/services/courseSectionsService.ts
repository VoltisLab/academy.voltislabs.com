// services/courseSectionsService.ts
import { useState } from 'react';
import { ApolloError } from '@apollo/client';
import { apolloClient } from '@/lib/apollo-client';
import { UPDATE_COURSE_SECTIONS } from '@/api/course/mutation';
import { UpdateCourseSectionsVariables, UpdateCourseSectionsResponse } from '@/lib/types';
import Cookies from 'js-cookie';

export const useCourseSectionsUpdate = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const updateCourseSections = async (variables: UpdateCourseSectionsVariables) => {
    try {
      setLoading(true);
      setError(null);
      
      // Get auth token from cookies (for logging purposes only)
      const authToken = Cookies.get('auth_token');
      
      if (!authToken) {
        throw new Error("Authentication token not found. Please login again.");
      }
      
      // Make the GraphQL mutation with includeAuth: true
      const { data, errors } = await apolloClient.mutate<UpdateCourseSectionsResponse>({
        mutation: UPDATE_COURSE_SECTIONS,
        variables,
        context: {
          includeAuth: true // This tells Apollo to include the auth token
        },
        fetchPolicy: 'no-cache' // Force network request, bypass cache
      });
      
      if (errors) {
        console.error("GraphQL errors:", errors);
        
        // Check if any errors are related to authentication
        const authErrors = errors.filter(err => 
          err.message.toLowerCase().includes('auth') || 
          err.message.toLowerCase().includes('token') ||
          err.message.toLowerCase().includes('credentials') ||
          err.message.toLowerCase().includes('permission')
        );
        
        if (authErrors.length > 0) {
          console.error("Authentication errors detected:", authErrors);
          throw new Error("Authentication failed. Please try logging in again.");
        }
        
        throw new Error(errors[0]?.message || "An error occurred during course section update");
      }
      
      if (!data?.updateCourseInfo.success) {
        throw new Error(data?.updateCourseInfo.message || "Failed to update course sections");
      }
      
      return data;
    } catch (err) {
      console.error("Course sections update error:", err);
      
      // Handle specific error types
      if (err instanceof ApolloError) {
        const networkError = err.networkError;
        if (networkError) {
          setError(new Error("Network error. Please check your connection and try again."));
        } else if (err.message.includes('Authentication') || err.message.includes('credentials')) {
          setError(new Error("Authentication failed. Please log in again."));
        } else {
          setError(new Error(err.message));
        }
      } else if (err instanceof Error) {
        if (err.message.includes('NetworkError')) {
          setError(new Error("Network error. Please check your connection and try again."));
        } else if (err.message.includes('Authentication') || err.message.includes('credentials')) {
          setError(new Error("Authentication failed. Please log in again."));
        } else {
          setError(err);
        }
      } else {
        setError(new Error("An unexpected error occurred"));
      }
      
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    updateCourseSections,
    loading,
    error
  };
};