"use client";
import React from 'react';
import { Paperclip, Film, Globe, Upload, X } from "lucide-react";
import { ContentType, ResourceTabType, Lecture } from '@/lib/types';

interface AddResourceModalProps {
  activeContentSection: { sectionId: string, lectureId: string } | null;
  setShowAddResourceModal: (show: boolean) => void;
  activeResourceTab: ResourceTabType;
  setActiveResourceTab: (tab: ResourceTabType) => void;
  sections: any[];
  isUploading: boolean;
  uploadProgress: number;
  triggerFileUpload: (contentType: ContentType) => void;
}

export default function AddResourceModal({
  activeContentSection,
  setShowAddResourceModal,
  activeResourceTab,
  setActiveResourceTab,
  sections,
  isUploading,
  uploadProgress,
  triggerFileUpload
}: AddResourceModalProps) {
  if (!activeContentSection) return null;
  
  const { sectionId, lectureId } = activeContentSection;
  const lecture = sections
    .find(s => s.id === sectionId)
    ?.lectures.find((l: Lecture) => l.id === lectureId);
  
  if (!lecture) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold">Add Resources</h3>
          <button 
            onClick={() => setShowAddResourceModal(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-4">
          <div className="mb-4">
            <h4 className="font-medium mb-2">Select resource type:</h4>
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => setActiveResourceTab(ResourceTabType.DOWNLOADABLE_FILE)}
                className={`px-3 py-2 rounded-md text-sm flex items-center gap-1 ${
                  activeResourceTab === ResourceTabType.DOWNLOADABLE_FILE 
                    ? "bg-indigo-600 text-white" 
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <Paperclip className="w-4 h-4" />
                Downloadable File
              </button>
              <button 
                onClick={() => setActiveResourceTab(ResourceTabType.VIDEO)}
                className={`px-3 py-2 rounded-md text-sm flex items-center gap-1 ${
                  activeResourceTab === ResourceTabType.VIDEO 
                    ? "bg-indigo-600 text-white" 
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <Film className="w-4 h-4" />
                Video
              </button>
              <button 
                onClick={() => setActiveResourceTab(ResourceTabType.EXTERNAL)}
                className={`px-3 py-2 rounded-md text-sm flex items-center gap-1 ${
                  activeResourceTab === ResourceTabType.EXTERNAL 
                    ? "bg-indigo-600 text-white" 
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <Globe className="w-4 h-4" />
                External Resource
              </button>
            </div>
          </div>
          
          {activeResourceTab === ResourceTabType.DOWNLOADABLE_FILE && (
            <div className="border-t pt-4">
              <h4 className="font-medium mb-2">Upload File</h4>
              {isUploading ? (
                <div className="text-center py-8">
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                    <div 
                      className="bg-indigo-600 h-2.5 rounded-full" 
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-500">Uploading... {Math.round(uploadProgress)}%</p>
                </div>
              ) : (
                <div 
                  onClick={() => triggerFileUpload(ContentType.FILE)}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50"
                >
                  <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">Click to upload a file</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Max file size: 1GB. Supported file types: PDF, DOC, XLS, etc.
                  </p>
                </div>
              )}
            </div>
          )}

          {activeResourceTab === ResourceTabType.VIDEO && (
            <div className="border-t pt-4">
              <h4 className="font-medium mb-2">Upload Video</h4>
              {isUploading ? (
                <div className="text-center py-8">
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                    <div 
                      className="bg-indigo-600 h-2.5 rounded-full" 
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-500">Uploading... {Math.round(uploadProgress)}%</p>
                </div>
              ) : (
                <div 
                  onClick={() => triggerFileUpload(ContentType.VIDEO)}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50"
                >
                  <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">Click to upload a video</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Max file size: 2GB. Supported formats: MP4, MOV, etc.
                  </p>
                </div>
              )}
            </div>
          )}
          
          {activeResourceTab === ResourceTabType.EXTERNAL && (
            <div className="border-t pt-4">
              <h4 className="font-medium mb-2">External Resources</h4>
              <div className="space-y-4">
                <div>
                  <label htmlFor="resource-url" className="block text-sm font-medium text-gray-700 mb-1">
                    Resource URL
                  </label>
                  <input
                    type="url"
                    id="resource-url"
                    placeholder="https://example.com/resource"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label htmlFor="resource-name" className="block text-sm font-medium text-gray-700 mb-1">
                    Resource Name
                  </label>
                  <input
                    type="text"
                    id="resource-name"
                    placeholder="Documentation"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Resource Type
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="website">Website</option>
                    <option value="documentation">Documentation</option>
                    <option value="source-code">Source Code</option>
                    <option value="research-paper">Research Paper</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Add External Resource
                </button>
              </div>
            </div>
          )}
          
          <div className="p-4 border-t flex justify-end gap-2">
            <button 
              onClick={() => setShowAddResourceModal(false)}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button 
              className="px-4 py-2 bg-indigo-600 text-white rounded-md shadow-sm text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Save Resource
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}