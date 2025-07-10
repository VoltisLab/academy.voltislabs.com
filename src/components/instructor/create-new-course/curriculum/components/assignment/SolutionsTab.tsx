import { ExtendedLecture } from "@/lib/types";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import RichTextEditor from "./NewRichTextEditor";
import toast from "react-hot-toast";
import { useAssignmentService } from "@/services/useAssignmentService";
import { UploadState } from "./InstructionsTab";
import { uploadFile } from "@/services/fileUploadService";
import {
  UpdateAssignmentQuestionSolutionResponse,
  UpdateAssignmentQuestionSolutionVariables,
  UpdateAssignmentVariables,
} from "@/api/assignment/mutation";
import { ChevronDown, ChevronUp, Search, Trash2, XIcon } from "lucide-react";
import { motion } from "framer-motion";
import { HLSVideoPlayer } from "./HLSVideoPlayer";
import { BiErrorAlt } from "react-icons/bi";
import { Video } from "./AssignmentEditor";
import { FiDownload } from "react-icons/fi";
import { useParams } from "next/navigation";

const SolutionsTab: React.FC<{
  data: ExtendedLecture;
  onChange: (field: string, value: any) => void;
  setActiveTab: (tab: string) => void;
  fetchAssignment: () => Promise<void>;
  libraryVideos: Video[];
  setLibraryVideos: Dispatch<SetStateAction<Video[]>>;
  sortByNameAsc: boolean | null;
  sortByDateAsc: boolean | null;
  toggleSortByName: () => void;
  toggleSortByDate: () => void;
}> = ({
  data,
  onChange,
  setActiveTab,
  fetchAssignment,
  libraryVideos,
  setLibraryVideos,
  sortByNameAsc,
  sortByDateAsc,
  toggleSortByName,
  toggleSortByDate,
}) => {
  console.log(data.assignmentQuestions);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeVideoTab, setActiveVideoTab] = useState<
    "upload" | "library" | null
  >("upload");
  const params = useParams();
  const id = params?.id;
  const [searchQuery, setSearchQuery] = useState("");
  const [showVideoUploaded, setShowVideoUploaded] = useState(false);
  const [showResourceUploaded, setShowResourceUploaded] = useState(false);
  const [showChangeCancel, setShowChangeCancel] = useState(false);
  const [showResourceChangeCancel, setShowResourceChangeCancel] =
    useState(false);
  const [editingAnswers, setEditingAnswers] = useState<Record<string, boolean>>(
    {}
  );
  const [answerContents, setAnswerContents] = useState<Record<string, string>>(
    {}
  );
  const [answerToDelete, setAnswerToDelete] = useState<string | null>(null);

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

  const abortControllerRef = useRef<AbortController | null>(null);

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
        solutionDownloadableResource: {
          fileName: file.name,
          url: baseUrl,
        },
      };

      await updateAssignment(updateVariables);

      onChange("solutionResource", {
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
      solutionVideo: {
        fileName: video.filename || "",
        url: video.url || "",
      },
    };

    try {
      await updateAssignment(updateVariables);
      onChange("solutionVideo", {
        file: null,
        url: video.url,
        name: video.filename,
      });
      setShowVideoUploaded(true);
      setActiveVideoTab(null);
      await fetchAssignment();
      toast.success("Video selected successfully");
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

  const {
    createAssignmentQuestionSolution,
    updateAssignmentQuestionSolution,
    updateAssignment,
  } = useAssignmentService();

  const startEditingAnswer = (questionId: string) => {
    setEditingAnswers((prev) => ({ ...prev, [questionId]: true }));

    // Get the question and its solution
    const question = data.assignmentQuestions?.find((q) => q.id === questionId);
    const solutionText =
      question?.solution?.text || question?.questionSolutions?.[0]?.text || "";

    setAnswerContents((prev) => ({
      ...prev,
      [questionId]: solutionText,
    }));
  };

  const cancelEditingAnswer = (questionId: string) => {
    setEditingAnswers((prev) => ({ ...prev, [questionId]: false }));
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitAnswer = async (questionId: string) => {
    const answerContent = answerContents[questionId] || "";

    if (!answerContent.trim()) {
      toast.error("Answer content cannot be empty");
      return;
    }
    setIsSubmitting(true);

    const question = data.assignmentQuestions?.find((q) => q.id === questionId);
    const existingSolution = question?.questionSolutions?.[0];

    try {
      if (existingSolution) {
        // Update existing solution
        await updateAssignmentQuestionSolution({
          questionSolutionId: Number(existingSolution.id),
          text: answerContent,
        });
        toast.success("Answer updated successfully!");
      } else {
        // Create new solution
        await createAssignmentQuestionSolution({
          assignmentQuestionId: Number(questionId),
          text: answerContent,
        });
        toast.success("Answer created successfully!");
      }

      // Refresh the data
      await fetchAssignment();
      setEditingAnswers((prev) => ({ ...prev, [questionId]: false }));
    } catch (err) {
      toast.error("Failed to save answer");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const [isDeletingAnswer, setIsDeletingAnswer] = useState(false);

  const handleDeleteAnswer = async (questionId: string) => {
    const question = data.assignmentQuestions?.find((q) => q.id === questionId);
    const solutionId = question?.questionSolutions?.[0]?.id;
    // const answerContent = answerContents[questionId] || "";

    setIsDeletingAnswer(true);

    if (!solutionId) {
      toast.error("No solution found to delete");
      return;
    }

    try {
      // await updateAssignmentQuestionSolution(Number(solutionId));

      await updateAssignmentQuestionSolution({
        questionSolutionId: Number(solutionId),
        text: " ", // Using space instead of empty string
      });

      // // If update with space was successful, now update with truly empty string
      // if (updateResponse) {
      //   await updateAssignmentQuestionSolution({
      //     questionSolutionId: Number(solutionId),
      //     text: "",
      //   });
      // }

      toast.success("Answer Cleared successfully!");

      // Refresh the data
      await fetchAssignment();
    } catch (err) {
      toast.error("Failed to delete answer");
      console.error(err);
    } finally {
      setIsDeletingAnswer(false);
    }
  };

  const hasQuestions =
    data.assignmentQuestions && data.assignmentQuestions.length > 0;

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
        solutionVideo: {
          fileName: "",
          url: "",
        },
      };
      await updateAssignment(updateVariables);
      toast.success("Video removed successfully");

      onChange("solutionVideo", null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
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
        solutionDownloadableResource: {
          fileName: "",
          url: "",
        },
      };
      await updateAssignment(updateVariables);
      toast.success("Resource removed successfully");
      await fetchAssignment();
      onChange("solutionResource", null);
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

  const handleSolutionVideoUpload = async (file: File) => {
    if (!file) return;

    abortControllerRef.current = new AbortController();

    if (data.assignmentQuestions?.[0]?.questionSolutions?.length === 0) {
      toast.error("A mininmum of a question and an answer is requied");
      return;
    }

    setUploadState({
      isUploading: true,
      progress: 0,
      file,
      status: "uploading",
      error: null,
    });

    const newVideo: Video = {
      id: String(libraryVideos.length + 1),
      filename: file.name,
      type: "Video",
      status: "processing",
      date: new Date().toLocaleDateString(),
    };

    setLibraryVideos((prev) => [newVideo, ...prev]);

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
        "VIDEO",
        abortControllerRef.current.signal
      );

      if (!baseUrl) {
        throw new Error("Upload failed - no URL returned");
      }

      clearInterval(progressInterval);
      setUploadState((prev) => ({ ...prev, progress: 100 }));

      const updateVariables: UpdateAssignmentVariables = {
        assignmentId: Number(id),
        solutionVideo: {
          fileName: file.name,
          url: baseUrl,
        },
      };

      await updateAssignment(updateVariables);

      onChange("solutionVideo", {
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

      setLibraryVideos((prev) =>
        prev.filter((video) => video.status !== "processing")
      );

      setShowVideoUploaded(true);
      setActiveVideoTab(null);

      toast.success("Video uploaded and assignment updated successfully!");
    } catch (error: any) {
      clearInterval(progressInterval);

      const newVideo: Video = {
        id: String(libraryVideos.length + 1),
        filename: file.name,
        type: "Video",
        status: "failed",
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

    setLibraryVideos((prev) =>
      prev.filter((video) => video.status !== "processing")
    );
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

  useEffect(() => {
    console.log(data);
    if (data.solutionResource?.url) setShowResourceUploaded(true);
    if (data.solutionVideo?.url) setShowVideoUploaded(true);

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  console.log(data);

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
                        {/* {data.solutionVideo?.file
                          ? data.solutionVideo.file.name
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
                          className="grid font-bold  text-sm text-zincborder-zinc-700"
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
                  {data.solutionVideo?.file?.name ||
                    data.solutionVideo?.file_name ||
                    "No video selected"}
                </span>
              </div>
            </div>

            <div className="h-80">
              {data.solutionVideo?.url ? (
                data.solutionVideo.file ? (
                  <video
                    controls
                    src={
                      data.solutionVideo.file
                        ? URL.createObjectURL(data.solutionVideo.file)
                        : data.solutionVideo.url
                    }
                    className="w-full h-full rounded object-contain"
                  />
                ) : (
                  <HLSVideoPlayer src={data.solutionVideo.url} />
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

      {/* No Questions Warning */}
      {!hasQuestions && (
        <div className="border border-red-600 rounded-2xl px-4 py-5 flex items-center gap-3">
          <BiErrorAlt className="text-red-500" size={25} />
          <div className="flex-1">
            <p className="text-gray-700 font-bold">
              You have no questions yet.{" "}
              <button
                onClick={() => setActiveTab("questions")}
                className="decoration-[#6d28d2] underline hover:text-[#6d28d2] font-bold cursor-pointer transition"
              >
                Click here to add
              </button>
            </p>
          </div>
        </div>
      )}

      {/* Questions and Answers Section */}
      {hasQuestions && (
        <div className="space-y-8">
          {data.assignmentQuestions?.map((question) => (
            <div key={question.id} className="border-b pb-6 last:border-b-0">
              <h3 className="text-sm font-bold text-gray-900">
                Question {question.order}
              </h3>
              <div className="prose max-w-none mt-2">{question?.text}</div>

              {/* Answer Section */}
              <div className="mt-6">
                <h4 className="text-sm font-bold text-gray-900 mb-2">
                  Your Answer
                </h4>

                {editingAnswers[question.id] ? (
                  <>
                    <RichTextEditor
                      key={`editor-${question.id}`} // Important to force re-render when switching questions
                      value={answerContents[question.id] || ""}
                      onChange={(value) =>
                        setAnswerContents((prev) => ({
                          ...prev,
                          [question.id]: value,
                        }))
                      }
                      placeholder="Enter your answer..."
                    />

                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => handleSubmitAnswer(question.id)}
                        disabled={isSubmitting}
                        className="px-4 py-2 bg-[#6d28d2] text-white rounded hover:bg-purple-600 cursor-pointer disabled:bg-[rgba(108,40,210,0.3)] disabled:cursor-not-allowed transition"
                      >
                        {isSubmitting ? "Submitting..." : "Submit"}
                      </button>

                      <button
                        onClick={() => cancelEditingAnswer(question.id)}
                        className="px-4 py-2 border font-bold text-sm border-[#6d28d2] text-[#6d28d2] rounded hover:bg-[rgba(108,40,210,0.125)] cursor-pointer transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    {question?.questionSolutions?.[0]?.text.trim() ? (
                      <div className="space-y-2">
                        <div
                          className="prose max-w-none"
                          dangerouslySetInnerHTML={{
                            __html:
                              question?.questionSolutions?.[0]?.text ?? "",
                          }}
                        />
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={() => startEditingAnswer(question.id)}
                            className="px-4 py-2 bg-[#6d28d2] text-white rounded hover:bg-purple-600 cursor-pointer"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => setAnswerToDelete(question.id)}
                            className="px-4 py-2 border font-bold text-sm border-[#6d28d2] text-[#6d28d2] rounded hover:bg-[rgba(108,40,210,0.125)] cursor-pointer transition"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => startEditingAnswer(question.id)}
                        className="mt-2 px-4 py-2 bg-[#6d28d2] text-white rounded hover:bg-purple-600"
                      >
                        Add Answer
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

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
                    {/* {data.solutionResource?.file
                      ? data.solutionResource.file.name
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
              {data.solutionResource?.file?.name ||
                data.solutionResource?.file_name ||
                "Uploaded file"}
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
          if (file) handleSolutionVideoUpload(file);
          e.target.value = "";
        }}
        className="hidden"
      />

      {/* Delete confirmation modal */}
      {answerToDelete && (
        <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-sm font-bold text-gray-900 mb-4">
              Confirm Deletion
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this answer?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setAnswerToDelete(null)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await handleDeleteAnswer(answerToDelete);
                  setAnswerToDelete(null);
                }}
                disabled={isDeletingAnswer}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition cursor-pointer disabled:bg-red-300"
              >
                {isDeletingAnswer ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SolutionsTab;
