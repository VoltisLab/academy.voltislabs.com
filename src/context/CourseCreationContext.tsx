"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { apolloClient } from '@/lib/apollo-client';
import { gql } from '@apollo/client';
import Cookies from 'js-cookie';

// Types for course creation data
export interface BasicInfo {
  title: string;
  subtitle: string;
  categoryId: string;
  subCategoryId: string;
  topic: string;
  language: string;
  subtitleLanguage: string;
  courseLevel: string;
  durationValue: string;
  durationUnit: string;
  description: string;
}

export interface AdvancedInfo {
  courseThumbnail: string;
  secondaryThumbnail: string;
  courseDescription: string;
  teachingPoints: string[];
  targetAudience: string[];
  courseRequirements: string[];
}

export interface CourseCreationData {
  courseId?: number;
  currentStep: string;
  completedSteps: string[];
  basicInfo?: BasicInfo;
  advancedInfo?: AdvancedInfo;
  curriculum?: any; // Will be populated from courseSections query
}

// GraphQL Queries using existing endpoints
const GET_COURSE_BY_ID = gql`
  query GetCourseById($courseId: Int!) {
    course(id: $courseId) {
      id
      title
      subtitle
      topic
      language
      subtitleLanguage
      courseLevel
      description
      createdAt
      updatedAt
      status
      category {
        id
        name
      }
      subCategory {
        id
        name
      }
      duration {
        value
        unit
      }
      banner {
        thumbnail
        url
      }
      teachingPoints
      targetAudience
      requirements
    }
  }
`;

const GET_COURSE_SECTIONS = gql`
  query GetCourseSections($courseId: Int!) {
    courseSections(id: $courseId) {
      id
      order
      title
      lectures {
        id
        videoUrl
        title
        notes
        duration
        description
        resources {
          id
          type
          url
          title
          createdAt
        }
      }
    }
  }
`;

const GET_INSTRUCTOR_COURSES = gql`
  query GetInstructorCourses {
    instructorCourses {
      id
      title
      subtitle
      topic
      status
      createdAt
      updatedAt
      category {
        id
        name
      }
      subCategory {
        id
        name
      }
    }
  }
`;

// Context interface
interface CourseCreationContextType {
  // State
  courseData: CourseCreationData;
  loading: boolean;
  error: string | null;
  
  // Actions
  initializeCourse: (courseId?: number) => Promise<void>;
  saveBasicInfo: (data: BasicInfo, courseId?: number) => Promise<void>;
  saveAdvancedInfo: (data: AdvancedInfo) => Promise<void>;
  saveCurrentStep: (step: string) => void;
  markStepCompleted: (step: string) => void;
  updateCourseId: (courseId: number) => void;
  getInstructorCourses: () => Promise<any[]>;
  clearCourseData: () => void;
  
  // Getters
  isStepCompleted: (step: string) => boolean;
  getCurrentStep: () => string;
  getCompletedSteps: () => string[];
}

// Create context
const CourseCreationContext = createContext<CourseCreationContextType | undefined>(undefined);

// Local storage keys
const STORAGE_KEYS = {
  COURSE_DATA: 'course_creation_data',
  CURRENT_STEP: 'course_creation_current_step',
  COMPLETED_STEPS: 'course_creation_completed_steps',
} as const;

// Helper functions for localStorage
const getStorageData = (key: string): any => {
  if (typeof window === 'undefined') return null;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error(`Error reading from localStorage (${key}):`, error);
    return null;
  }
};

const setStorageData = (key: string, data: any): void => {
  if (typeof window === 'undefined') return;
  try {
    console.log("Context: setStorageData called with key:", key, "data:", data);
    localStorage.setItem(key, JSON.stringify(data));
    console.log("Context: localStorage.setItem successful");
  } catch (error) {
    console.error(`Error writing to localStorage (${key}):`, error);
  }
};

const removeStorageData = (key: string): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing from localStorage (${key}):`, error);
  }
};

// Provider component
export const CourseCreationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // State
  const [courseData, setCourseData] = useState<CourseCreationData>({
    currentStep: 'basic',
    completedSteps: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize course data from URL params and localStorage
  const initializeCourse = useCallback(async (courseId?: number) => {
    console.log("Context: initializeCourse called with courseId:", courseId);
    setLoading(true);
    setError(null);
    
    try {
      // Get courseId from URL params or parameter
      const urlCourseId = searchParams?.get('courseId');
      const targetCourseId = courseId || (urlCourseId ? parseInt(urlCourseId) : undefined);
      
      console.log("Context: targetCourseId:", targetCourseId);
      
      if (targetCourseId) {
        // Load existing course data
        await loadExistingCourseData(targetCourseId);
      } else {
        // Start new course - load from localStorage if exists
        console.log("Context: No courseId, loading from localStorage");
        loadFromLocalStorage();
      }
    } catch (err) {
      console.error('Error initializing course:', err);
      setError(err instanceof Error ? err.message : 'Failed to initialize course');
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  // Load existing course data from backend
  const loadExistingCourseData = useCallback(async (courseId: number) => {
    try {
      const authToken = Cookies.get('auth_token');
      if (!authToken) {
        throw new Error('Authentication token not found');
      }

      // Get course basic info
      const { data: courseData, errors: courseErrors } = await apolloClient.query({
        query: GET_COURSE_BY_ID,
        variables: { courseId },
        context: { includeAuth: true },
        fetchPolicy: 'no-cache',
      });

      if (courseErrors) {
        throw new Error(courseErrors[0]?.message || 'Failed to load course data');
      }

      const course = courseData.course;
      
      // Get course sections (curriculum)
      const { data: sectionsData, errors: sectionsErrors } = await apolloClient.query({
        query: GET_COURSE_SECTIONS,
        variables: { courseId },
        context: { includeAuth: true },
        fetchPolicy: 'no-cache',
      });

      if (sectionsErrors) {
        console.warn('Failed to load course sections:', sectionsErrors);
      }

      // Transform course data to our format
      const basicInfo: BasicInfo = {
        title: course.title || '',
        subtitle: course.subtitle || '',
        categoryId: course.category?.id?.toString() || '',
        subCategoryId: course.subCategory?.id?.toString() || '',
        topic: course.topic || '',
        language: course.language || '',
        subtitleLanguage: course.subtitleLanguage || '',
        courseLevel: course.courseLevel || '',
        durationValue: course.duration?.value?.toString() || '',
        durationUnit: course.duration?.unit || '',
        description: course.description || '',
      };

      const advancedInfo: AdvancedInfo = {
        courseThumbnail: course.banner?.thumbnail || '',
        secondaryThumbnail: course.banner?.url || '',
        courseDescription: course.description || '',
        teachingPoints: course.teachingPoints || [],
        targetAudience: course.targetAudience || [],
        courseRequirements: course.requirements || [],
      };

      // Determine completed steps based on data presence
      const completedSteps: string[] = [];
      if (basicInfo.title && basicInfo.categoryId) {
        completedSteps.push('basic');
      }
      if (advancedInfo.courseThumbnail || advancedInfo.teachingPoints.length > 0) {
        completedSteps.push('advanced');
      }
      if (sectionsData?.courseSections?.length > 0) {
        completedSteps.push('curriculum');
      }

      // Determine current step
      let currentStep = 'basic';
      if (completedSteps.includes('curriculum')) {
        currentStep = 'publish';
      } else if (completedSteps.includes('advanced')) {
        currentStep = 'curriculum';
      } else if (completedSteps.includes('basic')) {
        currentStep = 'advanced';
      }

      const newCourseData: CourseCreationData = {
        courseId,
        currentStep,
        completedSteps,
        basicInfo,
        advancedInfo,
        curriculum: sectionsData?.courseSections || [],
      };

      setCourseData(newCourseData);
      saveToLocalStorage(newCourseData);
      
      // Update URL
      updateURL(courseId, currentStep);
      
    } catch (err) {
      console.error('Error loading existing course data:', err);
      throw err;
    }
  }, []);

  // Load from localStorage
  const loadFromLocalStorage = useCallback(() => {
    console.log("Context: loadFromLocalStorage called");
    const storedData = getStorageData(STORAGE_KEYS.COURSE_DATA);
    console.log("Context: storedData from localStorage:", storedData);
    if (storedData) {
      setCourseData(storedData);
      console.log("Context: courseData set from localStorage");
    } else {
      console.log("Context: No stored data found in localStorage");
    }
  }, []);

  // Save data to localStorage
  const saveToLocalStorage = useCallback((data: CourseCreationData) => {
    console.log("Context: saveToLocalStorage called with data:", data);
    setStorageData(STORAGE_KEYS.COURSE_DATA, data);
    console.log("Context: localStorage.setItem called");
  }, []);

  // Save basic info
  const saveBasicInfo = useCallback(async (data: BasicInfo, courseId?: number) => {
    console.log("Context: saveBasicInfo called with data:", data, "courseId:", courseId);
    setLoading(true);
    setError(null);
    
    try {
      const newCourseData = {
        ...courseData,
        basicInfo: data,
        completedSteps: [...new Set([...courseData.completedSteps, 'basic'])],
        ...(courseId && { courseId: courseId }), // Add courseId if provided
      };
      
      console.log("Context: newCourseData:", newCourseData);
      setCourseData(newCourseData);
      saveToLocalStorage(newCourseData);
      console.log("Context: Data saved to localStorage");
      
      // If we have a courseId, the data is already saved to backend via existing mutations
      // If not, we're just storing locally until course is created
      
    } catch (err) {
      console.error('Error saving basic info:', err);
      setError(err instanceof Error ? err.message : 'Failed to save basic info');
    } finally {
      setLoading(false);
    }
  }, [courseData, saveToLocalStorage]);

  // Save advanced info
  const saveAdvancedInfo = useCallback(async (data: AdvancedInfo) => {
    setLoading(true);
    setError(null);
    
    try {
      const newCourseData = {
        ...courseData,
        advancedInfo: data,
        completedSteps: [...new Set([...courseData.completedSteps, 'advanced'])],
      };
      
      setCourseData(newCourseData);
      saveToLocalStorage(newCourseData);
      
      // If we have a courseId, the data is already saved to backend via existing mutations
      
    } catch (err) {
      console.error('Error saving advanced info:', err);
      setError(err instanceof Error ? err.message : 'Failed to save advanced info');
    } finally {
      setLoading(false);
    }
  }, [courseData]);

  // Save current step
  const saveCurrentStep = useCallback((step: string) => {
    const newCourseData = {
      ...courseData,
      currentStep: step,
    };
    
    setCourseData(newCourseData);
    saveToLocalStorage(newCourseData);
    
    // Update URL
    if (courseData.courseId) {
      updateURL(courseData.courseId, step);
    }
  }, [courseData]);

  // Mark step as completed
  const markStepCompleted = useCallback((step: string) => {
    const newCourseData = {
      ...courseData,
      completedSteps: [...new Set([...courseData.completedSteps, step])],
    };
    
    setCourseData(newCourseData);
    saveToLocalStorage(newCourseData);
  }, [courseData]);

  // Update course ID
  const updateCourseId = useCallback((courseId: number) => {
    console.log("Context: updateCourseId called with courseId:", courseId);
    const newCourseData = {
      ...courseData,
      courseId: courseId,
    };
    
    setCourseData(newCourseData);
    saveToLocalStorage(newCourseData);
    console.log("Context: Course ID updated in context and localStorage");
  }, [courseData, saveToLocalStorage]);

  // Get instructor courses
  const getInstructorCourses = useCallback(async (): Promise<any[]> => {
    try {
      const authToken = Cookies.get('auth_token');
      if (!authToken) {
        throw new Error('Authentication token not found');
      }

      const { data, errors } = await apolloClient.query({
        query: GET_INSTRUCTOR_COURSES,
        context: { includeAuth: true },
        fetchPolicy: 'no-cache',
      });

      if (errors) {
        console.error('Get instructor courses errors:', errors);
        throw new Error(errors[0]?.message || 'Failed to get instructor courses');
      }

      return data.instructorCourses || [];
    } catch (err) {
      console.error('Get instructor courses error:', err);
      throw err;
    }
  }, []);

  // Clear course data
  const clearCourseData = useCallback(() => {
    setCourseData({
      currentStep: 'basic',
      completedSteps: [],
    });
    
    // Clear localStorage
    removeStorageData(STORAGE_KEYS.COURSE_DATA);
    removeStorageData(STORAGE_KEYS.CURRENT_STEP);
    removeStorageData(STORAGE_KEYS.COMPLETED_STEPS);
    
    // Clear URL params
    router.push('/instructor/create-new-course');
  }, [router]);

  // Update URL with courseId and step
  const updateURL = useCallback((courseId: number, step: string) => {
    const params = new URLSearchParams();
    params.set('courseId', courseId.toString());
    params.set('step', step);
    router.replace(`/instructor/create-new-course?${params.toString()}`, { scroll: false });
  }, [router]);

  // Getters
  const isStepCompleted = useCallback((step: string): boolean => {
    return courseData.completedSteps.includes(step);
  }, [courseData.completedSteps]);

  const getCurrentStep = useCallback((): string => {
    return courseData.currentStep;
  }, [courseData.currentStep]);

  const getCompletedSteps = useCallback((): string[] => {
    return courseData.completedSteps;
  }, [courseData.completedSteps]);

  // Initialize on mount
  useEffect(() => {
    console.log("Context: Initialization useEffect triggered");
    const urlCourseId = searchParams?.get('courseId');
    const courseId = urlCourseId ? parseInt(urlCourseId) : undefined;
    console.log("Context: URL courseId:", urlCourseId, "parsed courseId:", courseId);
    initializeCourse(courseId);
  }, []); // Remove initializeCourse from dependencies to prevent infinite re-renders

  const contextValue: CourseCreationContextType = {
    // State
    courseData,
    loading,
    error,
    
    // Actions
    initializeCourse,
    saveBasicInfo,
    saveAdvancedInfo,
    saveCurrentStep,
    markStepCompleted,
    updateCourseId,
    getInstructorCourses,
    clearCourseData,
    
    // Getters
    isStepCompleted,
    getCurrentStep,
    getCompletedSteps,
  };

  return (
    <CourseCreationContext.Provider value={contextValue}>
      {children}
    </CourseCreationContext.Provider>
  );
};

// Hook to use the context
export const useCourseCreation = (): CourseCreationContextType => {
  const context = useContext(CourseCreationContext);
  if (context === undefined) {
    throw new Error('useCourseCreation must be used within a CourseCreationProvider');
  }
  return context;
}; 