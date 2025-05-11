import { X } from "lucide-react";
import { useState } from "react";

const SectionForm: React.FC<{
  onAddSection: (title: string, objective: string) => void;
  onCancel: () => void;
}> = ({ onAddSection, onCancel }) => {
  const [title, setTitle] = useState('');
  const [objective, setObjective] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAddSection(title, objective);
    }
  };
  
  return (
    <div className="relative border border-gray-300 px-6 py-2 mb-2 rounded mt-15">
      {/* X button positioned at the top right */}
      <button 
        onClick={onCancel} 
        className="absolute -top-6 -left-3 bg-white text-gray-500 hover:text-gray-700"
        aria-label="Close"
      >
        <X className="w-5 h-5" />
      </button>
      
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <div className="w-28">
            <label className="text-md font-bold text-gray-800">New Section:</label>
          </div>
          <div className="flex-1 relative">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a Title"
              className="w-full border border-gray-500 rounded px-3 py-2 focus:outline-none focus:border-2 focus:border-[#6D28D2] pr-14"
              maxLength={80}
            />
            <div className="absolute right-3 top-1/2 transform font-bold -translate-y-1/2 text-sm text-gray-500">
              {80 - title.length}
            </div>
          </div>
        </div>
        
        <div className="ml-28">
          <label className="block text-sm font-medium text-gray-800 mb-2">
            What will students be able to do at the end of this section?
          </label>
          <div className="relative">
            <input
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              placeholder="Enter a Learning Objective"
              className="w-full border border-gray-500 rounded px-3 py-2 focus:outline-none focus:border-2 focus:border-[#6D28D2] pr-14"
              maxLength={200}
            />
            <div className="absolute right-3 top-1/2 font-bold transform -translate-y-1/2 text-sm text-gray-500">
              {200 - objective.length}
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          className="px-4 py-2 text-sm font-medium bg-[#6D28D2] text-white rounded hover:bg-[#7B3FE4]"
        >
          Add Section
        </button>
      </div>
    </div>
  );
};

export default SectionForm