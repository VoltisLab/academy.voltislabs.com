import { ExtendedLecture } from "@/lib/types";

const BasicInfoTab: React.FC<{
  data: ExtendedLecture;
  onChange: (field: string, value: any) => void;
}> = ({ data, onChange }) => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Title
        </label>
        <div className="relative">
          <input
            type="text"
            value={data.assignmentTitle || ''}
            onChange={(e) => onChange('assignmentTitle', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Enter assignment title"
          />
          <span className="absolute right-3 top-3 text-sm text-gray-400">
            {(data.assignmentTitle || '').length}/20
          </span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-red-600 mb-2">
          Description *
        </label>
        <div className="relative">
          <textarea
            value={data.assignmentDescription || ''}
            onChange={(e) => onChange('assignmentDescription', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            rows={6}
            placeholder="Enter assignment description"
          />
          <span className="absolute right-3 bottom-3 text-sm text-gray-400">
            {(data.assignmentDescription || '').length}/300
          </span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-red-600 mb-2">
          Estimated Duration *
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            value={data.estimatedDuration || 0}
            onChange={(e) => onChange('estimatedDuration', parseInt(e.target.value))}
            className="w-32 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            min="1"
          />
          <select
            value={data.durationUnit || 'minutes'}
            onChange={(e) => onChange('durationUnit', e.target.value)}
            className="p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="minutes">Minutes</option>
            <option value="hours">Hours</option>
            <option value="days">Days</option>
          </select>
        </div>
        <p className="text-sm text-red-500 mt-2">
          A minimum duration of 1 minute is required
        </p>
      </div>

      <button className="px-6 py-2 bg-purple-200 text-purple-700 rounded-md hover:bg-purple-300">
        Save
      </button>
    </div>
  );
};

export default BasicInfoTab