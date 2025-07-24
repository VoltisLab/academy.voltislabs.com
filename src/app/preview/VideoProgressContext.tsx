// context/VideoProgressContext.tsx
"use client";
import React, { createContext, useContext, useState, ReactNode } from 'react';

// Types
interface VideoProgressState {
  progress: number;
  duration: number;
  playing: boolean;
  volume: number;
  muted: boolean;
  playbackRate: number;
  currentVideoId: string | null;
  currentVideoUrl: string | null;
}
type SetVolumeArg = number | ((prevVolume: number) => number);
type SetNumberArg = number | ((prev: number) => number);


interface VideoProgressContextType {
  // State
  videoState: VideoProgressState;
  
  // Progress actions
  setProgress: (progress: number) => void;
  setDuration: (duration: number) => void;
  
  // Playback actions
  setPlaying: (playing: boolean) => void;
  togglePlayPause: () => void;
  
  // Audio actions
    setVolume: (volume: SetVolumeArg) => void; // Accepts number or function

  setMuted: (muted: boolean) => void;
  toggleMute: () => void;
  
  // Speed actions
  setPlaybackRate: (rate: SetNumberArg) => void;
  
  // Video management
  setCurrentVideo: (videoId: string, videoUrl: string) => void;
  resetProgress: () => void;
  
  // Utility functions
  getFormattedProgress: () => string;
  getFormattedDuration: () => string;
  getProgressPercentage: () => number;
}

// Default state
const defaultVideoState: VideoProgressState = {
  progress: 0,
  duration: 0,
  playing: false,
  volume: 0.8,
  muted: false,
  playbackRate: 1,
  currentVideoId: null,
  currentVideoUrl: null,
};

// Create context
const VideoProgressContext = createContext<VideoProgressContextType | undefined>(undefined);

// Provider component
interface VideoProgressProviderProps {
  children: ReactNode;
}

export const VideoProgressProvider: React.FC<VideoProgressProviderProps> = ({ children }) => {
  const [videoState, setVideoState] = useState<VideoProgressState>(defaultVideoState);

  // Progress actions
  const setProgress = (progress: number) => {
    setVideoState(prev => ({ ...prev, progress }));
  };

  const setDuration = (duration: number) => {
    setVideoState(prev => ({ ...prev, duration }));
  };

  // Playback actions
  const setPlaying = (playing: boolean) => {
    setVideoState(prev => ({ ...prev, playing }));
  };

  const togglePlayPause = () => {
    setVideoState(prev => ({ ...prev, playing: !prev.playing }));
  };


const setVolume = (volumeOrUpdater: SetVolumeArg) => {
  setVideoState(prev => {
    const nextVolume =
      typeof volumeOrUpdater === "function"
        ? Math.max(0, Math.min(1, volumeOrUpdater(prev.volume)))
        : Math.max(0, Math.min(1, volumeOrUpdater));

    return {
      ...prev,
      volume: nextVolume,
      muted: nextVolume === 0,
    };
  });
};

  const setMuted = (muted: boolean) => {
    setVideoState(prev => ({ ...prev, muted }));
  };

  const toggleMute = () => {
    setVideoState(prev => ({ ...prev, muted: !prev.muted }));
  };

  // Speed actions
 const setPlaybackRate = (rateOrUpdater: SetNumberArg) => {
  setVideoState(prev => {
    const nextRate =
      typeof rateOrUpdater === "function"
        ? Math.max(0.25, Math.min(2, rateOrUpdater(prev.playbackRate)))
        : Math.max(0.25, Math.min(2, rateOrUpdater));
    return { ...prev, playbackRate: nextRate };
  });
};


  // Video management
  const setCurrentVideo = (videoId: string, videoUrl: string) => {
    setVideoState(prev => ({
      ...prev,
      currentVideoId: videoId,
      currentVideoUrl: videoUrl,
      progress: 0, // Reset progress when switching videos
    }));
  };

  const resetProgress = () => {
    setVideoState(prev => ({ ...prev, progress: 0 }));
  };

  // Utility functions
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  const getFormattedProgress = (): string => {
    return formatTime(videoState.progress);
  };

  const getFormattedDuration = (): string => {
    return formatTime(videoState.duration);
  };

  const getProgressPercentage = (): number => {
    if (videoState.duration === 0) return 0;
    return (videoState.progress / videoState.duration) * 100;
  };

  const contextValue: VideoProgressContextType = {
    videoState,
    setProgress,
    setDuration,
    setPlaying,
    togglePlayPause,
    setVolume,
    setMuted,
    toggleMute,
    setPlaybackRate,
    setCurrentVideo,
    resetProgress,
    getFormattedProgress,
    getFormattedDuration,
    getProgressPercentage,
  };

  return (
    <VideoProgressContext.Provider value={contextValue}>
      {children}
    </VideoProgressContext.Provider>
  );
};

// Custom hook to use the context
export const useVideoProgress = (): VideoProgressContextType => {
  const context = useContext(VideoProgressContext);
  if (context === undefined) {
    throw new Error('useVideoProgress must be used within a VideoProgressProvider');
  }
  return context;
};

// Optional: Hook for specific video tracking
export const useVideoProgressForVideo = (videoId: string, videoUrl: string) => {
  const context = useVideoProgress();
  
  // Auto-set current video when component mounts
  React.useEffect(() => {
    if (context.videoState.currentVideoId !== videoId) {
      context.setCurrentVideo(videoId, videoUrl);
    }
  }, [videoId, videoUrl, context]);

  // Return context but only if it's for the current video
  const isCurrentVideo = context.videoState.currentVideoId === videoId;
  
  return {
    ...context,
    isCurrentVideo,
  };
};

export default VideoProgressContext;