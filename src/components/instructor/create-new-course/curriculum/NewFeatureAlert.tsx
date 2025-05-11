const NewFeatureAlert: React.FC<{ onDismiss: () => void }> = ({ onDismiss }) => {
  return (
    <div className="bg-gray-100 border border-gray-300  mb-6 overflow-hidden">
      <div className="flex items-start px-4 py-3">
        <div className="flex-shrink-0 mr-3">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs bg-green-300 text-green-900 font-bold">
            New
          </span>
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold text-gray-700">
            Check out the latest creation flow improvements, new question types, and AI-assisted features in practice tests.
          </p>
          <button 
            onClick={onDismiss} 
            className="mt-2 px-1 py-3 text-sm font-bold text-gray-700 hover:bg-gray-300 rounded-md"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewFeatureAlert