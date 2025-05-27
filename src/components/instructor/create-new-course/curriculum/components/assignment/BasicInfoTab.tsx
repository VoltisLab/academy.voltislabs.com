import { useState, useEffect } from "react";
import { ExtendedLecture } from "@/lib/types";
import toast from "react-hot-toast";

const BasicInfoTab: React.FC<{
  data: ExtendedLecture;
  onChange: (field: string, value: any) => void;
  onSave?: () => void; // Made optional to prevent errors
}> = ({ data, onChange, onSave }) => {
  const [validation, setValidation] = useState({
    title: true,
    description: true,
    duration: true,
  });

  // Validate form whenever data changes
  useEffect(() => {
    setValidation({
      title: (data.assignmentTitle || "").trim().length > 0,
      description: (data.assignmentDescription || "").trim().length > 0,
      duration: (data.estimatedDuration || 0) > 0,
    });
  }, [
    data.assignmentTitle,
    data.assignmentDescription,
    data.estimatedDuration,
  ]);

  const isFormValid =
    validation.title && validation.description && validation.duration;

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.slice(0, 20);
    onChange("assignmentTitle", value);
    setValidation((prev) => ({ ...prev, title: value.trim().length > 0 }));
  };

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const value = e.target.value.slice(0, 300);
    onChange("assignmentDescription", value);
    setValidation((prev) => ({
      ...prev,
      description: value.trim().length > 0,
    }));
  };

  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === "" ? "" : parseInt(e.target.value) || 0;
    onChange("estimatedDuration", value);
    setValidation((prev) => ({
      ...prev,
      duration: value !== "" && value > 0, // Only valid if not empty and > 0
    }));
  };

  const handleUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange("durationUnit", e.target.value as "minutes" | "hours" | "days");
  };

  const handleSaveClick = () => {
    if (isFormValid && onSave) {
      onSave();
      toast.success("Basic info saved successfully!");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <label
          className={`block text-sm font-medium mb-2 ${
            validation.title ? "text-gray-700" : "text-red-600"
          }`}
        >
          Title
        </label>
        <div className="relative">
          <input
            type="text"
            value={data.assignmentTitle || ""}
            onChange={handleTitleChange}
            className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
              validation.title ? "border-gray-300" : "border-red-500"
            }`}
            placeholder="Enter assignment title"
            maxLength={20}
          />
          <span className="absolute right-3 top-3 text-sm text-gray-400">
            {(data.assignmentTitle || "").length}/20
          </span>
        </div>
      </div>

      <div>
        <label
          className={`block text-sm font-medium mb-2 ${
            validation.description ? "text-gray-700" : "text-red-600"
          }`}
        >
          Description *
        </label>
        <div className="relative">
          <textarea
            value={data.assignmentDescription || ""}
            onChange={handleDescriptionChange}
            className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
              validation.description ? "border-gray-300" : "border-red-500"
            }`}
            rows={6}
            placeholder="Enter assignment description"
            maxLength={300}
          />
          <span className="absolute right-3 bottom-3 text-sm text-gray-400">
            {(data.assignmentDescription || "").length}/300
          </span>
        </div>
      </div>

      <div>
        <label
          className={`block text-sm font-medium mb-2 ${
            validation.duration ? "text-gray-700" : "text-red-600"
          }`}
        >
          Estimated Duration *
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            value={data.estimatedDuration || ""}
            onChange={handleDurationChange}
            className={`w-32 p-3 border rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
              validation.duration ? "border-gray-300" : "border-red-500"
            }`}
          />
          <select
            value={data.durationUnit || "minutes"}
            onChange={handleUnitChange}
            className="p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="minutes">Minutes</option>
            <option value="hours">Hours</option>
            <option value="days">Days</option>
          </select>
        </div>
        {!validation.duration && (
          <p className="text-sm text-red-500 mt-2">
            A minimum duration of 1 minute is required
          </p>
        )}
      </div>

      <button
        onClick={handleSaveClick}
        disabled={!isFormValid}
        className={`px-6 py-2 rounded-md ${
          isFormValid
            ? "bg-purple-600 text-white hover:bg-purple-700"
            : "bg-gray-200 text-gray-500 cursor-not-allowed"
        }`}
      >
        Save
      </button>
    </div>
  );
};

export default BasicInfoTab;
