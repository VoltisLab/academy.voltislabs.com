import { useState, useEffect } from "react";
import { ExtendedLecture } from "@/lib/types";
import toast from "react-hot-toast";
import { useAssignment } from "@/context/AssignmentDataContext";
import { UpdateAssignmentVariables } from "@/api/assignment/mutation";
import { useParams } from "next/navigation";
import { useAssignmentService } from "@/services/useAssignmentService";
import { BiErrorAlt } from "react-icons/bi";

const BasicInfoTab: React.FC<{
  data: ExtendedLecture;
  onChange: (field: string, value: any) => void;
  onSave?: () => void; // Made optional to prevent errors
  fetchAssignment: () => Promise<void>;
}> = ({ data, onChange, fetchAssignment }) => {
  const [validation, setValidation] = useState({
    title: true,
    description: true,
    duration: true,
  });
  const [isSaving, setIsSaving] = useState(false); // New state for save button loading
  const params = useParams();
  const id = params?.id;
  // Validate form whenever data changes
  useEffect(() => {
    setValidation({
      title: (data.title || "").trim().length > 0,
      description: (data.description || "").trim().length > 0,
      duration: (data.estimatedDuration || 0) > 0,
    });
  }, [data.assignmentTitle, data.description, data.estimatedDuration]);

  const isFormValid =
    validation.title && validation.description && validation.duration;

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.slice(0, 20);
    onChange("title", value);
    setValidation((prev) => ({ ...prev, title: value.trim().length > 0 }));
  };

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const value = e.target.value.slice(0, 300);
    onChange("description", value);
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

  const { assignmentData } = useAssignment();

  const { updateAssignment } = useAssignmentService();

  const handleSaveClick = async () => {
    if (!isFormValid || isSaving) return;

    setIsSaving(true);
    try {
      const publishedData = { ...assignmentData, isPublished: true };
      const variables: UpdateAssignmentVariables = {
        assignmentId: Number(id),
        title: publishedData.title,
        description: publishedData.description,
        estimatedDurationMinutes: publishedData.estimatedDuration,
      };

      await updateAssignment(variables);
      toast.success("Saved");
      await fetchAssignment();
    } catch (error) {
      toast.error("Failed to save basic info");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="px-2 py-4 md:p-6 space-y-6">
      <div>
        <label
          className={`flex items-center gap-2 text-sm font-bold mb-2 ${
            validation.title ? "text-gray-700" : "text-red-600"
          }`}
        >
          Title
          {!validation.title && <BiErrorAlt size={18} />}
        </label>
        <div className="relative">
          <input
            type="text"
            value={data.title || ""}
            onChange={handleTitleChange}
            className={`w-full px-3 py-2.5 rounded focus:outline-none focus:ring-1 focus:ring-[#6d28d2] ${
              validation.title
                ? "border border-zinc-500"
                : "border border-red-500 focus:border-transparent"
            }`}
            placeholder="Enter assignment title"
            maxLength={20}
          />
          <span className="absolute right-3 top-3 text-sm text-gray-400">
            {80 - (data.title || "").length}
          </span>
        </div>
      </div>

      <div>
        <label
          className={`flex items-center gap-2 text-sm font-bold mb-2  ${
            validation.description ? "text-gray-700" : "text-red-600"
          }`}
        >
          Description
          {!validation.description && <BiErrorAlt size={18} />}
        </label>
        <div className="relative">
          <textarea
            value={data.description || ""}
            onChange={handleDescriptionChange}
            className={`w-full h-18 px-3 py-2.5 rounded focus:outline-none focus:ring-1 focus:ring-[#6d28d2] ${
              validation.description
                ? "border border-zinc-500"
                : "border border-red-500 focus:border-transparent"
            }`}
            rows={6}
            maxLength={300}
          />
          <span className="absolute right-3 bottom-3 text-sm text-gray-400">
            {300 - (data.description || "").length}
          </span>
        </div>
      </div>

      <div>
        <label
          className={`flex items-center gap-2 text-sm font-bold mb-2 ${
            validation.duration ? "text-gray-700" : "text-red-600"
          }`}
        >
          Estimated Duration
          {!validation.duration && <BiErrorAlt size={18} />}
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            value={data.estimatedDuration || ""}
            onChange={handleDurationChange}
            className={`w-56 px-3 py-2.5 rounded focus:outline-none focus:ring-1 focus:ring-[#6d28d2] ${
              validation.duration
                ? "border border-zinc-500"
                : "border border-red-500 focus:border-transparent"
            }`}
          />
          {/* <select
            value={data.durationUnit || "minutes"}
            onChange={handleUnitChange}
            className="p-3 border border-zinc-500 rounded focus:ring-1 focus:ring-[#6d28d2] focus:outline-none"
          >
            <option value="minutes">Minutes</option>
            <option value="hours">Hours</option>
            <option value="days">Days</option>
          </select> */}
        </div>
        {!validation.duration ? (
          <p className="text-sm text-red-500 mt-2">
            A minimum duration of 1 minute is required
          </p>
        ) : (
          <p className="text-xs mt-2">In minutes</p>
        )}
      </div>

      <button
        onClick={handleSaveClick}
        disabled={!isFormValid || isSaving}
        className={`px-6 py-1.5 rounded  ${
          isFormValid && !isSaving
            ? "bg-[#6d28d2] text-white hover:bg-purple-700"
            : "bg-[rgba(108,40,210,0.3)] text-white cursor-not-allowed"
        }`}
      >
        {isSaving ? "...Saving" : "Save"}
      </button>
    </div>
  );
};

export default BasicInfoTab;
