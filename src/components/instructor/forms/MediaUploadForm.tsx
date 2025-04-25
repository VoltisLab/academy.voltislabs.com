import { UploadCloud } from "lucide-react";
import CourseThumbnailUploader from "./CourseThumbnailUploader";

export default function MediaUploadForm() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Course Thumbnail */}
      <CourseThumbnailUploader/>
      <CourseThumbnailUploader/>

      {/* Course Trailer */}
     
    </div>
  );
}
