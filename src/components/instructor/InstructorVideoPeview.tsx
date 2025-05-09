import { Lecture, VideoContent } from "@/lib/types";
import {
  ChevronDown,
  ChevronUp,
  Play,
  X,
  Volume2,
  Settings,
  Maximize,
  Search,
  Clock,
  Globe,
  Plus
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import ReactPlayer from "react-player";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";

type ChildProps = {
  videoContent: VideoContent;
  setShowVideoPreview: React.Dispatch<React.SetStateAction<boolean>>;
  lecture: Lecture;
};

const InstructorVideoPreview = ({ videoContent, setShowVideoPreview, lecture }: ChildProps) => {
  // State management
  const [activeTab, setActiveTab] = useState<'overview' | 'notes' | 'announcements' | 'reviews' | 'learning-tools'>('overview');
  const [playing, setPlaying] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [showControls, setShowControls] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.8);
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [showSearch, setShowSearch] = useState<boolean>(false);
  
  const playerRef = useRef<ReactPlayer>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // If the component is mounted, make sure we have our event handlers set up
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        setPlaying(!playing);
        e.preventDefault();
      }
    };
    
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [playing]);
  
  if (!videoContent.selectedVideoDetails) return null;
  
  // Format time in MM:SS format
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };
  
  const handleProgress = (state: { played: number; playedSeconds: number; loaded: number; loadedSeconds: number }) => {
    setProgress(state.playedSeconds);
  };
  
  const handleDuration = (duration: number) => {
    setDuration(duration);
  };
  
  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / progressBar.offsetWidth;
    
    if (playerRef.current) {
      playerRef.current.seekTo(pos);
    }
  };
  
  return (
    <div className="fixed inset-0 z-[9999] bg-white flex flex-col">
      {/* Main scrollable container for video and tabs */}
      <div className="flex flex-1 h-full overflow-hidden">
        {/* Left side - scrollable content (video player + tabs) */}
        <div className="flex-1 overflow-y-auto" style={{ width: 'calc(100% - 320px)' }}>
          {/* Video player section */}
          <div className="bg-black relative" style={{ height: 'calc(100vh - 220px)' }}>
            <div 
              ref={playerContainerRef}
              className="relative w-full h-full flex items-center justify-center"
              onMouseEnter={() => setShowControls(true)}
              onMouseLeave={() => setShowControls(false)}
            >
              {/* Video player */}
              <div className="relative w-full h-full mx-auto">
                <ReactPlayer
                  ref={playerRef}
                  url={videoContent.selectedVideoDetails.url || "https://www.youtube.com/watch?v=dQw4w9WgXcQ"} // Fallback URL
                  width="100%"
                  height="100%"
                  playing={playing}
                  volume={volume}
                  playbackRate={playbackRate}
                  onProgress={handleProgress}
                  onDuration={handleDuration}
                  progressInterval={100}
                  config={{
                    file: {
                      attributes: {
                        controlsList: 'nodownload'
                      }
                    }
                  }}
                />
                
                {/* Play button overlay when paused */}
                {!playing && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
                    <button 
                      className="rounded-full bg-black bg-opacity-70 p-4 hover:bg-opacity-90 transition-all"
                      type="button"
                      aria-label="Play video"
                      onClick={() => setPlaying(true)}
                    >
                      <Play className="w-8 h-8 text-white" />
                    </button>
                  </div>
                )}
                
                {/* Video controls */}
                {(showControls || !playing) && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                    <div className="flex items-center text-white">
                      <button 
                        className="mr-4"
                        type="button" 
                        aria-label="Play/Pause"
                        onClick={() => setPlaying(!playing)}
                      >
                        {playing ? (
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10 4H6V20H10V4Z" fill="white"/>
                            <path d="M18 4H14V20H18V4Z" fill="white"/>
                          </svg>
                        ) : (
                          <Play className="w-6 h-6" />
                        )}
                      </button>
                      
                      <div className="flex-1 mx-2">
                        <div 
                          className="h-1 bg-gray-600 rounded-full cursor-pointer"
                          onClick={handleSeek}
                        >
                          <div 
                            className="h-1 bg-white rounded-full" 
                            style={{ width: `${(progress / duration) * 100}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-xs mt-1">
                          <span>{formatTime(progress)}</span>
                          <span>{videoContent.selectedVideoDetails.duration || formatTime(duration)}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <div className="flex items-center mx-2">
                          <Volume2 className="w-5 h-5 mr-2" />
                          <div 
                            className="w-16 h-1 bg-gray-600 rounded-full cursor-pointer"
                            onClick={(e) => {
                              const volumeBar = e.currentTarget;
                              const rect = volumeBar.getBoundingClientRect();
                              const newVolume = (e.clientX - rect.left) / volumeBar.offsetWidth;
                              setVolume(newVolume);
                            }}
                          >
                            <div 
                              className="h-1 bg-white rounded-full" 
                              style={{ width: `${volume * 100}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        <button 
                          className="mx-2"
                          type="button"
                          aria-label="Playback speed"
                          onClick={() => {
                            const rates = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
                            const currentIndex = rates.indexOf(playbackRate);
                            const nextIndex = (currentIndex + 1) % rates.length;
                            setPlaybackRate(rates[nextIndex]);
                          }}
                        >
                          <span className="text-sm">{playbackRate}x</span>
                        </button>
                        
                        <button 
                          className="mx-2"
                          type="button"
                          aria-label="Add note"
                        >
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11 5V19M5 11H11H19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                        
                        <button 
                          className="mx-2"
                          type="button"
                          aria-label="Skip ahead"
                        >
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M14 9L19 12L14 15V9Z" fill="white"/>
                            <path d="M19 12H5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                        
                        <button 
                          className="mx-2"
                          type="button"
                          aria-label="Settings"
                        >
                          <Settings className="w-5 h-5" />
                        </button>
                        
                        <button 
                          className="ml-2"
                          type="button"
                          aria-label="Fullscreen"
                        >
                          <Maximize className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Bottom video controls bar (visible when not in controls overlay) */}
          <div className="h-8 bg-gray-900 flex items-center px-4 text-white">
            <button className="mr-2" aria-label="Play/Pause">
              {playing ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 4H6V20H10V4Z" fill="white"/>
                  <path d="M18 4H14V20H18V4Z" fill="white"/>
                </svg>
              ) : (
                <Play className="w-5 h-5" />
              )}
            </button>
            
            <div className="text-xs mx-2 flex items-center space-x-1">
              <span>{formatTime(progress)}</span>
              <span>/</span>
              <span>{videoContent.selectedVideoDetails.duration || formatTime(duration)}</span>
            </div>
            
            <div className="flex-1">
              <div className="h-1 bg-gray-700 rounded-full">
                <div 
                  className="h-1 bg-purple-600 rounded-full" 
                  style={{ width: `${(progress / duration) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div className="flex items-center ml-4 space-x-3">
              <button className="text-xs border border-gray-500 px-2 py-0.5 rounded">
                1x
              </button>
              
              <button>
                <Settings className="w-4 h-4" />
              </button>
              
              <button>
                <Volume2 className="w-4 h-4" />
              </button>
              
              <button>
                <Maximize className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          {/* Bottom content tabs */}
          <div className="bg-white border-t border-gray-200 max-w-[75.5%]" style={{ minHeight: '600px' }}>
            {/* Tabs with Search icon/functionality */}
            <div className="flex items-center border-b border-gray-200">
              <button 
                className="px-4 py-3 text-gray-500 hover:text-gray-700"
                type="button"
                aria-label="Search"
                onClick={() => setShowSearch(!showSearch)}
              >
                <Search className="w-5 h-5" />
              </button>
              
              {!showSearch && (
                <>
                  {[
                    { id: 'overview', label: 'Overview' },
                    { id: 'notes', label: 'Notes' },
                    { id: 'announcements', label: 'Announcements' },
                    { id: 'reviews', label: 'Reviews' },
                    { id: 'learning-tools', label: 'Learning tools' }
                  ].map(tab => (
                    <button 
                      key={tab.id}
                      className={`px-6 py-3 text-sm font-bold ${activeTab === tab.id ? 'text-gray-700 border-b-2 border-gray-700' : 'text-gray-500 hover:text-gray-800'}`}
                      onClick={() => setActiveTab(tab.id as typeof activeTab)}
                      type="button"
                    >
                      {tab.label}
                    </button>
                  ))}
                </>
              )}
              
              {showSearch && (
                <div className="flex-1 p-2">
                  <div className="relative flex items-center">
                    <input 
                      type="text"
                      placeholder="Search course content"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                      autoFocus
                    />
                    <button 
                      className="absolute right-2 bg-purple-600 hover:bg-purple-700 text-white p-1 rounded-md"
                      aria-label="Search"
                    >
                      <Search className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Search results display (only shown when search is active) */}
            {showSearch && (
              <div className="p-6 text-center">
                <h3 className="text-xl font-semibold mb-2">Start a new search</h3>
                <p className="text-gray-600">To find lectures or resources</p>
              </div>
            )}
            
            {/* Tab content - Overview */}
            {activeTab === 'overview' && (
              <div className="p-6">
                {/* Rating, Students, and Total section */}
                <div className="flex items-center gap-8 mb-6">
                  <div className="flex flex-col items-center ">
                    <span className="text-amber-700 text-lg font-bold mr-1">0.0 <span className="text-amber-700">★</span></span>
                    <span className="text-gray-500 text-xs ml-1">(0 ratings)</span>
                  </div>
                  <div className="">
                    <div className="text-gray-700 font-bold">0</div>
                    <div className="text-gray-500 text-xs">Students</div>
                  </div>
                  <div>
                    <div className="text-gray-700 font-bold">2mins</div>
                    <div className="text-gray-500 text-xs">Total</div>
                  </div>
                </div>
                
                {/* Published date and language */}
                <div className="mb-6 space-y-3">
                  <div className="flex items-center text-gray-600">
                    <Clock className="w-4 h-4 mr-2" />
                    <span className="text-sm">Published December 1969</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Globe className="w-4 h-4 mr-2" />
                    <span className="text-sm">English</span>
                  </div>
                </div>
                
                {/* Schedule learning time section */}
                <div className="border-b border-gray-300 mb-8">
                <div className=" p-6 border border-gray-300 rounded-lg">
                  <div className="flex items-start">
                    <Clock className="text-gray-500 w-5 h-5 mr-3 mt-1" />
                    <div>
                      <h4 className="font-medium text-base mb-2">Schedule learning time</h4>
                      <p className="text-sm text-gray-600 mb-4">
                        Learning a little each day adds up. Research shows that students who make learning a habit are more likely to reach their goals.
                        Set time aside to learn and get reminders using your learning scheduler.
                      </p>
                      <div className="flex">
                        <button className="bg-[#6D28D2] hover:bg-[#7D28D2] text-white text-sm py-2 px-4 rounded-md mr-3 font-medium">
                          Get started
                        </button>
                        <button className="text-[#6D28D2] hover:text-[#7D28D2] text-sm py-2 px-4 font-medium">
                          Dismiss
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                </div>
                
                {/* By the numbers section */}
                <div className="mb-8 pb-8 border-b border-gray-200 grid grid-cols-3">
                  <h3 className="text-gray-700 text-sm mb-4">By the numbers</h3>

                    <div className="mr-16">
                      <p className="text-sm text-gray-700">Skill level:</p>
                      <p className="text-sm text-gray-700">Students: 0</p>
                      <p className="text-sm text-gray-700">Languages: English</p>
                      <p className="text-sm text-gray-700">Captions: No</p>
                    </div>

                    <div>
                       <p className="text-sm text-gray-700">Lectures: 1</p>
                       <p className="text-sm text-gray-700">Video: 2 total mins</p>
                    </div>
                </div>
                
                {/* Features section */}
                <div className="mb-8 pb-8 border-b grid grid-cols-3 items-center border-gray-200 mr-7">
                  <h3 className="text-sm text-gray-700 ">Features</h3>
                  <div className="flex items-center text-gray-700 font-medium ">
                    <p className="text-sm">Available on </p>
                    <a href="#" className="text-purple-600 mx-1 text-sm font-medium">iOS</a>
                    <p className="text-sm">and</p>
                    <a href="#" className="text-purple-600 mx-1 text-sm font-medium">Android</a>
                  </div>
                </div>
                
                {/* Description section */}
                <div className="mb-8 pb-8 border-b border-gray-200 grid grid-cols-3 mr-10 ">
                  <h3 className="text-sm text-gray-700 ">Description</h3>
                  <div className="text-sm text-gray-700">
                    <div>
                      <h4 className="font-medium text-sm ">What you'll learn</h4>
                      {/* Content would go here */}
                    </div>
                    <div>
                      <h4 className="font-medium text-sm ">Are there any course requirements or prerequisites?</h4>
                      {/* Content would go here */}
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">Who this course is for:</h4>
                      {/* Content would go here */}
                    </div>
                  </div>
                </div>
                
                {/* Instructor section */}
                <div className="flex flex-row grid grid-cols-3 mr-10">
                  <h3 className="text-sm text-gray-700">Instructor</h3>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center text-white font-medium">
                      SS
                    </div>
                    <div className="ml-3">
                      <h4 className="font-medium">Stanley Samuel</h4>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Tab content - Notes */}
            {activeTab === 'notes' && (
              <div className="p-6">
                <div className="mb-4">
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="Create a new note at 0:00" 
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500" 
                    />
                    <button 
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500" 
                      aria-label="Add note"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                
                <div className="flex space-x-2 mb-6">
                  <div className="relative">
                    <button className="flex items-center px-3 py-1.5 text-sm border border-purple-300 rounded-md text-purple-700 font-medium">
                      <span>All lectures</span>
                      <ChevronDown className="w-4 h-4 ml-1" />
                    </button>
                  </div>
                  
                  <div className="relative">
                    <button className="flex items-center px-3 py-1.5 text-sm border border-purple-300 rounded-md text-purple-700 font-medium">
                      <span>Sort by most recent</span>
                      <ChevronDown className="w-4 h-4 ml-1" />
                    </button>
                  </div>
                </div>
                
                <div className="flex flex-col items-center justify-center h-32 text-center">
                  <p className="text-gray-600 mb-2">Click the "Create a new note" box, the "+" button, or press "B" to make your first note.</p>
                </div>
              </div>
            )}
            
            {/* Tab content - Announcements */}
            {activeTab === 'announcements' && (
              <div className="p-6">
                <div className="text-center py-8">
                  <h3 className="text-xl font-bold mb-2">No announcements posted yet</h3>
                  <p className="text-gray-600">
                    The instructor hasn't added any announcements to this course yet. Announcements 
                    are used to inform you of updates or additions to the course.
                  </p>
                </div>
              </div>
            )}
            
            {/* Tab content - Reviews */}
            {activeTab === 'reviews' && (
              <div className="p-6">
                <div className="text-center py-8">
                  <h3 className="text-xl font-bold mb-2">Student feedback</h3>
                  <p className="text-gray-600">
                    This course doesn't have any reviews yet.
                  </p>
                </div>
              </div>
            )}
            
            {/* Tab content - Learning tools */}
            {activeTab === 'learning-tools' && (
              <div className="p-6">
                <div className="mb-6">
                  <h3 className="text-xl font-bold mb-2">Learning reminders</h3>
                  <p className="text-gray-600 mb-4">
                    Set up push notifications or calendar events to stay on track for your learning goals.
                  </p>
                  
                  <button className="flex items-center bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-colors">
                    <Plus className="w-4 h-4 mr-1" />
                    <span>Add a learning reminder</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Right side - Fixed sidebar */}
        <div className="w-80 bg-white border-l border-gray-200 flex flex-col fixed top-0 right-0 h-full">
          {/* Header with close button */}
          <div className="flex justify-between items-center border-b border-gray-200 p-4">
            <h2 className="font-semibold">Course content</h2>
            <button 
              onClick={() => setShowVideoPreview(false)} 
              className="text-gray-500 hover:text-gray-700"
              type="button"
              aria-label="Close preview"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Lecture sections container - scrollable */}
          <div className="flex-1 overflow-y-auto">
            {/* Section with lecture */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold">Section 1: ecw</h3>
                <ChevronUp className="w-4 h-4" />
              </div>
              <p className="text-sm text-gray-500">0/1 | 1min</p>
            </div>
            
            {/* Lecture item */}
            <div className="p-4 bg-gray-100 border-l-4 border-purple-600">
              <div className="flex items-start">
                <input 
                  type="checkbox" 
                  className="mt-1 mr-2" 
                  aria-label="Mark lecture as complete"
                />
                <div>
                  <p className="font-medium">1. {lecture.name || "uieosco"}</p>
                  <div className="flex items-center text-xs text-gray-500 mt-1">
                    <Play className="w-3 h-3 mr-1" />
                    <span>1min</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Bottom navigation with Finish course button */}
          <div className="p-4 border-t border-gray-200">
           
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorVideoPreview;