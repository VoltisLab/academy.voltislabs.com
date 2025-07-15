'use client';
import { useState } from "react";

export default function NotificationSettingsForm() {
  const [settings, setSettings] = useState({
    chat: true,
    updates: true,
    mentor: false,
    course: false,
  });

  const toggle = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <form className="max-w-sm space-y-6 text-sm text-gray-700">
      {[
        { label: "Chat Personal/ Group", key: "chat" },
        { label: "Newest Update", key: "updates" },
        { label: "Mentor Of The Month", key: "mentor" },
        { label: "Course Of The Month", key: "course" },
      ].map(({ label, key }) => (
        <div key={key} className="flex items-center gap-4">
          <div
            onClick={() => toggle(key as keyof typeof settings)}
            className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${
              settings[key as keyof typeof settings] ? "bg-[#2E2C6F]" : "bg-gray-300"
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                settings[key as keyof typeof settings] ? "translate-x-5" : "translate-x-0"
              }`}
            ></div>
          </div>
          <span className="text-gray-900 font-medium">{label}</span>
        </div>
      ))}

      <button
        type="submit"
        className="bg-[#2E2C6F] text-white px-6 py-2 rounded-lg font-medium"
      >
        Save Changes
      </button>
    </form>
  );
}
