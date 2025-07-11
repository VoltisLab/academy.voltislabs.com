import React, { useState } from 'react';
import {
  Search,
  Clock,
  Globe,
  Plus,
  Edit,
  Trash2,
  ChevronDown,
} from "lucide-react";
import { VideoNote } from '@/lib/types';

interface BottomTabsContainerProps {
  activeTab: "overview" | "notes" | "announcements" | "reviews" | "learning-tools";
  setActiveTab: (tab: "overview" | "notes" | "announcements" | "reviews" | "learning-tools") => void;
  showSearch: boolean;
  setShowSearch: (show: boolean) => void;
  isExpanded: boolean;
  selectedItemData: any;
  activeItemType: string;
  progress: number;
  formatTime: (seconds: number) => string;
  notes: VideoNote[];
  onCreateNote: () => void;
  onSaveNote: () => void;
  onCancelNote: () => void;
  onEditNote: (noteId: string) => void;
  onDeleteNote: (noteId: string) => void;
  isAddingNote: boolean;
  currentNoteContent: string;
  setCurrentNoteContent: (content: string) => void;
  selectedLectureFilter: string;
  setSelectedLectureFilter: (filter: string) => void;
  selectedSortOption: string;
  setSelectedSortOption: (option: string) => void;
  getSortedNotes: () => VideoNote[];
  onOpenLearningModal: () => void;
  activeItemId: string;
}

const BottomTabsContainer: React.FC<BottomTabsContainerProps> = ({
  activeTab,
  setActiveTab,
  showSearch,
  setShowSearch,
  isExpanded,
  selectedItemData,
  activeItemType,
  progress,
  formatTime,
  notes,
  onCreateNote,
  onSaveNote,
  onCancelNote,
  onEditNote,
  onDeleteNote,
  isAddingNote,
  currentNoteContent,
  setCurrentNoteContent,
  selectedLectureFilter,
  setSelectedLectureFilter,
  selectedSortOption,
  setSelectedSortOption,
  getSortedNotes,
  onOpenLearningModal,
  activeItemId,
}) => {
  const [allLecturesDropdownOpen, setAllLecturesDropdownOpen] = useState(false);
  const [sortByDropdownOpen, setSortByDropdownOpen] = useState(false);

  const handleSearchToggle = () => {
    setShowSearch(!showSearch);
    if (!showSearch) {
      setActiveTab("overview");
    }
  };

  // Function to clean HTML content for display
  const cleanHtmlContent = (htmlString: string): string => {
    if (!htmlString || htmlString.trim() === '') return '';
    
    // Handle React Quill's empty content pattern
    if (htmlString === '<p><br></p>' || htmlString === '<p></p>') {
      return '';
    }
    
    let cleaned = htmlString;
    
    // Remove outer p tags if the content is just a single paragraph
    // FIXED: Use [\s\S]* instead of .* with /s flag for ES5+ compatibility
    if (cleaned.match(/^<p[^>]*>[\s\S]*<\/p>$/) && !cleaned.includes('</p><p>')) {
      cleaned = cleaned.replace(/^<p[^>]*>/, '').replace(/<\/p>$/, '');
    }
    
    // Clean up other unwanted p tag patterns
    cleaned = cleaned
      .replace(/<p><\/p>/g, '') // Remove empty p tags
      .replace(/<p>\s*<\/p>/g, '') // Remove p tags with only whitespace
      .replace(/^<p><br><\/p>$/, '') // Remove single br in p tag
      .trim();
    
    return cleaned;
  };

  // Function to strip HTML tags completely (for plain text display)
  const stripHtmlTags = (htmlString: string): string => {
    if (!htmlString) return '';
    return htmlString.replace(/<[^>]*>/g, '').trim();
  };

  // Get cleaned description for display
  const getDisplayDescription = () => {
    const description = selectedItemData?.description;
    if (!description) return `This is a ${activeItemType} content item.`;
    
    // First clean the HTML, then strip remaining tags for plain text display
    const cleaned = cleanHtmlContent(description);
    return stripHtmlTags(cleaned) || `This is a ${activeItemType} content item.`;
  };

  return (
    <div className="border-t border-gray-200 flex-shrink-0">
      <div className="" style={{ maxWidth: isExpanded ? '100%' : '79.5vw' }}>
        {/* Tabs */}
        <div className="flex items-center border-b border-gray-200">
          <button
            className={`px-4 py-3 text-gray-500 hover:text-gray-700 ${
              showSearch ? "text-gray-700 border-b-2 border-gray-700" : ""
            }`}
            type="button"
            aria-label="Search"
            onClick={handleSearchToggle}
          >
            <Search className="w-5 h-5" />
          </button>

          {[
            { id: "overview", label: "Overview" },
            { id: "notes", label: "Notes" },
            { id: "announcements", label: "Announcements" },
            { id: "reviews", label: "Reviews" },
            { id: "learning-tools", label: "Learning tools" },
          ].map((tab) => (
            <button
              key={tab.id}
              className={`px-6 py-3 text-sm font-bold ${
                activeTab === tab.id && !showSearch
                  ? "text-gray-700 border-b-2 border-gray-700"
                  : "text-gray-500 hover:text-gray-800"
              }`}
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

        {/* Tab content */}
        <div className="flex-1 overflow-y-auto">
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
                    type="button"
                  >
                    <Search className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="text-center py-8">
                <h3 className="text-xl font-bold mb-2 text-gray-800">
                  Start a new search
                </h3>
                <p className="text-gray-600">To find lectures or resources</p>
              </div>
            </div>
          )}

          {activeTab === "overview" && !showSearch && (
            <div className="p-6">
              <div className="flex items-center gap-8 mb-6">
                <div className="flex flex-col items-center">
                  <span className="text-amber-700 text-lg font-bold mr-1">
                    0.0 <span className="text-amber-700">★</span>
                  </span>
                  <span className="text-gray-500 text-xs ml-1">
                    (0 ratings)
                  </span>
                </div>
                <div>
                  <div className="text-gray-700 font-bold">0</div>
                  <div className="text-gray-500 text-xs">Students</div>
                </div>
                <div>
                  <div className="text-gray-700 font-bold">
                    {selectedItemData?.duration || "2mins"}
                  </div>
                  <div className="text-gray-500 text-xs">Total</div>
                </div>
              </div>

              <div className="mb-6 space-y-3">
                <div className="flex items-center text-gray-600">
                  <Clock className="w-4 h-4 mr-2" />
                  <span className="text-sm">Published May 2025</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Globe className="w-4 h-4 mr-2" />
                  <span className="text-sm">English</span>
                </div>
              </div>

              <div className="border-b border-gray-300 mb-8">
                <div className="p-6 border border-gray-300 rounded-lg">
                  <div className="flex items-start">
                    <Clock className="text-gray-500 w-5 h-5 mr-3 mt-1" />
                    <div>
                      <h4 className="font-medium text-base mb-2">
                        Schedule learning time
                      </h4>
                      <p className="text-sm text-gray-600 mb-4">
                        Learning a little each day adds up. Research shows
                        that students who make learning a habit are more
                        likely to reach their goals. Set time aside to learn
                        and get reminders using your learning scheduler.
                      </p>
                      <div className="flex">
                        <button
                          type="button"
                          className="bg-[#6D28D2] hover:bg-[#7D28D2] text-white text-sm py-2 px-4 rounded-md mr-3 font-medium"
                          onClick={onOpenLearningModal}
                        >
                          Get started
                        </button>
                        <button
                          type="button"
                          className="text-[#6D28D2] hover:text-[#7D28D2] text-sm py-2 px-4 font-medium"
                        >
                          Dismiss
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-8 pb-8 border-b border-gray-200 grid grid-cols-3">
                <h3 className="text-gray-700 text-sm mb-4">By the numbers</h3>

                <div className="mr-12">
                  <p className="text-sm text-gray-700">Skill level:</p>
                  <p className="text-sm text-gray-700">Students: 0</p>
                  <p className="text-sm text-gray-700">Languages: English</p>
                  <p className="text-sm text-gray-700">Captions: No</p>
                </div>

                <div>
                  <p className="text-sm text-gray-700">
                    Content Type: {activeItemType}
                  </p>
                  <p className="text-sm text-gray-700">
                    Duration: {selectedItemData?.duration || "2 mins"}
                  </p>
                </div>
              </div>

              <div className="mb-8 pb-8 border-b grid grid-cols-3 items-center border-gray-200 mr-7">
                <h3 className="text-sm text-gray-700">Features</h3>
                <div className="flex items-center text-gray-700 font-medium">
                  <p className="text-sm">Available on </p>
                  <a
                    href="#"
                    className="text-purple-600 mx-1 text-sm font-medium"
                  >
                    iOS
                  </a>
                  <p className="text-sm">and</p>
                  <a
                    href="#"
                    className="text-purple-600 mx-1 text-sm font-medium"
                  >
                    Android
                  </a>
                </div>
              </div>

              <div className="mb-8 pb-8 border-b border-gray-200 grid grid-cols-3 mr-10">
                <h3 className="text-sm text-gray-700">Description</h3>
                <div className="text-sm text-gray-700 col-span-2">
                  <div>
                    <h4 className="font-medium text-sm mb-2">
                      Content Details
                    </h4>
                    <p className="mb-4">
                      {getDisplayDescription()}
                    </p>
                  </div>
                </div>
              </div>

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

          {activeTab === "notes" && !showSearch && (
            <div className="p-6 flex flex-col items-center">
              {!isAddingNote ? (
                <div className="mb-4 w-full max-w-3xl">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder={`Create a new note at ${formatTime(progress)}`}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                      onClick={onCreateNote}
                      readOnly
                    />
                    <button
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-purple-600"
                      aria-label="Add note"
                      onClick={onCreateNote}
                      type="button"
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
                      onClick={onCancelNote}
                      type="button"
                    >
                      Cancel
                    </button>
                    <button
                      className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md disabled:bg-purple-300"
                      onClick={onSaveNote}
                      disabled={!currentNoteContent.trim()}
                      type="button"
                    >
                      Save note
                    </button>
                  </div>
                </div>
              )}

              <div className="flex space-x-2 mb-6 w-full max-w-3xl">
                <div className="relative">
                  <button
                    className="flex items-center px-3 py-1.5 text-sm border border-[#6D28D2] text-[#6D28D2] rounded-md font-medium"
                    onClick={(e) => {
                      e.stopPropagation();
                      setAllLecturesDropdownOpen(!allLecturesDropdownOpen);
                      setSortByDropdownOpen(false);
                    }}
                    type="button"
                  >
                    <span>{selectedLectureFilter}</span>
                    <ChevronDown className="w-4 h-4 ml-1" />
                  </button>

                  {allLecturesDropdownOpen && (
                    <div className="absolute top-full left-0 mt-1 bg-white rounded-md shadow-lg z-10 w-48">
                      <div className="p-2">
                        <button
                          className="block w-full text-left px-3 py-2 text-sm rounded-md"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedLectureFilter("All lectures");
                            setAllLecturesDropdownOpen(false);
                          }}
                          type="button"
                        >
                          All lectures
                        </button>
                        <button
                          className="block w-full text-left px-3 py-2 text-sm rounded-md"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedLectureFilter("Current lecture");
                            setAllLecturesDropdownOpen(false);
                          }}
                          type="button"
                        >
                          Current lecture
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="relative">
                  <button
                    className="flex items-center px-3 py-1.5 text-sm border border-[#6D28D2] rounded-md text-[#6D28D2] font-medium"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSortByDropdownOpen(!sortByDropdownOpen);
                      setAllLecturesDropdownOpen(false);
                    }}
                    type="button"
                  >
                    <span>{selectedSortOption}</span>
                    <ChevronDown className="w-4 h-4 ml-1" />
                  </button>

                  {sortByDropdownOpen && (
                    <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 w-48">
                      <div className="p-2">
                        <button
                          className="block w-full text-left px-3 py-2 text-sm rounded-md"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedSortOption("Sort by most recent");
                            setSortByDropdownOpen(false);
                          }}
                          type="button"
                        >
                          Sort by most recent
                        </button>
                        <button
                          className="block w-full text-left px-3 py-2 text-sm rounded-md"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedSortOption("Sort by oldest");
                            setSortByDropdownOpen(false);
                          }}
                          type="button"
                        >
                          Sort by oldest
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {getSortedNotes().length > 0 ? (
                <div className="w-full max-w-3xl">
                  {getSortedNotes().map((note) => (
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
                            onClick={() => onEditNote(note.id)}
                            type="button"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            className="text-gray-500 hover:text-red-600 p-1 ml-1"
                            onClick={() => onDeleteNote(note.id)}
                            type="button"
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
                  <p className="text-gray-600 mb-2">
                    Click the "Create a new note" box, the "+" button, or
                    press "B" to make your first note.
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === "announcements" && !showSearch && (
            <div className="p-6">
              <div className="text-center py-8">
                <h3 className="text-xl font-bold mb-2">
                  No announcements posted yet
                </h3>
                <p className="text-gray-600">
                  The instructor hasn't added any announcements to this course
                  yet. Announcements are used to inform you of updates or
                  additions to the course.
                </p>
              </div>
            </div>
          )}

          {activeTab === "reviews" && !showSearch && (
            <div className="p-6">
              <div className="text-center py-8">
                <h3 className="text-xl font-bold mb-2">Student feedback</h3>
                <p className="text-gray-600">
                  This course doesn't have any reviews yet.
                </p>
              </div>
            </div>
          )}

          {activeTab === "learning-tools" && !showSearch && (
            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-2">Learning reminders</h3>
                <p className="text-gray-600 mb-4">
                  Set up push notifications or calendar events to stay on
                  track for your learning goals.
                </p>

                <button
                  className="flex items-center bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-colors"
                  onClick={onOpenLearningModal}
                  type="button"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  <span>Add a learning reminder</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BottomTabsContainer;