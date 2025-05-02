"use client";
import React from 'react';
import { X } from "lucide-react";

interface DescriptionEditorModalProps {
  activeDescriptionSection: { sectionId: string, lectureId: string } | null;
  setShowDescriptionEditor: (show: boolean) => void;
  currentDescription: string;
  setCurrentDescription: (description: string) => void;
  saveDescription: () => void;
}

export default function DescriptionEditorModal({
  activeDescriptionSection,
  setShowDescriptionEditor,
  currentDescription,
  setCurrentDescription,
  saveDescription
}: DescriptionEditorModalProps) {
  if (!activeDescriptionSection) return null;
  
  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold">Edit Description</h3>
          <button 
            onClick={() => setShowDescriptionEditor(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-4">
          <textarea
            className="w-full h-64 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            value={currentDescription}
            onChange={(e) => setCurrentDescription(e.target.value)}
            placeholder="Enter a detailed description for this lecture..."
          />
          
          <div className="mt-4 flex justify-end gap-2">
            <button 
              onClick={() => setShowDescriptionEditor(false)}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button 
              onClick={saveDescription}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md shadow-sm text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Save Description
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}