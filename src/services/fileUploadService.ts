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
  mutation Upload($files: [Upload]!, $filetype: String!) {
    upload(files: $files, filetype: $filetype) {
      baseUrl
      data
      success
    }
  }
`;

/**
 * Uploads a file to the server
 * @param file The file to upload
 * @param filetype The type of file (RESOURCE, PROFILE, COURSE)
 * @returns The URL of the uploaded file or null if failed
 */
export const uploadFile = async (
  file: File,
  filetype: FileTypeEnum = 'RESOURCE'
): Promise<string | null> => {
  try {
    console.log("Starting file upload:", file.name, "Type:", filetype);
    
    // Make the GraphQL mutation
    const { data, errors } = await apolloClient.mutate({
      mutation: UPLOAD_FILE,
      variables: {
        files: [file], // Important: This needs to be an array
        filetype
      },
      context: {
        includeAuth: true
      },
      fetchPolicy: 'no-cache'
    });
    
    if (errors) {
      console.error("GraphQL errors:", errors);
      
      // Check if any errors are related to authentication
      const authErrors = errors.filter(err => 
        err.message.toLowerCase().includes('auth') || 
        err.message.toLowerCase().includes('token') ||
        err.message.toLowerCase().includes('credentials') ||
        err.message.toLowerCase().includes('permission')
      );
      
      if (authErrors.length > 0) {
        console.error("Authentication errors detected:", authErrors);
        toast.error("Authentication failed. Please try logging in again.");
        return null;
      }
      
      toast.error(errors[0]?.message || "An error occurred during file upload");
      return null;
    }
    
    if (data?.upload?.success) {
      const url = data.upload.baseUrl;
      console.log("File uploaded successfully:", url);
      toast.success("File uploaded successfully!");
      return url;
    } else {
      console.error("Upload failed:", data);
      toast.error("Failed to upload file");
      return null;
    }
  } catch (err) {
    console.error("Error uploading file:", err);
    
    // Handle specific error types
    if (err instanceof Error) {
      if (err.message.includes('NetworkError')) {
        toast.error("Network error. Please check your connection and try again.");
      } else {
        toast.error(err.message || "Failed to upload file");
      }
    } else {
      toast.error("An unexpected error occurred during file upload");
    }
    
    return null;
  }
};