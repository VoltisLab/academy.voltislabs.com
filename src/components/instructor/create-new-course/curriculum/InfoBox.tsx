import { Info } from "lucide-react";

const InfoBox: React.FC<{ onDismiss: () => void }> = ({ onDismiss }) => {
  return (
    <div className="flex items-start p-5 bg-white rounded-xl border border-gray-200 mb-6">
      <div className="flex-shrink-0 mt-0.5 mr-3">
        <Info className="h-6 w-6 text-[#6D28D2]" />
      </div>
      <div className="flex-1">
        <p className="text-md font-bold text-gray-700">
          Here's where you add course content—like lectures, course sections, assignments, and more. Click the + icon to get started.
        </p>
        <button 
          onClick={onDismiss} 
          className="mt-2 px-3 py-2 text-sm font-bold text-[#6D28D2] border border-[#6D28D2] rounded hover:bg-indigo-50"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
};

export default InfoBox