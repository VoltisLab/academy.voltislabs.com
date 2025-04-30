import { gql } from '@apollo/client';
import { apolloClient } from '@/lib/apollo-client';
import { toast } from 'react-hot-toast';

export type FileTypeEnum = 'RESOURCE' | 'PROFILE' | 'COURSE';

interface UploadResponse {
  baseUrl: string;
  data: string;
  success: boolean;
}

interface UploadResult {
  upload: UploadResponse;
}

const UPLOAD_FILE = gql`
  mutation Upload($files: [Upload]!, $filetype: FileTypeEnum!) {
    upload(files: $files, filetype: $filetype) {
      baseUrl
      data
      success
    }
  }
`;

export const uploadFile = async (
  file: File,
  filetype: FileTypeEnum = 'RESOURCE'
): Promise<string | null> => {
  try {
    console.log("Starting file upload:", file.name, "Type:", filetype);

    if (!(file instanceof File)) {
      throw new Error("Invalid file object");
    }

    const { data, errors } = await apolloClient.mutate<UploadResult>({
      mutation: UPLOAD_FILE,
      variables: {
        files: [file],
        filetype,
      },
      context: {
        includeAuth: true,
      },
      fetchPolicy: 'no-cache',
    });

    if (errors && errors.length) {
      console.error("GraphQL errors:", errors);
      toast.error(errors[0]?.message || "Upload failed");
      return null;
    }

    console.log(data)

    if (data?.upload?.success) {
      toast.success("File uploaded successfully!");
      return data.upload.baseUrl;
    } else {
      toast.error("File upload failed");
      return null;
    }
  } catch (err) {
    console.error("Upload error:", err);
    toast.error(err instanceof Error ? err.message : "Unexpected upload error");
    return null;
  }
};
