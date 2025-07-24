// services/useLectureService.ts
import { useState } from 'react';
import { ApolloError } from '@apollo/client';
import { apolloClient } from '@/lib/apollo-client';
import { toast } from 'react-hot-toast';
import { uploadFile } from '@/services/fileUploadService';
import { 
  CREATE_LECTURE, 
  UPDATE_LECTURE,
  DELETE_LECTURE,
  UPDATE_LECTURE_CONTENT,
  CreateLectureVariables,
  CreateLectureResponse,
  UpdateLectureVariables,
  UpdateLectureResponse,
  DeleteLectureVariables,
  DeleteLectureResponse,
  UpdateLectureDescriptionVariables,
  UPDATE_LECTURE_DESCRIPTION,
  UpdateLectureDescriptionResponse,
  UpdateLectureContentVariables,
  UpdateLectureContentResponse,
  UpdateLectureResourceResponse,
  UPDATE_LECTURE_RESOURCE,
  UpdateLectureResourceVariables,
  AddLectureResourcesVariables,
  AddLectureResourcesResponse,
  ADD_LECTURE_RESOURCES,
} from '@/api/course/lecture/mutation';
import { GET_LECTURE_RESOURCECS, GET_LECTURE_RESOURCES_LIST, GetLectureResourcesListResponse, GetLectureResourcesListVariables, GetLectureResourcesResponse, GetLectureResourcesVariables } from '@/api/course/lecture/queries';

export const useLectureService = () => {
  const [loading, setLoading] = useState(false);
  const [videoUploading, setVideoUploading] = useState(false);
  var [videoUploadProgress, setVideoUploadProgress] = useState(0);
  const [error, setError] = useState<Error | null>(null);


  const createLecture = async (variables: CreateLectureVariables) => {
    try {
      setLoading(true);
      setError(null);

      const { data, errors } = await apolloClient.mutate<CreateLectureResponse>({
        
        mutation: CREATE_LECTURE,
        variables,
        context: {
          includeAuth: true
        },
        fetchPolicy: 'no-cache'
      });

      if (errors) {
        console.error("GraphQL errors:", errors);
        throw new Error(errors[0]?.message || "An error occurred during lecture creation");
      }

      if (!data?.createLecture.success) {
        throw new Error("Failed to create lecture");
      }
      return data;
    } catch (err) {
      console.error("Lecture creation error:", err);
      
      if (err instanceof ApolloError) {
        const errorMessage = err.message || "Network error. Please check your connection and try again.";
        setError(new Error(errorMessage));
        toast.error(errorMessage);
      } else if (err instanceof Error) {
        setError(err);
        toast.error(err.message);
      } else {
        const genericError = new Error("An unexpected error occurred");
        setError(genericError);
        toast.error(genericError.message);
      }
      
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateLecture = async (variables: UpdateLectureVariables) => {
    try {
      setLoading(true);
      setError(null);

      const { data, errors } = await apolloClient.mutate<UpdateLectureResponse>({
        mutation: UPDATE_LECTURE,
        variables,
        context: {
          includeAuth: true
        },
        fetchPolicy: 'no-cache'
      });

      if (errors) {
        console.error("GraphQL errors:", errors);
        throw new Error(errors[0]?.message || "An error occurred during lecture update");
      }

      if (!data?.updateLecture.success) {
        throw new Error("Failed to update lecture");
      }

      toast.success("Lecture updated successfully!");
      return data;
    } catch (err) {
      console.error("Lecture update error:", err);
      
      if (err instanceof ApolloError) {
        const errorMessage = err.message || "Network error. Please check your connection and try again.";
        setError(new Error(errorMessage));
        toast.error(errorMessage);
      } else if (err instanceof Error) {
        setError(err);
        toast.error(err.message);
      } else {
        const genericError = new Error("An unexpected error occurred");
        setError(genericError);
        toast.error(genericError.message);
      }
      
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteLecture = async (variables: DeleteLectureVariables) => {
    try {
      setLoading(true);
      setError(null);

      const { data, errors } = await apolloClient.mutate<DeleteLectureResponse>({
        mutation: DELETE_LECTURE,
        variables,
        context: {
          includeAuth: true
        },
        fetchPolicy: 'no-cache'
      });

      if (errors) {
        console.error("GraphQL errors:", errors);
        throw new Error(errors[0]?.message || "An error occurred during lecture deletion");
      }

      if (!data?.deleteLecture.success) {
        throw new Error("Failed to delete lecture");
      }

      toast.success("Lecture deleted successfully!");
      return data;
    } catch (err) {
      console.error("Lecture deletion error:", err);
      
      if (err instanceof ApolloError) {
        const errorMessage = err.message || "Network error. Please check your connection and try again.";
        setError(new Error(errorMessage));
        toast.error(errorMessage);
      } else if (err instanceof Error) {
        setError(err);
        toast.error(err.message);
      } else {
        const genericError = new Error("An unexpected error occurred");
        setError(genericError);
        toast.error(genericError.message);
      }
      
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateLectureDescription = async (variables: UpdateLectureDescriptionVariables) => {
    try {
      setLoading(true);
      setError(null);

      const { data, errors } = await apolloClient.mutate<UpdateLectureDescriptionResponse>({
        mutation: UPDATE_LECTURE_DESCRIPTION,
        variables,
        context: {
          includeAuth: true
        },
        fetchPolicy: 'no-cache'
      });

      if (errors) {
        console.error("GraphQL errors:", errors);
        throw new Error(errors[0]?.message || "An error occurred during description update");
      }

      if (!data?.updateLecture.success) {
        throw new Error("Failed to update description");
      }

      toast.success("Description updated successfully!");
      return data;
    } catch (err) {
      console.error("Description update error:", err);
      
      if (err instanceof ApolloError) {
        const errorMessage = err.message || "Network error. Please check your connection and try again.";
        setError(new Error(errorMessage));
        toast.error(errorMessage);
      } else if (err instanceof Error) {
        setError(err);
        toast.error(err.message);
      } else {
        const genericError = new Error("An unexpected error occurred");
        setError(genericError);
        toast.error(genericError.message);
      }
      
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // NEW: Upload video and update lecture
  // NEW: Upload video and update lecture
const uploadVideoToLecture = async (
  lectureId: number,
  videoFile: File,
  onProgress?: (progress: number) => void
): Promise<string | null> => {
  let progressInterval: NodeJS.Timeout | null = null;
  
  try {
    setVideoUploading(true);
    setVideoUploadProgress(0);
    setError(null);

    // Simulate progress for UI (but cap at 80% until upload completes)
    progressInterval = setInterval(() => {
      setVideoUploadProgress(prev => {
        const newProgress = prev + Math.random() * 10;
        const clampedProgress = Math.min(newProgress, 80); // Stop at 80% until actual upload completes
        if (onProgress) onProgress(clampedProgress);
        return clampedProgress;
      });
    }, 500);

    // Upload file to backend
    const videoUrl = await uploadFile(videoFile, 'VIDEO');
    
    // Clear progress simulation
    if (progressInterval) {
      clearInterval(progressInterval);
      progressInterval = null;
    }

    if (!videoUrl) {
      throw new Error("Failed to upload video file");
    }

    // Set progress to 90% after successful file upload
    setVideoUploadProgress(90);
    if (onProgress) onProgress(90);

    // Update lecture with video URL
    const { data, errors } = await apolloClient.mutate<UpdateLectureContentResponse>({
      mutation: UPDATE_LECTURE_CONTENT,
      variables: {
        lectureId,
        videoUrl
      },
      context: {
        includeAuth: true
      },
      fetchPolicy: 'no-cache'
    });

    if (errors) {
      console.error("GraphQL errors:", errors);
      throw new Error(errors[0]?.message || "An error occurred during video update");
    }

    if (!data?.updateLecture.success) {
      throw new Error("Failed to update lecture with video");
    }

    // Only set to 100% after BOTH upload AND database update are successful
    setVideoUploadProgress(100);
    if (onProgress) onProgress(100);
    
    // toast.success("Video uploaded and linked successfully!");
    return videoUrl;
    
  } catch (err) {
    console.error("Video upload error:", err);
    
    // Clear progress simulation on error
    if (progressInterval) {
      clearInterval(progressInterval);
      progressInterval = null;
    }
    
    // Reset progress on error
    setVideoUploadProgress(0);
    if (onProgress) onProgress(0);
    
    if (err instanceof ApolloError) {
      const errorMessage = err.message || "Network error. Please check your connection and try again.";
      setError(new Error(errorMessage));
      toast.error(errorMessage);
    } else if (err instanceof Error) {
      setError(err);
      toast.error(err.message);
    } else {
      const genericError = new Error("An unexpected error occurred");
      setError(genericError);
      toast.error(genericError.message);
    }
    
    throw err;
  } finally {
    // Ensure progress simulation is cleared
    if (progressInterval) {
      clearInterval(progressInterval);
    }
    setVideoUploading(false);
    // Don't reset progress to 0 here - let it stay at 100% if successful, or 0 if failed
  }
};
  // NEW: Save article content as notes
  const saveArticleToLecture = async (lectureId: number, articleContent: string) => {
    try {
      setLoading(true);
      setError(null);

      const { data, errors } = await apolloClient.mutate<UpdateLectureContentResponse>({
        mutation: UPDATE_LECTURE_CONTENT,
        variables: {
          lectureId,
          notes: articleContent
        },
        context: {
          includeAuth: true
        },
        fetchPolicy: 'no-cache'
      });

      if (errors) {
        console.error("GraphQL errors:", errors);
        throw new Error(errors[0]?.message || "An error occurred during article save");
      }

      if (!data?.updateLecture.success) {
        throw new Error("Failed to save article");
      }

      toast.success("Article saved successfully!");
      return data;
    } catch (err) {
      console.error("Article save error:", err);
      
      if (err instanceof ApolloError) {
        const errorMessage = err.message || "Network error. Please check your connection and try again.";
        setError(new Error(errorMessage));
        toast.error(errorMessage);
      } else if (err instanceof Error) {
        setError(err);
        toast.error(err.message);
      } else {
        const genericError = new Error("An unexpected error occurred");
        setError(genericError);
        toast.error(genericError.message);
      }
      
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // NEW: Save description to lecture
  const saveDescriptionToLecture = async (lectureId: number, description: string) => {
    try {
      setLoading(true);
      setError(null);

      const { data, errors } = await apolloClient.mutate<UpdateLectureContentResponse>({
        mutation: UPDATE_LECTURE_CONTENT,
        variables: {
          lectureId,
          description
        },
        context: {
          includeAuth: true
        },
        fetchPolicy: 'no-cache'
      });

      if (errors) {
        console.error("GraphQL errors:", errors);
        throw new Error(errors[0]?.message || "An error occurred during description save");
      }

      if (!data?.updateLecture.success) {
        throw new Error("Failed to save description");
      }

      toast.success("Description saved successfully!");
      return data;
    } catch (err) {
      console.error("Description save error:", err);
      
      if (err instanceof ApolloError) {
        const errorMessage = err.message || "Network error. Please check your connection and try again.";
        setError(new Error(errorMessage));
        toast.error(errorMessage);
      } else if (err instanceof Error) {
        setError(err);
        toast.error(err.message);
      } else {
        const genericError = new Error("An unexpected error occurred");
        setError(genericError);
        toast.error(genericError.message);
      }
      
      throw err;
    } finally {
      setLoading(false);
    }
  };

const updateLectureResource = async (variables: UpdateLectureResourceVariables) => {
  try {
    setLoading(true);
    setError(null);

    const { data, errors } = await apolloClient.mutate<UpdateLectureResourceResponse>({
      mutation: UPDATE_LECTURE_RESOURCE,
      variables,
      context: {
        includeAuth: true
      },
      fetchPolicy: 'no-cache'
    });

    if (errors) {
      console.error("GraphQL errors:", errors);
      throw new Error(errors[0]?.message || "An error occurred during resource update");
    }

    if (!data?.updateLecture.success) {
      throw new Error("Failed to update lecture resource");
    }

    toast.success("Resource added successfully!");
    return data;
  } catch (err) {
    console.error("Resource update error:", err);
    
    if (err instanceof ApolloError) {
      const errorMessage = err.message || "Network error. Please check your connection and try again.";
      setError(new Error(errorMessage));
      toast.error(errorMessage);
    } else if (err instanceof Error) {
      setError(err);
      toast.error(err.message);
    } else {
      const genericError = new Error("An unexpected error occurred");
      setError(genericError);
      toast.error(genericError.message);
    }
    
    throw err;
  } finally {
    setLoading(false);
  }
};

const getLectureResources = async (variables: GetLectureResourcesVariables, setData?: any) => {
    try {
      setLoading(true);
      setError(null);

      const { data, errors } = await apolloClient.query<GetLectureResourcesResponse>({
        query: GET_LECTURE_RESOURCECS,
        variables,
        fetchPolicy: "network-only",
      });

      console.log(data)
      if(setData){
        setData(data)
      }

      if (errors) {
        console.error("GraphQL errors:", errors);
        throw new Error(errors[0]?.message || "An error occurred during lecture resources fetching");
      }

      if (!data?.getLecture.resource) {
        throw new Error("Failed to fetch lecture resources");
      }
      return data;
    } catch (err) {
      console.error("Lecture Resources Fetching error:", err);
      
      if (err instanceof ApolloError) {
        const errorMessage = err.message || "Network error. Please check your connection and try again.";
        setError(new Error(errorMessage));
        toast.error(errorMessage);
      } else if (err instanceof Error) {
        setError(err);
        toast.error(err.message);
      } else {
        const genericError = new Error("An unexpected error occurred");
        setError(genericError);
        toast.error(genericError.message);
      }
      
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getLectureResourcesList = async (
  variables: GetLectureResourcesListVariables,
  setData?: (data: GetLectureResourcesListResponse) => void
) => {
  try {
    setLoading(true);
    setError(null);

    const { data, errors } = await apolloClient.query<GetLectureResourcesListResponse>({
      query: GET_LECTURE_RESOURCES_LIST,
      variables,
      fetchPolicy: 'network-only',
    });

    console.log(data);

    if (setData) {
      setData(data);
    }

    if (errors) {
      console.error('GraphQL errors:', errors);
      throw new Error(errors[0]?.message || 'An error occurred during lecture resources fetching');
    }

    if (!data?.getLecture.resources || !Array.isArray(data.getLecture.resources)) {
      throw new Error('Failed to fetch lecture resources');
    }

    return data;
  } catch (err) {
    console.error('Lecture Resources Fetching error:', err);

    if (err instanceof ApolloError) {
      const errorMessage = err.message || 'Network error. Please check your connection and try again.';
      setError(new Error(errorMessage));
      toast.error(errorMessage);
    } else if (err instanceof Error) {
      setError(err);
      toast.error(err.message);
    } else {
      const genericError = new Error('An unexpected error occurred');
      setError(genericError);
      toast.error(genericError.message);
    }

    throw err;
  } finally {
    setLoading(false);
  }
};

    const updateLectureWithResource = async (lectureId: number, resourceUrl: string, resourceType: string) => {
      try {
        // Use the same working pattern as uploadVideoToLecture
        const { data, errors } = await apolloClient.mutate<UpdateLectureContentResponse>({
          mutation: UPDATE_LECTURE_CONTENT,
          variables: {
            lectureId,
            // Store resource info in notes field as a workaround
            notes: `Resource added: ${resourceType} - ${resourceUrl}`
          },
          context: {
            includeAuth: true
          },
          fetchPolicy: 'no-cache'
        });
  
        if (errors) {
          console.error("GraphQL errors:", errors);
          throw new Error(errors[0]?.message || "An error occurred during resource update");
        }
  
        if (!data?.updateLecture.success) {
          throw new Error("Failed to update lecture with resource");
        }
  
        return data;
      } catch (error) {
        console.error("Resource update error:", error);
        throw error;
      }
    };


const addLectureResources = async (variables: AddLectureResourcesVariables) => {
  try {
    setLoading(true);
    setError(null);

    const { data, errors } = await apolloClient.mutate<AddLectureResourcesResponse>({
      mutation: ADD_LECTURE_RESOURCES,
      variables,
      context: {
        includeAuth: true
      },
      fetchPolicy: 'no-cache'
    });

    if (errors) {
      throw new Error(errors[0]?.message || 'Error adding resources');
    }

    if (!data?.addLectureResources.success) {
      throw new Error(data?.addLectureResources.message || 'Failed to add resources');
    }

    toast.success('Resources added successfully!');
    return data;
  } catch (err) {
    console.error('Add resources error:', err);

    const message = err instanceof Error ? err.message : 'Unexpected error';
    setError(new Error(message));
    toast.error(message);

    throw err;
  } finally {
    setLoading(false);
  }
};

  return {
    createLecture,
    updateLectureWithResource,
    updateLecture,
    deleteLecture,
    getLectureResources,
    updateLectureDescription,
    uploadVideoToLecture,
    saveArticleToLecture,
    saveDescriptionToLecture,
    updateLectureResource,
    addLectureResources,
    getLectureResourcesList,
    loading,
    videoUploading,
    videoUploadProgress,
    error
  };
};