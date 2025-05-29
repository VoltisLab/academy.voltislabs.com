import React, { useState } from "react";
import { X } from "lucide-react";

interface ReportAbuseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (issueType: string, issueDetails: string) => void;
}

const ReportAbuseModal: React.FC<ReportAbuseModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [issueType, setIssueType] = useState<string>("");
  const [issueDetails, setIssueDetails] = useState<string>("");
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  const issueTypes = [
    "Inappropriate Content-Harmful, Violent, Hateful or Criminal",
    "Inappropriate Content-other",
    "Inappropriate behaviour",
    "Voltis Academy Policy Violation",
    "Spammy Content",
    "Technical Issue",
    "Other",
  ];

  const handleSubmit = () => {
    if (issueType && issueDetails.trim()) {
      onSubmit(issueType, issueDetails);
      setIssueType("");
      setIssueDetails("");
      onClose();
    }
  };

  const handleCancel = () => {
    setIssueType("");
    setIssueDetails("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[10000] backdrop-blur-sm bg-transparent bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg w-full max-w-xl shadow-lg">
        <div className="p-4 flex justify-between items-center border-b border-gray-200">
          <h2 className="text-lg font-medium">Report abuse</h2>
          <button
            onClick={handleCancel}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <p className="text-sm text-gray-600 mb-6">
            Flagged content is reviewed by Udemy staff to determine whether it violates
            Terms of Service or Community Guidelines. If you have a question or
            technical issue, please{" "}
            <a href="#" className="text-purple-600 hover:underline">
              contact the Support team here
            </a>
            .
          </p>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Issue type
            </label>
            <div className="relative">
              <button
                type="button"
                className="w-full px-3 py-2 text-left border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-purple-500 flex justify-between items-center"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <span className={issueType ? "text-gray-900" : "text-gray-500"}>
                  {issueType || "Select an issue"}
                </span>
                <svg
                  className={`w-4 h-4 transition-transform ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {isDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10">
                  {issueTypes.map((type) => (
                    <button
                      key={type}
                      type="button"
                      className="w-full px-3 py-2 text-left hover:bg-gray-50 focus:outline-none focus:bg-gray-50"
                      onClick={() => {
                        setIssueType(type);
                        setIsDropdownOpen(false);
                      }}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Issue details
            </label>
            <textarea
              value={issueDetails}
              onChange={(e) => setIssueDetails(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 resize-none"
              rows={4}
              placeholder="Please provide details about the issue..."
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 text-purple-600 hover:text-purple-700 font-medium"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!issueType || !issueDetails.trim()}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white rounded-md font-medium"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportAbuseModal;