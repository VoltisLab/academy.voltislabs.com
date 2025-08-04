import { useState } from "react";
import { ApolloError } from "@apollo/client";
import Cookies from "js-cookie";
import { apolloClient } from "@/lib/apollo-client";
import {
  UPDATE_USER_MUTATION,
  UpdateUserResponse,
  UpdateUserVariables,
} from "@/api/course/mutation";
import { GET_USER_PROFILE } from "@/api/user/queries";

export const useUpdateUser = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const updateUser = async (variables: UpdateUserVariables) => {
    try {
      setLoading(true);
      setError(null);

      const authToken = Cookies.get("auth_token");
      if (!authToken) {
        throw new Error("Authentication token not found. Please login again.");
      }

      const { data } = await apolloClient.mutate<
        UpdateUserResponse,
        UpdateUserVariables
      >({
        mutation: UPDATE_USER_MUTATION,
        variables,
        context: {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        },
        fetchPolicy: "no-cache",
        errorPolicy: "none",
        // Update Apollo cache with the returned user data
        update: (cache, { data: mutationResult }) => {
          if (mutationResult?.updateUser?.user) {
            try {
              // Update the cache with fresh user data
              cache.writeQuery({
                query: GET_USER_PROFILE,
                data: {
                  userProfile: mutationResult.updateUser.user
                }
              });
              console.log("Cache updated successfully with:", mutationResult.updateUser.user);
            } catch (cacheError) {
              console.warn("Cache update failed:", cacheError);
              // Fallback: clear the cache so next fetch gets fresh data
              cache.evict({ fieldName: "userProfile" });
              cache.gc();
            }
          }
        },
      });

      if (!data?.updateUser) {
        throw new Error("Update failed. Please try again.");
      }

      console.log("Update successful:", data.updateUser);
      return data.updateUser;
    } catch (err) {
      console.error("updateUser error:", err);

      let errorMessage = "An unexpected error occurred";

      if (err instanceof ApolloError) {
        if (err.networkError) {
          errorMessage = "Network error. Please check your connection and try again.";
        } else if (err.graphQLErrors?.length > 0) {
          const graphQLError = err.graphQLErrors[0];
          if (/(auth|token|permission|credentials)/i.test(graphQLError.message)) {
            errorMessage = "Authentication failed. Please log in again.";
          } else {
            errorMessage = graphQLError.message;
          }
        } else if (/(auth|credentials)/i.test(err.message)) {
          errorMessage = "Authentication failed. Please log in again.";
        } else {
          errorMessage = err.message;
        }
      } else if (err instanceof Error) {
        if (/(NetworkError|network)/i.test(err.message)) {
          errorMessage = "Network error. Please check your connection and try again.";
        } else if (/(auth|credentials)/i.test(err.message)) {
          errorMessage = "Authentication failed. Please log in again.";
        } else {
          errorMessage = err.message;
        }
      }

      const finalError = new Error(errorMessage);
      setError(finalError);
      throw finalError;
    } finally {
      setLoading(false);
    }
  };

  return {
    updateUser,
    loading,
    error,
  };
};