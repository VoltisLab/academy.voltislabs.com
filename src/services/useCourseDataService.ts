"use client"
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
  [x: string]: any;
  status: "DRAFT" | "PUBLISHED" | undefined;
  id: string;
  title: string;
  publishedAt: string;
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
    fullName: string;
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

  const fetchInstructorCourses = async ({
    searchValue = "",
  }: { searchValue?: string } = {}) => {
    try {
      setLoading(true);
      setError(null);

      const token = Cookies.get("auth_token");
      if (!token) throw new Error("Authentication token not found");

      const { data } = await apolloClient.query({
        query: GET_ALL_INSTRUCTOR_COURSES,
        variables: {
          search: searchValue ? searchValue : search,
          pageNumber,
          pageCount,
          filters,
        },
        fetchPolicy: "network-only",
      });

      setInstructorCourses(data.instructorCourses);
      return data;
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

  // Track previous values to detect changes
  const prevSearch = useRef("");
  const prevFilters = useRef<Filters>({});

  const fetchData = useCallback(async (currentPageNumber: number = pageNumber) => {
    try {
      setLoading(true);
      setError(null);

      const response = await apolloClient.query({
        query: GET_ALL_COURSES,
        variables: { 
          search, 
          pageNumber: currentPageNumber, 
          pageCount, 
          filters 
        },
        fetchPolicy: "network-only",
      });

      const totalResponse = await apolloClient.query({
        query: GET_COURSES_TOTAL,
        variables: { search, filters },
        fetchPolicy: "network-only",
      });

      // Simplified state update - always update to ensure re-render
      setPublishedCourse(response.data.courses || []);
      setTotal(totalResponse.data.coursesTotalNumber || 0);

      console.log('Fetched courses:', response.data.courses);
    } catch (err: any) {
      console.error("Fetch failed", err);
      setError(err.message || "Failed to fetch data");
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  }, [search, filters, pageNumber, pageCount]);

  // Effect to handle search/filter changes and reset pagination
  useEffect(() => {
    const searchChanged = search !== prevSearch.current;
    const filtersChanged = JSON.stringify(filters) !== JSON.stringify(prevFilters.current);
    
    if (searchChanged || filtersChanged) {
      // Reset to page 1 and fetch
      setPageNumber(1);
      fetchData(1); // Pass 1 directly to ensure immediate fetch with correct page
      
      // Update refs
      prevSearch.current = search;
      prevFilters.current = filters;
    } else {
      // Only page changed, fetch with current page
      fetchData();
    }
  }, [search, filters, pageNumber]);

  const handleSetFilters = useCallback((newFilters: Filters) => {
    setFilters(newFilters);
  }, []);

  const handleSetSearch = useCallback((newSearch: string) => {
    setSearch(newSearch);
    // Page reset will be handled in useEffect
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
