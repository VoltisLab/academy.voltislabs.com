"use client"
import { useState } from "react";

export default function PreferencesForm() {
  const [timeFormat, setTimeFormat] = useState("24h");
  const [dateFormat, setDateFormat] = useState("dd/mm/yyyy");

  return (
    <form className="max-w-sm space-y-6 text-sm text-gray-700">
      {/* Language */}
      <div>
        <label className="block mb-1 font-medium">Language</label>
        <select className="w-full border border-gray-300 rounded-lg px-4 py-2">
          <option>English (Default)</option>
        </select>
      </div>

      {/* Timezone */}
      <div>
        <label className="block mb-1 font-medium">Timezone</label>
        <select className="w-full border border-gray-300 rounded-lg px-4 py-2">
          <option>English (Default)</option>
        </select>
      </div>

      {/* Time format */}
      <div>
        <label className="block mb-2 font-medium">Timezone</label>
        <div className="flex gap-4">
          <label className={`flex items-center gap-2 px-4 py-2 border rounded-lg cursor-pointer ${timeFormat === "24h" ? "border-[#2E2C6F] text-[#2E2C6F]" : "border-gray-300"}`}>
            <input
              type="radio"
              name="timeFormat"
              value="24h"
              checked={timeFormat === "24h"}
              onChange={() => setTimeFormat("24h")}
              className="hidden"
            />
            24 Hours
            <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${timeFormat === "24h" ? "border-[#2E2C6F]" : "border-gray-400"}`}>
              {timeFormat === "24h" && <span className="w-2 h-2 bg-[#2E2C6F] rounded-full" />}
            </span>
          </label>
          <label className={`flex items-center gap-2 px-4 py-2 border rounded-lg cursor-pointer ${timeFormat === "12h" ? "border-[#2E2C6F] text-[#2E2C6F]" : "border-gray-300"}`}>
            <input
              type="radio"
              name="timeFormat"
              value="12h"
              checked={timeFormat === "12h"}
              onChange={() => setTimeFormat("12h")}
              className="hidden"
            />
            12 Hours
            <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${timeFormat === "12h" ? "border-[#2E2C6F]" : "border-gray-400"}`}>
              {timeFormat === "12h" && <span className="w-2 h-2 bg-[#2E2C6F] rounded-full" />}
            </span>
          </label>
        </div>
      </div>

      {/* Date format */}
      <div>
        <label className="block mb-2 font-medium">Date Format</label>
        <div className="flex gap-4">
          <label className={`flex items-center gap-2 px-4 py-2 border rounded-lg cursor-pointer ${dateFormat === "mm/dd/yyyy" ? "border-[#2E2C6F] text-[#2E2C6F]" : "border-gray-300"}`}>
            <input
              type="radio"
              name="dateFormat"
              value="mm/dd/yyyy"
              checked={dateFormat === "mm/dd/yyyy"}
              onChange={() => setDateFormat("mm/dd/yyyy")}
              className="hidden"
            />
            mm/dd/yyyy
            <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${dateFormat === "mm/dd/yyyy" ? "border-[#2E2C6F]" : "border-gray-400"}`}>
              {dateFormat === "mm/dd/yyyy" && <span className="w-2 h-2 bg-[#2E2C6F] rounded-full" />}
            </span>
          </label>
          <label className={`flex items-center gap-2 px-4 py-2 border rounded-lg cursor-pointer ${dateFormat === "dd/mm/yyyy" ? "border-[#2E2C6F] text-[#2E2C6F]" : "border-gray-300"}`}>
            <input
              type="radio"
              name="dateFormat"
              value="dd/mm/yyyy"
              checked={dateFormat === "dd/mm/yyyy"}
              onChange={() => setDateFormat("dd/mm/yyyy")}
              className="hidden"
            />
            dd/mm/yyyy
            <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${dateFormat === "dd/mm/yyyy" ? "border-[#2E2C6F]" : "border-gray-400"}`}>
              {dateFormat === "dd/mm/yyyy" && <span className="w-2 h-2 bg-[#2E2C6F] rounded-full" />}
            </span>
          </label>
        </div>
      </div>

      <button
        type="submit"
        className="bg-[#2E2C6F] text-white px-6 py-2 rounded-lg font-medium"
      >
        Save Changes
      </button>
    </form>
  );
}
