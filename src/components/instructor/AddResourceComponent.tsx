"use client";
import React, { useState, useRef, ChangeEvent, Dispatch, SetStateAction } from 'react';
import { ContentType, ResourceTabType } from '@/lib/types';

// Define types for the component
interface ResourceComponentProps {
  // Original props
  onClose?: () => void;
  activeTab?: ResourceTabType;
  setActiveTab?: (tab: ResourceTabType) => void;
  onFileSelect?: (file: File) => void;
  onSourceFileSelect?: (file: File) => void;
  onExternalResourceAdd?: (title: string, url: string) => void;
  
  // Add the missing props that are causing errors:
  activeContentSection?: {sectionId: string, lectureId: string} | null;
  activeResourceTab?: ResourceTabType;
  setActiveResourceTab?: Dispatch<SetStateAction<ResourceTabType>>;
  sections?: any[];
  isUploading?: boolean;
  uploadProgress?: number;
  triggerFileUpload?: (contentType: ContentType) => void;
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
  // Include the new props with default values:
  activeContentSection = null,
  activeResourceTab,
  setActiveResourceTab,
  sections = [],
  isUploading = false,
  uploadProgress = 0,
  triggerFileUpload
}: ResourceComponentProps) {
  // Use the provided activeTab or initialize with a default
  const [currentTab, setCurrentTab] = useState<ResourceTabType>(
    activeResourceTab !== undefined ? activeResourceTab : activeTab
  );
  const [externalForm, setExternalForm] = useState<ExternalResourceForm>({
    title: '',
    url: ''
  });
  
  // Fixed ref types - the issue is resolved by making sure they're correctly typed
  const fileInputRef = useRef<HTMLInputElement>(null);
  const sourceFileInputRef = useRef<HTMLInputElement>(null);
  
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
  
  // Handle file selection
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (onFileSelect) {
        onFileSelect(file);
      }
      console.log("File selected:", file);
    }
  };
  
  // Handle source file selection
  const handleSourceFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (onSourceFileSelect) {
        onSourceFileSelect(file);
      }
      console.log("Source file selected:", file);
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
  
  // Handle external resource submission
  const handleExternalResourceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onExternalResourceAdd) {
      onExternalResourceAdd(externalForm.title, externalForm.url);
    }
    console.log("External resource added:", externalForm);
    // Reset form after submission
    setExternalForm({ title: '', url: '' });
  };
  
  // Custom input styles with focus state
  const inputClasses = "w-full px-3 py-2 border border-gray-500 rounded text-gray-700 focus:outline-none focus:1 focus:ring-[#6D28D2] focus:border-[#6D28D2]";
  const searchInputClasses = "w-full px-3 py-1 border border-gray-400 rounded text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#6D28D2] focus:border-[#6D28D2]";
  
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
                <p className="text-gray-700">No file selected</p>
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
            
            <div className="mt-4">
              <p className="text-sm text-gray-600">
                <span className="font-bold">Note:</span>  A resource is for any type of document that can be used to help students in the lecture. This file is going to be seen as a lecture extra. Make sure everything is legible and the file size is less than 1 GiB.
              </p>
            </div>
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
                  className={searchInputClasses}
                />
              </div>
              <button 
                type="button"
                className="ml-2 px-3 py-2 bg-[#6D28D2] text-white rounded hover:bg-purple-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            
            <div className="border-b border-gray-300">
              <div className="grid grid-cols-12 text-left py-2 font-medium text-gray-800 border-b border-gray-300">
                <div className="col-span-5">Filename</div>
                <div className="col-span-2">Type</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-3 flex items-center">
                  Date
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              
              <div className="py-8 text-center text-gray-600">
                No results found.
              </div>
            </div>
          </div>
        )}
        
        {/* Source Code Tab */}
        {currentTab === ResourceTabType.SOURCE_CODE && (
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
                <p className="text-gray-700">No file selected</p>
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
            
            <div className="mt-4">
              <p className="text-sm text-gray-600">
                <span className="font-bold">Note:</span> Only available for Python and Ruby for now. You can upload .py and .rb files.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}