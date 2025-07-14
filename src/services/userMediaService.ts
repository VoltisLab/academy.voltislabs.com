import { useState } from "react";
import { ApolloError } from "@apollo/client";
import { toast } from "react-hot-toast";
import { apolloClient } from "@/lib/apollo-client";
import { GET_USER_MEDIA_QUERY, GetUserMediaResponse, GetUserMediaVariables } from "@/api/usermedia/query";

export const useUserService = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const getUserMedia = async (variables: GetUserMediaVariables) => {
    try {
      setLoading(true);
      setError(null);

      const { data, errors } = await apolloClient.query<
        GetUserMediaResponse,
        GetUserMediaVariables
      >({
        query: GET_USER_MEDIA_QUERY,
        variables,
        context: {
          includeAuth: true,
        },
        fetchPolicy: "no-cache",
      });

      if (errors && errors.length > 0) {
        throw new Error(errors[0]?.message || "Failed to fetch media");
      }

      return data.userMedia;
    } catch (err) {
      console.error("Fetch user media error:", err);

      const message =
        err instanceof ApolloError
          ? err.message
          : err instanceof Error
          ? err.message
          : "An unexpected error occurred";

      setError(new Error(message));
      toast.error(message);

      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    getUserMedia,
    loading,
    error,
  };
};
