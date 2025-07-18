// shared-hooks.ts
import { useState, useRef, useEffect } from "react";
import { UploadState } from "./shared-components";
import { uploadFile } from "@/services/fileUploadService";
import toast from "react-hot-toast";

export const useUploadManager = () => {
  const abortControllerRef = useRef<AbortController | null>(null);
  const [uploadState, setUploadState] = useState<UploadState>({
    isUploading: false,
    progress: 0,
    file: null,
    status: "idle",
    error: null,
  });

  const cancelUpload = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setUploadState({
      isUploading: false,
      progress: 0,
      file: null,
      status: "error",
      error: null,
    });
  };

  const handleUpload = async (file: File, fileType: "VIDEO" | "RESOURCE") => {
    if (!file) return;

    abortControllerRef.current = new AbortController();

    setUploadState({
      isUploading: true,
      progress: 0,
      file,
      status: "uploading",
      error: null,
    });

    const progressInterval = setInterval(() => {
      setUploadState((prev) => {
        if (prev.progress >= 95) return prev;
        const increment =
          prev.progress < 40 ? Math.random() * 10 + 5 : Math.random() * 3 + 1;
        return {
          ...prev,
          progress: Math.min(prev.progress + increment, 95),
        };
      });
    }, 300);

    try {
      const baseUrl = await uploadFile(
        file,
        fileType,
        abortControllerRef.current.signal
      );

      if (!baseUrl) throw new Error("Upload failed - no URL returned");

      clearInterval(progressInterval);
      setUploadState((prev) => ({ ...prev, progress: 100 }));

      setUploadState({
        isUploading: false,
        progress: 100,
        file: null,
        status: "success",
        error: null,
      });

      return baseUrl;
    } catch (error: any) {
      clearInterval(progressInterval);

      if (error.name === "AbortError") {
        setUploadState({
          isUploading: false,
          progress: 0,
          file: null,
          status: "idle",
          error: null,
        });
        return;
      }

      const errorMessage =
        error instanceof Error ? error.message : `${fileType} upload failed`;

      setUploadState({
        isUploading: false,
        progress: 100,
        file: null,
        status: "error",
        error: errorMessage,
      });

      toast.error(errorMessage);
      throw error;
    } finally {
      abortControllerRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return { uploadState, handleUpload, cancelUpload };
};

export const useFileHandling = () => {
  const [showUploaded, setShowUploaded] = useState(false);
  const [showChangeCancel, setShowChangeCancel] = useState(false);

  const handleChange = () => {
    setShowChangeCancel(true);
    setShowUploaded(false);
  };

  const handleCancelChange = () => {
    setShowChangeCancel(false);
    setShowUploaded(true);
  };

  const handleDelete = (onDeleteCallback: () => void) => {
    onDeleteCallback();
    setShowUploaded(false);
    setShowChangeCancel(false);
  };

  return {
    showUploaded,
    showChangeCancel,
    handleChange,
    handleCancelChange,
    handleDelete,
    setShowUploaded,
  };
};
