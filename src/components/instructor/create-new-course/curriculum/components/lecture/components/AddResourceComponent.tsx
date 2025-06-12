"use client";
import React, { useState, useRef, ChangeEvent, Dispatch, SetStateAction } from 'react';
import { ContentType, ResourceTabType, StoredVideo } from '@/lib/types';
import { Search, ChevronDown, Trash2 } from 'lucide-react';
import { inputClasses, searchInputClasses } from '@/lib/utils';
import { uploadFile } from '@/services/fileUploadService';
import { useLectureService } from '@/services/useLectureService';
import { toast } from 'react-hot-toast';
import { apolloClient } from '@/lib/apollo-client';
import { UPDATE_LECTURE_CONTENT, UpdateLectureContentResponse } from '@/api/course/lecture/mutation';

interface LibraryFileWithSize extends StoredVideo {
  size?: string;
}

// Define types for the component
interface ResourceComponentProps {
  // Original props
  onClose?: () => void;
  activeTab?: ResourceTabType;
  setActiveTab?: (tab: ResourceTabType) => void;
  onFileSelect?: (file: File) => void;
  onSourceFileSelect?: (file: File) => void;
  onExternalResourceAdd?: (title: string, url: string, name: string) => void;
  onSourceCodeSelect?: (item: LibraryFileWithSize) => void;  
  onLibraryItemSelect?: (item: LibraryFileWithSize) => void;
  activeContentSection?: {sectionId: string, lectureId: string} | null;
  activeResourceTab?: ResourceTabType;
  setActiveResourceTab?: Dispatch<SetStateAction<ResourceTabType>>;
  sections?: any[];
  isUploading?: boolean;
  uploadProgress?: number;
  triggerFileUpload?: (contentType: ContentType) => void;
  // NEW: Backend integration props
  lectureId?: string;
  sectionId?: string;
}

// Define the types for the form state
interface ExternalResourceForm {
  title: string;
  url: string;
}

export default function ResourceComponent({
  onClose,
  activeTab = ResourceTabType.DOWNLOADABLE_FILE,
  setActiveTab,
  onFileSelect,
  onSourceFileSelect,
  onExternalResourceAdd,
  onLibraryItemSelect,
  onSourceCodeSelect,
  // Include the new props with default values:
  activeContentSection = null,
  activeResourceTab,
  setActiveResourceTab,
  sections = [],
  isUploading = false,
  uploadProgress = 0,
  triggerFileUpload,
  // NEW: Backend props
  lectureId,
  sectionId
}: ResourceComponentProps) {
  // Use the provided activeTab or initialize with a default
  const [currentTab, setCurrentTab] = useState<ResourceTabType>(
    activeResourceTab !== undefined ? activeResourceTab : activeTab
  );
  const [externalForm, setExternalForm] = useState<ExternalResourceForm>({
    title: '',
    url: ''
  });
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showUploadComplete, setShowUploadComplete] = useState<boolean>(false);
  const [selectedLibraryItems, setSelectedLibraryItems] = useState<StoredVideo[]>([]);
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [isSourceUploading, setIsSourceUploading] = useState<boolean>(false);
  const [sourceUploadProgress, setSourceUploadProgress] = useState<number>(0);
  const [sourceUploadComplete, setSourceUploadComplete] = useState<boolean>(false);
  const [isFileUploading, setIsFileUploading] = useState<boolean>(false);
  const [fileUploadProgress, setFileUploadProgress] = useState<number>(0);

  // Backend service
  const { saveDescriptionToLecture, loading } = useLectureService();

  // Custom resource update functions using the working pattern
  const updateLectureWithResource = async (lectureId: number, resourceUrl: string, resourceType: string) => {
    try {
      // Use the same working pattern as uploadVideoToLecture
      const { data, errors } = await apolloClient.mutate<UpdateLectureContentResponse>({
        mutation: UPDATE_LECTURE_CONTENT,
        variables: {
          lectureId,
          // Store resource info in notes field as a workaround
          notes: `Resource added: ${resourceType} - ${resourceUrl}`
        },
        context: {
          includeAuth: true
        },
        fetchPolicy: 'no-cache'
      });

      if (errors) {
        console.error("GraphQL errors:", errors);
        throw new Error(errors[0]?.message || "An error occurred during resource update");
      }

      if (!data?.updateLecture.success) {
        throw new Error("Failed to update lecture with resource");
      }

      return data;
    } catch (error) {
      console.error("Resource update error:", error);
      throw error;
    }
  };

  // Fixed ref types - the issue is resolved by making sure they're correctly typed
  const fileInputRef = useRef<HTMLInputElement>(null);
  const sourceFileInputRef = useRef<HTMLInputElement>(null);
  
  // Sample library data for demonstration
  const libraryFiles = [
    { id: '1', filename: 'Netflix.mp4', type: 'Video', status: 'Success', date: '05/08/2025' },
    { id: '2', filename: 'css_tutorial.pdf', type: 'Presentation', status: 'Success', date: '05/08/2025' },
    { id: '3', filename: '2025-05-01-025523.webm', type: 'Video', status: 'Success', date: '05/08/2025' },
    { id: '4', filename: 'Backend Software Engineer Practical Test Assignment for Stanley Samuel.pdf', type: 'Presentation', status: 'Success', date: '05/07/2025' },
    { id: '5', filename: 'css_tutorial.pdf', type: 'Presentation', status: 'Success', date: '05/07/2025' },
    { id: '6', filename: 'css_tutorial.pdf', type: 'Presentation', status: 'Success', date: '05/07/2025' },
    { id: '7', filename: 'css_tutorial.pdf', type: 'Presentation', status: 'Success', date: '05/07/2025' },
    { id: '8', filename: 'Netflix.mp4', type: 'Video', status: 'Success', date: '05/07/2025' },
    { id: '9', filename: 'Netflix.mp4', type: 'Video', status: 'Success', date: '05/07/2025' },
    { id: '10', filename: 'Backend Software Engineer Practical Test Assignment for Stanley Samuel.pdf', type: 'Presentation', status: 'Success', date: '05/07/2025' },
  ];

  // Filter library files based on search query
  const filteredFiles = libraryFiles.filter(file => 
    file.filename.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const filesPerPage = 5;
  const totalPages = Math.ceil(filteredFiles.length / filesPerPage);
  
  // Get current files for pagination
  const indexOfLastFile = currentPage * filesPerPage;
  const indexOfFirstFile = indexOfLastFile - filesPerPage;
  const currentFiles = filteredFiles.slice(indexOfFirstFile, indexOfLastFile);
  
  // Update parent component's state if provided
  const handleTabChange = (tab: ResourceTabType) => {
    setCurrentTab(tab);
    if (setActiveTab) {
      setActiveTab(tab);
    }
    if (setActiveResourceTab) {
      setActiveResourceTab(tab);
    }
  };
  
  // Fixed function signature to properly handle null refs
  const handleFileSelection = (inputRef: React.MutableRefObject<HTMLInputElement | null>) => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };
  
  // Handle file selection for downloadable files
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);
      if (onFileSelect) {
        onFileSelect(file);
      }
    }
  };

  // Handle source file selection
  const handleSourceFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSourceFile(file);
      if (onSourceFileSelect) {
        onSourceFileSelect(file);
      }
    }
  };
  
  // Handle external resource form changes
  const handleExternalFormChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setExternalForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // NEW: Handle external resource submission with backend integration
  const handleExternalResourceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!lectureId || !externalForm.title.trim() || !externalForm.url.trim()) {
      toast.error('Please provide both title and URL');
      return;
    }

    try {
      await updateLectureWithResource(
        parseInt(lectureId),
        externalForm.url,
        `EXTERNAL_RESOURCE: ${externalForm.title}`
      );

      // Call the handler if provided (for local state updates)
      if (onExternalResourceAdd) {
        onExternalResourceAdd(externalForm.title, externalForm.url, externalForm.title);
      }
      
      // Reset form after submission
      setExternalForm({ title: '', url: '' });
      toast.success('External resource added successfully!');

      // Close modal after successful submission
      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error('Error adding external resource:', error);
      // Error toast is already handled in the service
    }
  };

  // NEW: Handle downloadable file upload with backend integration
  const handleUpload = async () => {
    if (!selectedFile || !lectureId) {
      toast.error('Please select a file and ensure lecture ID is available');
      return;
    }

    // Additional safety check to ensure we have a numeric backend ID
    const numericLectureId = parseInt(lectureId);
    if (isNaN(numericLectureId) || numericLectureId <= 0) {
      toast.error('Invalid lecture ID. Please refresh and try again.');
      return;
    }

    try {
      setIsFileUploading(true);
      setFileUploadProgress(0);

      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setFileUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      // Upload file to backend (always use RESOURCE for downloadable files)
      const uploadedUrl = await uploadFile(selectedFile, 'RESOURCE');
      
      clearInterval(progressInterval);
      setFileUploadProgress(95);

      if (!uploadedUrl) {
        throw new Error('File upload failed - no URL returned');
      }

      // Update lecture with resource using working pattern
      await updateLectureWithResource(
        numericLectureId,
        uploadedUrl,
        `DOWNLOADABLE_FILE: ${selectedFile.name}`
      );

      setFileUploadProgress(100);
      setShowUploadComplete(true);
      toast.success('File uploaded successfully!');

      // After the upload is "complete", show the success status
      setTimeout(() => {
        if (onClose) {
          onClose();
        }
      }, 1000);

    } catch (error) {
      console.error('Error uploading file:', error);
      setSelectedFile(null);
      setFileUploadProgress(0);
      // Error toast is already handled in the service
    } finally {
      setIsFileUploading(false);
    }
  };

  // NEW: Handle source code upload with backend integration
  const handleSourceCodeUpload = async () => {
    if (!sourceFile || !lectureId) {
      toast.error('Please select a source code file');
      return;
    }

    // Additional safety check to ensure we have a numeric backend ID
    const numericLectureId = parseInt(lectureId);
    if (isNaN(numericLectureId) || numericLectureId <= 0) {
      toast.error('Invalid lecture ID. Please refresh and try again.');
      return;
    }

    try {
      setIsSourceUploading(true);
      setSourceUploadProgress(0);

      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setSourceUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      // Upload source code file (always use RESOURCE)
      const uploadedUrl = await uploadFile(sourceFile, 'RESOURCE');
      
      clearInterval(progressInterval);
      setSourceUploadProgress(95);

      if (!uploadedUrl) {
        throw new Error('Source code upload failed - no URL returned');
      }

      // Update lecture with source code resource using working pattern
      await updateLectureWithResource(
        numericLectureId,
        uploadedUrl,
        `SOURCE_CODE: ${sourceFile.name}`
      );

      setSourceUploadProgress(100);
      setSourceUploadComplete(true);
      toast.success('Source code uploaded successfully!');

      // Call the handler if provided (for local state updates)
      if (onSourceCodeSelect) {
        const fileItem: LibraryFileWithSize = {
          id: Date.now().toString(),
          filename: sourceFile.name,
          type: 'SourceCode',
          status: 'Success',
          date: new Date().toLocaleDateString('en-US', {month: '2-digit', day: '2-digit', year: 'numeric'})
        };
        onSourceCodeSelect(fileItem);
      }

      setTimeout(() => {
        if (onClose) {
          onClose();
        }
      }, 1000);

    } catch (error) {
      console.error('Error uploading source code:', error);
      setSourceFile(null);
      setSourceUploadProgress(0);
      // Error toast is already handled in the service
    } finally {
      setIsSourceUploading(false);
    }
  };
  
  return (
    <div className="w-full bg-white py-3 border-t border-t-gray-400">
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200">
        <button 
          onClick={() => handleTabChange(ResourceTabType.DOWNLOADABLE_FILE)}
          className={`px-5 py-2 text-gray-600 relative ${
            currentTab === ResourceTabType.DOWNLOADABLE_FILE 
              ? "font-bold border-b-3 border-gray-700 -mb-px" 
              : "font-semibold hover:text-gray-800"
          }`}
        >
          Downloadable File
        </button>
        <button 
          onClick={() => handleTabChange(ResourceTabType.LIBRARY)}
          className={`px-5 py-2 text-gray-600 relative ${
            currentTab === ResourceTabType.LIBRARY 
              ? "font-bold border-b-3 border-gray-700 -mb-px" 
              : "font-semibold hover:text-gray-800"
          }`}
        >
          Add from library
        </button>
        <button 
          onClick={() => handleTabChange(ResourceTabType.EXTERNAL_RESOURCE)}
          className={`px-5 py-2 text-gray-600 relative ${
            currentTab === ResourceTabType.EXTERNAL_RESOURCE 
              ? "font-bold border-b-3 border-gray-700 -mb-px" 
              : "font-semibold hover:text-gray-800"
          }`}
        >
          External Resource
        </button>
        <button 
          onClick={() => handleTabChange(ResourceTabType.SOURCE_CODE)}
          className={`px-5 py-2 text-gray-600 relative ${
            currentTab === ResourceTabType.SOURCE_CODE 
              ? "font-bold border-b-3 border-gray-700 -mb-px" 
              : "font-semibold hover:text-gray-800"
          }`}
        >
          Source Code
        </button>
      </div>
      
      {/* Content Area */}
      <div className="px-4 py-3">
        {/* Downloadable File Tab */}
        {currentTab === ResourceTabType.DOWNLOADABLE_FILE && (
          <div>
            {showUploadComplete ? (
              <div className="space-y-4">
                <div className="border-b border-gray-300 py-2">
                  <div className="grid grid-cols-4 gap-2 md:gap-4 text-[17px] font-bold text-gray-800 border-b border-gray-300">
                    <div>Filename</div>
                    <div>Type</div>
                    <div>Status</div>
                    <div>Date</div>
                  </div>
                  <div className="grid grid-cols-4 gap-2 md:gap-4 text-sm mt-2 items-center text-gray-700 font-semibold">
                    <div className="truncate">{selectedFile?.name || "2025-05-01-025523.webm"}</div>
                    <div>File</div>
                    <div className="text-green-600">Success</div>
                    <div className="flex justify-between items-center">
                      {new Date().toLocaleDateString('en-US', {month: '2-digit', day: '2-digit', year: 'numeric'})}
                      <button 
                        className="text-[#6D28D2] hover:text-[#7D28D2] text-xs font-medium"
                        onClick={() => {
                          setSelectedFile(null);
                          setShowUploadComplete(false);
                        }}
                      >
                        Replace
                      </button>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center justify-between">
                      <div className="w-full bg-gray-200 rounded h-2">
                        <div className="bg-[#6D28D2] h-2 rounded" style={{ width: '100%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 bg-[#6D28D2] text-white rounded text-sm font-medium hover:bg-[#5D18C9]"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : isFileUploading ? (
              <div className="space-y-4">
                <div className="border-b border-gray-300 py-2">
                  <div className="grid grid-cols-4 gap-2 md:gap-4 text-[17px] font-bold text-gray-800 border-b border-gray-300">
                    <div>Filename</div>
                    <div>Type</div>
                    <div>Status</div>
                    <div>Date</div>
                  </div>
                  <div className="grid grid-cols-4 gap-2 md:gap-4 text-sm mt-2 items-center">
                    <div className="truncate">{selectedFile?.name || "2025-05-01-025523.webm"}</div>
                    <div>File</div>
                    <div className="flex items-center">
                      <div className="w-full flex items-center">
                        <div className="w-20 bg-gray-200 h-2 overflow-hidden rounded">
                          <div className="bg-[#6D28D2] h-2" style={{ width: `${fileUploadProgress}%` }}></div>
                        </div>
                        <span className="ml-2 text-xs">{fileUploadProgress}%</span>
                      </div>
                    </div>
                    <div>{new Date().toLocaleDateString('en-US', {month: '2-digit', day: '2-digit', year: 'numeric'})}</div>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center mb-4">
                  {/* Hidden file input element */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  
                  {/* Clickable area for file selection */}
                  <div 
                    className="border border-gray-400 rounded p-2 flex-grow mr-2 cursor-pointer hover:bg-gray-50"
                    onClick={() => handleFileSelection(fileInputRef)}
                  >
                    <p className="text-gray-700">
                      {selectedFile ? selectedFile.name : 'No file selected'}
                    </p>
                  </div>
                  
                  {/* Button also triggers the same file input */}
                  <button
                    type="button"
                    className="px-4 py-2 border border-[#6D28D2] text-[#6D28D2] text-sm font-medium rounded hover:bg-[#6D28D2] hover:text-white whitespace-nowrap"
                    onClick={() => handleFileSelection(fileInputRef)}
                  >
                    Select File
                  </button>
                </div>

                {selectedFile && (
                  <div className="flex justify-end mt-4">
                    <button
                      onClick={handleUpload}
                      disabled={isFileUploading}
                      className="px-4 py-2 bg-[#6D28D2] text-white rounded text-sm font-medium hover:bg-[#5D18C9] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isFileUploading ? 'Uploading...' : 'Upload'}
                    </button>
                  </div>
                )}
                
                <div className="mt-4">
                  <p className="text-sm text-gray-600">
                    <span className="font-bold">Note:</span> A resource is for any type of document that can be used to help students in the lecture. This file is going to be seen as a lecture extra. Make sure everything is legible and the file size is less than 1 GiB.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* External Resource Tab */}
        {currentTab === ResourceTabType.EXTERNAL_RESOURCE && (
          <form onSubmit={handleExternalResourceSubmit}>
            <div className="mb-4">
              <label htmlFor="title" className="block text-gray-700 font-bold mb-2">Title</label>
              <input
                id="title"
                name="title"
                type="text"
                value={externalForm.title}
                onChange={handleExternalFormChange}
                placeholder="A descriptive title"
                className={inputClasses}
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="url" className="block text-gray-700 font-bold mb-2">URL</label>
              <input
                id="url"
                name="url"
                type="url"
                value={externalForm.url}
                onChange={handleExternalFormChange}
                placeholder="https://example.com"
                className={inputClasses}
                required
              />
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-[#6D28D2] text-white text-sm font-medium rounded hover:bg-[#7D28D2]"
              >
                Add link
              </button>
            </div>
          </form>
        )}
        
        {/* Add from Library Tab */}
        {currentTab === ResourceTabType.LIBRARY && (
          <div>
            <div className="flex justify-end mb-4">
              <div className="ml-auto w-[50%]">
                <input
                  type="text"
                  placeholder="Search files by name"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={searchInputClasses}
                />
              </div>
              <button 
                type="button"
                className="ml-2 px-3 py-2 bg-[#6D28D2] text-white rounded hover:bg-purple-700"
              >
                <Search className="h-5 w-5" />
              </button>
            </div>
            
            <div className="border-b border-gray-300">
              <div className="grid grid-cols-4 text-left py-2 font-medium text-gray-800 border-b border-gray-300">
                <div>Filename</div>
                <div>Type</div>
                <div>Status</div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    Date <ChevronDown className="w-4 h-4" />
                  </div>
                </div>
              </div>
              
              {currentFiles.length > 0 ? (
                currentFiles.map(file => (
                  <div key={file.id} className="grid grid-cols-4 gap-2 md:gap-4 p-3 border-b border-gray-200 hover:bg-gray-50 items-center">
                    <div className="truncate">{file.filename}</div>
                    <div>{file.type}</div>
                    <div className="text-sm font-medium text-green-800">
                      {file.status}
                    </div>
                    <div className="flex items-center justify-between">
                      <div>{file.date}</div>
                      <div className="text-indigo-600">
                        <button 
                          onClick={() => {
                            // Create enhanced item with size information
                            const enhancedItem: LibraryFileWithSize = {
                              ...file,
                              size: file.type === 'Video' ? '01:45' : '1.2 MB'
                            };
                            
                            // Call the onLibraryItemSelect handler if provided
                            if (onLibraryItemSelect) {
                              onLibraryItemSelect(enhancedItem);
                              
                              // Optionally close the modal after selecting
                              if (onClose) {
                                onClose();
                              }
                            }
                          }}
                          className="text-indigo-600 hover:text-indigo-800 text-xs font-medium"
                        >
                          Select
                        </button>
                        <button 
                          className="ml-2 text-indigo-600 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4 inline-block" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-4 py-7 text-center text-gray-500 text-sm">
                  No results found.
                </div>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-4 space-x-1">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-md border border-[#6D28D2] text-[#6D28D2] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  &lt;
                </button>
                
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-8 h-8 rounded-full ${
                      currentPage === i + 1
                        ? 'bg-[#6D28D2] text-white'
                        : 'text-[#6D28D2] hover:bg-[#6D28D2]/10'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-md border border-[#6D28D2] text-[#6D28D2] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  &gt;
                </button>
              </div>
            )}
          </div>
        )}
        
        {/* Source Code Tab */}
        {currentTab === ResourceTabType.SOURCE_CODE && (
          <div>
            {sourceUploadComplete ? (
              <div className="space-y-4">
                <div className="border-b border-gray-300 py-2">
                  <div className="grid grid-cols-4 gap-2 md:gap-4 text-[17px] font-bold text-gray-800 border-b border-gray-300">
                    <div>Filename</div>
                    <div>Type</div>
                    <div>Status</div>
                    <div>Date</div>
                  </div>
                  <div className="grid grid-cols-4 gap-2 md:gap-4 text-sm mt-2 items-center text-gray-700 font-semibold">
                    <div className="truncate">{sourceFile?.name || "find_max.py"}</div>
                    <div>SourceCode</div>
                    <div className="text-green-600">Success</div>
                    <div className="flex justify-between items-center">
                      {new Date().toLocaleDateString('en-US', {month: '2-digit', day: '2-digit', year: 'numeric'})}
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center justify-between">
                      <div className="w-full bg-gray-200 rounded h-2">
                        <div className="bg-[#6D28D2] h-2 rounded" style={{ width: '100%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 bg-[#6D28D2] text-white rounded text-sm font-medium hover:bg-[#5D18C9]"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : isSourceUploading ? (
              <div className="space-y-4">
                <div className="border-b border-gray-300 py-2">
                  <div className="grid grid-cols-4 gap-2 md:gap-4 text-[17px] font-bold text-gray-800 border-b border-gray-300">
                    <div>Filename</div>
                    <div>Type</div>
                    <div>Status</div>
                    <div>Date</div>
                  </div>
                  <div className="grid grid-cols-4 gap-2 md:gap-4 text-sm mt-2 items-center">
                    <div className="truncate">{sourceFile?.name || "find_max.py"}</div>
                    <div>SourceCode</div>
                    <div className="flex items-center">
                      <div className="w-full flex items-center">
                        <div className="w-20 bg-gray-200 h-2 overflow-hidden rounded">
                          <div className="bg-[#6D28D2] h-2" style={{ width: `${sourceUploadProgress}%` }}></div>
                        </div>
                        <span className="ml-2 text-xs">{sourceUploadProgress}%</span>
                      </div>
                    </div>
                    <div>{new Date().toLocaleDateString('en-US', {month: '2-digit', day: '2-digit', year: 'numeric'})}</div>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center mb-4">
                  {/* Hidden file input for source code files */}
                  <input
                    type="file"
                    ref={sourceFileInputRef}
                    className="hidden"
                    accept=".py,.rb"
                    onChange={handleSourceFileChange}
                  />
                  
                  {/* Clickable area for source file selection */}
                  <div 
                    className="border border-gray-400 rounded p-2 flex-grow mr-2 cursor-pointer hover:bg-gray-50"
                    onClick={() => handleFileSelection(sourceFileInputRef)}
                  >
                    <p className="text-gray-700">
                      {sourceFile ? sourceFile.name : 'No file selected'}
                    </p>
                  </div>
                  
                  {/* Button also triggers the same file input */}
                  <button
                    type="button"
                    className="px-4 py-2 text-[#6D28D2] text-sm font-medium border border-[#6D28D2] rounded hover:bg-purple-50 whitespace-nowrap"
                    onClick={() => handleFileSelection(sourceFileInputRef)}
                  >
                    Select File
                  </button>
                </div>
                
                {sourceFile && (
                  <div className="flex justify-end mt-4">
                    <button
                      onClick={handleSourceCodeUpload}
                      disabled={isSourceUploading}
                      className="px-4 py-2 bg-[#6D28D2] text-white rounded text-sm font-medium hover:bg-[#5D18C9] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSourceUploading ? 'Uploading...' : 'Upload'}
                    </button>
                  </div>
                )}

                <div className="mt-4">
                  <p className="text-sm text-gray-600">
                    <span className="font-bold">Note:</span> Only available for Python and Ruby for now. You can upload .py and .rb files.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Display selected library items (if any) */}
      {selectedLibraryItems.length > 0 && (
        <div className="px-4 mt-4 border-t border-gray-200 pt-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Selected Materials</h3>
          {selectedLibraryItems.map((item) => (
            <div key={`selected-${item.id}`} className="flex justify-between items-center py-1">
              <div className="flex items-center">
                <span className="text-sm text-gray-800">{item.filename} ({item.type === 'Video' ? '01:45' : '1.2 MB'})</span>
              </div>
              <button 
                onClick={() => {
                  setSelectedLibraryItems(selectedLibraryItems.filter(i => i.id !== item.id));
                }}
                className="text-gray-400 hover:text-red-600"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          
          <div className="flex justify-end mt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-[#6D28D2] text-white rounded text-sm font-medium hover:bg-[#5D18C9]"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}