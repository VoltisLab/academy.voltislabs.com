import { UploadCloud } from "lucide-react";

export default function MediaUploadForm() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Course Thumbnail */}
      <div>
        <h3 className="font-semibold text-gray-800 mb-2">Course Thumbnail</h3>
        <div className="bg-gray-100 rounded-md h-48 flex items-center justify-center mb-3">
          <img src="/placeholder-thumbnail.svg" alt="Thumbnail Preview" className="h-24 w-24 object-contain" />
        </div>
        <p className="text-sm text-gray-500 mb-2">
          Upload your course Thumbnail here. <span className="text-gray-400">Important guidelines: 1200x800 pixels or 12:8 Ratio. Supported format:</span> <strong>jpg, jpeg, or png</strong>
        </p>
        <button className="mt-2 flex items-center gap-2 bg-[#D9D6FB] text-[#2E2C6F] text-sm font-semibold px-6 py-2 rounded-md">
          Upload Image <UploadCloud className="w-4 h-4" />
        </button>
      </div>

      {/* Course Trailer */}
      <div>
        <h3 className="font-semibold text-gray-800 mb-2">Course Trailer</h3>
        <div className="bg-gray-100 rounded-md h-48 flex items-center justify-center mb-3">
          <img src="/placeholder-video.svg" alt="Video Preview" className="h-24 w-24 object-contain" />
        </div>
        <p className="text-sm text-gray-500 mb-2">
          Students who watch a well-made promo video are 5X more likely to enroll in your course. We've seen that statistic go up to 10X for exceptionally awesome videos.
        </p>
        <button className="mt-2 flex items-center gap-2 bg-[#D9D6FB] text-[#2E2C6F] text-sm font-semibold px-6 py-2 rounded-md">
          Upload Video <UploadCloud className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
