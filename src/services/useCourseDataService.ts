import { useState, useEffect } from "react";
import { GET_ALL_INSTRUCTOR_COURSES } from "@/api/course/queries";
import { apolloClient } from "@/lib/apollo-client";
import Cookies from "js-cookie";
import { toast } from "react-hot-toast";

type Course = {
  id: number;
  title: string;
  banner: string;
  category: {
    id: number;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
};

type Filters = {
  category?: number;
  level?: "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "ALL_LEVELS";
  status?: "DRAFT" | "PUBLISHED";
  title?: string;
  topic?: string;
};

export const useCoursesData = () => {
  const [instructorCourses, setInstructorCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<Filters>({});
  const [pageNumber, setPageNumber] = useState(1);
  const [pageCount] = useState(10); // items per page

  const fetchInstructorCourses = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = Cookies.get("auth_token");
      if (!token) throw new Error("Authentication token not found");

      const { data } = await apolloClient.query({
        query: GET_ALL_INSTRUCTOR_COURSES,
        variables: {
          search,
          pageNumber,
          pageCount,
          filters,
        },
        fetchPolicy: "network-only",
      });

      setInstructorCourses(data.instructorCourses);
    } catch (err: any) {
      console.error("Fetch courses failed", err);
      setError(err.message || "Failed to fetch courses");
      toast.error("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstructorCourses();
  }, [search, filters, pageNumber]);

  return {
    instructorCourses,
    loading,
    error,
    search,
    setSearch,
    filters,
    setFilters,
    pageNumber,
    setPageNumber,
    refetch: fetchInstructorCourses,
  };
};
