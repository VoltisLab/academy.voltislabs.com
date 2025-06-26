import { gql } from "@apollo/client";
import { apolloClient } from "@/lib/apollo-client";
import { toast } from "react-hot-toast";

export type FileTypeEnum = "RESOURCE" | "PROFILE_PICTURE" | "VIDEO";

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
  filetype: FileTypeEnum
): Promise<string | null> => {
  try {
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
      fetchPolicy: "no-cache",
    });

    if (errors && errors.length) {
      console.error("GraphQL errors:", errors);
      toast.error(errors[0]?.message || "Upload failed");
      return null;
    }

    if (data?.upload?.success) {
      const baseUrl = data.upload.baseUrl;
      const rawJson = data.upload.data?.[0]; // JSON string
      const parsed = rawJson ? JSON.parse(rawJson) : null;

      if (parsed?.file_url) {
        return `${baseUrl}${parsed.file_url}`;
      } else {
        toast.error("Invalid upload response format");
        return null;
      }
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

