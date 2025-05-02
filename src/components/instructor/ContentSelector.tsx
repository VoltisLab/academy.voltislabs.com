// components/ContentTypeSelector.tsx
"use client";
import { ContentItemType } from '@/lib/types';
import React from 'react';

interface ContentTypeSelectorProps {
  sectionId: string;
  onSelect: (sectionId: string, contentType: ContentItemType) => void;
  onClose: () => void;
}

export default function ContentTypeSelector({
  onSelect,
  onClose,
  sectionId,
}: ContentTypeSelectorProps) {
  return (
    <div className="bg-white rounded-md shadow-sm border border-gray-200 p-4 w-full">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-gray-800 font-medium">Select content type</h3>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <span className="text-xl">×</span>
        </button>
      </div>
      
      <p className="text-sm text-gray-600 mb-4">
        Select the main type of content. Files and links can be added as resources. 
        <a href="#" className="text-indigo-600 hover:text-indigo-700 ml-1">Learn about content types.</a>
      </p>
      
      <div className="grid grid-cols-3 gap-2">
        <button 
          onClick={() => onSelect(sectionId, 'video', )}
          className="flex flex-col items-center p-3 border rounded-md hover:bg-gray-50"
        >
          <div className="w-12 h-12 bg-gray-100 rounded-md mb-2 flex items-center justify-center">
            <span className="text-gray-400">▶</span>
          </div>
          <span className="text-sm">Video</span>
        </button>
        
        <button 
          onClick={() => onSelect(sectionId, 'video-slide')}
          className="flex flex-col items-center p-3 border rounded-md hover:bg-gray-50"
        >
          <div className="w-12 h-12 bg-gray-100 rounded-md mb-2 flex items-center justify-center">
            <span className="text-gray-400">▶⊞</span>
          </div>
          <span className="text-sm">Video & Slide Mashup</span>
        </button>
        
        <button 
          onClick={() => onSelect(sectionId, 'article')}
          className="flex flex-col items-center p-3 border rounded-md hover:bg-gray-50"
        >
          <div className="w-12 h-12 bg-gray-100 rounded-md mb-2 flex items-center justify-center">
            <span className="text-gray-400">📄</span>
          </div>
          <span className="text-sm">Article</span>
        </button>
      </div>
    </div>
  );
}