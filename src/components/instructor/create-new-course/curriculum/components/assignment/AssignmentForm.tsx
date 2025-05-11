"use client";
import React, { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';

interface AssignmentFormProps {
  sectionId: string;
  onAddAssignment: (sectionId: string, title: string) => void;
  onCancel: () => void;
}

export default function AssignmentForm({
  sectionId,
  onAddAssignment,
  onCancel
}: AssignmentFormProps) {
  const [title, setTitle] = useState('');
  const maxChars = 80;
  const [charCount, setCharCount] = useState(maxChars);
  const inputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    // Focus the input when component mounts
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Update character count when title changes
  useEffect(() => {
    setCharCount(maxChars - title.length);
  }, [title]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAddAssignment(sectionId, title.trim());
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (newValue.length <= maxChars) {
      setTitle(newValue);
      // Character count is updated in the useEffect hook
    }
  };

  return (
    <div className="mb-3 ml-10 mt-6 bg-white border border-gray-500 relative">
      <button 
        onClick={onCancel}
        className="absolute -left-6 -top-4 text-gray-400 hover:text-gray-600"
      >
        <X className="w-4 h-4 text-gray-700" />
      </button>
      
      <form onSubmit={handleSubmit} className="pt-3 pb-3 px-4">
        <div className="mb-4 relative">
          <input
            ref={inputRef}
            type="text"
            value={title}
            onChange={handleChange}
            placeholder="Enter a Title"
            className="w-full border border-gray-500 rounded px-3 py-1 focus:outline-none focus:ring-1 focus:ring-[#6D28D2]"
            maxLength={maxChars}
          />
          <div className="absolute right-3 top-1 text-sm text-gray-500">
            {charCount}
          </div>
        </div>
        
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onCancel}
            className="p-2 text-xs text-gray-700 hover:bg-gray-100 rounded-md"
          >
            Cancel
          </button>
          <button
            type="submit"
            className=" p-2 font-medium text-xs bg-[#6D28D2] text-white rounded-md hover:bg-[#7D28D2] disabled:bg-indigo-300"
            disabled={!title.trim()}
          >
            Add Assignment
          </button>
        </div>
      </form>
    </div>
  );
}