// components/CodingExerciseForm.tsx
import React, { useState } from "react";
import { X } from "lucide-react";

interface CodingExerciseFormProps {
  sectionId: string;
  onAddCodingExercise: (sectionId: string, title: string) => Promise<void>;
  onCancel: () => void;
  isAddingCodingExercise: boolean;
}

const CodingExerciseForm: React.FC<CodingExerciseFormProps> = ({
  sectionId,
  onAddCodingExercise,
  onCancel,
  isAddingCodingExercise,
}) => {
  const [title, setTitle] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      await onAddCodingExercise(sectionId, title.trim());
    }
  };

  return (
    <div className=" overflow-hidden mb-4">
      <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
        <X className="w-5 h-5" />
      </button>

      <div className="p-2 ml-8 bg-white border-gray-400 border">
        <form onSubmit={handleSubmit}>
          <div className="mb-4 relative">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a Title"
              className="w-full border border-gray-400 rounded text-gray-700 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#6D28D2]"
              maxLength={100}
              autoFocus
              required
            />
            <div className="absolute right-2 bottom-2 text-lg text-gray-700 mt-1">
              {100 - title.length}
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
              disabled={!title.trim() || isAddingCodingExercise}
              className={`px-2 xl:py-2 py-1 disabled:bg-[#9E28D2] disabled:cursor-not-allowed bg-[#6D28D2] hover:bg-[#7D28D2] text-white rounded-md focus:outline-none focus:ring-1 focus:ring-[#6D28D2]`}
            >
              {isAddingCodingExercise
                ? "Adding coding exercise..."
                : " Add Coding Exercise"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CodingExerciseForm;
