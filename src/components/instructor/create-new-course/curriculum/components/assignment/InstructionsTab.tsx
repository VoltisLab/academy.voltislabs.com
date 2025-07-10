import { ExtendedLecture } from "@/lib/types";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import RichTextEditor from "./NewRichTextEditor";
import toast from "react-hot-toast";
import { UpdateAssignmentVariables } from "@/api/assignment/mutation";
import { useParams } from "next/navigation";
import { useAssignmentService } from "@/services/useAssignmentService";
import { ChevronDown, ChevronUp, Search, Trash2, XIcon } from "lucide-react";
import { uploadFile } from "@/services/fileUploadService";
import { motion } from "framer-motion";
import { HLSVideoPlayer } from "./HLSVideoPlayer";
import { Video } from "./AssignmentEditor";
import { FiDownload } from "react-icons/fi";

export interface UploadState {
  isUploading: boolean;
  progress: number;
  file: File | null;
  status: "idle" | "uploading" | "success" | "error";
  error: string | null;
}

const InstructionsTab: React.FC<{
  data: ExtendedLecture;
  onChange: (field: string, value: any) => void;
  hasSubmitted: boolean;
  fetchAssignment: () => Promise<void>;
  libraryVideos: Video[];
  setLibraryVideos: Dispatch<SetStateAction<Video[]>>;
  sortByNameAsc: boolean;
  sortByDateAsc: boolean;
  toggleSortByName: () => void;
  toggleSortByDate: () => void;
}> = ({
  data,
  onChange,
  hasSubmitted,
  fetchAssignment,
  libraryVideos,
  setLibraryVideos,
  sortByNameAsc,
  sortByDateAsc,
  toggleSortByName,
  toggleSortByDate,
}) => {
  console.log(data);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeVideoTab, setActiveVideoTab] = useState<
    "upload" | "library" | null
  >("upload");
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditingInstructions, setIsEditingInstructions] = useState(true);
  const [showVideoUploaded, setShowVideoUploaded] = useState(false);
  const [showResourceUploaded, setShowResourceUploaded] = useState(false);
  const [showChangeCancel, setShowChangeCancel] = useState(false);
  const [showResourceChangeCancel, setShowResourceChangeCancel] =
    useState(false);
  const params = useParams();
  const id = params?.id;

  console.log(sortByNameAsc, sortByDateAsc);

  const showEditor = isEditingInstructions || !hasSubmitted;

  const [uploadState, setUploadState] = useState<UploadState>({
    isUploading: false,
    progress: 0,
    file: null,
    status: "idle",
    error: null,
  });

  const [resourceUploadState, setResourceUploadState] = useState<UploadState>({
    isUploading: false,
    progress: 0,
    file: null,
    status: "idle",
    error: null,
  });

  const handleResourceUpload = async (file: File) => {
    if (!file) return;

    abortControllerRef.current = new AbortController();

    // Set uploading state
    setResourceUploadState({
      isUploading: true,
      progress: 0,
      file,
      status: "uploading",
      error: null,
    });

    const progressInterval = setInterval(() => {
      setResourceUploadState((prev) => {
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
        "RESOURCE",
        abortControllerRef.current.signal
      );

      if (!baseUrl) {
        throw new Error("Upload failed - no URL returned");
      }

      clearInterval(progressInterval);
      setResourceUploadState((prev) => ({ ...prev, progress: 100 }));

      const updateVariables: UpdateAssignmentVariables = {
        assignmentId: Number(id),
        instructionDownloadableResource: {
          fileName: file.name,
          url: baseUrl,
        },
      };

      await updateAssignment(updateVariables);

      onChange("instructionalResource", {
        file,
        url: baseUrl,
        name: file.name,
      });

      setResourceUploadState({
        isUploading: false,
        progress: 100,
        file: null,
        status: "success",
        error: null,
      });

      setShowResourceUploaded(true);

      toast.success("Resource uploaded successfully!");
    } catch (error: any) {
      clearInterval(progressInterval);

      if (error.name === "AbortError") {
        setResourceUploadState({
          isUploading: false,
          progress: 0,
          file: null,
          status: "idle",
          error: null,
        });

        return;
      }

      const errorMessage =
        error instanceof Error ? error.message : "Resource upload failed";

      setResourceUploadState({
        isUploading: false,
        progress: 100,
        file: null,
        status: "error",
        error: errorMessage,
      });

      toast.error(errorMessage);
    } finally {
      abortControllerRef.current = null;
    }
  };

  // const handleVideoSelect = (video: any) => {};

  const [isSelectingVideo, setIsSelectingVideo] = useState(false);

  const handleVideoSelect = async (video: any) => {
    // Begin loading state
    setIsSelectingVideo(true);

    const updateVariables: UpdateAssignmentVariables = {
      assignmentId: Number(id),
      instructionVideo: {
        fileName: video.filename || "",
        url: video.url || "",
      },
    };

    try {
      await updateAssignment(updateVariables);
      onChange("instructionalVideo", {
        file: null,
        url: video.url,
        file_name: video.filename,
      });
      setShowVideoUploaded(true);
      setActiveVideoTab(null);
      toast.success("Video selected successfully");
      await fetchAssignment();
    } catch (error) {
      console.error("Failed to update solution video:", error);
      toast.error("Could not select video");
    } finally {
      setIsSelectingVideo(false);
    }
  };

  const handleChangeVideo = () => {
    setShowChangeCancel(true);
    setShowVideoUploaded(false);
    setActiveVideoTab("upload");
  };

  console.log(libraryVideos);

  const handleCancelChange = () => {
    setShowChangeCancel(false);
    setShowVideoUploaded(true);
    setActiveVideoTab(null);
  };

  const handleChangeResource = () => {
    setShowResourceChangeCancel(true);
    setShowResourceUploaded(false);
  };
  const handleCancelResourceChange = () => {
    setShowResourceChangeCancel(false);
    setShowResourceUploaded(true);
  };

  const { updateAssignment } = useAssignmentService();

  console.log("This is the data", data.videoUrl);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitInstructions = async () => {
    setIsSubmitting(true);

    try {
      if (!data.instructions || data.instructions.trim() === "") {
        toast.error("Please enter assignment instructions.");
        return;
      }

      const cleanedInstructions = data.instructions
        .replace(/<p><br><\/p>/g, "") // remove <p><br></p>
        .replace(/<[^>]*>/g, "") // remove all HTML tags
        .trim(); // trim whitespace

      if (!cleanedInstructions) {
        toast.error("Please enter assignment instructions.");
        return;
      }

      const variables: UpdateAssignmentVariables = {
        assignmentId: Number(id),
        instructions: cleanedInstructions,
      };

      await updateAssignment(variables);
      toast.success("Instructions saved successfully!");
      fetchAssignment();
      setIsEditingInstructions(false);
    } catch (error) {
      console.error("Failed to update instructions:", error);
      toast.error("Something went wrong while saving. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditInstructions = () => {
    setIsEditingInstructions(true);
  };

  const filteredVideos = libraryVideos.filter((video) =>
    video.filename.toLowerCase().includes(searchQuery.toLowerCase())
  );

  let sortedVideos = [...filteredVideos];

  if (sortByNameAsc) {
    sortedVideos.sort((a, b) => a.filename.localeCompare(b.filename));
  } else if (sortByDateAsc) {
    sortedVideos.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  } else {
    sortedVideos = [...filteredVideos];
  }

  const handleLibraryVideoDelete = (id: string) => {
    setLibraryVideos((prev) => prev.filter((video) => video.id !== id));
  };

  const [isDeletingVideo, setIsDeletingVideo] = useState(false);
  const handleVideoDelete = async () => {
    setIsDeletingVideo(true);
    try {
      const updateVariables: UpdateAssignmentVariables = {
        assignmentId: Number(id),
        instructionVideo: {
          fileName: "",
          url: "",
        },
      };
      await updateAssignment(updateVariables);
      toast.success("Video removed successfully");

      // Clear the video state
      onChange("instructionalVideo", null);

      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      // Reset all related states
      setShowVideoUploaded(false);
      setShowChangeCancel(false);
      setActiveVideoTab("upload");
      await fetchAssignment();
    } catch (error) {
      toast.error("Could not remove video");
    } finally {
      setIsDeletingVideo(false);
    }
  };

  const [isDeletingResource, setIsDeletingResource] = useState(false);

  const handleResourceDelete = async () => {
    setIsDeletingResource(true);
    try {
      const updateVariables: UpdateAssignmentVariables = {
        assignmentId: Number(id),
        instructionDownloadableResource: {
          fileName: "",
          url: "",
        },
      };
      const data = await updateAssignment(updateVariables);

      console.log(data);
      toast.success("Resource removed successfully");
      await fetchAssignment();
      onChange("instructionalResource", null);
      setResourceUploadState({
        isUploading: false,
        progress: 0,
        file: null,
        status: "idle",
        error: null,
      });
      setShowResourceUploaded(false);
      setShowResourceChangeCancel(false);
    } catch (error) {
      toast.error("Could not remove Resource");
    } finally {
      setIsDeletingResource(false);
    }
  };

  // const [isDeletingVideo, setIsDeletingVideo] = useState(false);
  // const [isDeletingResource, setIsDeletingResource] = useState(false);
  // const handleDeleteVideo = async (id: string) => {
  //   setIsDeletingVideo(true);
  //   try {
  //     setLibraryVideos((prev) => prev.filter((video) => video.id !== id));
  //     const updateVariables: UpdateAssignmentVariables = {
  //       assignmentId: Number(id),
  //       videoUrl: "",
  //     };
  //     await updateAssignment(updateVariables);
  //     toast.success("Video removed successfully");
  //     await fetchAssignment();
  //   } catch (error) {
  //     toast.error("Could not remove video");
  //   } finally {
  //     setIsDeletingVideo(false);
  //   }
  // };

  const abortControllerRef = useRef<AbortController | null>(null);

  const handleVideoUpload = async (file: File) => {
    if (!file) return;

    abortControllerRef.current = new AbortController();

    // Reset and set initial state
    setUploadState({
      isUploading: true,
      progress: 0,
      file,
      status: "uploading",
      error: null,
    });

    // 2. Add to library immediately (optimistic update)
    const newVideo: Video = {
      id: String(libraryVideos.length + 1),
      filename: file.name,
      type: "Video",
      status: "processing",
      date: new Date().toLocaleDateString(),
    };

    setLibraryVideos((prev) => [newVideo, ...prev]);

    // Simulate realistic progress
    const progressInterval = setInterval(() => {
      setUploadState((prev) => {
        if (prev.progress >= 95) return prev;

        // Faster progress at the beginning
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
        "VIDEO",
        abortControllerRef.current.signal
      );

      if (!baseUrl) {
        throw new Error("Upload failed - no URL returned");
      }

      clearInterval(progressInterval);
      setUploadState((prev) => ({ ...prev, progress: 100 }));

      // 3. Update the assignment with the new video URL
      const updateVariables: UpdateAssignmentVariables = {
        assignmentId: Number(id),
        instructionVideo: {
          fileName: file.name,
          url: baseUrl,
        }, // Make sure your API accepts this field
      };

      await updateAssignment(updateVariables);

      // 4. Update local state
      onChange("instructionalVideo", {
        file,
        url: baseUrl,
        filename: file.name,
      });

      const newVideo: Video = {
        id: String(libraryVideos.length + 1),
        filename: file.name,
        type: "Video",
        status: "success",
        url: baseUrl,
        date: new Date().toLocaleDateString(),
      };

      setLibraryVideos((prev) => [newVideo, ...prev]);

      setUploadState({
        isUploading: false,
        progress: 100,
        file: null,
        status: "success",
        error: null,
      });

      setLibraryVideos((prev: any) =>
        prev.filter((video: any) => video.status !== "processing")
      );

      setShowVideoUploaded(true);
      setActiveVideoTab(null);

      toast.success("Video uploaded and assignment updated successfully!");
    } catch (error: any) {
      clearInterval(progressInterval);

      console.log(error);

      if (error.name === "AbortError") {
        // User canceled the upload
        setUploadState({
          isUploading: false,
          progress: 0,
          file: null,
          status: "idle",
          error: null,
        });
        return;
      }

      // Add to library even if failed
      const newVideo: Video = {
        id: String(libraryVideos.length + 1),
        filename: file.name,
        type: "Video",
        status: "failed",
        url: "",
        date: new Date().toLocaleDateString(),
      };

      setLibraryVideos((prev) => [newVideo, ...prev]);

      setLibraryVideos((prev) =>
        prev.filter((video: any) => video.status !== "processing")
      );

      const errorMessage =
        error instanceof Error ? error.message : "Video upload failed";

      setUploadState({
        isUploading: false,
        progress: 100,
        file: null,
        status: "error",
        error: errorMessage,
      });

      toast.error(errorMessage);
    } finally {
      abortControllerRef.current = null;
    }
  };

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

    // Remove the "processing" video from library
    setLibraryVideos((prev) =>
      prev.filter((video) => video.status !== "processing")
    );

    // toast.success("Upload canceled");
  };

  const cancelResourceUpload = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    setResourceUploadState({
      isUploading: false,
      progress: 0,
      file: null,
      status: "error",
      error: null,
    });
  };

  // Clean up on unmount
  useEffect(() => {
    console.log(data.solutionResource);
    if (data.instructionalVideo?.file_name) setShowVideoUploaded(true);
    if (data.instructionalResource?.file_name) setShowResourceUploaded(true);
    if (data.instructions) setIsEditingInstructions(false);

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return (
    <div className="px-2 py-4 md:p-6 space-y-10 lg:space-y-20">
      {/* Video Section */}
      <div>
        <h3 className="text-sm font-bold text-gray-900 mb-2">Video</h3>

        {!showVideoUploaded ? (
          <>
            {/* Video Tabs */}
            <div className="border-b border-gray-200 mb-4">
              <div className="flex gap-4">
                <button
                  onClick={() => setActiveVideoTab("upload")}
                  className={`px-1 py-2 font-bold text-sm border-b-2 ${
                    activeVideoTab === "upload"
                      ? "border-zinc-700 text-zincborder-zinc-700"
                      : "border-transparent text-zinc-500 hover:text-zincborder-zinc-700"
                  }`}
                >
                  Upload Video
                </button>
                <button
                  onClick={() => setActiveVideoTab("library")}
                  className={`px-1 py-2 font-bold text-sm border-b-2 ${
                    activeVideoTab === "library"
                      ? "border-zinc-700 text-zincborder-zinc-700"
                      : "border-transparent text-zinc-500 hover:text-zincborder-zinc-700"
                  }`}
                >
                  Add from library
                </button>
              </div>
            </div>

            {/* Upload Video Tab Content */}
            {activeVideoTab === "upload" && (
              <div>
                {uploadState.isUploading ? (
                  <div className="overflow-hidden">
                    <div className="w-full overflow-x-auto">
                      <div className="min-w-[700px] space-y-4">
                        {" "}
                        <div className="border-b border-gray-300 py-2">
                          <div
                            className="grid font-bold text-gray-800"
                            style={{
                              gridTemplateColumns: "30% 15% 25% 20% 10%",
                            }}
                          >
                            <div>Filename</div>
                            <div>Type</div>
                            <div>Status</div>
                            <div>Date</div>
                            <div></div>
                          </div>
                          <div
                            className="grid text-sm text-zincborder-zinc-700 mt-2 items-center"
                            style={{
                              gridTemplateColumns: "30% 15% 25% 20% 10%",
                            }}
                          >
                            <div className="truncate">
                              {uploadState.file?.name || "Uploading..."}
                            </div>
                            <div>Video</div>
                            <div className="flex items-center">
                              <div className="w-full flex items-center">
                                <div className="w-30 bg-gray-200 h-2 overflow-hidden rounded">
                                  <motion.div
                                    className="bg-[#6D28D2] h-2"
                                    initial={{ width: 0 }}
                                    animate={{
                                      width: `${uploadState.progress}%`,
                                    }}
                                    transition={{
                                      duration: 0.3,
                                      ease: "easeOut",
                                    }}
                                  />
                                </div>
                                <span className="ml-2 text-xs">
                                  {Math.trunc(uploadState.progress)}%
                                  {uploadState.progress >= 95 &&
                                    uploadState.status === "uploading" &&
                                    " (Processing...)"}
                                </span>
                              </div>
                            </div>
                            <div>{new Date().toLocaleDateString()}</div>
                            <div className="flex">
                              <XIcon
                                className="text-[#6D28D9] hover:bg-[rgba(108,40,210,0.125)] font-semibold ml-auto cursor-pointer text-sm"
                                onClick={() => cancelUpload()}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {uploadState.status === "error" && (
                      <div className="text-red-500 text-sm mt-2">
                        {uploadState.error}
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-2">
                      <span className="text-zinc-700 max-w-lg font-semibold text-sm w-full border border-zinc-700 py-3 px-4 rounded">
                        {/* {data.instructionalVideo?.file
                          ? data.instructionalVideo.file.name
                          : "No file selected"} */}
                        No file selected
                      </span>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3 py-3 border font-bold text-sm border-[#6d28d2] text-[#6d28d2] rounded hover:bg-[rgba(108,40,210,0.125)] cursor-pointer transition whitespace-nowrap"
                      >
                        Select Video
                      </button>
                    </div>
                    {showChangeCancel && (
                      <button
                        onClick={handleCancelChange}
                        className="px-4 py-2 bg-[#6d28d2] text-white rounded hover:bg-purple-600 cursor-pointer mt-2"
                      >
                        Cancel
                      </button>
                    )}
                    <p className="text-xs text-gray-500 mt-2">
                      <span className="font-bold">Note:</span> All files should
                      be at least 720p and less than 4.0 GB.
                    </p>
                  </>
                )}
              </div>
            )}

            {/* Library Tab Content */}
            {activeVideoTab === "library" && (
              <div>
                {/* Search Bar */}
                <div className="mb-4 flex">
                  <div className="relative flex w-2/3 gap-2 ml-auto">
                    <input
                      type="text"
                      placeholder="Search files by name"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full py-2 px-3 border border-gray-400 rounded focus:outline-none focus:border-[#6D28D9]"
                    />

                    <button className="p-2 bg-[#6D28D9] text-white rounded hover:bg-indigo-700">
                      <Search className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Video Library Table */}
                <div className="overflow-hidden">
                  {/* Scrollable Table Wrapper */}
                  <div className="w-full overflow-x-auto">
                    {/* Inner Wrapper with Min Width to Trigger Scroll on Small Screens */}
                    <div className="min-w-[700px]">
                      {/* Table Header */}
                      <div className="px-4 py-3 border-b border-gray-200">
                        <div
                          className="grid font-bold text-sm text-zinc border-zinc-700"
                          style={{
                            gridTemplateColumns: "35% 11.67% 16.67% 16.66% 20%",
                          }}
                        >
                          <div className="flex items-center gap-1 group">
                            <span>Filename</span>
                            <div
                              className="cursor-pointer"
                              onClick={toggleSortByName}
                            >
                              {sortByNameAsc ? (
                                <ChevronUp
                                  size={23}
                                  className="group-hover:opacity-100 opacity-0 p-1 hover:bg-gray-200 rounded transition shrink-0"
                                />
                              ) : (
                                <ChevronDown
                                  size={23}
                                  className="group-hover:opacity-100 opacity-0 p-1 hover:bg-gray-200 rounded transition shrink-0"
                                />
                              )}
                            </div>
                          </div>
                          <div>Type</div>
                          <div>Status</div>
                          <div className="flex items-center gap-1">
                            <span>Date</span>
                            <div
                              className="cursor-pointer"
                              onClick={toggleSortByDate}
                            >
                              {sortByDateAsc ? (
                                <ChevronUp
                                  size={23}
                                  className="p-1 hover:bg-gray-200 rounded transition shrink-0"
                                />
                              ) : (
                                <ChevronDown
                                  size={23}
                                  className="p-1 hover:bg-gray-200 rounded transition shrink-0"
                                />
                              )}
                            </div>
                          </div>
                          <div></div>
                        </div>
                      </div>

                      {/* Table Body */}
                      <div className="divide-y divide-gray-200">
                        {sortedVideos.length === 0 ? (
                          <div className="text-center text-gray-500 py-6">
                            No result found
                          </div>
                        ) : (
                          sortedVideos.map((video, index) => (
                            <div
                              key={index}
                              className="px-4 py-3 hover:bg-gray-50"
                            >
                              <div
                                className="grid font-medium text-sm text-zincborder-zinc-700"
                                style={{
                                  gridTemplateColumns:
                                    "35% 11.67% 16.67% 16.66% 20%",
                                }}
                              >
                                <div className="text-gray-900">
                                  {video.filename}
                                </div>
                                <div className="text-gray-600">
                                  {video.type}
                                </div>
                                <div
                                  className={`capitalize ${
                                    video.status === "failed"
                                      ? "text-red-600"
                                      : "text-gray-600"
                                  }`}
                                >
                                  {video.status}
                                </div>
                                <div className="text-gray-600">
                                  {video.date}
                                </div>
                                <div className="flex items-center gap-2">
                                  {video.status === "success" && (
                                    <button
                                      disabled={isSelectingVideo}
                                      onClick={async () => {
                                        await handleVideoSelect(video);
                                        handleLibraryVideoDelete(video.id);
                                      }}
                                      className={`text-[#6D28D9] hover:text-purple-800 hover:bg-purple-100 font-semibold ml-auto cursor-pointer an text-sm transition ${
                                        isSelectingVideo ? "" : ""
                                      }`}
                                    >
                                      Select
                                    </button>
                                  )}

                                  <Trash2
                                    className={`text-[#6D28D9] hover:text-purple-800 hover:bg-purple-100 cursor-pointer ${
                                      video.status !== "success" && "ml-auto"
                                    }`}
                                    size={15}
                                    onClick={() =>
                                      handleLibraryVideoDelete(video.id)
                                    }
                                  />
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="space-y-4">
            <div className="border border-gray-300 rounded p-4 bg-gray-100">
              <div className="flex justify-between items-center font-semibold">
                <span className="text-zincborder-zinc-700">
                  {data.instructionalVideo?.file?.name ||
                    data.instructionalVideo?.file_name ||
                    "No video selected"}
                </span>
              </div>
            </div>

            <div className="h-80">
              {data.instructionalVideo?.url || data.videoUrl ? (
                data.instructionalVideo?.file ? (
                  <video
                    controls
                    src={
                      data.instructionalVideo.file
                        ? URL.createObjectURL(data.instructionalVideo.file)
                        : data.instructionalVideo.url
                    }
                    className="w-full h-full rounded object-contain"
                  />
                ) : (
                  <HLSVideoPlayer
                    src={
                      data.instructionalVideo?.url || (data.videoUrl as string)
                    }
                  />
                )
              ) : (
                <div className="flex items-center justify-center h-full text-center text-gray-500">
                  <p>No video preview available.</p>
                </div>
              )}
            </div>

            {/* Files change and delete buttons */}
            <div className="flex space-x-2 mb-20">
              <button
                onClick={handleChangeVideo}
                className="px-4 py-2 bg-[#6d28d2] text-white rounded hover:bg-purple-600 cursor-pointer"
              >
                Change
              </button>
              <button
                onClick={() => handleVideoDelete()}
                disabled={isDeletingVideo}
                className="px-4 py-2 border font-bold text-sm border-[#6d28d2] text-[#6d28d2] rounded hover:bg-[rgba(108,40,210,0.125)] cursor-pointer transition"
              >
                {isDeletingVideo ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Assignment Instructions */}
      <div className="mt-10">
        <h3 className="text-sm font-bold text-gray-900 mb-2">
          Assignment Instructions
        </h3>
        {showEditor ? (
          <>
            <RichTextEditor
              value={data.instructions || ""}
              onChange={(value) => onChange("instructions", value)}
              placeholder="Enter assignment instructions..."
            />
            <div className="flex gap-2 mt-4">
              <button
                disabled={isSubmitting}
                onClick={handleSubmitInstructions}
                className="px-4 py-2 bg-[#6d28d2] text-white rounded hover:bg-purple-600 cursor-pointer disabled:bg-[rgba(108,40,210,0.3)] disabled:cursor-not-allowed transition"
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
              <button
                onClick={() => {
                  setIsEditingInstructions(false);
                }}
                className="px-4 py-2 border font-bold text-sm border-[#6d28d2] text-[#6d28d2] rounded hover:bg-[rgba(108,40,210,0.125)] cursor-pointer transition"
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <div className="space-y-2">
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{
                __html: data.instructions || "",
              }}
            />
            <button
              onClick={handleEditInstructions}
              className="px-4 py-2 bg-[#6d28d2] text-white rounded hover:bg-purple-600 cursor-pointer"
            >
              Edit
            </button>
          </div>
        )}
      </div>

      {/* Downloadable Resource */}
      <div className="mt-10">
        <h3 className="text-sm font-bold text-gray-900 mb-2">
          Downloadable resource
        </h3>

        {!showResourceUploaded ? (
          <div>
            {resourceUploadState.isUploading ? (
              <div className="overflow-hidden">
                <div className="w-full max-w-[calc(32rem+90px)] overflow-x-auto">
                  <div className="min-w-[600px] space-y-4">
                    {" "}
                    <div className="border-b border-gray-300 py-2">
                      <div
                        className="grid font-bold text-gray-800"
                        style={{
                          gridTemplateColumns: "30% 15% 25% 20% 10%",
                        }}
                      >
                        <div>Filename</div>
                        <div>Type</div>
                        <div>Status</div>
                        <div>Date</div>
                        <div></div>
                      </div>
                      <div
                        className="grid text-sm text-zincborder-zinc-700 mt-2 items-center"
                        style={{
                          gridTemplateColumns: "30% 15% 25% 20% 10%",
                        }}
                      >
                        <div className="truncate">
                          {resourceUploadState.file?.name || "Uploading..."}
                        </div>
                        <div>Video</div>
                        <div className="flex items-center">
                          <div className="w-full flex items-center">
                            <div className="w-30 bg-gray-200 h-2 overflow-hidden rounded">
                              <motion.div
                                className="bg-[#6D28D2] h-2"
                                initial={{ width: 0 }}
                                animate={{
                                  width: `${resourceUploadState.progress}%`,
                                }}
                                transition={{
                                  duration: 0.3,
                                  ease: "easeOut",
                                }}
                              />
                            </div>
                            <span className="ml-2 text-xs">
                              {Math.trunc(resourceUploadState.progress)}%
                              {resourceUploadState.progress >= 95 &&
                                resourceUploadState.status === "uploading" &&
                                " (Processing...)"}
                            </span>
                          </div>
                        </div>
                        <div>{new Date().toLocaleDateString()}</div>
                        <div className="flex">
                          <XIcon
                            className="text-[#6D28D9] hover:bg-[rgba(108,40,210,0.125)] font-semibold ml-auto cursor-pointer text-sm"
                            onClick={() => cancelResourceUpload()}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {resourceUploadState.status === "error" && (
                  <div className="text-red-500 text-sm mt-2">
                    {resourceUploadState.error}
                  </div>
                )}
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <span className="text-zinc-700 max-w-lg font-semibold text-sm w-full border border-zinc-700 py-3 px-4 rounded">
                    {/* {data.instructionalResource?.file
                      ? data.instructionalResource.file.name
                      : "No file selected"} */}
                    No file selected
                  </span>
                  <button
                    onClick={() => {
                      const input = document.createElement("input");
                      input.type = "file";
                      input.onchange = (e) => {
                        const file = (e.target as HTMLInputElement).files?.[0];
                        if (file) handleResourceUpload(file);
                      };
                      input.click();
                    }}
                    className="px-3 py-3 border font-bold text-sm border-[#6d28d2] text-[#6d28d2] rounded hover:bg-[rgba(108,40,210,0.125)] cursor-pointer transition whitespace-nowrap"
                  >
                    Select File
                  </button>
                </div>

                <p className="text-xs text-zinc-600 mt-2 max-w-[calc(32rem+90px)] w-full">
                  <span className="font-bold">Note:</span> A resource is for any
                  type of document that can be used to help students in the
                  lecture. This file is going to be such as a lecture extra.
                  Make sure everything is legible and the file size is less than
                  1 GB.
                </p>

                {showResourceChangeCancel && (
                  <button
                    onClick={handleCancelResourceChange}
                    className="px-4 py-2 bg-[#6d28d2] text-white rounded hover:bg-purple-600 cursor-pointer mt-2"
                  >
                    Cancel
                  </button>
                )}
              </>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-4 p-3">
            {/* Download Icon */}
            <FiDownload />
            {/* File Name */}
            <span className="text-sm font-medium text-gray-900 truncate">
              {data.instructionalResource?.file?.name ||
                data.instructionalResource?.file_name ||
                "File uploaded"}
            </span>

            {/* Change Button */}
            <button
              onClick={() => handleChangeResource()}
              className="px-4 py-2 bg-[#6d28d2] text-white rounded hover:bg-purple-600 cursor-pointer"
            >
              Change
            </button>

            {/* Delete Button */}
            <button
              onClick={() => handleResourceDelete()}
              disabled={isDeletingResource}
              className="px-4 py-2 border font-bold text-sm border-[#6d28d2] text-[#6d28d2] rounded hover:bg-[rgba(108,40,210,0.125)] cursor-pointer transition"
            >
              {isDeletingResource ? "Deleting..." : "Delete"}
            </button>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleVideoUpload(file);
          e.target.value = "";
        }}
        className="hidden"
      />
    </div>
  );
};

export default InstructionsTab;
