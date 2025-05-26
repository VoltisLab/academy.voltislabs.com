import { ExtendedLecture } from "@/lib/types";
import { useRef, useState } from "react";
import RichTextEditor from "./NewRichTextEditor";
import toast from "react-hot-toast";

const InstructionsTab: React.FC<{
  data: ExtendedLecture;
  onChange: (field: string, value: any) => void;
}> = ({ data, onChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeVideoTab, setActiveVideoTab] = useState<
    "upload" | "library" | null
  >("upload");
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditingInstructions, setIsEditingInstructions] = useState(true);
  const [showVideoUploaded, setShowVideoUploaded] = useState(false);
  const [showChangeCancel, setShowChangeCancel] = useState(false);

  // Sample library videos
  const libraryVideos = [
    {
      filename: "2024-11-13-175733.webm",
      type: "Video",
      status: "Success",
      date: "05/13/2025",
    },
    {
      filename: "Netflix.mp4",
      type: "Video",
      status: "Success",
      date: "05/08/2025",
    },
    {
      filename: "Netflix.mp4",
      type: "Video",
      status: "Success",
      date: "05/07/2025",
    },
  ];

  const handleVideoUpload = (file: File) => {
    onChange("instructionalVideo", { file, url: URL.createObjectURL(file) });
    setShowVideoUploaded(true);
    setActiveVideoTab(null); // Hide tabs after upload
  };

  const handleResourceUpload = (file: File) => {
    onChange("instructionalResource", {
      // Changed from downloadableResource
      file,
      url: URL.createObjectURL(file),
      name: file.name,
    });
  };

  const handleVideoSelect = (video: any) => {
    onChange("instructionalVideo", {
      file: null,
      url: video.filename,
      filename: video.filename,
    });
    setShowVideoUploaded(true);
    setActiveVideoTab(null); // Hide tabs after selection
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

  const handleSubmitInstructions = () => {
    if (
      !data.assignmentInstructions ||
      data.assignmentInstructions.trim() === ""
    ) {
      toast.error("Please enter assignment instructions.");
      return;
    }
    const cleanedInstructions = data.assignmentInstructions
      .replace(/<p><br><\/p>/g, "") // remove <p><br></p>
      .replace(/<[^>]*>/g, "") // remove all HTML tags
      .trim(); // trim whitespace

    if (!cleanedInstructions) {
      toast.error("Please enter assignment instructions.");
      return;
    }

    setIsEditingInstructions(false);
    toast.success("Instructions saved successfully!");
    console.log("Instructions saved:", data.assignmentInstructions);
  };

  const handleEditInstructions = () => {
    setIsEditingInstructions(true);
  };

  const filteredVideos = libraryVideos.filter((video) =>
    video.filename.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
                      ? "border-purple-600 text-purple-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Upload Video
                </button>
                <button
                  onClick={() => setActiveVideoTab("library")}
                  className={`px-4 py-2 font-medium text-sm border-b-2 ml-8 ${
                    activeVideoTab === "library"
                      ? "border-purple-600 text-purple-600"
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
                <div className="border border-gray-300 rounded-md p-4 flex items-center justify-between">
                  <span className="text-gray-500">
                    {data.instructionalVideo?.file
                      ? data.instructionalVideo.file.name
                      : "No file selected"}
                  </span>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 border border-purple-600 text-purple-600 rounded-md hover:bg-purple-50"
                  >
                    Select Video
                  </button>
                </div>
                {showChangeCancel && (
                  <button
                    onClick={handleCancelChange}
                    className="mt-2 px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                )}
                <p className="text-sm text-gray-500 mt-2">
                  Note: All files should be at least 720p and less than 4.0 GB.
                </p>
              </div>
            )}

            {/* Library Tab Content */}
            {activeVideoTab === "library" && (
              <div>
                {/* Search Bar */}
                <div className="mb-4">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search files by name"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <button className="absolute right-2 top-2 p-1 bg-purple-600 text-white rounded">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Video Library Table */}
                <div className="border border-gray-300 rounded-md overflow-hidden">
                  {/* Table Header */}
                  <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                    <div className="grid grid-cols-5 gap-4 font-medium text-sm text-gray-700">
                      <div>Filename</div>
                      <div>Type</div>
                      <div>Status</div>
                      <div className="flex items-center gap-1">
                        Date
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                      <div></div>
                    </div>
                  </div>

                  {/* Table Body */}
                  <div className="divide-y divide-gray-200">
                    {filteredVideos.map((video, index) => (
                      <div key={index} className="px-4 py-3 hover:bg-gray-50">
                        <div className="grid grid-cols-5 gap-4 items-center text-sm">
                          <div className="text-gray-900">{video.filename}</div>
                          <div className="text-gray-600">{video.type}</div>
                          <div className="text-blue-600">{video.status}</div>
                          <div className="text-gray-600">{video.date}</div>
                          <div>
                            <button
                              onClick={() => handleVideoSelect(video)}
                              className="text-purple-600 hover:text-purple-800 font-medium"
                            >
                              Select ↗
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="space-y-4">
            <div className="border border-gray-300 rounded-md p-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">
                  {data.instructionalVideo?.file?.name ||
                    data.instructionalVideo?.url?.split("/").pop() ||
                    "No video selected"}
                </span>
                <div className="flex space-x-2">
                  <button
                    onClick={handleChangeVideo}
                    className="px-4 py-2 text-purple-600 hover:text-purple-800"
                  >
                    Change
                  </button>
                  <button
                    onClick={() => {
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
                    }}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
            <div className="h-32 flex items-center justify-center text-center text-gray-500">
              <p>
                We've uploaded your file, and are processing it to ensure it
                works smoothly on Udemy.
                <br />
                As soon as it's ready, we'll send you an email.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Assignment Instructions */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Assignment Instructions
        </h3>
        {isEditingInstructions ? (
          <>
            <RichTextEditor
              value={data.assignmentInstructions || ""}
              onChange={(value) => onChange("assignmentInstructions", value)}
              placeholder="Enter assignment instructions..."
            />
            <div className="flex gap-2 mt-4">
              <button
                onClick={handleSubmitInstructions}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setIsEditingInstructions(false);
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
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
                __html: data.assignmentInstructions || "",
              }}
            />
            <button
              onClick={handleEditInstructions}
              className="text-purple-600 hover:text-purple-800"
            >
              Edit
            </button>
          </div>
        )}
      </div>

      {/* Downloadable Resource */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Downloadable resource
        </h3>
        <div className="border border-gray-300 rounded-md p-4 flex items-center justify-between">
          <span className="text-gray-500">
            {data.instructionalResource?.file
              ? data.instructionalResource.file.name
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
            className="px-4 py-2 border border-purple-600 text-purple-600 rounded-md hover:bg-purple-50"
          >
            Select File
          </button>
        </div>
        <p className="text-sm text-blue-600 mt-2">
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
          if (file) handleVideoUpload(file);
        }}
        className="hidden"
      />
    </div>
  );
};

export default InstructionsTab;
