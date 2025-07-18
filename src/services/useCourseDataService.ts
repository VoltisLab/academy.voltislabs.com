import { useState, useEffect, useCallback, useRef } from "react";
import {
  GET_ALL_COURSES,
  GET_ALL_INSTRUCTOR_COURSES,
  GET_COURSES_TOTAL,
  GET_INSTRUCTOR_COURSES_TOTAL,
} from "@/api/course/queries";
import { apolloClient } from "@/lib/apollo-client";
import Cookies from "js-cookie";
import { toast } from "react-hot-toast";

type Course = {
  status: "DRAFT" | "PUBLISHED" | undefined;
  id: string;
  title: string;
  banner: {
    thumbnail: string;
    url: string;
  };
  description: string;
  category: {
    id: string;
    name: string;
  };
  instructor: {
    id: string;
    thumbnailUrl: string;
  };
  createdAt: string;
  updatedAt: string;
};

export type Filters = {
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
  const [total, setTotal] = useState(0);

  const fetchInstructorCourses = async ({ searchValue = "" }: { searchValue?: string } = {}) => {
    try {
      setLoading(true);
      setError(null);

      const token = Cookies.get("auth_token");
      if (!token) throw new Error("Authentication token not found");

      const { data } = await apolloClient.query({
        query: GET_ALL_INSTRUCTOR_COURSES,
        variables: {
          search: searchValue? searchValue : search,
          pageNumber,
          pageCount,
          filters,
        },
        fetchPolicy: "network-only",
      });

      setInstructorCourses(data.instructorCourses);
      return data
    } catch (err: any) {
      console.error("Fetch courses failed", err);
      setError(err.message || "Failed to fetch courses");
      toast.error("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  const fetchInstructorCoursesTotal = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = Cookies.get("auth_token");
      if (!token) throw new Error("no Authentication token  found");

      const { data } = await apolloClient.query({
        query: GET_INSTRUCTOR_COURSES_TOTAL,
        fetchPolicy: "network-only",
      });

      setTotal(data.instructorCoursesTotalNumber);
    } catch (err: any) {
      console.error("Fetch total failed", err);
      setError(err.message || "Failed to fetch course total");
      toast.error("Failed to load course count");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstructorCourses();
    fetchInstructorCoursesTotal();
  }, [search, filters, pageNumber]);

  return {
    fetchInstructorCourses,
    instructorCourses,
    loading,
    error,
    search,
    setSearch,
    filters,
    setFilters,
    pageNumber,
    setPageNumber,
    total,
    refetch: fetchInstructorCourses,
  };
};

export const usePublishedCoursesData = () => {
  const [publishedCourses, setPublishedCourse] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<Filters>({});
  const [pageNumber, setPageNumber] = useState(1);
  const [pageCount] = useState(10);
  const [total, setTotal] = useState(0);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Reset page number to 1 when filters or search change
      if (filtersChanged.current) {
        setPageNumber(1);
        filtersChanged.current = false;
      }

      const response = await apolloClient.query({
        query: GET_ALL_COURSES,
        variables: { search, pageNumber, pageCount, filters },
        fetchPolicy: "network-only",
      });

      const totalResponse = await apolloClient.query({
        query: GET_COURSES_TOTAL,
        variables: { search, filters },
        fetchPolicy: "network-only",
      });

      setPublishedCourse(response.data.courses);
      setTotal(totalResponse.data.coursesTotalNumber);
    } catch (err: any) {
      console.error("Fetch failed", err);
      setError(err.message || "Failed to fetch data");
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  }, [search, filters, pageNumber, pageCount]);

  // Track filter changes
  const filtersChanged = useRef(false);
  const prevFilters = useRef<Filters>({});

  useEffect(() => {
    // Compare current filters with previous filters
    if (JSON.stringify(filters) !== JSON.stringify(prevFilters.current)) {
      filtersChanged.current = true;
      prevFilters.current = filters;
    }
  }, [filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSetFilters = useCallback((newFilters: Filters) => {
    setFilters(newFilters);
  }, []);

  const handleSetSearch = useCallback((newSearch: string) => {
    setSearch(newSearch);
    setPageNumber(1); // Reset to first page when search changes
  }, []);

  return {
    publishedCourses,
    loading,
    error,
    total,
    search,
    setSearch: handleSetSearch,
    filters,
    setFilters: handleSetFilters,
    pageNumber,
    setPageNumber,
    refetch: fetchData,
  };
};
