// hooks/useFileUpload.tsx
import { useState, useRef } from "react";
import { toast } from "react-hot-toast";
import { ContentType } from "@/lib/types";
import { uploadFile } from "@/services/fileUploadService";

export const useFileUpload = (
  updateLectureWithUploadedContent: (
    sectionId: string,
    lectureId: string,
    contentType: ContentType,
    fileUrl: string,
    fileName: string
  ) => void,
  onUploadComplete?: () => void
) => {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const triggerFileUpload = (contentType: ContentType) => {
    if (fileInputRef.current) {
      fileInputRef.current.setAttribute(
        "accept",
        contentType === ContentType.VIDEO ? "video/*" : "*/*"
      );
      fileInputRef.current.click();
    }
  };

  const handleFileSelection = async (
    e: React.ChangeEvent<HTMLInputElement>,
    contentType: ContentType,
    sectionId?: string,
    lectureId?: string
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    try {
      setIsUploading(true);
      setUploadProgress(0);
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          const newProgress = prev + Math.random() * 20;
          return newProgress >= 100 ? 100 : newProgress;
        });
      }, 500);

      const fileType = contentType === ContentType.VIDEO ? "VIDEO" : "RESOURCE";
      const url = await uploadFile(file, fileType);
      clearInterval(progressInterval);
      setUploadProgress(100);

      if (url) {
        updateLectureWithUploadedContent(
          sectionId!,
          lectureId!,
          contentType,
          url,
          file.name
        );
        toast.success(
          `${
            contentType === ContentType.VIDEO ? "Video" : "File"
          } uploaded successfully!`
        );
        if (onUploadComplete) onUploadComplete();
      }
    } catch (error) {
      console.error(`Upload error:`, error);
      toast.error(
        `Failed to upload ${
          contentType === ContentType.VIDEO ? "video" : "file"
        }. Please try again.`
      );
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return {
    isUploading,
    uploadProgress,
    fileInputRef,
    triggerFileUpload,
    handleFileSelection,
  };
};
