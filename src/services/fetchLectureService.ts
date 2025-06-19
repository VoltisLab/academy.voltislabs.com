import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { GET_SECTION_LECTURES } from "@/api/course/lecture/queries";
import { apolloClient } from "@/lib/apollo-client";
import Cookies from "js-cookie";
import { toast } from "react-hot-toast";

export const useLectureData = (sectionId: number) => {
  const [lectures, setLectures] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLectures = async () => {
    try {
      setLoading(true);
      setError(null);

      const authToken = Cookies.get("auth_token");
      if (!authToken) {
        throw new Error("Authentication token not found");
      }

      const { data, error } = await apolloClient.query({
        query: GET_SECTION_LECTURES,
        variables: { sectionId },
        fetchPolicy: "network-only",
      });

      if (error) {
        throw new Error(error.message);
      }

      // Filter lectures to only include those with video URLs
      const lecturesWithVideos = (data.sectionLectures || []).filter(
        (lecture: any) => lecture.videoUrl
      );

      setLectures(lecturesWithVideos);
    } catch (err) {
      console.error("Failed to fetch lectures:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch lectures");
      toast.error("Failed to load lectures");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (sectionId) {
      fetchLectures();
    }
  }, [sectionId]);

  return { lectures, loading, error, refetch: fetchLectures };
};
