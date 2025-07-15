"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";

interface CourseObjectivesInputProps {
  title: string;
  objectives: string[];
  onObjectivesChange: (objectives: string[]) => void;
}

export default function CourseObjectivesInput({ 
  title, 
  objectives, 
  onObjectivesChange 
}: CourseObjectivesInputProps) {
  const [localObjectives, setLocalObjectives] = useState<string[]>(objectives);

  // Update local state when props change
  useEffect(() => {
    setLocalObjectives(objectives);
  }, [objectives]);

  const handleChange = (index: number, value: string) => {
    const updated = [...localObjectives];
    updated[index] = value;
    setLocalObjectives(updated);
    
    // Send data up to parent component
    onObjectivesChange(updated);
  };

  const handleAdd = () => {
    const updated = [...localObjectives, ""];
    setLocalObjectives(updated);
    
    // Send data up to parent component
    onObjectivesChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-800">
          {title} <span className="text-gray-500">({localObjectives.length}/8)</span>
        </h3>
        {localObjectives.length < 8 && (
          <button
            onClick={handleAdd}
            className="text-sm text-indigo-600 flex items-center gap-1 hover:underline"
          >
            <Plus className="w-4 h-4" /> Add new
          </button>
        )}
      </div>

      {localObjectives.map((obj, i) => (
        <div key={i} className="space-y-1">
          <p className="text-xs text-gray-400">{String(i + 1).padStart(2, "0")}</p>
          <input
            type="text"
            placeholder={`Enter ${title.toLowerCase()}...`}
            maxLength={120}
            value={obj}
            onChange={(e) => handleChange(i, e.target.value)}
            className="w-full border border-gray-300 rounded-md p-3 text-sm"
          />
          <p className="text-right text-xs text-gray-400">{obj.length}/120</p>
        </div>
      ))}
    </div>
  );
}