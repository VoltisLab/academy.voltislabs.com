"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

export default function CourseObjectivesInput({ title }: { title: string }) {
  const [objectives, setObjectives] = useState<string[]>(["", "", "", ""]);

  const handleChange = (index: number, value: string) => {
    const updated = [...objectives];
    updated[index] = value;
    setObjectives(updated);
  };

  const handleAdd = () => {
    setObjectives([...objectives, ""]);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-800">
          {title} <span className="text-gray-500">({objectives.length}/8)</span>
        </h3>
        {objectives.length < 8 && (
          <button
            onClick={handleAdd}
            className="text-sm text-indigo-600 flex items-center gap-1 hover:underline"
          >
            <Plus className="w-4 h-4" /> Add new
          </button>
        )}
      </div>

      {objectives.map((obj, i) => (
        <div key={i} className="space-y-1">
          <p className="text-xs text-gray-400">{String(i + 1).padStart(2, "0")}</p>
          <input
            type="text"
            placeholder="What you will teach in this course..."
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
