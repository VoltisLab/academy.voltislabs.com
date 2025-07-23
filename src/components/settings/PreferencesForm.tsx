"use client";
import { useState, useEffect } from "react";
import { usePreferenceOperations } from "@/services/preferenceService";
import {
  DateFormat,
  QueryLanguage,
  MutationLanguage,
  QueryTimeFormat,
  MutationTimeFormat,
  TimeZone,
  UserPreference,
  UpdatePreferenceInput,
} from "@/lib/preference";
import { toast } from "react-hot-toast";

// Helper function to convert query language to mutation language
const toMutationLanguage = (lang: QueryLanguage): MutationLanguage => {
  const map: Record<QueryLanguage, MutationLanguage> = {
    EN: MutationLanguage.ENGLISH,
    ES: MutationLanguage.SPANISH,
    FR: MutationLanguage.FRENCH,
    DE: MutationLanguage.GERMAN,
    IT: MutationLanguage.ITALIAN,
    PT: MutationLanguage.PORTUGUESE,
    ZH: MutationLanguage.CHINESE,
    JA: MutationLanguage.JAPANESE,
    RU: MutationLanguage.RUSSIAN,
    AR: MutationLanguage.ARABIC,
    HI: MutationLanguage.HINDI,
    BN: MutationLanguage.BENGALI,
    UR: MutationLanguage.URDU,
    KO: MutationLanguage.KOREAN,
    TR: MutationLanguage.TURKISH,
    SV: MutationLanguage.SWEDISH,
    NO: MutationLanguage.NORWEGIAN,
    NL: MutationLanguage.DUTCH,
    PL: MutationLanguage.POLISH,
    SW: MutationLanguage.SWAHILI,
    ID: MutationLanguage.INDONESIAN,
  };
  return map[lang];
};

// Helper function to convert query time format to mutation time format
const toMutationTimeFormat = (format: QueryTimeFormat): MutationTimeFormat => {
  return format === QueryTimeFormat.A_24_HOUR
    ? MutationTimeFormat.TIME_FORMAT_24_HOUR
    : MutationTimeFormat.TIME_FORMAT_12_HOUR;
};

export default function PreferencesForm() {
  const { getPreferences, updatePreferences } = usePreferenceOperations();
  const [loading, setLoading] = useState(true);
  const [preferences, setPreferences] = useState<Partial<UserPreference>>({
    dateFormat: DateFormat.DD_MM_YYYY,
    language: QueryLanguage.EN,
    timeFormat: QueryTimeFormat.A_24_HOUR,
    timezone: TimeZone.UTC,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        setLoading(true);
        const userPreferences = await getPreferences();
        console.log(userPreferences);
        if (userPreferences) {
          setPreferences(userPreferences);
        }
      } catch (error) {
        console.error("Failed to fetch preferences:", error);
        toast.error("Failed to load preferences");
      } finally {
        setLoading(false);
      }
    };

    fetchPreferences();
  }, []);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!preferences.dateFormat) {
      newErrors.dateFormat = "Date format is required";
    }
    if (!preferences.language) {
      newErrors.language = "Language is required";
    }
    if (!preferences.timeFormat) {
      newErrors.timeFormat = "Time format is required";
    }
    if (!preferences.timezone) {
      newErrors.timezone = "Timezone is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fill all required fields");
      return;
    }

    console.log(preferences);

    try {
      setLoading(true);

      // Convert to mutation input format
      const input = {
        dateFormat: preferences.dateFormat,
        language: preferences.language
          ? toMutationLanguage(preferences.language)
          : undefined,
        timeFormat: preferences.timeFormat
          ? toMutationTimeFormat(preferences.timeFormat)
          : undefined,
        timeZone: preferences.timezone,
      };

      const result = await updatePreferences(input);
      console.log(result);
      toast.success("Preferences updated successfully");
    } catch (error) {
      console.error("Failed to update preferences:", error);
      toast.error("Failed to update preferences");
    } finally {
      setLoading(false);
    }
  };

  const languages = [
    { value: QueryLanguage.EN, label: "English" },
    { value: QueryLanguage.ES, label: "Spanish" },
    { value: QueryLanguage.FR, label: "French" },
    { value: QueryLanguage.DE, label: "German" },
    { value: QueryLanguage.JA, label: "Japanese" },
  ];

  const timezones = [
    { value: TimeZone.UTC, label: "UTC (Coordinated Universal Time)" },
    { value: TimeZone.EST, label: "EST (Eastern Standard Time)" },
    { value: TimeZone.PST, label: "PST (Pacific Standard Time)" },
    { value: TimeZone.CET, label: "CET (Central European Time)" },
    { value: TimeZone.IST, label: "IST (Indian Standard Time)" },
  ];

  if (loading && !preferences.id) {
    return <div>Loading preferences...</div>;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-sm space-y-6 text-sm text-gray-700"
    >
      {/* Language */}
      <div>
        <label className="block mb-1 font-medium">Language</label>
        <select
          className={`w-full border ${
            errors.language ? "border-red-500" : "border-gray-300"
          } rounded-lg px-4 py-2 focus:border-[#2E2C6F] focus:ring-1 focus:ring-[#2E2C6F] outline-none transition-all appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNjYmNiY2IiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBjbGFzcz0ibHVjaWRlIGx1Y2lkZS1jaGV2cm9uLWRvd24iPjxwYXRoIGQ9Im03IDEwIDUgNSA1LTUiLz48L3N2Zz4=')] bg-no-repeat bg-[right_0.75rem_center]`}
          value={preferences.language || ""}
          onChange={(e) =>
            setPreferences({
              ...preferences,
              language: e.target.value as QueryLanguage,
            })
          }
          disabled={loading}
        >
          <option value="">Select a language</option>
          {languages.map((lang) => (
            <option key={lang.value} value={lang.value}>
              {lang.label} {lang.value === QueryLanguage.EN && "(Default)"}
            </option>
          ))}
        </select>
        {errors.language && (
          <p className="mt-1 text-sm text-red-600">{errors.language}</p>
        )}
      </div>

      {/* Timezone */}
      <div>
        <label className="block mb-1 font-medium">Timezone</label>
        <select
          className={`w-full border ${
            errors.timezone ? "border-red-500" : "border-gray-300"
          } rounded-lg px-4 py-2 focus:border-[#2E2C6F] focus:ring-1 focus:ring-[#2E2C6F] outline-none transition-all appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNjYmNiY2IiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBjbGFzcz0ibHVjaWRlIGx1Y2lkZS1jaGV2cm9uLWRvd24iPjxwYXRoIGQ9Im03IDEwIDUgNSA1LTQiLz48L3N2Zz4=')] bg-no-repeat bg-[right_0.75rem_center]`}
          value={preferences.timezone || ""}
          onChange={(e) =>
            setPreferences({
              ...preferences,
              timezone: e.target.value as TimeZone,
            })
          }
          disabled={loading}
        >
          <option value="">Select a timezone</option>
          {timezones.map((tz) => (
            <option key={tz.value} value={tz.value}>
              {tz.label}
            </option>
          ))}
        </select>
        {errors.timezone && (
          <p className="mt-1 text-sm text-red-600">{errors.timezone}</p>
        )}
      </div>

      {/* Time format */}
      <div>
        <label className="block mb-2 font-medium">Time Format</label>
        {errors.timeFormat && (
          <p className="mb-1 text-sm text-red-600">{errors.timeFormat}</p>
        )}
        <div className="flex gap-4">
          <label
            className={`flex items-center gap-2 px-4 py-2 border rounded-lg cursor-pointer ${
              preferences.timeFormat === QueryTimeFormat.A_24_HOUR
                ? "border-[#2E2C6F] text-[#2E2C6F]"
                : "border-gray-300"
            } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <input
              type="radio"
              name="timeFormat"
              value={QueryTimeFormat.A_24_HOUR}
              checked={preferences.timeFormat === QueryTimeFormat.A_24_HOUR}
              onChange={() =>
                setPreferences({
                  ...preferences,
                  timeFormat: QueryTimeFormat.A_24_HOUR,
                })
              }
              className="hidden"
              disabled={loading}
            />
            24 Hours
            <span
              className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                preferences.timeFormat === QueryTimeFormat.A_24_HOUR
                  ? "border-[#2E2C6F]"
                  : "border-gray-400"
              }`}
            >
              {preferences.timeFormat === QueryTimeFormat.A_24_HOUR && (
                <span className="w-2 h-2 bg-[#2E2C6F] rounded-full" />
              )}
            </span>
          </label>
          <label
            className={`flex items-center gap-2 px-4 py-2 border rounded-lg cursor-pointer ${
              preferences.timeFormat === QueryTimeFormat.A_12_HOUR
                ? "border-[#2E2C6F] text-[#2E2C6F]"
                : "border-gray-300"
            } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <input
              type="radio"
              name="timeFormat"
              value={QueryTimeFormat.A_12_HOUR}
              checked={preferences.timeFormat === QueryTimeFormat.A_12_HOUR}
              onChange={() =>
                setPreferences({
                  ...preferences,
                  timeFormat: QueryTimeFormat.A_12_HOUR,
                })
              }
              className="hidden"
              disabled={loading}
            />
            12 Hours
            <span
              className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                preferences.timeFormat === QueryTimeFormat.A_12_HOUR
                  ? "border-[#2E2C6F]"
                  : "border-gray-400"
              }`}
            >
              {preferences.timeFormat === QueryTimeFormat.A_12_HOUR && (
                <span className="w-2 h-2 bg-[#2E2C6F] rounded-full" />
              )}
            </span>
          </label>
        </div>
      </div>

      {/* Date format */}
      <div>
        <label className="block mb-2 font-medium">Date Format</label>
        {errors.dateFormat && (
          <p className="mb-1 text-sm text-red-600">{errors.dateFormat}</p>
        )}
        <div className="flex gap-4">
          <label
            className={`flex items-center gap-2 px-4 py-2 border rounded-lg cursor-pointer ${
              preferences.dateFormat === DateFormat.MM_DD_YYYY
                ? "border-[#2E2C6F] text-[#2E2C6F]"
                : "border-gray-300"
            } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <input
              type="radio"
              name="dateFormat"
              value={DateFormat.MM_DD_YYYY}
              checked={preferences.dateFormat === DateFormat.MM_DD_YYYY}
              onChange={() =>
                setPreferences({
                  ...preferences,
                  dateFormat: DateFormat.MM_DD_YYYY,
                })
              }
              className="hidden"
              disabled={loading}
            />
            mm/dd/yyyy
            <span
              className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                preferences.dateFormat === DateFormat.MM_DD_YYYY
                  ? "border-[#2E2C6F]"
                  : "border-gray-400"
              }`}
            >
              {preferences.dateFormat === DateFormat.MM_DD_YYYY && (
                <span className="w-2 h-2 bg-[#2E2C6F] rounded-full" />
              )}
            </span>
          </label>
          <label
            className={`flex items-center gap-2 px-4 py-2 border rounded-lg cursor-pointer ${
              preferences.dateFormat === DateFormat.DD_MM_YYYY
                ? "border-[#2E2C6F] text-[#2E2C6F]"
                : "border-gray-300"
            } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <input
              type="radio"
              name="dateFormat"
              value={DateFormat.DD_MM_YYYY}
              checked={preferences.dateFormat === DateFormat.DD_MM_YYYY}
              onChange={() =>
                setPreferences({
                  ...preferences,
                  dateFormat: DateFormat.DD_MM_YYYY,
                })
              }
              className="hidden"
              disabled={loading}
            />
            dd/mm/yyyy
            <span
              className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                preferences.dateFormat === DateFormat.DD_MM_YYYY
                  ? "border-[#2E2C6F]"
                  : "border-gray-400"
              }`}
            >
              {preferences.dateFormat === DateFormat.DD_MM_YYYY && (
                <span className="w-2 h-2 bg-[#2E2C6F] rounded-full" />
              )}
            </span>
          </label>
        </div>
      </div>

      <button
        type="submit"
        className="bg-[#2E2C6F] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#3a388a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={loading}
      >
        {loading ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
}
