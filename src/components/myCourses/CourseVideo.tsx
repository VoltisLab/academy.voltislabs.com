"use client";
import { useRef, useState } from "react";
import ReactPlayer from "react-player";

function CourseVideo({
  videoUrl,
  duration,
  currentTime,
}: {
  videoUrl: string;
  duration: string;
  currentTime: string;
}) {
  const playerRef = useRef<ReactPlayer>(null);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [progress, setProgress] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);

  const handleProgress = (state: {
    played: number;
    playedSeconds: number;
    loaded: number;
    loadedSeconds: number;
  }) => {
    setProgress(state.played);
  };

  const handleDuration = (duration: number) => {
    setVideoDuration(duration);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full lg:h-[449px] h-[349px] bg-black rounded-[27px] overflow-hidden relative">
      <ReactPlayer
        ref={playerRef}
        url={videoUrl}
        width="100%"
        height="100%"
        playing={playing}
        volume={volume}
        onProgress={handleProgress}
        onDuration={handleDuration}
        progressInterval={100}
        controls={true}
        config={{
          youtube: {
            playerVars: {
              controls: 1,
              modestbranding: 1,
              rel: 0,
              showinfo: 0,
              disablekb: 1,
            },
          },
          vimeo: {
            playerOptions: {
              controls: true,
              keyboard: false,
            },
          },
          file: {
            attributes: {
              controlsList: "nodownload",
              disablePictureInPicture: true,
            },
          },
        }}
        onReady={() => {
          if (playerRef.current) {
            const player = playerRef.current.getInternalPlayer();
            if (player && player.setVolume) {
              player.setVolume(volume * 100);
            }
          }
        }}
      />

      {/* Time overlay */}
      <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded pointer-events-none">
        {formatTime(progress * videoDuration)} / {formatTime(videoDuration)}
      </div>
    </div>
  );
}

export default CourseVideo;
