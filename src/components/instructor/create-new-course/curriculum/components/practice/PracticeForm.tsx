"use client";
import React, { useState } from 'react';
import { X } from 'lucide-react';

interface PracticeFormProps {
  sectionId: string;
  onAddPractice: (sectionId: string, title: string, description: string) => void;
  onCancel: () => void;
}

const PracticeForm: React.FC<PracticeFormProps> = ({
  sectionId,
  onAddPractice,
  onCancel,
}) => {
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAddPractice(sectionId, title.trim(), description.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.key === 'Escape') {
      onCancel();
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-medium">New Practice Exercise</h3>
        <button 
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="practice-title" className="block text-sm font-medium text-gray-700 mb-1">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            id="practice-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter a title for the practice exercise"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            maxLength={100}
            autoFocus
            required
          />
          <div className="text-right text-xs text-gray-500 mt-1">
            {title.length}/100
          </div>
        </div>
        
        <div className="mb-4">
          <label htmlFor="practice-description" className="block text-sm font-medium text-gray-700 mb-1">
            Description/Instructions
          </label>
          <textarea
            id="practice-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter instructions for this practice exercise"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            rows={4}
            maxLength={2000}
          />
          <div className="text-right text-xs text-gray-500 mt-1">
            {description.length}/2000
          </div>
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!title.trim()}
            className={`px-4 py-2 ${!title.trim() ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'} text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
          >
            Add Practice Exercise
          </button>
        </div>
      </form>
    </div>
  );
};

export default PracticeForm;