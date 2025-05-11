// components/CodingExerciseForm.tsx
import React, { useState } from 'react';
import { X } from 'lucide-react';

interface CodingExerciseFormProps {
  sectionId: string;
  onAddCodingExercise: (sectionId: string, title: string) => void;
  onCancel: () => void;
}

const CodingExerciseForm: React.FC<CodingExerciseFormProps> = ({
  sectionId,
  onAddCodingExercise,
  onCancel
}) => {
  const [title, setTitle] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAddCodingExercise(sectionId, title.trim());
    }
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden border border-gray-200 mb-4">
      <div className="flex justify-between items-center p-3 bg-gray-50">
        <h3 className="font-semibold">New Coding Exercise:</h3>
        <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
          <X className="w-5 h-5" />
        </button>
      </div>
      
      <div className="p-4">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a Title"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              maxLength={100}
              autoFocus
              required
            />
            <div className="text-right text-xs text-gray-500 mt-1">
              {title.length}/100
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
              className={`xl:px-4 px-2 xl:py-2 py-1 ${!title.trim() ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'} text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            >
              Add Coding Exercise
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CodingExerciseForm;