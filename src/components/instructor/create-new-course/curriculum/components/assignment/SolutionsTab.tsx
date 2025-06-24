import { ExtendedLecture } from "@/lib/types";
import { useRef, useState } from "react";
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
import { useParams } from "next/navigation";
import { ChevronDown, Search, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

const SolutionsTab: React.FC<{
  data: ExtendedLecture;
  onChange: (field: string, value: any) => void;
  setActiveTab: (tab: string) => void; // Add this line
  fetchAssignment: () => Promise<void>;
}> = ({ data, onChange, setActiveTab, fetchAssignment }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeVideoTab, setActiveVideoTab] = useState<
    "upload" | "library" | null
  >("upload");
  const [searchQuery, setSearchQuery] = useState("");
  const [showVideoUploaded, setShowVideoUploaded] = useState(false);
  const [showChangeCancel, setShowChangeCancel] = useState(false);
  const [editingAnswers, setEditingAnswers] = useState<Record<string, boolean>>(
    {}
  );
  const [answerContents, setAnswerContents] = useState<Record<string, string>>(
    {}
  );

  const [answerToDelete, setAnswerToDelete] = useState<string | null>(null);
  const params = useParams();
  const id = params?.id;

  // Sample library videos
  const [libraryVideos, setLibraryVideos] = useState([
    {
      filename: "2024-11-13-175733.webm",
      type: "Video",
      status: "success",
      date: "05/13/2025",
    },
    {
      filename: "Netflix.mp4",
      type: "Video",
      status: "success",
      date: "05/08/2025",
    },
    {
      filename: "Netflix.mp4",
      type: "Video",
      status: "success",
      date: "05/07/2025",
    },
  ]);

  const [uploadState, setUploadState] = useState<UploadState>({
    isUploading: false,
    progress: 0,
    file: null,
    status: "idle",
    error: null,
  });

  const handleResourceUpload = (file: File) => {
    if (!file) return; // Add null check
    onChange("solutionResource", {
      file,
      url: URL.createObjectURL(file),
      name: file.name,
    });
  };

  // const handleSolutionVideoUpload = (file: File) => {
  //   if (!file) return; // Add null check
  //   onChange("solutionVideo", { file, url: URL.createObjectURL(file) });
  //   setShowVideoUploaded(true);
  //   setActiveVideoTab(null);
  // };

  const handleVideoSelect = (video: any) => {
    onChange("solutionVideo", {
      file: null,
      url: video.filename,
      filename: video.filename,
    });
    setShowVideoUploaded(true);
    setActiveVideoTab(null);
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

  const startEditingAnswer = (questionId: string) => {
    setEditingAnswers((prev) => ({ ...prev, [questionId]: true }));
    setAnswerContents((prev) => ({
      ...prev,
      [questionId]:
        data.assignmentQuestions?.find((q) => q.id === questionId)?.solution
          ?.text || "",
    }));
  };

  const cancelEditingAnswer = (questionId: string) => {
    setEditingAnswers((prev) => ({ ...prev, [questionId]: false }));
  };
  //handle submitting of answers to question
  const { createAssignmentQuestionSolution, updateAssignmentQuestionSolution } =
    useAssignmentService();

  const handleSubmitAnswer = async (questionId: string) => {
    const answerContent = answerContents[questionId] || "";

    if (!answerContent.trim()) {
      toast.error("Answer content cannot be empty");
      return;
    }

    const question = data.assignmentQuestions?.find((q) => q.id === questionId);
    const existingSolution = question?.solution;

    console.log(question);
    try {
      if (
        existingSolution &&
        typeof existingSolution === "object" &&
        "id" in existingSolution
      ) {
        await updateAssignmentQuestionSolution({
          questionSolutionId: Number(existingSolution?.id),
          text: answerContent,
          videoUrl: "",
          downloadableResourceUrl: "",
        });
      } else {
        await createAssignmentQuestionSolution({
          assignmentQuestionId: Number(questionId),
          text: answerContent,
          videoUrl: "",
          downloadableResourceUrl: "",
        });
      }

      // Update the local state
      const updatedQuestions =
        data.assignmentQuestions?.map((q) =>
          q.id === questionId
            ? { ...q, solution: { ...existingSolution, text: answerContent } }
            : q
        ) || [];
      fetchAssignment();
      onChange("assignmentQuestions", updatedQuestions);
      setEditingAnswers((prev) => ({ ...prev, [questionId]: false }));
      toast.success("Answer saved successfully!");
    } catch (err) {
      toast.error("Failed to save answer");
      console.error(err);
    }
  };

  const handleDeleteAnswer = (questionId: string) => {
    // Remove the solution from the question
    const updatedQuestions =
      data.assignmentQuestions?.map((q) =>
        q.id === questionId ? { ...q, solution: undefined } : q
      ) || [];

    onChange("assignmentQuestions", updatedQuestions);
  };

  const hasQuestions =
    data.assignmentQuestions && data.assignmentQuestions.length > 0;

  const filteredVideos = libraryVideos.filter((video) =>
    video.filename.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteVideo = (filenameToDelete: string) => {
    setLibraryVideos((prev) =>
      prev.filter((video) => video.filename !== filenameToDelete)
    );
  };

  const handleSolutionVideoUpload = async (file: File) => {
    if (!file) return;

    // Reset and set initial state
    setUploadState({
      isUploading: true,
      progress: 0,
      file,
      status: "uploading",
      error: null,
    });

    // 2. Add to library immediately (optimistic update)
    const newVideo = {
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
      // 1. Upload the file
      const baseUrl = await uploadFile(file, "VIDEO");

      if (!baseUrl) {
        throw new Error("Upload failed - no URL returned");
      }

      clearInterval(progressInterval);
      setUploadState((prev) => ({ ...prev, progress: 100 }));

      // 3. Update the assignment with the new video URL
      const updateVariables: UpdateAssignmentQuestionSolutionVariables = {
        questionSolutionId: Number(id),
        videoUrl: baseUrl, // Make sure your API accepts this field
      };

      await updateAssignmentQuestionSolution(updateVariables);

      // 4. Update local state
      onChange("solutionVideo", {
        file,
        url: baseUrl,
        filename: file.name,
      });

      const newVideo = {
        filename: file.name,
        type: "Video",
        status: "success",
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
    } catch (error) {
      clearInterval(progressInterval);

      // Add to library even if failed
      const newVideo = {
        filename: file.name,
        type: "Video",
        status: "Failed",
        date: new Date().toLocaleDateString(),
      };

      setLibraryVideos((prev) => [newVideo, ...prev]);

      setLibraryVideos((prev) =>
        prev.filter((video) => video.status !== "processing")
      );

      console.log();

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
    }
  };

  console.log("quesion===", data);
  return (
    <div className="p-6 space-y-6">
      {/* Video Section */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Video</h3>

        {!showVideoUploaded ? (
          <>
            {/* Video Tabs */}
            <div className="border-b border-gray-200 mb-4">
              <div className="flex">
                <button
                  onClick={() => setActiveVideoTab("upload")}
                  className={`px-4 py-2 font-medium text-sm border-b-2 ${
                    activeVideoTab === "upload"
                      ? "border-[#6d28d2] text-[#6d28d2]"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Upload Video
                </button>
                <button
                  onClick={() => setActiveVideoTab("library")}
                  className={`px-4 py-2 font-medium text-sm border-b-2 ml-8 ${
                    activeVideoTab === "library"
                      ? "border-[#6d28d2] text-[#6d28d2]"
                      : "border-transparent text-gray-500 hover:text-gray-700"
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
                            style={{ gridTemplateColumns: "35% 15% 30% 20%" }}
                          >
                            <div>Filename</div>
                            <div>Type</div>
                            <div>Status</div>
                            <div>Date</div>
                          </div>
                          <div
                            className="grid text-sm text-gray-700 mt-2 items-center"
                            style={{ gridTemplateColumns: "35% 15% 30% 20%" }}
                          >
                            <div className="truncate">
                              {uploadState.file?.name || "Uploading..."}
                            </div>
                            <div>Video</div>
                            <div className="flex items-center">
                              <div className="w-full flex items-center">
                                <div className="w-20 bg-gray-200 h-2 overflow-hidden rounded-full">
                                  <motion.div
                                    className="bg-[#6D28D2] h-2 rounded-full"
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
                    <div className="flex items-center gap-4">
                      <span className="text-gray-500 max-w-xl w-full border border-zinc-700 py-3 px-4 rounded">
                        {data.solutionVideo?.file
                          ? data.solutionVideo.file.name
                          : "No file selected"}
                      </span>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-3 border border-purple-600 text-purple-600 rounded-md hover:bg-purple-50 cursor-pointer"
                      >
                        Select Video
                      </button>
                    </div>
                    {showChangeCancel && (
                      <button
                        onClick={handleCancelChange}
                        className="mt-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700   cursor-pointer"
                      >
                        Cancel
                      </button>
                    )}
                    <p className="text-sm text-gray-500 mt-2">
                      Note: All files should be at least 720p and less than 4.0
                      GB.
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
                      className="w-full py-2 px-3 border border-gray-400 rounded-md focus:outline-none focus:border-[#6D28D9]"
                    />

                    <button className="p-2 bg-[#6D28D9] text-white rounded-md hover:bg-indigo-700">
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
                      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                        <div
                          className="grid font-bold  text-sm text-gray-700"
                          style={{
                            gridTemplateColumns: "35% 11.67% 16.67% 16.66% 20%",
                          }}
                        >
                          <div>Filename</div>
                          <div>Type</div>
                          <div>Status</div>
                          <div className="flex items-center gap-1">
                            <span>Date</span>
                            <ChevronDown size={15} />
                          </div>
                          <div></div>
                        </div>
                      </div>

                      {/* Table Body */}
                      <div className="divide-y divide-gray-200">
                        {filteredVideos.length === 0 ? (
                          <div className="text-center text-gray-500 py-6">
                            No result found
                          </div>
                        ) : (
                          filteredVideos.map((video, index) => (
                            <div
                              key={index}
                              className="px-4 py-3 hover:bg-gray-50"
                            >
                              <div
                                className="grid font-medium text-sm text-gray-700"
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
                                  className={`${
                                    video.status === "success"
                                      ? "text-green-500"
                                      : video.status === "processing"
                                      ? "text-gray-600"
                                      : "text-red-600"
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
                                      onClick={() => {
                                        handleVideoSelect(video);
                                        handleDeleteVideo(video.filename);
                                      }}
                                      className="text-[#6D28D9] hover:text-purple-800 hover:bg-purple-100 font-semibold ml-auto cursor-pointer text-sm"
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
                                      handleDeleteVideo(video.filename)
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
            <div className="border border-gray-300 rounded-md p-4 bg-gray-100">
              <div className="flex justify-between items-center font-semibold">
                <span className="text-gray-700">
                  {data.solutionVideo?.file?.name ||
                    data.solutionVideo?.url?.split("/").pop() ||
                    "No video selected"}
                </span>
              </div>
            </div>

            <div className="h-80">
              {data.solutionVideo?.url ? (
                <video
                  controls
                  src={
                    data.solutionVideo.file
                      ? URL.createObjectURL(data.solutionVideo.file)
                      : data.solutionVideo.url
                  }
                  className="w-full h-full rounded-md object-contain"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-center text-gray-500">
                  <p>No video preview available.</p>
                </div>
              )}
            </div>
            {/* <div className="h-80 flex items-center justify-center text-center text-gray-500">
              <p>
                We've uploaded your file, and are processing it to ensure it
                works smoothly on Udemy.
                <br />
                As soon as it's ready, we'll send you an email.
              </p>
            </div> */}

            {/* Files change and delete buttons */}
            <div className="flex space-x-2 mb-20">
              <button
                onClick={handleChangeVideo}
                className="px-4 py-2 bg-[#6d28d2] text-white rounded-md hover:bg-purple-600 cursor-pointer"
              >
                Change
              </button>
              <button
                onClick={() => {
                  // Clear the video state
                  onChange("solutionVideo", null);

                  // Reset the file input
                  if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                  }

                  // Reset all related states
                  setShowVideoUploaded(false);
                  setShowChangeCancel(false);
                  setActiveVideoTab("upload");
                }}
                className="px-4 py-2 text-[#6d28d2] hover:text-purple-800 border border-[#6d28d2] rounded-md hover:bg-purple-50 cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </div>

      {/* No Questions Warning */}
      {!hasQuestions && (
        <div className="border border-orange-300 bg-orange-50 rounded-md p-4 flex items-center gap-3">
          <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm">
            ⚠
          </div>
          <div className="flex-1">
            <p className="text-gray-700">
              You have no questions yet.{" "}
              <button
                onClick={() => setActiveTab("questions")}
                className="text-[#6d28d2] hover:text-purple-800 font-medium cursor-pointer transition"
              >
                Click here to add questions
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
              <h3 className="text-lg font-medium text-gray-900">
                Question {question.order}
              </h3>
              <div className="prose max-w-none mt-2">
                {question?.text?.split("\n").map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>

              {/* Answer Section */}
              <div className="mt-6">
                <h4 className="text-md font-medium text-gray-900 mb-2">
                  Your Answer
                </h4>

                {editingAnswers[question.id] ? (
                  <>
                    <RichTextEditor
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
                        className="px-4 py-2 bg-[#6d28d2] text-white rounded-md cursor-pointer transition hover:bg-purple-600"
                      >
                        Submit
                      </button>
                      <button
                        onClick={() => cancelEditingAnswer(question.id)}
                        className="px-4 py-2 text-gray-600 cursor-pointer rounded-md transition hover:bg-gray-200"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    {question.solution ? (
                      <div className="space-y-2">
                        <div
                          className="prose max-w-none"
                          dangerouslySetInnerHTML={{
                            __html: question?.solution?.text ?? "",
                          }}
                        />
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={() => startEditingAnswer(question.id)}
                            className="px-4 py-1 text-sm bg-[#6d28d2] text-white rounded-md cursor-pointer transition hover:bg-purple-600"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => setAnswerToDelete(question.id)}
                            className="px-4 py-1 text-sm border border-[#6d28d2] text-[#6d28d2] rounded-md hover:bg-purple-50 transition cursor-pointer"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => startEditingAnswer(question.id)}
                        className="mt-2 px-4 py-2 bg-[#6d28d2] text-white rounded-md hover:bg-purple-600"
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
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Downloadable resource
        </h3>
        <div className="flex items-center gap-4">
          <span className="text-gray-500 max-w-xl w-full border border-zinc-700 py-3 px-4 rounded">
            {data.solutionResource?.file
              ? data.solutionResource.file.name
              : "No file selected"}
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
            className="px-4 py-3 border border-[#6d28d2] text-[#6d28d2] rounded-md hover:bg-purple-50 cursor-pointer transition"
          >
            Select File
          </button>
        </div>
        <p className="text-sm text-gray-600 mt-2 max-w-xl w-full">
          Note: A resource is for any type of document that can be used to help
          students in the lecture. This file is going to be such as a lecture
          extra. Make sure everything is legible and the file size is less than
          1 GB.
        </p>
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
            <h3 className="text-lg font-medium text-gray-900 mb-4">
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
                onClick={() => {
                  handleDeleteAnswer(answerToDelete);
                  setAnswerToDelete(null);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SolutionsTab;
