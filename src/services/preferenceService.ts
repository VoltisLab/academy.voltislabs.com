import { ApolloError } from "@apollo/client";
import { apolloClient } from "@/lib/apollo-client";
import Cookies from "js-cookie";
import { toast } from "react-hot-toast";
import { GraphQLFormattedError } from "graphql";
import {
  UserPreference,
  UpdatePreferenceInput,
  UserPreferenceResponse,
  UpdatePreferenceResponse,
} from "@/lib/preference";
import {
  GET_USER_PREFERENCES,
  UPDATE_USER_PREFERENCES,
} from "@/api/user/mutation";

export const usePreferenceOperations = () => {
  const getPreferences = async (): Promise<UserPreference | null> => {
    try {
      const authToken = Cookies.get("auth_token");

      if (!authToken) {
        throw new Error("Authentication token not found. Please login again.");
      }

      const { data, errors } = await apolloClient.query<UserPreferenceResponse>(
        {
          query: GET_USER_PREFERENCES,
          fetchPolicy: "network-only",
        }
      );

      if (errors) {
        handleGraphQLErrors(errors);
      }

      return data.viewMe.preference || null;
    } catch (err) {
      handleError(err);
      return null;
    }
  };

  const updatePreferences = async (
    input: UpdatePreferenceInput
  ): Promise<UpdatePreferenceResponse | null> => {
    try {
      const authToken = Cookies.get("auth_token");

      if (!authToken) {
        throw new Error("Authentication token not found. Please login again.");
      }

      const { data, errors } =
        await apolloClient.mutate<UpdatePreferenceResponse>({
          mutation: UPDATE_USER_PREFERENCES,
          variables: input,
        });

      if (errors) {
        handleGraphQLErrors(errors);
      }

      return data || null;
    } catch (err) {
      handleError(err);
      return null;
    }
  };

  const handleGraphQLErrors = (errors: readonly GraphQLFormattedError[]) => {
    const authErrors = errors.filter(
      (err) =>
        err.message.toLowerCase().includes("auth") ||
        err.message.toLowerCase().includes("token") ||
        err.message.toLowerCase().includes("credentials") ||
        err.message.toLowerCase().includes("permission")
    );

    if (authErrors.length > 0) {
      throw new Error("Authentication failed. Please try logging in again.");
    }

    throw new Error(
      errors[0]?.message || "An error occurred during the operation"
    );
  };

  const handleError = (err: any) => {
    console.error("Preference operation error:", err);

    if (err instanceof ApolloError) {
      if (err.networkError) {
        toast.error("Network error. Please check your connection.");
      } else if (err.message.includes("Authentication")) {
        toast.error("Authentication failed. Please log in again.");
      } else {
        toast.error(err.message);
      }
    } else if (err instanceof Error) {
      toast.error(err.message);
    } else {
      toast.error("An unexpected error occurred");
    }
  };

  return {
    getPreferences,
    updatePreferences,
  };
};
