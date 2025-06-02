import { X } from "lucide-react";

const ContentInformationDisplay: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  contentData: {
    contentType: string;
    isEncrypted: boolean;
    courseHasEncryptedVideos: boolean;
  };
}> = ({ isOpen, onClose, contentData }) => {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 bg-black flex justify-center z-50">
      <div className="text-white rounded-lg p-8 w-full mx-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none"
        >
          <X className="w-6 h-6" />
        </button>
        
        <h2 className="text-xl font-semibold mb-6 text-center">Content information</h2>
        
        <div className="space-y-4">
          <div>
            <span className="font-medium">Content type: </span>
            <span className="capitalize">{contentData.contentType}</span>
          </div>
          
          <div>
            <span className="font-medium">Course contains encrypted videos: </span>
            <span>{contentData.courseHasEncryptedVideos ? 'Yes' : 'No'}</span>
          </div>
          
          <div>
            <span className="font-medium">Is this video encrypted: </span>
            <span>{contentData.isEncrypted ? 'Yes' : 'No'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentInformationDisplay