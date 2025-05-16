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
    <div className=" overflow-hidden mb-4">
 
        <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
          <X className="w-5 h-5" />
        </button>

      
      <div className="p-2 ml-10 bg-white border-gray-500 border">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a Title"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#6D28D2]"
              maxLength={100}
              autoFocus
              required
            />
            <div className="absolute right-5 bottom-5 text-xs text-gray-500 mt-1">
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
              className={`px-2 xl:py-2 py-1 ${!title.trim() ? 'bg-indigo-400 cursor-not-allowed' : 'bg-[#6D28D2] hover:bg-[#7D28D2]'} text-white rounded-md focus:outline-none focus:ring-1 focus:ring-[#6D28D2]`}
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