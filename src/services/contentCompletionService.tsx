import { useState } from "react";
import { ApolloError } from "@apollo/client";
import { apolloClient } from "@/lib/apollo-client";

import Cookies from "js-cookie";
import {
  SET_CONTENT_COMPLETION_STATUS_MUTATION,
  SetContentCompletionStatusResponse,
  SetContentCompletionStatusVariables,
} from "@/api/course/mutation";

export const useContentCompletionStatus = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const setContentCompletionStatus = async (
    variables: SetContentCompletionStatusVariables
  ) => {
    try {
      setLoading(true);
      setError(null);

      const authToken = Cookies.get("auth_token");

      if (!authToken) {
        throw new Error("Authentication token not found. Please login again.");
      }

      const { data, errors } =
        await apolloClient.mutate<SetContentCompletionStatusResponse>({
          mutation: SET_CONTENT_COMPLETION_STATUS_MUTATION,
          variables,
          context: {
            includeAuth: true,
          },
          fetchPolicy: "no-cache",
        });

      if (errors && errors.length > 0) {
        const authErrors = errors.filter(
          (err) =>
            err.message.toLowerCase().includes("auth") ||
            err.message.toLowerCase().includes("token") ||
            err.message.toLowerCase().includes("permission")
        );

        if (authErrors.length > 0) {
          throw new Error(
            "Authentication failed. Please try logging in again."
          );
        }

        throw new Error(
          errors[0]?.message ||
            "An error occurred while setting completion status"
        );
      }

      if (!data?.setContentCompletionStatus.success) {
        throw new Error(
          data?.setContentCompletionStatus.message ||
            "Failed to update completion status"
        );
      }

      return data;
    } catch (err) {
      console.error("setContentCompletionStatus error:", err);

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
    setContentCompletionStatus,
    loading,
    error,
  };
};
