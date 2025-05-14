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
  Plus,
  Edit,
  Trash2
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import ReactPlayer from "react-player";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";

type ChildProps = {
  videoContent: VideoContent;
  setShowVideoPreview: React.Dispatch<React.SetStateAction<boolean>>;
  lecture: Lecture;
  section: any
};

// Define a type for our notes
type VideoNote = {
  id: string;
  timestamp: number;
  formattedTime: string;
  content: string;
  lectureId: string;
  lectureName?: string;
  sectionName: string;
  createdAt: Date;
};
type ModalStep = 1 | 2 | 3;
type FrequencyType = 'Daily' | 'Weekly' | 'Once';

const InstructorVideoPreview = ({ videoContent, setShowVideoPreview, lecture, section}: ChildProps) => {
  // State management
  const [activeTab, setActiveTab] = useState<'overview' | 'notes' | 'announcements' | 'reviews' | 'learning-tools'>('overview');
  const [playing, setPlaying] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [showControls, setShowControls] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.8);
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [showSearch, setShowSearch] = useState<boolean>(false);
  
  // Notes specific state
  const [notes, setNotes] = useState<VideoNote[]>([]);
  const [isAddingNote, setIsAddingNote] = useState<boolean>(false);
  const [currentNoteContent, setCurrentNoteContent] = useState<string>("");
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [allLecturesDropdownOpen, setAllLecturesDropdownOpen] = useState<boolean>(false);
  const [sortByDropdownOpen, setSortByDropdownOpen] = useState<boolean>(false);
  const [selectedLectureFilter, setSelectedLectureFilter] = useState<string>("All lectures");
  const [selectedSortOption, setSelectedSortOption] = useState<string>("Sort by most recent");
  const [forwardLabel, setForwardLabel] = useState<boolean>(false);
  const [rewindLabel, setRewindLabel] = useState<boolean>(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const [showLearningModal, setShowLearningModal] = useState<boolean>(false);
  const [modalStep, setModalStep] = useState<ModalStep>(1);
  const [reminderName, setReminderName] = useState<string>('Learning reminder');
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [frequency, setFrequency] = useState<FrequencyType>('Daily');
  const [reminderTime, setReminderTime] = useState<string>('12:00 PM');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  
  // Function to handle opening the learning schedule modal
  const handleOpenLearningModal = () => {
    setShowLearningModal(true);
    setModalStep(1);
  };

  // Function to close the modal
  const handleCloseModal = () => {
    setShowLearningModal(false);
  };

  // Function to handle next button in modal
  const handleNext = () => {
    if (modalStep < 3) {
      setModalStep((modalStep + 1) as ModalStep);
    } else {
      // Complete the process
      setShowLearningModal(false);
      // Here you would typically save the reminder
    }
  };

  // Function to handle previous button in modal
  const handlePrevious = () => {
    if (modalStep > 1) {
      setModalStep((modalStep - 1) as ModalStep);
    }
  };

  // Function to handle frequency selection
  const handleFrequencyChange = (newFrequency: FrequencyType) => {
    setFrequency(newFrequency);
  };

  // Function to toggle day selection for weekly frequency
  const toggleDay = (day: string) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter(d => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  // Add this search handling function
  const handleSearchToggle = () => {
    setShowSearch(!showSearch);
    // Reset other states if needed when opening search
    if (!showSearch) {
      setActiveTab('overview'); // This ensures we're not showing tab content under search
    }
  };
  
  const playerRef = useRef<ReactPlayer>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const mainContentRef = useRef<HTMLDivElement>(null);
  
  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (allLecturesDropdownOpen || sortByDropdownOpen) {
        // Close dropdowns when clicking outside
        setAllLecturesDropdownOpen(false);
        setSortByDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [allLecturesDropdownOpen, sortByDropdownOpen]);
  
  useEffect(() => {
    // If the component is mounted, make sure we have our event handlers set up
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        setPlaying(!playing);
        e.preventDefault();
      } else if (e.code === "KeyB" && activeTab === 'notes' && !isAddingNote) {
        // "B" key to add a new note
        handleCreateNote();
        e.preventDefault();
      }
    };
    
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [playing, activeTab, isAddingNote]);

  const renderLearningModal = () => {
    return (
      <div className="fixed inset-0 z-[10000] backdrop-blur-sm bg-opacity-50 flex items-center justify-center">
        <div className="bg-white rounded-lg w-full max-w-xl shadow-lg">
          <div className="p-4 flex justify-between items-center border-b border-gray-200">
            <h2 className="text-lg font-medium">Learning reminders</h2>
            <button 
              onClick={handleCloseModal}
              className="text-gray-500 hover:text-gray-700"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="p-6">
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-4">Step {modalStep} of 3</p>
            </div>
            
            {modalStep === 1 && (
              <>
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-1">
                    <label className="block font-medium">Name</label>
                    <span className="text-sm text-gray-500">optional</span>
                  </div>
                  <input
                    type="text"
                    value={reminderName}
                    onChange={(e) => setReminderName(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-purple-500"
                    placeholder="Learning reminder"
                  />
                </div>
                
                <div>
                  <p className="font-medium mb-2">Attach content (optional)</p>
                  <p className="text-sm text-gray-600 mb-3">Most recent courses or labs:</p>
                  
                  <div className="mb-3">
                    <label className="flex items-center space-x-2 mb-2">
                      <input 
                        type="radio" 
                        name="course" 
                        value="course" 
                        checked={selectedCourse === "course"}
                        onChange={() => setSelectedCourse("course")}
                        className="text-purple-600"
                      />
                      <span className="text-sm">Course: How to Create an Online Course: The Official Udemy Course</span>
                    </label>
                    
                    <label className="flex items-center space-x-2">
                      <input 
                        type="radio" 
                        name="course" 
                        value="none" 
                        checked={selectedCourse === "none"}
                        onChange={() => setSelectedCourse("none")}
                        className="text-purple-600"
                      />
                      <span className="text-sm">None</span>
                    </label>
                  </div>
                  
                  <div className="relative mb-4">
                    <input
                      type="text"
                      placeholder="Search"
                      className="w-full p-3 pl-10 border border-gray-300 rounded"
                    />
                    <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  </div>
                </div>
              </>
            )}
            
            {modalStep === 2 && (
              <>
                <div className="mb-6">
                  <p className="font-medium mb-3">Frequency</p>
                  <div className="flex space-x-3">
                    <button 
                      className={`px-4 py-2 rounded-full border ${frequency === 'Daily' ? 'bg-purple-100 border-purple-300' : 'border-gray-300'}`}
                      onClick={() => handleFrequencyChange('Daily')}
                    >
                      {frequency === 'Daily' && <span className="mr-1">✓</span>}
                      Daily
                    </button>
                    <button 
                      className={`px-4 py-2 rounded-full border ${frequency === 'Weekly' ? 'bg-purple-100 border-purple-300' : 'border-gray-300'}`}
                      onClick={() => handleFrequencyChange('Weekly')}
                    >
                      {frequency === 'Weekly' && <span className="mr-1">✓</span>}
                      Weekly
                    </button>
                    <button 
                      className={`px-4 py-2 rounded-full border ${frequency === 'Once' ? 'bg-purple-100 border-purple-300' : 'border-gray-300'}`}
                      onClick={() => handleFrequencyChange('Once')}
                    >
                      {frequency === 'Once' && <span className="mr-1">✓</span>}
                      Once
                    </button>
                  </div>
                </div>
                
                <div className="mb-6">
                  <p className="font-medium mb-3">Time</p>
                  <div className="relative">
                    <input
                      type="text"
                      value={reminderTime}
                      onChange={(e) => setReminderTime(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-md"
                    />
                    <Clock className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 transform -translate-y-1/2" />
                  </div>
                </div>
                
                {frequency === 'Weekly' && (
                  <div className="mb-6">
                    <p className="font-medium mb-3">Day</p>
                    <div className="flex space-x-2">
                      {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                        <button
                          key={day}
                          className={`h-10 w-10 rounded-full border flex items-center justify-center ${
                            selectedDays.includes(day) ? 'bg-purple-100 border-purple-300' : 'border-gray-300'
                          }`}
                          onClick={() => toggleDay(day)}
                        >
                          <span className="text-sm">{selectedDays.includes(day) ? '✓' : '+'} {day}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                {frequency === 'Once' && (
                  <div className="mb-6">
                    <p className="font-medium mb-3">Date</p>
                    <div className="relative">
                      <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        placeholder="MM/DD/YYYY"
                        className="w-full p-3 border border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                )}
              </>
            )}
            
            {modalStep === 3 && (
              <>
                <div className="mb-6">
                  <p className="font-medium mb-3">Add to calendar (optional)</p>
                  <div className="flex space-x-3 mb-4">
                    <button className="flex items-center px-4 py-2 border border-purple-600 text-purple-600 rounded">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="#673ab7">
                        <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z"/>
                      </svg>
                      <span className="ml-2">Sign in with Google</span>
                    </button>
                    
                    <button className="flex items-center px-4 py-2 border border-gray-300 rounded">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.71,19.5C17.88,20.74 17,21.95 15.66,21.97C14.32,22 13.89,21.18 12.37,21.18C10.84,21.18 10.37,21.95 9.1,22C7.79,22.05 6.8,20.68 5.96,19.47C4.25,17 2.94,12.45 4.7,9.39C5.57,7.87 7.13,6.91 8.82,6.88C10.1,6.86 11.32,7.75 12.11,7.75C12.89,7.75 14.37,6.68 15.92,6.84C16.57,6.87 18.39,7.1 19.56,8.82C19.47,8.88 17.39,10.1 17.41,12.63C17.44,15.65 20.06,16.66 20.09,16.67C20.06,16.74 19.67,18.11 18.71,19.5M13,3.5C13.73,2.67 14.94,2.04 15.94,2C16.07,3.17 15.6,4.35 14.9,5.19C14.21,6.04 13.07,6.7 11.95,6.61C11.8,5.46 12.36,4.26 13,3.5Z"/>
                      </svg>
                      <span className="ml-2">Apple</span>
                    </button>
                    
                    <button className="flex items-center px-4 py-2 border border-gray-300 rounded">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M21.386 12.000c0-1.197-.22-2.403-.662-3.557-.43-1.113-1.057-2.145-1.876-3.022-.8-.86-1.762-1.53-2.816-1.989-1.088-.472-2.229-.704-3.383-.704h-.297c-1.154 0-2.295.232-3.383.704-1.054.459-2.016 1.129-2.816 1.989-.819.877-1.446 1.909-1.876 3.022-.442 1.155-.662 2.360-.662 3.557 0 .64.064 1.275.186 1.900.114.59.274 1.174.48 1.729v2.898c0 .193.123.366.307.43.184.063.387.006.522-.143L7.63 17.29c.43.193.88.357 1.338.487.544.155 1.11.244 1.678.264h.303c1.153 0 2.295-.232 3.383-.704 1.053-.46 2.016-1.13 2.815-1.99.82-.876 1.446-1.908 1.876-3.02.442-1.155.663-2.36.663-3.558zM8.46 11.991c0-.568.456-1.031 1.015-1.031.56 0 1.015.463 1.015 1.031 0 .567-.455 1.031-1.015 1.031-.56 0-1.015-.464-1.015-1.031zm3.015 0c0-.568.456-1.031 1.015-1.031.56 0 1.015.463 1.015 1.031 0 .567-.455 1.031-1.015 1.031-.56 0-1.015-.464-1.015-1.031zm3.016 0c0-.568.455-1.031 1.015-1.031.559 0 1.015.463 1.015 1.031 0 .567-.456 1.031-1.015 1.031-.56 0-1.015-.464-1.015-1.031z"/>
                      </svg>
                      <span className="ml-2">Outlook</span>
                    </button>
                  </div>
                  
                  <p className="text-xs text-gray-600">
                    Follow all calendar prompts and save before moving forward. Apple and outlook will download an ics file. Open this file to add it to your calendar.
                  </p>
                </div>
              </>
            )}
          </div>
          
          <div className="px-6 pb-6 flex justify-end">
            {modalStep > 1 && (
              <button 
                onClick={handlePrevious}
                className="mr-3 text-purple-600 font-medium"
              >
                Previous
              </button>
            )}
            
            {modalStep < 3 ? (
              <button 
                onClick={handleNext}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded"
              >
                Next
              </button>
            ) : (
              <button 
                onClick={handleCloseModal}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded"
              >
                Done
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };
  
  // Fix for scroll issue
  useEffect(() => {
    // This will prevent the automatic scrolling behavior
    if (mainContentRef.current) {
      const mainContent = mainContentRef.current;
      
      // Store the scroll position
      let lastScrollTop = 0;
      
      const handleScroll = () => {
        // Get current scroll position
        const scrollTop = mainContent.scrollTop;
        
        // Store scroll position for later use
        lastScrollTop = scrollTop;
      };
      
      // Override browser's automatic scroll restoration
      const handleWheel = (e: WheelEvent) => {
        // Let the natural scrolling happen, but ensure we're saving position
        requestAnimationFrame(() => {
          handleScroll();
        });
      };
      
      // Add event listeners
      mainContent.addEventListener('scroll', handleScroll, { passive: true });
      mainContent.addEventListener('wheel', handleWheel, { passive: true });
      
      return () => {
        mainContent.removeEventListener('scroll', handleScroll);
        mainContent.removeEventListener('wheel', handleWheel);
      };
    }
  }, []);
  
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
  
  // Note-related functions
  const handleCreateNote = () => {
    setIsAddingNote(true);
    setCurrentNoteContent("");
    setEditingNoteId(null);
  };
  
  const handleSaveNote = () => {
    if (editingNoteId) {
      // Update existing note
      setNotes(notes.map(note => 
        note.id === editingNoteId 
          ? { ...note, content: currentNoteContent } 
          : note
      ));
    } else {
      // Create new note
      const newNote: VideoNote = {
        id: Date.now().toString(),
        timestamp: progress,
        formattedTime: formatTime(progress),
        content: currentNoteContent,
        lectureId: lecture.id || "default-lecture",
        lectureName: lecture.name,
        sectionName: "vtgui", // This would typically come from your data structure
        createdAt: new Date()
      };
      
      setNotes([newNote, ...notes]);
    }
    
    setIsAddingNote(false);
    setCurrentNoteContent("");
    setEditingNoteId(null);
  };
  
  const handleCancelNote = () => {
    setIsAddingNote(false);
    setCurrentNoteContent("");
    setEditingNoteId(null);
  };
  
  const handleEditNote = (noteId: string) => {
    const noteToEdit = notes.find(note => note.id === noteId);
    if (noteToEdit) {
      setCurrentNoteContent(noteToEdit.content);
      setEditingNoteId(noteId);
      setIsAddingNote(true);
    }
  };
  
  const handleDeleteNote = (noteId: string) => {
    setNotes(notes.filter(note => note.id !== noteId));
  };
  
  const getSortedNotes = () => {
    let filteredNotes = [...notes];
    
    // Apply lecture filter
    if (selectedLectureFilter === "Current lecture") {
      filteredNotes = filteredNotes.filter(note => note.lectureId === lecture.id);
    }
    
    // Apply sort
    if (selectedSortOption === "Sort by most recent") {
      filteredNotes.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    } else if (selectedSortOption === "Sort by oldest") {
      filteredNotes.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    }
    
    return filteredNotes;
  };
  
  // Add these functions to handle video controls
  const handleForward = () => {
    if (playerRef.current) {
      const newTime = Math.min(duration, progress + 5);
      playerRef.current.seekTo(newTime / duration);
      
      // Show the forward label temporarily
      setForwardLabel(true);
      setTimeout(() => {
        setForwardLabel(false);
      }, 800);
    }
  };
  
  const handleRewind = () => {
    if (playerRef.current) {
      const newTime = Math.max(0, progress - 5);
      playerRef.current.seekTo(newTime / duration);
      
      // Show the rewind label temporarily
      setRewindLabel(true);
      setTimeout(() => {
        setRewindLabel(false);
      }, 800);
    }
  };
  
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };
  
  // Update this useEffect to include fullscreen change event listener
  useEffect(() => {
    // If the component is mounted, make sure we have our event handlers set up
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        setPlaying(!playing);
        e.preventDefault();
      } else if (e.code === "ArrowRight") {
        handleForward();
        e.preventDefault();
      } else if (e.code === "ArrowLeft") {
        handleRewind();
        e.preventDefault();
      }
    };
    
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [playing]);
  
  return (
    <div className="fixed inset-0 z-[9999] bg-white flex flex-col">
      {/* Main scrollable container for video and tabs */}
      <div className="flex flex-1 h-full overflow-hidden">
        {/* Left side - scrollable content (video player + tabs) */}
        <div ref={mainContentRef} className="flex-1 overflow-y-auto" style={{ width: 'calc(100% - 320px)' }}>
          {/* Video player section */}
          <div className="bg-black relative w-[82vw]" style={{ height: 'calc(100vh - 220px)' }}>
            <div 
              ref={playerContainerRef}
              className="relative w-full h-full flex "
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
                      <Play size={80} className="p-3 rounded-full bg-gray-800 text-white" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Bottom video controls bar (visible when not in controls overlay) */}
          <div className="h-12 bg-black w-[82vw] flex items-center px-4 text-white relative">
            {/* Progress bar at the very top */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gray-900">
              <div 
                className="h-full bg-gradient-to-r from-purple-600 to-purple-700" 
                style={{ width: `${(progress / duration) * 100}%` }}
              ></div>
            </div>

            {/* Left controls */}
            <div className="flex items-center space-x-3">
              <button 
                className="hover:text-gray-300 focus:outline-none"
                aria-label="Play/Pause"
                onClick={() => setPlaying(!playing)}
              >
                {playing ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 4H6V20H10V4Z" fill="white"/>
                    <path d="M18 4H14V20H18V4Z" fill="white"/>
                  </svg>
                ) : (
                  <Play className="w-5 h-5" />
                )}
              </button>

              {/* Rewind button with label */}
              <div className="relative">
                <button 
                  className="hover:text-gray-300 focus:outline-none"
                  aria-label="Rewind 5s"
                  onClick={handleRewind}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.5 8V16L6.5 12L12.5 8Z" fill="white"/>
                    <path d="M18.5 8V16L12.5 12L18.5 8Z" fill="white"/>
                  </svg>
                </button>
                {rewindLabel && (
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 px-2 py-0.5 rounded text-xs">
                    Rewind 5s
                  </div>
                )}
              </div>

              {/* Forward button with label */}
              <div className="relative">
                <button 
                  className="hover:text-gray-300 focus:outline-none"
                  aria-label="Forward 5s"
                  onClick={handleForward}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5.5 8V16L11.5 12L5.5 8Z" fill="white"/>
                    <path d="M11.5 8V16L17.5 12L11.5 8Z" fill="white"/>
                  </svg>
                </button>
                {forwardLabel && (
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 px-2 py-0.5 rounded text-xs whitespace-nowrap">
                    Forward 5s
                  </div>
                )}
              </div>

              <div className="text-xs mx-2 flex items-center space-x-1 font-medium">
                <span>{formatTime(progress)}</span>
                <span className="text-gray-400">/</span>
                <span className="text-gray-400">{videoContent.selectedVideoDetails.duration || formatTime(duration)}</span>
              </div>
            </div>

            {/* Center - empty space */}
            <div className="flex-1"></div>

            {/* Right controls */}
            <div className="flex items-center space-x-3">
              <button 
                className="text-xs border border-gray-700 px-2 py-0.5 rounded hover:bg-gray-900 focus:outline-none"
                onClick={() => {
                  const rates = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
                  const currentIndex = rates.indexOf(playbackRate);
                  const nextIndex = (currentIndex + 1) % rates.length;
                  setPlaybackRate(rates[nextIndex]);
                }}
              >
                {playbackRate}x
              </button>

              {/* Volume control with hover slider */}
              <div className="relative">
                <button 
                  className="hover:text-gray-300 focus:outline-none"
                  onMouseEnter={() => setShowVolumeSlider(true)}
                  onMouseLeave={() => setShowVolumeSlider(false)}
                >
                  <Volume2 className="w-4 h-4" />
                </button>
                
                {showVolumeSlider && (
                  <div 
                    className="absolute bottom-8 -left-1 bg-gray-900 p-2 rounded shadow-lg z-10"
                    onMouseEnter={() => setShowVolumeSlider(true)}
                    onMouseLeave={() => setShowVolumeSlider(false)}
                  >
                    <div 
                      className="h-20 w-1 bg-gray-700 rounded-full cursor-pointer"
                      onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const newVolume = 1 - ((e.clientY - rect.top) / rect.height);
                        setVolume(Math.max(0, Math.min(1, newVolume)));
                      }}
                    >
                      <div 
                        className="bg-white rounded-full absolute bottom-0 left-0 right-0" 
                        style={{ height: `${volume * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              <button className="hover:text-gray-300 focus:outline-none">
                <Settings className="w-4 h-4" />
              </button>

              <button 
                className="hover:text-gray-300 focus:outline-none"
                onClick={toggleFullscreen}
              >
                <Maximize className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          {/* Bottom content tabs */}
          <div className="bg-white border-t border-gray-200 max-w-[82vw]" style={{ minHeight: '600px' }}>
            {/* Tabs with Search icon/functionality */}
            <div className="flex items-center border-b border-gray-200">
  <button 
    className={`px-4 py-3 text-gray-500 hover:text-gray-700 ${showSearch ? 'text-gray-700 border-b-2 border-gray-700' : ''}`}
    type="button"
    aria-label="Search"
    onClick={handleSearchToggle}
  >
    <Search className="w-5 h-5" />
  </button>
  
  {/* Tabs always visible */}
  {[
    { id: 'overview', label: 'Overview' },
    { id: 'notes', label: 'Notes' },
    { id: 'announcements', label: 'Announcements' },
    { id: 'reviews', label: 'Reviews' },
    { id: 'learning-tools', label: 'Learning tools' }
  ].map(tab => (
    <button 
      key={tab.id}
      className={`px-6 py-3 text-sm font-bold ${activeTab === tab.id && !showSearch ? 'text-gray-700 border-b-2 border-gray-700' : 'text-gray-500 hover:text-gray-800'}`}
      onClick={() => {
        setActiveTab(tab.id as typeof activeTab);
        setShowSearch(false);
      }}
      type="button"
    >
      {tab.label}
    </button>
  ))}
</div>

{/* Search interface */}
{showSearch && (
  <div className="px-6 py-8">
    <div className="max-w-2xl mx-auto mb-8">
      <div className="relative flex items-center">
        <input 
          type="text"
          placeholder="Search course content"
          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
          autoFocus
        />
        <button 
          className="absolute right-2 bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-md"
          aria-label="Search"
        >
          <Search className="w-5 h-5" />
        </button>
      </div>
    </div>
    
    <div className="text-center py-8">
      <h3 className="text-xl font-bold mb-2 text-gray-800">Start a new search</h3>
      <p className="text-gray-600">To find lectures or resources</p>
    </div>
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

                    <div className="mr-12">
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
                <div className="grid grid-cols-3 mr-10">
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
      
      <button 
        className="flex items-center bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-colors"
        onClick={handleOpenLearningModal}
      >
        <Plus className="w-4 h-4 mr-1" />
        <span>Add a learning reminder</span>
      </button>
    </div>
  </div>
)}
            
            {/* Tab content - Notes */}
            {activeTab === 'notes' && (
              <div className="p-6 flex flex-col items-center">
                {/* Note adding/editing interface */}
                {!isAddingNote ? (
                  <div className="mb-4 w-full max-w-3xl">
                    <div className="relative">
                      <input 
                        type="text" 
                        placeholder={`Create a new note at ${formatTime(progress)}`}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500" 
                        onClick={handleCreateNote} 
                        readOnly
                      />
                      <button 
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-purple-600" 
                        aria-label="Add note"
                        onClick={handleCreateNote}
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mb-4 w-full max-w-3xl">
                    <div className="bg-black text-white text-sm px-3 py-1 rounded-t-md inline-block">
                      {formatTime(progress)}
                    </div>
                    <div className="border border-purple-200 rounded-md p-2 rounded-tl-none">
                      <div className="border-b border-gray-200 pb-2 mb-2 flex items-center">
                        <button className="px-2 py-1 text-sm">Styles</button>
                        <button className="px-2 py-1 text-sm font-bold">B</button>
                        <button className="px-2 py-1 text-sm italic">I</button>
                        <button className="px-2 py-1 text-sm">≡</button>
                        <button className="px-2 py-1 text-sm">≡</button>
                        <button className="px-2 py-1 text-sm">&lt;&gt;</button>
                        <div className="ml-auto text-gray-400 text-sm">1000</div>
                      </div>
                      <textarea 
                        className="w-full min-h-32 resize-none focus:outline-none focus:ring-0 border-0 p-2" 
                        value={currentNoteContent}
                        onChange={(e) => setCurrentNoteContent(e.target.value)}
                        placeholder="Enter your note here..."
                        autoFocus
                      />
                    </div>
                    <div className="flex justify-end mt-2">
                      <button 
                        className="text-gray-700 font-medium mr-3 hover:text-gray-900"
                        onClick={handleCancelNote}
                      >
                        Cancel
                      </button>
                      <button 
                        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md disabled:bg-purple-300"
                        onClick={handleSaveNote}
                        disabled={!currentNoteContent.trim()}
                      >
                        Save note
                      </button>
                    </div>
                  </div>
                )}
                
                {/* Filter dropdowns */}
                <div className="flex space-x-2 mb-6 w-full max-w-3xl">
                  {/* All lectures dropdown */}
                  <div className="relative">
                    <button 
                      className="flex items-center px-3 py-1.5 text-sm border border-[#6D28D2] text-[#6D28D2] rounded-md font-medium"
                      onClick={(e) => {
                        e.stopPropagation();
                        setAllLecturesDropdownOpen(!allLecturesDropdownOpen);
                        setSortByDropdownOpen(false);
                      }}
                    >
                      <span>{selectedLectureFilter}</span>
                      <ChevronDown className="w-4 h-4 ml-1" />
                    </button>
                    
                    {allLecturesDropdownOpen && (
                      <div className="absolute top-full left-0 mt-1 bg-white rounded-md shadow-lg z-10 w-48">
                        <div className="p-2">
                          <button 
                            className={`block w-full text-left px-3 py-2 text-sm rounded-md `}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedLectureFilter('All lectures');
                              setAllLecturesDropdownOpen(false);
                            }}
                          >
                            All lectures
                          </button>
                          <button 
                            className={`block w-full text-left px-3 py-2 text-sm rounded-md`}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedLectureFilter('Current lecture');
                              setAllLecturesDropdownOpen(false);
                            }}
                          >
                            Current lecture
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Sort by dropdown */}
                  <div className="relative">
                    <button 
                      className="flex items-center px-3 py-1.5 text-sm border border-[#6D28D2] rounded-md text-[#6D28D2] font-medium"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSortByDropdownOpen(!sortByDropdownOpen);
                        setAllLecturesDropdownOpen(false);
                      }}
                    >
                      <span>{selectedSortOption}</span>
                      <ChevronDown className="w-4 h-4 ml-1" />
                    </button>
                    
                    {sortByDropdownOpen && (
                      <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 w-48">
                        <div className="p-2">
                          <button 
                            className={`block w-full text-left px-3 py-2 text-sm rounded-md `}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedSortOption('Sort by most recent');
                              setSortByDropdownOpen(false);
                            }}
                          >
                            Sort by most recent
                          </button>
                          <button 
                            className={`block w-full text-left px-3 py-2 text-sm rounded-md `}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedSortOption('Sort by oldest');
                              setSortByDropdownOpen(false);
                            }}
                          >
                            Sort by oldest
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Notes list or empty state */}
                {getSortedNotes().length > 0 ? (
                  <div className="w-full max-w-3xl">
                    {getSortedNotes().map(note => (
                      <div key={note.id} className="mb-4">
                        <div className="flex items-center mb-2">
                          <div className="bg-black text-white text-xs px-2 py-1 rounded-sm mr-3">
                            {note.formattedTime}
                          </div>
                          <div className="text-sm text-gray-700 font-medium mr-2">
                            {note.sectionName && `${note.sectionName}.`} {note.lectureName}
                          </div>
                          <div className="ml-auto flex">
                            <button 
                              className="text-gray-500 hover:text-purple-600 p-1"
                              onClick={() => handleEditNote(note.id)}
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button 
                              className="text-gray-500 hover:text-red-600 p-1 ml-1"
                              onClick={() => handleDeleteNote(note.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-md">
                          <p className="text-sm text-gray-700">{note.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-32 text-center">
                    <p className="text-gray-600 mb-2">Click the "Create a new note" box, the "+" button, or press "B" to make your first note.</p>
                  </div>
                )}
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
      {showLearningModal && renderLearningModal()}
    </div>
  );
};

export default InstructorVideoPreview;