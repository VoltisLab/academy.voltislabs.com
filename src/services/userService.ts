// src/services/user.service.ts
import { ApolloError } from "@apollo/client";
import { apolloClient } from "@/lib/apollo-client";
import Cookies from "js-cookie";
import { toast } from "react-hot-toast";
import { GraphQLFormattedError } from "graphql";
import { GET_USER_PROFILE } from "@/api/user/queries";

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  firstName: string;
  lastName: string;
  bio?: string;
  dateJoined: string;
  displayName?: string;
  dob?: string;
  gender?: string;
  isInstructor: boolean;
  isVerified: boolean;
  lastLogin?: string;
  location?: {
    locationName?: string;
    latitude?: number;
    longitude?: number;
  };
  phone?: {
    countryCode?: string;
    number?: string;
    completed?: boolean;
  };
  preference?: {
    language?: string;
    timezone?: string;
    dateFormat?: string;
    timeFormat?: string;
  };
  profilePictureUrl?: string;
  thumbnailUrl?: string;
  username?: string;
}

interface UserProfileResponse {
  viewMe: UserProfile;
}

interface UpdateProfileInput {
  firstName?: string;
  lastName?: string;
  bio?: string;
  displayName?: string;
  dob?: string;
  gender?: string;
  location?: {
    locationName?: string;
  };
  phone?: {
    countryCode?: string;
    number?: string;
  };
}

export const useUserService = () => {
  const getUserProfile = async (): Promise<UserProfile | null> => {
    try {
      const authToken = Cookies.get("auth_token");
      if (!authToken) throw new Error("Authentication token not found");

      const { data, errors } = await apolloClient.query<UserProfileResponse>({
        query: GET_USER_PROFILE,
        fetchPolicy: "network-only",
      });

      if (errors) handleGraphQLErrors(errors);
      return data?.viewMe || null;
    } catch (err) {
      handleError(err);
      return null;
    }
  };

  // const updateUserProfile = async (
  //   input: UpdateProfileInput
  // ): Promise<boolean> => {
  //   try {
  //     const authToken = Cookies.get("auth_token");
  //     if (!authToken) throw new Error("Authentication token not found");

  //     const { data, errors } = await apolloClient.mutate({
  //       mutation: UPDATE_USER_PROFILE,
  //       variables: { input },
  //     });

  //     if (errors) handleGraphQLErrors(errors);
  //     toast.success("Profile updated successfully");
  //     return true;
  //   } catch (err) {
  //     handleError(err);
  //     return false;
  //   }
  // };

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
      errors[0]?.message || "An error occurred while processing your request"
    );
  };

  const handleError = (err: unknown) => {
    console.error("User service error:", err);
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
    getUserProfile,
  };
};
