import { useState } from "react";
import { ApolloError } from "@apollo/client";
import { apolloClient } from "@/lib/apollo-client";
import {
  UPDATE_COURSE_INFO,
  UPDATE_COURSE_STATUS,
} from "@/api/course/mutation";
import Cookies from "js-cookie";

export interface BannerInput {
  thumbnail: string;
  url: string;
}

export interface UpdateCourseInfoVariables {
  courseId: number;
  requirements: string[];
  banner: BannerInput;
  targetAudience: string[];
  teachingPoints: string[];
  description?: string;
}

export interface UpdateCourseStatusVariables {
  courseId: number;
  status: "DRAFT" | "PROCESSING" | "PUBLISHED";
}

export interface UpdateCourseInfoResponse {
  updateCourse: {
    success: boolean;
    message: string;
  };
}

export const useCourseInfoUpdate = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const updateCourseInfo = async (variables: UpdateCourseInfoVariables) => {
    try {
      setLoading(true);
      setError(null);

      // Get auth token from cookies (for logging purposes only)
      const authToken = Cookies.get("auth_token");

      if (!authToken) {
        throw new Error("Authentication token not found. Please login again.");
      }

      // Make the GraphQL mutation with includeAuth: true
      const { data, errors } =
        await apolloClient.mutate<UpdateCourseInfoResponse>({
          mutation: UPDATE_COURSE_INFO,
          variables,
          context: {
            includeAuth: true, // This tells Apollo to include the auth token
          },
          fetchPolicy: "no-cache", // Force network request, bypass cache
        });

      if (errors) {
        console.error("GraphQL errors:", errors);

        // Check if any errors are related to authentication
        const authErrors = errors.filter(
          (err) =>
            err.message.toLowerCase().includes("auth") ||
            err.message.toLowerCase().includes("token") ||
            err.message.toLowerCase().includes("credentials") ||
            err.message.toLowerCase().includes("permission")
        );

        if (authErrors.length > 0) {
          console.error("Authentication errors detected:", authErrors);
          throw new Error(
            "Authentication failed. Please try logging in again."
          );
        }

        throw new Error(
          errors[0]?.message || "An error occurred during course update"
        );
      }

      if (!data?.updateCourse.success) {
        throw new Error(
          data?.updateCourse.message || "Failed to update course information"
        );
      }

      return data;
    } catch (err) {
      console.error("Course update error:", err);

      // Handle specific error types
      if (err instanceof ApolloError) {
        const networkError = err.networkError;
        if (networkError) {
          setError(
            new Error(
              "Network error. Please check your connection and try again."
            )
          );
        } else if (
          err.message.includes("Authentication") ||
          err.message.includes("credentials")
        ) {
          setError(new Error("Authentication failed. Please log in again."));
        } else {
          setError(new Error(err.message));
        }
      } else if (err instanceof Error) {
        if (err.message.includes("NetworkError")) {
          setError(
            new Error(
              "Network error. Please check your connection and try again."
            )
          );
        } else if (
          err.message.includes("Authentication") ||
          err.message.includes("credentials")
        ) {
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
    updateCourseInfo,
    loading,
    error,
  };
};

export const useCourseStatusUpdate = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const updateCourseStatusInfo = async (
    variables: UpdateCourseStatusVariables
  ) => {
    try {
      setLoading(true);
      setError(null);

      // Get auth token from cookies (for logging purposes only)
      const authToken = Cookies.get("auth_token");

      if (!authToken) {
        throw new Error("Authentication token not found. Please login again.");
      }

      // Make the GraphQL mutation with includeAuth: true
      const { data, errors } =
        await apolloClient.mutate<UpdateCourseInfoResponse>({
          mutation: UPDATE_COURSE_STATUS,
          variables,
          context: {
            includeAuth: true, // This tells Apollo to include the auth token
          },
          fetchPolicy: "no-cache", // Force network request, bypass cache
        });

      if (errors) {
        console.error("GraphQL errors:", errors);

        // Check if any errors are related to authentication
        const authErrors = errors.filter(
          (err) =>
            err.message.toLowerCase().includes("auth") ||
            err.message.toLowerCase().includes("token") ||
            err.message.toLowerCase().includes("credentials") ||
            err.message.toLowerCase().includes("permission")
        );

        if (authErrors.length > 0) {
          console.error("Authentication errors detected:", authErrors);
          throw new Error(
            "Authentication failed. Please try logging in again."
          );
        }

        throw new Error(
          errors[0]?.message || "An error occurred during course update"
        );
      }

      if (!data?.updateCourse.success) {
        throw new Error(
          data?.updateCourse.message || "Failed to update course information"
        );
      }

      return data;
    } catch (err) {
      console.error("Course update error:", err);

      // Handle specific error types
      if (err instanceof ApolloError) {
        const networkError = err.networkError;
        if (networkError) {
          setError(
            new Error(
              "Network error. Please check your connection and try again."
            )
          );
        } else if (
          err.message.includes("Authentication") ||
          err.message.includes("credentials")
        ) {
          setError(new Error("Authentication failed. Please log in again."));
        } else {
          setError(new Error(err.message));
        }
      } else if (err instanceof Error) {
        if (err.message.includes("NetworkError")) {
          setError(
            new Error(
              "Network error. Please check your connection and try again."
            )
          );
        } else if (
          err.message.includes("Authentication") ||
          err.message.includes("credentials")
        ) {
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
    updateCourseStatusInfo,
    loading,
    error,
  };
};
