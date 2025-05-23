import React, { useState, useRef } from 'react';
import { ArrowLeft} from 'lucide-react';
import SolutionsTab from './SolutionsTab';
import QuestionsTab from './QuestionsTab';
import BasicInfoTab from './BasicInfoTab';

// Types
interface AssignmentQuestion {
  id: string;
  content: string;
  order: number;
}

interface ExtendedLecture {
  id: string;
  name?: string;
  title?: string;
  description: string;
  captions: string;
  lectureNotes: string;
  attachedFiles: any[];
  videos: any[];
  contentType: any;
  isExpanded: boolean;
  assignmentTitle?: string;
  assignmentDescription?: string;
  estimatedDuration?: number;
  durationUnit?: 'minutes' | 'hours' | 'days';
  assignmentInstructions?: string;
  instructionalVideo?: {
    file: File | null;
    url?: string;
  };
  downloadableResource?: {
    file: File | null;
    url?: string;
    name?: string;
  };
  assignmentQuestions?: AssignmentQuestion[];
  solutionVideo?: {
    file: File | null;
    url?: string;
  };
}

interface AssignmentEditorProps {
  initialData?: ExtendedLecture;
  onClose: () => void;
  onSave: (data: ExtendedLecture) => void;
}

// Simple Rich Text Editor (React Quill alternative for this demo)
const RichTextEditor: React.FC<{
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}> = ({ value, onChange, placeholder }) => {
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  
  const handleFormat = (command: string) => {
    document.execCommand(command, false);
    if (command === 'bold') setIsBold(!isBold);
    if (command === 'italic') setIsItalic(!isItalic);
  };

  return (
    <div className="border border-gray-300 rounded-md">
      <div className="border-b border-gray-200 p-2 flex gap-2">
        <select className="text-sm border-none bg-transparent">
          <option>Styles</option>
        </select>
        <button
          type="button"
          onClick={() => handleFormat('bold')}
          className={`p-1 rounded ${isBold ? 'bg-gray-200' : ''}`}
        >
          <strong>B</strong>
        </button>
        <button
          type="button"
          onClick={() => handleFormat('italic')}
          className={`p-1 rounded ${isItalic ? 'bg-gray-200' : ''}`}
        >
          <em>I</em>
        </button>
        <button type="button" onClick={() => handleFormat('insertUnorderedList')} className="p-1">
          •
        </button>
        <button type="button" onClick={() => handleFormat('insertOrderedList')} className="p-1">
          1.
        </button>
        <span className="text-blue-600 text-sm ml-auto cursor-pointer">Edit HTML</span>
      </div>
      <div
        contentEditable
        className="p-3 min-h-[100px] outline-none"
        onInput={(e) => onChange(e.currentTarget.textContent || '')}
        suppressContentEditableWarning={true}
        data-placeholder={placeholder}
        style={{
          color: !value ? '#9CA3AF' : '#000'
        }}
      >
        {value || placeholder}
      </div>
    </div>
  );
};

// Instructions Tab Component
const InstructionsTab: React.FC<{
  data: ExtendedLecture;
  onChange: (field: string, value: any) => void;
}> = ({ data, onChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeVideoTab, setActiveVideoTab] = useState<'upload' | 'library'>('upload');
  const [searchQuery, setSearchQuery] = useState('');

  // Sample library videos - replace with actual data from your API
  const libraryVideos = [
    {
      filename: '2024-11-13-175733.webm',
      type: 'Video',
      status: 'Success',
      date: '05/13/2025'
    },
    {
      filename: 'Netflix.mp4',
      type: 'Video', 
      status: 'Success',
      date: '05/08/2025'
    },
    {
      filename: 'Netflix.mp4',
      type: 'Video',
      status: 'Success', 
      date: '05/07/2025'
    }
  ];

  const handleVideoUpload = (file: File) => {
    onChange('instructionalVideo', { file, url: URL.createObjectURL(file) });
  };

  const handleResourceUpload = (file: File) => {
    onChange('downloadableResource', { 
      file, 
      url: URL.createObjectURL(file),
      name: file.name 
    });
  };

  const handleVideoSelect = (video: any) => {
    onChange('instructionalVideo', { 
      file: null, 
      url: video.filename,
      filename: video.filename 
    });
  };

  const filteredVideos = libraryVideos.filter(video =>
    video.filename.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      {/* Video Section */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Video</h3>
        
        {/* Video Tabs */}
        <div className="border-b border-gray-200 mb-4">
          <div className="flex">
            <button 
              onClick={() => setActiveVideoTab('upload')}
              className={`px-4 py-2 font-medium text-sm border-b-2 ${
                activeVideoTab === 'upload' 
                  ? 'border-purple-600 text-purple-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Upload Video
            </button>
            <button 
              onClick={() => setActiveVideoTab('library')}
              className={`px-4 py-2 font-medium text-sm border-b-2 ml-8 ${
                activeVideoTab === 'library' 
                  ? 'border-purple-600 text-purple-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Add from library
            </button>
          </div>
        </div>

        {/* Upload Video Tab Content */}
        {activeVideoTab === 'upload' && (
          <div>
            <div className="border border-gray-300 rounded-md p-4 flex items-center justify-between">
              <span className="text-gray-500">
                {data.instructionalVideo?.file ? data.instructionalVideo.file.name : 'No file selected'}
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
        )}

        {/* Library Tab Content */}
        {activeVideoTab === 'library' && (
          <div>
            {/* Search Bar */}
            <div className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search files by name"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <button className="absolute right-2 top-2 p-1 bg-purple-600 text-white rounded">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Video Library Table */}
            <div className="border border-gray-300 rounded-md overflow-hidden">
              {/* Table Header */}
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                <div className="grid grid-cols-5 gap-4 font-medium text-sm text-gray-700">
                  <div>Filename</div>
                  <div>Type</div>
                  <div>Status</div>
                  <div className="flex items-center gap-1">
                    Date
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  <div></div>
                </div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-gray-200">
                {filteredVideos.map((video, index) => (
                  <div key={index} className="px-4 py-3 hover:bg-gray-50">
                    <div className="grid grid-cols-5 gap-4 items-center text-sm">
                      <div className="text-gray-900">{video.filename}</div>
                      <div className="text-gray-600">{video.type}</div>
                      <div className="text-blue-600">{video.status}</div>
                      <div className="text-gray-600">{video.date}</div>
                      <div>
                        <button
                          onClick={() => handleVideoSelect(video)}
                          className="text-purple-600 hover:text-purple-800 font-medium"
                        >
                          Select ↗
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Assignment Instructions */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Assignment Instructions</h3>
        <RichTextEditor
          value={data.assignmentInstructions || ''}
          onChange={(value) => onChange('assignmentInstructions', value)}
          placeholder="Enter assignment instructions..."
        />
        <div className="flex gap-2 mt-4">
          <button className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700">
            Submit
          </button>
          <button className="px-4 py-2 text-gray-600 hover:text-gray-800">
            Cancel
          </button>
        </div>
      </div>

      {/* Downloadable Resource */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Downloadable resource</h3>
        <div className="border border-gray-300 rounded-md p-4 flex items-center justify-between">
          <span className="text-gray-500">
            {data.downloadableResource?.file ? data.downloadableResource.file.name : 'No file selected'}
          </span>
          <button
            onClick={() => {
              const input = document.createElement('input');
              input.type = 'file';
              input.onchange = (e) => {
                const file = (e.target as HTMLInputElement).files?.[0];
                if (file) handleResourceUpload(file);
              };
              input.click();
            }}
            className="px-4 py-2 border border-purple-600 text-purple-600 rounded-md hover:bg-purple-50"
          >
            Select File
          </button>
        </div>
        <p className="text-sm text-blue-600 mt-2">
          Note: A resource is for any type of document that can be used to help students in the lecture. This file is going to be such as a lecture extra. Make sure everything is legible and the file size is less than 1 GB.
        </p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleVideoUpload(file);
        }}
        className="hidden"
      />
    </div>
  );
};

// Main Assignment Editor Component
const AssignmentEditor: React.FC<AssignmentEditorProps> = ({
  initialData,
  onClose,
  onSave
}) => {
  const [activeTab, setActiveTab] = useState('basic-info');
  const [assignmentData, setAssignmentData] = useState<ExtendedLecture>(
    initialData || {
      id: Date.now().toString(),
      name: '',
      description: '',
      captions: '',
      lectureNotes: '',
      attachedFiles: [],
      videos: [],
      contentType: 'assignment',
      isExpanded: false,
      assignmentTitle: '',
      assignmentDescription: '',
      estimatedDuration: 0,
      durationUnit: 'minutes',
      assignmentInstructions: '',
      assignmentQuestions: []
    }
  );

  const handleDataChange = (field: string, value: any) => {
    setAssignmentData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    onSave(assignmentData);
  };

  const tabs = [
    { id: 'basic-info', label: 'Basic Info' },
    { id: 'instructions', label: 'Instructions' },
    { id: 'questions', label: 'Questions' },
    { id: 'solutions', label: 'Solutions' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'basic-info':
        return <BasicInfoTab data={assignmentData} onChange={handleDataChange} />;
      case 'instructions':
        return <InstructionsTab data={assignmentData} onChange={handleDataChange} />;
      case 'questions':
        return <QuestionsTab data={assignmentData} onChange={handleDataChange} />;
      case 'solutions':
        return <SolutionsTab data={assignmentData} onChange={handleDataChange} />;
      default:
        return <BasicInfoTab data={assignmentData} onChange={handleDataChange} />;
    }
  };

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col px-20">
      {/* Top Bar */}
      <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-purple-600 hover:text-purple-800"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to curriculum
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Create Assignment</h1>
        </div>
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
        >
          Publish
        </button>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-64 ">
          <nav className="p-4 space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full text-left px-3 py-2 text-sm ${
                  activeTab === tab.id
                    ? 'text-gray-800 border-l-4 border-gray-800'
                    : 'text-gray-800 '
                } hover:bg-gray-100`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default AssignmentEditor;