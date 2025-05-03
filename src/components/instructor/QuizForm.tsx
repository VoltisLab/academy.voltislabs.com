"use client";
import React, { useState } from 'react';
import { X } from 'lucide-react';

interface QuizFormProps {
  sectionId: string;
  onAddQuiz: (sectionId: string, title: string, description: string) => void;
  onCancel: () => void;
}

const QuizForm: React.FC<QuizFormProps> = ({
  sectionId,
  onAddQuiz,
  onCancel
}) => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const handleAddQuiz = () => {
    if (title.trim()) {
      onAddQuiz(sectionId, title.trim(), description.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && title.trim()) {
      e.preventDefault();
      handleAddQuiz();
    } else if (e.key === 'Escape') {
      onCancel();
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium">New Quiz:</h3>
        <button 
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="mb-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter a Title"
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-2"
          maxLength={80}
          autoFocus
        />
        <div className="text-right text-xs text-gray-500 mt-1">
          {title.length}/80
        </div>
        
        <div className="mt-4">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Quiz Description"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            rows={4}
          />
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
          type="button"
          onClick={handleAddQuiz}
          disabled={!title.trim()}
          className={`px-4 py-2 ${!title.trim() ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'} text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
        >
          Add Quiz
        </button>
      </div>
    </div>
  );
};

export default QuizForm;