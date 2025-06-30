import { useEffect, useRef } from "react";
import Hls, { ErrorData, Events } from "hls.js";

interface HLSVideoPlayerProps {
  src: string;
}

export const HLSVideoPlayer: React.FC<HLSVideoPlayerProps> = ({ src }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (src.endsWith(".mp4")) {
      video.src = src;
      return;
    }

    if (!src.endsWith(".m3u8")) {
      video.src = src;
      return;
    }

    let hls: Hls | null = null;

    const handleError = (_event: Events.ERROR, data: ErrorData) => {
      console.error("HLS Error:", data);

      // if (video.canPlayType("video/mp4")) {
      //   video.src = src.replace(".m3u8", ".mp4");
      // }
    };

    if (Hls.isSupported()) {
      hls = new Hls({
        enableWorker: false,
        xhrSetup: (xhr) => {
          xhr.withCredentials = false;
        },
      });

      hls.on(Hls.Events.ERROR, handleError);
      hls.loadSource(src);
      hls.attachMedia(video);
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
    }

    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, [src]);

  console.log("HLS player on the move jdsjhdsjhdshjhdshj");

  return (
    <video
      ref={videoRef}
      controls
      crossOrigin="anonymous"
      style={{ width: "100%", height: "100%" }}
    />
  );
};
