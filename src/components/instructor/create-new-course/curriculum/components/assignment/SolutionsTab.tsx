import { ExtendedLecture } from "@/lib/types";
import { useRef } from "react";

const SolutionsTab: React.FC<{
  data: ExtendedLecture;
  onChange: (field: string, value: any) => void;
}> = ({ data, onChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSolutionVideoUpload = (file: File) => {
    onChange('solutionVideo', { file, url: URL.createObjectURL(file) });
  };

  const hasQuestions = data.assignmentQuestions && data.assignmentQuestions.length > 0;

  return (
    <div className="p-6 space-y-6">
      {/* Video Section */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Video</h3>
        <div className="border-b border-gray-200 mb-4">
          <div className="flex gap-4">
            <button className="px-4 py-2 border-b-2 border-purple-600 text-purple-600 font-medium">
              Upload Video
            </button>
            <button className="px-4 py-2 text-gray-500 hover:text-gray-700">
              Add from library
            </button>
          </div>
        </div>

        <div className="border border-gray-300 rounded-md p-4 flex items-center justify-between">
          <span className="text-gray-500">
            {data.solutionVideo?.file ? data.solutionVideo.file.name : 'No file selected'}
          </span>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 border border-purple-600 text-purple-600 rounded-md hover:bg-purple-50"
          >
            Select Video
          </button>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Note: All files should be at least 720p and less than 4.0 GB.
        </p>
      </div>

      {/* No Questions Warning */}
      {!hasQuestions && (
        <div className="border border-orange-300 bg-orange-50 rounded-md p-4 flex items-center gap-3">
          <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm">
            ⚠
          </div>
          <span className="text-gray-700">
            You have no question yet. Click Here to Add
          </span>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleSolutionVideoUpload(file);
        }}
        className="hidden"
      />
    </div>
  );
};
export default SolutionsTab;