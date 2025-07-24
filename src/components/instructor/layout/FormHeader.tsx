// FormHeader.tsx
import React from 'react';

// Define the interface for the handleCourseCreation parameter
interface FormHeaderProps {
  loading: boolean;
  handleCourseCreation: (event: React.MouseEvent<HTMLButtonElement>, preview?: boolean) => void;
  title: string
}

export default function FormHeader({ loading, handleCourseCreation, title}: FormHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b border-gray-200 py-3 ">
      <h2 className="xl:text-lg text-[15px] font-semibold text-gray-900">{title}</h2>

      <div className="flex items-center xl:gap-4 gap-2">
        <button 
          className="bg-indigo-100 text-indigo-700 font-medium text-sm xl:px-4 px-2 xl:py-2 py-1 rounded-md"
          onClick={(e) => handleCourseCreation(e)}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save"}
        </button>
        <button 
          className="text-indigo-800 text-sm font-medium"
          onClick={(e) => handleCourseCreation(e, true)}
          disabled={loading}
        >
          Save & Preview
        </button>
      </div>
    </div>
  );
}