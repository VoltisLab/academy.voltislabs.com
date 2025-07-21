"use client";
import { useState } from "react";

export default function PreferencesForm() {
  const [timeFormat, setTimeFormat] = useState("24h");
  const [dateFormat, setDateFormat] = useState("dd/mm/yyyy");
  const [language, setLanguage] = useState("en");
  const [timezone, setTimezone] = useState("UTC");

  const languages = [
    { value: "en", label: "English" },
    { value: "es", label: "Spanish" },
    { value: "fr", label: "French" },
    { value: "de", label: "German" },
    { value: "ja", label: "Japanese" },
  ];

  const timezones = [
    { value: "UTC", label: "UTC (Coordinated Universal Time)" },
    { value: "EST", label: "EST (Eastern Standard Time)" },
    { value: "PST", label: "PST (Pacific Standard Time)" },
    { value: "CET", label: "CET (Central European Time)" },
    { value: "IST", label: "IST (Indian Standard Time)" },
  ];

  return (
    <form className="max-w-sm space-y-6 text-sm text-gray-700">
      {/* Language */}
      <div>
        <label className="block mb-1 font-medium">Language</label>
        <select
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:border-[#2E2C6F] focus:ring-1 focus:ring-[#2E2C6F] outline-none transition-all appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNjYmNiY2IiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBjbGFzcz0ibHVjaWRlIGx1Y2lkZS1jaGV2cm9uLWRvd24iPjxwYXRoIGQ9Im03IDEwIDUgNSA1LTUiLz48L3N2Zz4=')] bg-no-repeat bg-[right_0.75rem_center]"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          {languages.map((lang) => (
            <option key={lang.value} value={lang.value}>
              {lang.label} {lang.value === "en" && "(Default)"}
            </option>
          ))}
        </select>
      </div>

      {/* Timezone */}
      <div>
        <label className="block mb-1 font-medium">Timezone</label>
        <select
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:border-[#2E2C6F] focus:ring-1 focus:ring-[#2E2C6F] outline-none transition-all appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNjYmNiY2IiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBjbGFzcz0ibHVjaWRlIGx1Y2lkZS1jaGV2cm9uLWRvd24iPjxwYXRoIGQ9Im03IDEwIDUgNSA1LTUiLz48L3N2Zz4=')] bg-no-repeat bg-[right_0.75rem_center]"
          value={timezone}
          onChange={(e) => setTimezone(e.target.value)}
        >
          {timezones.map((tz) => (
            <option key={tz.value} value={tz.value}>
              {tz.label}
            </option>
          ))}
        </select>
      </div>

      {/* Time format */}
      <div>
        <label className="block mb-2 font-medium">Time Format</label>
        <div className="flex gap-4">
          <label
            className={`flex items-center gap-2 px-4 py-2 border rounded-lg cursor-pointer ${
              timeFormat === "24h"
                ? "border-[#2E2C6F] text-[#2E2C6F]"
                : "border-gray-300"
            }`}
          >
            <input
              type="radio"
              name="timeFormat"
              value="24h"
              checked={timeFormat === "24h"}
              onChange={() => setTimeFormat("24h")}
              className="hidden"
            />
            24 Hours
            <span
              className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                timeFormat === "24h" ? "border-[#2E2C6F]" : "border-gray-400"
              }`}
            >
              {timeFormat === "24h" && (
                <span className="w-2 h-2 bg-[#2E2C6F] rounded-full" />
              )}
            </span>
          </label>
          <label
            className={`flex items-center gap-2 px-4 py-2 border rounded-lg cursor-pointer ${
              timeFormat === "12h"
                ? "border-[#2E2C6F] text-[#2E2C6F]"
                : "border-gray-300"
            }`}
          >
            <input
              type="radio"
              name="timeFormat"
              value="12h"
              checked={timeFormat === "12h"}
              onChange={() => setTimeFormat("12h")}
              className="hidden"
            />
            12 Hours
            <span
              className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                timeFormat === "12h" ? "border-[#2E2C6F]" : "border-gray-400"
              }`}
            >
              {timeFormat === "12h" && (
                <span className="w-2 h-2 bg-[#2E2C6F] rounded-full" />
              )}
            </span>
          </label>
        </div>
      </div>

      {/* Date format */}
      <div>
        <label className="block mb-2 font-medium">Date Format</label>
        <div className="flex gap-4">
          <label
            className={`flex items-center gap-2 px-4 py-2 border rounded-lg cursor-pointer ${
              dateFormat === "mm/dd/yyyy"
                ? "border-[#2E2C6F] text-[#2E2C6F]"
                : "border-gray-300"
            }`}
          >
            <input
              type="radio"
              name="dateFormat"
              value="mm/dd/yyyy"
              checked={dateFormat === "mm/dd/yyyy"}
              onChange={() => setDateFormat("mm/dd/yyyy")}
              className="hidden"
            />
            mm/dd/yyyy
            <span
              className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                dateFormat === "mm/dd/yyyy"
                  ? "border-[#2E2C6F]"
                  : "border-gray-400"
              }`}
            >
              {dateFormat === "mm/dd/yyyy" && (
                <span className="w-2 h-2 bg-[#2E2C6F] rounded-full" />
              )}
            </span>
          </label>
          <label
            className={`flex items-center gap-2 px-4 py-2 border rounded-lg cursor-pointer ${
              dateFormat === "dd/mm/yyyy"
                ? "border-[#2E2C6F] text-[#2E2C6F]"
                : "border-gray-300"
            }`}
          >
            <input
              type="radio"
              name="dateFormat"
              value="dd/mm/yyyy"
              checked={dateFormat === "dd/mm/yyyy"}
              onChange={() => setDateFormat("dd/mm/yyyy")}
              className="hidden"
            />
            dd/mm/yyyy
            <span
              className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                dateFormat === "dd/mm/yyyy"
                  ? "border-[#2E2C6F]"
                  : "border-gray-400"
              }`}
            >
              {dateFormat === "dd/mm/yyyy" && (
                <span className="w-2 h-2 bg-[#2E2C6F] rounded-full" />
              )}
            </span>
          </label>
        </div>
      </div>

      <button
        type="submit"
        className="bg-[#2E2C6F] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#3a388a] transition-colors"
      >
        Save Changes
      </button>
    </form>
  );
}
