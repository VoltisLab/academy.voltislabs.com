"use client"
import React, { useState } from 'react';
import { X, Search, Clock, Plus, CheckCircle } from 'lucide-react';
import { signIn, useSession } from 'next-auth/react';
import { useCoursesData } from '@/services/useCourseDataService';
import { uploadAndDownloadIcsFile } from '@/services/fileUploadService';
import CourseReminderService from '@/services/courseReminderService';


type ModalStep = 1 | 2 | 3;
type FrequencyType = "Daily" | "Weekly" | "Once";

interface LearningReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const dayMap: Record<string, string> = {
  Su: "SUNDAY",
  Mo: "MONDAY",
  Tu: "TUESDAY",
  We: "WEDNESDAY",
  Th: "THURSDAY",
  Fr: "FRIDAY",
  Sa: "SATURDAY",
};
const LearningReminderModal: React.FC<LearningReminderModalProps> = ({ isOpen, onClose }) => {
  const [modalStep, setModalStep] = useState<ModalStep>(1);
  const [reminderName, setReminderName] = useState<string>("Learning reminder");
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [courseId, setCourseId] = useState<string | null>("")
  const [frequency, setFrequency] = useState<FrequencyType>("Daily");
  const [reminderTime, setReminderTime] = useState<string>("12:00 PM");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const { data: session, update: updateSession } = useSession();
  const [loading, setLoading] = useState(false);
  const [googleCalendarEventId, setGoogleCalendarEventId] = useState<string | null>(null);

  const [calendarService, setCalendarService] = useState<"GOOGLE" | "APPLE" | "OUTLOOK"> ("GOOGLE")
  const [success, setSuccess] = useState<{
  google: boolean;
  apple: boolean;
  outlook: boolean;
}>({
  google: false,
  apple: false,
  outlook: false,
});
const [icUrl, setIcUrl] = useState<string | undefined>("")
const [icId, setIcId] = useState("")

const { createLearningReminder } = CourseReminderService();

// console.log("session===",session?.accessToken); // Should not be undefined!


  const start = selectedDate
  ? `${selectedDate}T${to24HrTime(reminderTime)}`
  : new Date().toISOString().slice(0, 16);

const end = new Date(new Date(start).getTime() + 60 * 60 * 1000)
  .toISOString()
  .slice(0, 16);

  //rest function
function resetModalState() {
  setModalStep(1);
  setReminderName("Learning reminder");
  setSelectedCourse(null);
  setCourseId(null);
  setFrequency("Daily");
  setReminderTime("12:00 PM");
  setSelectedDate("");
  setSelectedDays([]);
  setSuccess({ google: false, apple: false, outlook: false });
  setIcUrl("");
  setIcId("");
  setGoogleCalendarEventId(null); // 👈 Reset Google Calendar event ID
  setLoading(false);
}
  const { instructorCourses} = useCoursesData()
  const topThree = instructorCourses.slice(0, 3);


  console.log("instructor===", topThree)
  function to24HrTime(time12: string) {
  // Example input: "12:00 PM", "09:30 AM"
  const [time, ampm] = time12.split(" ");
  let [hour, minute] = time.split(":").map(Number);

  if (ampm === "PM" && hour !== 12) hour += 12;
  if (ampm === "AM" && hour === 12) hour = 0;

  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

 const handleAddToGoogleCalendar = async () => {
  if (!session) {
    await signIn("google", {
      callbackUrl: window.location.href,
      redirect: false,
    });
    setTimeout(() => {
      updateSession();
    }, 2000);
    return;
  }
  setLoading(true);

  const startDate = selectedDate
    ? `${selectedDate}T${to24HrTime(reminderTime)}:00`
    : new Date().toISOString();
  const endDate = new Date(new Date(startDate).getTime() + 60 * 60 * 1000).toISOString();

  let recurrence = "";
  if (frequency === "Daily") recurrence = "RRULE:FREQ=DAILY";
  if (frequency === "Weekly" && selectedDays.length > 0) {
    const map: any = {
      Su: "SU",
      Mo: "MO",
      Tu: "TU",
      We: "WE",
      Th: "TH",
      Fr: "FR",
      Sa: "SA",
    };
    recurrence = `RRULE:FREQ=WEEKLY;BYDAY=${selectedDays
      .map((d) => map[d])
      .join(",")}`;
  }

  const res = await fetch("/api/google-calendar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "same-origin",
    body: JSON.stringify({
      summary: reminderName,
      description:
        selectedCourse && selectedCourse !== "none"
          ? `Course: ${selectedCourse}`
          : "Learning Reminder",
      start: startDate,
      end: endDate,
      recurrence: recurrence || undefined,
    }),
  });

  const data = await res.json();
  setLoading(false);
  
  if (res.ok) {
    console.log("Google Calendar response:", data);
    
    // Store the Google Calendar event ID
    setGoogleCalendarEventId(data.id); // 👈 This is the key addition
    
    setSuccess((prev) => ({ ...prev, google: true }));
  } else {
    alert(
      "Failed to add event: " + (data.error?.message || JSON.stringify(data))
    );
  }
};


//   function downloadICS({
//   title,
//   description,
//   startDate,
//   endDate,
// }: {
//   title: string;
//   description: string;
//   startDate: string; // "YYYY-MM-DDTHH:mm"
//   endDate: string;   // "YYYY-MM-DDTHH:mm"
// }) {
//   const pad = (n: number) => n.toString().padStart(2, "0");
//   // Convert local datetime to UTC in format YYYYMMDDTHHmmssZ
//   function toUTC(dateString: string) {
//     const date = new Date(dateString);
//     return (
//       date.getUTCFullYear() +
//       pad(date.getUTCMonth() + 1) +
//       pad(date.getUTCDate()) +
//       "T" +
//       pad(date.getUTCHours()) +
//       pad(date.getUTCMinutes()) +
//       pad(date.getUTCSeconds()) +
//       "Z"
//     );
//   }
//   const dtStart = toUTC(startDate);
//   const dtEnd = toUTC(endDate);

//   const icsContent =
//     `BEGIN:VCALENDAR\r\n` +
//     `VERSION:2.0\r\n` +
//     `CALSCALE:GREGORIAN\r\n` +
//     `BEGIN:VEVENT\r\n` +
//     `SUMMARY:${title}\r\n` +
//     `DESCRIPTION:${description}\r\n` +
//     `DTSTART:${dtStart}\r\n` +
//     `DTEND:${dtEnd}\r\n` +
//     `END:VEVENT\r\n` +
//     `END:VCALENDAR`;

//   // Create Blob and trigger download
//   const blob = new Blob([icsContent], { type: "text/calendar" });
//   const url = URL.createObjectURL(blob);

//   const link = document.createElement("a");
//   link.href = url;
//   link.download = `${title.replace(/\s+/g, "_")}.ics`;
//   document.body.appendChild(link);
//   link.click();
//   document.body.removeChild(link);
//   URL.revokeObjectURL(url);
// }

const downloadICS = async({
    title,
    description,
    startDate,
    endDate,
}: {
  title: string;
  description: string;
  startDate: string; // "YYYY-MM-DDTHH:mm"
  endDate: string;   // "YYYY-MM-DDTHH:mm"
})=>{
  const url = await uploadAndDownloadIcsFile({
  title,
  description,
  startDate,
  endDate,
});

setIcId(url?.eventId)
setIcUrl(url?.fileUrl ?? undefined)
console.log("ICS file uploaded to:", url);
}



  const handleNext = () => {
    if (modalStep < 3) {
      setModalStep((modalStep + 1) as ModalStep);
    } else {
      onClose();
    }
  };

  const handlePrevious = () => {
    if (modalStep > 1) {
      setModalStep((modalStep - 1) as ModalStep);
    }
  };

  const handleFrequencyChange = (newFrequency: FrequencyType) => {
    setFrequency(newFrequency);
  };

  const toggleDay = (day: string) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((d) => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

async function handleSetReminder() {
  // Validation logic...
  if (selectedCourse !== "none" && !courseId) {
    alert("Please select a course or choose 'None'");
    return;
  }

  if (frequency === "Weekly" && selectedDays.length === 0) {
    alert("Please select at least one day for weekly reminders");
    return;
  }

  if (frequency === "Once" && !selectedDate) {
    alert("Please select a date for one-time reminders");
    return;
  }

  let loading = false;
  let error = null;

  // Determine which service event ID to use based on selected calendar service
  let serviceEventId = undefined;
  if (calendarService === "GOOGLE" && googleCalendarEventId) {
    serviceEventId = googleCalendarEventId;
  } else if ((calendarService === "APPLE" || calendarService === "OUTLOOK") && icId) {
    serviceEventId = icId;
  }

  console.log("Submitting with service event ID:", serviceEventId);
  console.log("Calendar service:", calendarService);

  const result = await createLearningReminder({
    calendarService,
    description: selectedCourse,
    schedule: {
      ...(selectedDate && { date: selectedDate }),
      days: frequency === "Weekly" ? selectedDays.map((d) => dayMap[d]) : undefined,
      frequency: frequency.toUpperCase(),
      time: to24HrTime(reminderTime),
    },
    course:  Number(courseId),
    icsFile: icUrl,
    serviceEventId: serviceEventId, // 👈 Use the appropriate event ID
    setLoading: (v) => loading = v,
    setError: (e) => error = e,
  });

  if (result.success) {
    alert("Reminder created!");
    resetModalState();
    onClose();
  } else {
    alert("Failed to create reminder.");
    console.error("Error creating reminder:", error);
  }
}



  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[10000] backdrop-blur-sm bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg w-full max-w-xl shadow-lg">
        <div className="p-4 flex justify-between items-center border-b border-gray-200">
          <h2 className="text-lg font-medium">Learning reminders</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-4">
              Step {modalStep} of 3
            </p>
          </div>

          {modalStep === 1 && (
            <>
              <div className="mb-6">
                <div className="flex justify-between items-center mb-1">
                  <label className="block font-medium">Name</label>
                  <span className="text-sm text-gray-500">optional</span>
                </div>
                <input
                  type="text"
                  value={reminderName}
                  onChange={(e) => setReminderName(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-purple-500"
                  placeholder="Learning reminder"
                />
              </div>

              <div>
                <p className="font-medium mb-2">Attach content (optional)</p>
                <p className="text-sm text-gray-600 mb-3">
                  Most recent courses or labs:
                </p>

                <div className="mb-3">
                  {
                    topThree?.map((item:any, index:number) => (
                      <label key={index} className="flex items-center space-x-2 mb-2">
                        <input
                          type="radio"
                          name="course"
                          value="course"
                          checked={selectedCourse === item?.title}
                          onChange={() => 
                          {
                            setSelectedCourse(item?.title)
                            setCourseId(item?.id)
                          }

                          }
                          className="text-purple-600"
                        />
                        <span className="text-sm">
                          Course: {item?.title}
                        </span>
                      </label>

                    ))
                  }

                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="course"
                      value="none"
                      checked={selectedCourse === "none"}
                      onChange={() => setSelectedCourse("none")}
                      className="text-purple-600"
                    />
                    <span className="text-sm">None</span>
                  </label>
                </div>

                <div className="relative mb-4">
                  <input
                    type="text"
                    placeholder="Search"
                    className="w-full p-3 pl-10 border border-gray-300 rounded"
                  />
                  <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
                </div>
              </div>
            </>
          )}

          {modalStep === 2 && (
            <>
              <div className="mb-6">
                <p className="font-medium mb-3">Frequency</p>
                <div className="flex space-x-3">
                  <button
                    className={`px-4 py-2 rounded-full border ${
                      frequency === "Daily"
                        ? "bg-purple-100 border-purple-300"
                        : "border-gray-300"
                    }`}
                    onClick={() => handleFrequencyChange("Daily")}
                    type="button"
                  >
                    {frequency === "Daily" && <span className="mr-1">✓</span>}
                    Daily
                  </button>
                  <button
                    className={`px-4 py-2 rounded-full border ${
                      frequency === "Weekly"
                        ? "bg-purple-100 border-purple-300"
                        : "border-gray-300"
                    }`}
                    onClick={() => handleFrequencyChange("Weekly")}
                    type="button"
                  >
                    {frequency === "Weekly" && (
                      <span className="mr-1">✓</span>
                    )}
                    Weekly
                  </button>
                  <button
                    className={`px-4 py-2 rounded-full border ${
                      frequency === "Once"
                        ? "bg-purple-100 border-purple-300"
                        : "border-gray-300"
                    }`}
                    onClick={() => handleFrequencyChange("Once")}
                    type="button"
                  >
                    {frequency === "Once" && <span className="mr-1">✓</span>}
                    Once
                  </button>
                </div>
              </div>

              <div className="mb-6">
                <p className="font-medium mb-3">Time</p>
                <div className="relative">
                  <input
                    type="text"
                    value={reminderTime}
                    onChange={(e) => setReminderTime(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md"
                  />
                  <Clock className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 transform -translate-y-1/2" />
                </div>
              </div>

              {frequency === "Weekly" && (
                <div className="mb-6">
                  <p className="font-medium mb-3">Day</p>
                  <div className="flex space-x-2">
                    {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                      <button
                        key={day}
                        type="button"
                        className={`h-10 w-10 rounded-full border flex items-center justify-center ${
                          selectedDays.includes(day)
                            ? "bg-purple-100 border-purple-300"
                            : "border-gray-300"
                        }`}
                        onClick={() => toggleDay(day)}
                      >
                        <span className="text-sm">
                          {selectedDays.includes(day) ? "✓" : ""} {day}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {frequency === "Once" && (
                <div className="mb-6">
                  <p className="font-medium mb-3">Date</p>
                  <div className="relative">
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      placeholder="MM/DD/YYYY"
                      className="w-full p-3 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>
              )}
            </>
          )}

          {modalStep === 3 && (
  <>
    <div className="flex space-x-3 mb-4">
      {/* Google Calendar */}
      <button
        type="button"
        disabled={loading}
        className="flex items-center px-4 py-2 border border-purple-600 text-purple-600 rounded relative"
        onClick={async () => {
          setCalendarService("GOOGLE")
          await handleAddToGoogleCalendar();
          // setSuccess((prev) => ({ ...prev, google: true }));
        }}
      >
        {/* Google SVG icon */}
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="#673ab7">
          <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z" />
        </svg>
        <span className="ml-2">
          {session ? "Add to Google Calendar" : "Sign in with Google"}
        </span>
        {success.google && (
          <CheckCircle className="ml-2 text-green-500 w-5 h-5" />
        )}
      </button>

      {/* Apple Calendar */}
      <button
        type="button"
        className="flex items-center px-4 py-2 border border-gray-300 rounded relative"
        onClick={() => {
          setCalendarService("APPLE")
          downloadICS({
            title: reminderName || "Learning Reminder",
            description: selectedCourse && selectedCourse !== "none"
              ? `Course: ${selectedCourse}`
              : "Learning Reminder",
            startDate: start,
            endDate: end,
          });
          setSuccess((prev) => ({ ...prev, apple: true }));
        }}
      >
        {/* Apple icon */}
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.71,19.5C17.88,20.74 17,21.95 15.66,21.97C14.32,22 13.89,21.18 12.37,21.18C10.84,21.18 10.37,21.95 9.1,22C7.79,22.05 6.8,20.68 5.96,19.47C4.25,17 2.94,12.45 4.7,9.39C5.57,7.87 7.13,6.91 8.82,6.88C10.1,6.86 11.32,7.75 12.11,7.75C12.89,7.75 14.37,6.68 15.92,6.84C16.57,6.87 18.39,7.1 19.56,8.82C19.47,8.88 17.39,10.1 17.41,12.63C17.44,15.65 20.06,16.66 20.09,16.67C20.06,16.74 19.67,18.11 18.71,19.5M13,3.5C13.73,2.67 14.94,2.04 15.94,2C16.07,3.17 15.6,4.35 14.9,5.19C14.21,6.04 13.07,6.7 11.95,6.61C11.8,5.46 12.36,4.26 13,3.5Z" />
        </svg>
        <span className="ml-2">Apple</span>
        {success.apple && (
          <CheckCircle className="ml-2 text-green-500 w-5 h-5" />
        )}
      </button>

      {/* Outlook Calendar */}
      <button
        type="button"
        className="flex items-center px-4 py-2 border border-gray-300 rounded relative"
        onClick={() => {
          setCalendarService("OUTLOOK")
          downloadICS({
            title: reminderName || "Learning Reminder",
            description: selectedCourse && selectedCourse !== "none"
              ? `Course: ${selectedCourse}`
              : "Learning Reminder",
            startDate: start,
            endDate: end,
          });
          setSuccess((prev) => ({ ...prev, outlook: true }));
        }}
      >
        {/* Outlook icon */}
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M21.386 12.000c0-1.197-.22-2.403-.662-3.557-.43-1.113-1.057-2.145-1.876-3.022-.8-.86-1.762-1.53-2.816-1.989-1.088-.472-2.229-.704-3.383-.704h-.297c-1.154 0-2.295.232-3.383.704-1.054.459-2.016 1.129-2.816 1.989-.819.877-1.446 1.909-1.876 3.022-.442 1.155-.662 2.360-.662 3.557 0 .64.064 1.275.186 1.900.114.59.274 1.174.48 1.729v2.898c0 .193.123.366.307.43.184.063.387.006.522-.143L7.63 17.29c.43.193.88.357 1.338.487.544.155 1.11.244 1.678.264h.303c1.153 0 2.295-.232 3.383-.704 1.053-.46 2.016-1.13 2.815-1.99.82-.876 1.446-1.908 1.876-3.02.442-1.155.663-2.36.663-3.558zM8.46 11.991c0-.568.456-1.031 1.015-1.031.56 0 1.015.463 1.015 1.031 0 .567-.455 1.031-1.015 1.031-.56 0-1.015-.464-1.015-1.031zm3.015 0c0-.568.456-1.031 1.015-1.031.56 0 1.015.463 1.015 1.031 0 .567-.455 1.031-1.015 1.031-.56 0-1.015-.464-1.015-1.031zm3.016 0c0-.568.455-1.031 1.015-1.031.559 0 1.015.463 1.015 1.031 0 .567-.456 1.031-1.015 1.031-.56 0-1.015-.464-1.015-1.031z" />
        </svg>
        <span className="ml-2">Outlook</span>
        {success.outlook && (
          <CheckCircle className="ml-2 text-green-500 w-5 h-5" />
        )}
      </button>
    </div>
  </>
)}
        </div>

        <div className="px-6 pb-6 flex justify-end">
          {modalStep > 1 && (
            <button
              onClick={handlePrevious}
              className="mr-3 text-purple-600 font-medium"
              type="button"
            >
              Previous
            </button>
          )}

          {modalStep < 3 ? (
            <button
              onClick={handleNext}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded"
              type="button"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSetReminder}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded"
              type="button"
            >
              Done
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LearningReminderModal;