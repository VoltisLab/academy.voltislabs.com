"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface LinkInsertModalProps {
  closeModal: () => void;
  onInsert: (url: string, text: string) => void;
}

const LinkInsertModal: React.FC<LinkInsertModalProps> = ({
  closeModal,
  onInsert,
}) => {
  const [url, setUrl] = useState("");
  const [text, setText] = useState("");
  const [errors, setErrors] = useState({
    url: false,
    text: false,
  });
  const [touched, setTouched] = useState({
    url: false,
    text: false,
  });

  const validateUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const validate = () => {
    const newErrors = {
      url: !url.trim() || !validateUrl(url),
      text: !text.trim(),
    };
    setErrors(newErrors);
    return !newErrors.url && !newErrors.text;
  };

  const handleInsert = () => {
    setTouched({ url: true, text: true });
    if (validate()) {
      onInsert(url, text);
      closeModal();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs"
      onClick={closeModal}
    >
      <div
        className="bg-white w-full max-w-xl p-4 rounded-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between mb-4">
          <h2 className="font-bold text-lg">Insert Link</h2>
          <button
            onClick={closeModal}
            className="text-gray-500 hover:text-black cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label
              className={`block text-sm font-medium mb-1 ${
                touched.url && errors.url ? "text-red-600" : "text-gray-700"
              }`}
            >
              URL *
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                if (touched.url) {
                  setErrors((prev) => ({
                    ...prev,
                    url: !e.target.value.trim() || !validateUrl(e.target.value),
                  }));
                }
              }}
              onBlur={() => setTouched((prev) => ({ ...prev, url: true }))}
              className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                touched.url && errors.url ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="https://example.com"
            />
            {touched.url && errors.url && (
              <p className="text-sm text-red-500 mt-1">
                {!url.trim()
                  ? "URL is required"
                  : "Please enter a valid URL (include http:// or https://)"}
              </p>
            )}
          </div>

          <div>
            <label
              className={`block text-sm font-medium mb-1 ${
                touched.text && errors.text ? "text-red-600" : "text-gray-700"
              }`}
            >
              Text *
            </label>
            <input
              type="text"
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                if (touched.text) {
                  setErrors((prev) => ({
                    ...prev,
                    text: !e.target.value.trim(),
                  }));
                }
              }}
              onBlur={() => setTouched((prev) => ({ ...prev, text: true }))}
              className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                touched.text && errors.text
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
              placeholder="Link text"
            />
            {touched.text && errors.text && (
              <p className="text-sm text-red-500 mt-1">Text is required</p>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-2 mt-6">
          <button
            onClick={closeModal}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={handleInsert}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
          >
            Insert
          </button>
        </div>
      </div>
    </div>
  );
};

export default LinkInsertModal;
