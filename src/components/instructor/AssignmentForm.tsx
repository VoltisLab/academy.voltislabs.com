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
  const [charCount, setCharCount] = useState(0);
  const maxChars = 80;
  const inputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

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
      setCharCount(newValue.length);
    }
  };

  return (
    <div className="mb-3 bg-white border border-gray-300 rounded-md relative">
      <button 
        onClick={onCancel}
        className="absolute left-3 top-3 text-gray-400 hover:text-gray-600"
      >
        <X className="w-5 h-5" />
      </button>
      
      <form onSubmit={handleSubmit} className="pt-10 pb-4 px-4">
        <div className="mb-4">
          <input
            ref={inputRef}
            type="text"
            value={title}
            onChange={handleChange}
            placeholder="Enter a Title"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <div className="text-right text-sm text-gray-500 mt-1">
            {charCount}
          </div>
        </div>
        
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-300"
            disabled={!title.trim()}
          >
            Add Assignment
          </button>
        </div>
      </form>
    </div>
  );
}