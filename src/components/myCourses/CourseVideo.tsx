"use client";
import { useRef } from "react";

function CourseVideo({
  videoUrl,
  duration,
  currentTime,
}: {
  videoUrl: string;
  duration: string;
  currentTime: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <div className="w-full lg:h-[449px] h-[349px] bg-black rounded-[27px] overflow-hidden relative">
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        controls
        src={videoUrl}
      >
        Your browser does not support the video tag.
      </video>

      {/* Optional time overlay */}
      {/* <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded pointer-events-none">
        {currentTime} / {duration}
      </div> */}
    </div>
  );
}

export default CourseVideo;
