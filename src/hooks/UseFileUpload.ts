import { useState } from 'react';
import { gql } from '@apollo/client';
import { apolloClient } from '@/lib/apollo-client';
import { toast } from 'react-hot-toast';

// Define TypeScript types for clarity and type safety
export type FileTypeEnum = 'RESOURCE' | 'PROFILE' | 'COURSE';

interface UploadResponse {
  baseUrl: string;
  data: string;
  success: boolean;
}

interface UploadResult {
  upload: UploadResponse;
}

// Define the upload mutation
const UPLOAD_FILE = gql`
  mutation UploadFile($file: Upload!, $filetype: String!) {
    upload(files: [$file], filetype: $filetype) {
      baseUrl
      data
      success
    }
  }
`;

// Custom hook for file uploads
export const useFileUpload = () => {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  
  // Function to handle file upload
  const uploadFile = async (
    file: File, 
    filetype: FileTypeEnum = 'RESOURCE',
    onSuccess?: (url: string) => void
  ) => {
    try {
      setIsUploading(true);
      setError(null);
      
      // Use apolloClient.mutate directly instead of useMutation hook
      const { data, errors } = await apolloClient.mutate({
        mutation: UPLOAD_FILE,
        variables: {
          file, // Single file
          filetype
        },
        context: {
          includeAuth: true // This tells Apollo to include the auth token
        },
        fetchPolicy: 'no-cache' // Force network request, bypass cache
      });
      
      if (errors) {
        console.error("GraphQL errors:", errors);
        throw new Error(errors[0]?.message || "Error uploading file");
      }
      
      if (data?.upload?.success) {
        const url = data.upload.baseUrl;
        if (onSuccess) {
          onSuccess(url);
        }
        toast.success("File uploaded successfully!");
        return url;
      } else {
        throw new Error("Upload failed");
      }
    } catch (err) {
      console.error("Error uploading file:", err);
      
      // Handle specific error types
      if (err instanceof Error) {
        if (err.message.includes('NetworkError')) {
          setError(new Error("Network error. Please check your connection and try again."));
          toast.error("Network error. Please check your connection and try again.");
        } else if (err.message.includes('Authentication') || err.message.includes('credentials')) {
          setError(new Error("Authentication failed. Please log in again."));
          toast.error("Authentication failed. Please log in again.");
        } else {
          setError(err);
          toast.error(err.message || "Failed to upload file");
        }
      } else {
        const errorMessage = "An unexpected error occurred";
        setError(new Error(errorMessage));
        toast.error(errorMessage);
      }
      
      return null;
    } finally {
      setIsUploading(false);
    }
  };
  
  return {
    uploadFile,
    isUploading,
    error
  };
};