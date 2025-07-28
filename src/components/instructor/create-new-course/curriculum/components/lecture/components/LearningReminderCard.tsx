"use client"
import React, { useState, useRef, useEffect } from "react";
import { Clock, MoreVertical, RefreshCw, Calendar, Apple, Mail } from "lucide-react";
import { LuCalendarDays } from "react-icons/lu";
import { PiInfinity } from "react-icons/pi";
import toast from 'react-hot-toast';

// Add this interface for the deletion ICS function
interface DeleteIcsParams {
  originalEventId: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
}

// Add this function to create deletion ICS file
const createDeletionIcsFile = async ({
  originalEventId,
  title,
  description,
  startDate,
  endDate,
}: DeleteIcsParams) => {
  const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Your App//Learning Reminders//EN
CALSCALE:GREGORIAN
METHOD:CANCEL
BEGIN:VEVENT
UID:${originalEventId}
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTSTART:${new Date(startDate).toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTEND:${new Date(endDate).toISOString().replace(/[-:]/g, '').split('.')[0]}Z
SUMMARY:${title}
DESCRIPTION:${description}
STATUS:CANCELLED
SEQUENCE:1
END:VEVENT
END:VCALENDAR`;

  // Create blob and upload (you'll need to implement the upload part based on your existing service)
  const blob = new Blob([icsContent], { type: 'text/calendar' });
  const file = new File([blob], `delete-reminder-${originalEventId}.ics`, {
    type: 'text/calendar',
  });

  // Upload to your storage service
  const formData = new FormData();
  formData.append('file', file);
  
  try {
    const response = await fetch('/api/upload-ics', {
      method: 'POST',
      body: formData,
    });
    
    const result = await response.json();
    return {
      fileUrl: result.fileUrl,
      eventId: originalEventId,
    };
  } catch (error) {
    console.error('Error uploading deletion ICS:', error);
    throw error;
  }
};

// Alternative: Direct download function
const downloadDeletionIcs = ({
  originalEventId,
  title,
  description,
  startDate,
  endDate,
}: DeleteIcsParams) => {
  const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Your App//Learning Reminders//EN
CALSCALE:GREGORIAN
METHOD:CANCEL
BEGIN:VEVENT
UID:${originalEventId}
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTSTART:${new Date(startDate).toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTEND:${new Date(endDate).toISOString().replace(/[-:]/g, '').split('.')[0]}Z
SUMMARY:${title}
DESCRIPTION:${description}
STATUS:CANCELLED
SEQUENCE:1
END:VEVENT
END:VCALENDAR`;

  // Create download link
  const blob = new Blob([icsContent], { type: 'text/calendar' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `delete-reminder-${originalEventId}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Icons for different calendar services
const GoogleIcon = () => (
  <svg width="28" height="28" viewBox="0 0 20 20" className="mr-2 -ml-1">
    <g>
      <path fill="#4285F4" d="M19.6 10.2c0-.7-.1-1.3-.2-1.9H10v3.6h5.5c-.2 1.1-.9 2.1-1.9 2.7v2.2h3c1.7-1.5 2.7-3.7 2.7-6.6z"/>
      <path fill="#34A853" d="M10 20c2.5 0 4.6-.8 6.1-2.1l-3-2.2c-.8.6-1.8 1-3.1 1-2.4 0-4.5-1.6-5.2-3.8H1.7v2.4C3.2 18.7 6.4 20 10 20z"/>
      <path fill="#FBBC05" d="M4.8 12c-.2-.6-.4-1.3-.4-2s.2-1.4.4-2V5.6H1.7C1.2 6.6 1 7.7 1 9c0 1.3.2 2.4.7 3.4l3.1-2.4z"/>
      <path fill="#EA4335" d="M10 4c1.4 0 2.6.5 3.5 1.4l2.6-2.6C14.6 1.1 12.5 0 10 0 6.4 0 3.2 1.3 1.7 5.6l3.1 2.4C5.5 6.6 7.6 4 10 4z"/>
    </g>
  </svg>
);

const AppleIcon = () => (
  <svg width="32" height="32" viewBox="0 0 20 20" className="mr-2 -ml-1">
    <g>
      <path fill="#000000" d="M15.6,10.5c0-2.1,1.8-3.1,1.9-3.1c-1-1.5-2.5-1.7-3-1.7c-1.3-0.1-2.5,0.7-3.1,0.7c-0.6,0-1.6-0.7-2.7-0.7c-1.4,0-2.7,0.8-3.4,2.2c-1.5,2.5-0.4,6.1,1.1,8.1c0.7,1,1.5,2.1,2.5,2.1c1,0,1.4-0.6,2.7-0.6c1.2,0,1.7,0.6,2.7,0.6c1,0,1.6-1,2.2-2c0.7-1,1-2.1,1-2.2C17.6,14,15.6,13.3,15.6,10.5z"/>
      <path fill="#000000" d="M13.5,5.2c0.6-0.8,1-1.9,0.8-3.1c-0.7,0-2,0.5-2.6,1.3c-0.6,0.7-1.1,1.8-0.9,2.8C11.6,6.4,12.9,6.1,13.5,5.2z"/>
    </g>
  </svg>
);

const OutlookIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" className="mr-2 -ml-1">
    <g>
      <rect x="6" y="10" width="20" height="14" rx="2" fill="#0072C6"/>
      <rect x="9" y="15" width="13" height="7" rx="1.3" fill="#fff"/>
      <path d="M23 5.5H10c-1.1 0-2 .9-2 2v17c0 1.1.9 2 2 2h13c1.1 0 2-.9 2-2V7.5c0-1.1-.9-2-2-2zm-9.5 16.3c-.7 0-1.2-.6-1.2-1.3 0-.8.5-1.3 1.2-1.3.7 0 1.2.6 1.2 1.3 0 .7-.5 1.3-1.2 1.3zm5.5 0c-.7 0-1.2-.6-1.2-1.3 0-.8.5-1.3 1.2-1.3.7 0 1.2.6 1.2 1.3 0 .7-.5 1.3-1.2 1.3zm5.5 0c-.7 0-1.2-.6-1.2-1.3 0-.8.5-1.3 1.2-1.3.7 0 1.2.6 1.2 1.3 0 .7-.5 1.3-1.2 1.3z" fill="#0072C6"/>
      <path d="M7.5 10l5.9-5.5h9.1c1.1 0 2 .9 2 2v2.7L24.5 10h-17z" fill="#1B87CF"/>
      <path d="M24.5 10l4.5 3.2v8.7c0 1.1-.9 2-2 2H7.5V10h17z" fill="#0072C6"/>
      <path d="M13 14.6l1.4 1.5-1.4 1.5h6l-1.4-1.5 1.4-1.5h-6z" fill="#fff"/>
    </g>
  </svg>
);

function getCalendarIcon(service: string) {
  if (service === "GOOGLE") return <GoogleIcon />;
  if (service === "APPLE") return <AppleIcon />;
  if (service === "OUTLOOK") return <OutlookIcon />;
  return <Calendar className="w-5 h-5 mr-1.5" />;
}

function getServiceLabel(service: string) {
  if (service === "GOOGLE") return "Added to Google Calendar";
  if (service === "APPLE") return "Added to Apple Calendar";
  if (service === "OUTLOOK") return "Added to Outlook";
  return "Added to Calendar";
}

function formatTime(time: string) {
  if (!time) return "";
  const [hour, minute] = time.split(":");
  const h = parseInt(hour);
  const m = minute;
  const ampm = h >= 12 ? "PM" : "AM";
  const displayHour = h % 12 === 0 ? 12 : h % 12;
  return `${displayHour}:${m} ${ampm}`;
}

function formatFrequency(schedule: any) {
  if (schedule.frequency === "DAILY") return "Daily";
  if (schedule.frequency === "WEEKLY") {
    if (schedule.days?.length) {
      return ` ${schedule.days.map((d: string) => d.slice(0, 2)).join(", ")}`;
    }
    return "Weekly";
  }
  if (schedule.frequency === "ONCE" && schedule.date) {
    return `${schedule.date}`;
  }
  return schedule.frequency;
}

const LearningReminderMenu = ({
  show,
  onClose,
  onEdit,
  onDelete,
  onSync,
  data,
  anchorRef,
  onOpenLearningModal,
}: {
  show: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: (reminderId: number) => void | Promise<void>;
  onSync: () => void;
  data: any;
  anchorRef: React.RefObject<HTMLButtonElement> | null;
  onOpenLearningModal: any
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const listener = (event: MouseEvent) => {
      if (!menuRef.current || menuRef.current.contains(event.target as Node)) return;
      onClose();
    };
    document.addEventListener("mousedown", listener);
    return () => document.removeEventListener("mousedown", listener);
  }, [menuRef, onClose]);

  const handleEditClick = () => {
    localStorage.setItem("remiderEdit", JSON.stringify(data));
    onOpenLearningModal();
  };

  // Helper function to convert time format and create dates
  const createEventDates = (schedule: any) => {
    const time = schedule.time || "12:00:00";
    const [hour, minute] = time.split(":");
    
    let startDate: Date;
    if (schedule.date) {
      // For one-time events, use the specific date
      startDate = new Date(`${schedule.date}T${time}`);
    } else {
      // For recurring events, use today's date
      startDate = new Date();
      startDate.setHours(parseInt(hour), parseInt(minute), 0, 0);
    }
    
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // Add 1 hour
    
    return {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString()
    };
  };

  const handleDeleteWithICS = async () => {
    const loadingToastId = toast.loading('Preparing deletion...', {
      duration: 0,
    });

    try {
      // For Apple and Outlook calendars, create deletion ICS file
      if ((data.calendarService === "APPLE" || data.calendarService === "OUTLOOK") && data.serviceEventId) {
        const { startDate, endDate } = createEventDates(data.schedule);
        
        try {
          // Option 1: Upload deletion file (if you have upload service)
          const deletionFile = await createDeletionIcsFile({
            originalEventId: data.serviceEventId,
            title: data.description || "Learning Reminder",
            description: data.course?.title ? `Course: ${data.course.title}` : "Learning Reminder",
            startDate,
            endDate,
          });

          toast.dismiss(loadingToastId);
          
          // Show success message with download link
          toast.success(
            <div>
              <p>Deletion file ready!</p>
              <a 
                href={deletionFile.fileUrl} 
                download 
                className="text-blue-600 underline text-sm"
              >
                Download deletion file
              </a>
            </div>,
            {
              duration: 8000,
              icon: '📄',
            }
          );
        } catch (uploadError) {
          // If upload fails, fall back to direct download
          console.warn('Upload failed, using direct download:', uploadError);
          
          downloadDeletionIcs({
            originalEventId: data.serviceEventId,
            title: data.description || "Learning Reminder",
            description: data.course?.title ? `Course: ${data.course.title}` : "Learning Reminder",
            startDate,
            endDate,
          });

          toast.dismiss(loadingToastId);
          toast.success("Deletion file downloaded! Import it to your calendar to remove the event.", {
            duration: 6000,
            icon: '📄',
          });
        }
      } else if (data.calendarService === "GOOGLE") {
        // For Google Calendar, the deletion will be handled via API in the backend
        toast.dismiss(loadingToastId);
        toast.loading('Deleting Google Calendar event...', {
          duration: 2000,
        });
      } else {
        toast.dismiss(loadingToastId);
      }

      // Now call the backend delete function
      await onDelete(Number(data.id));
      
    } catch (error) {
      toast.dismiss(loadingToastId);
      toast.error("Failed to prepare deletion. The reminder will still be deleted from your account.", {
        duration: 5000,
        icon: '❌',
      });
      console.error("Error creating deletion ICS:", error);
      
      // Still call delete even if ICS creation fails
      await onDelete(Number(data.id));
    }
  };

  return show ? (
    <div
      ref={menuRef}
      className="absolute z-20 right-4 top-14 bg-white rounded-lg shadow-lg border border-gray-100 min-w-[170px] text-[15px] py-2"
      style={{ minWidth: 170 }}
    >
      <button
        className="w-full text-left px-4 py-2 hover:text-purple-700 hover:bg-purple-50 font-semibold rounded-t-lg"
        onClick={() => {
          handleEditClick();
        }}
      >
        Edit
      </button>
      <button
        className="w-full text-left px-4 py-2 flex items-center hover:text-purple-700 hover:bg-purple-50"
        onClick={async () => {
          await handleDeleteWithICS();
          onClose();
        }}
      >
        {data?.calendarService === "GOOGLE" && getCalendarIcon("GOOGLE")}
        <span className="">Delete</span>
      </button>
      <button
        className="w-full text-left px-4 py-2 flex items-center hover:text-purple-700 hover:bg-purple-50 rounded-b-lg"
        onClick={() => {
          onSync();
          onClose();
        }}
      >
        {data?.calendarService === "GOOGLE" && getCalendarIcon("GOOGLE")}
        <span className=""> {data?.calendarService === "GOOGLE" ? "Sync again" : "Download Again" } </span>
      </button>
    </div>
  ) : null;
};

export default function LearningReminderCard({ 
  data, 
  onDelete, 
  onOpenLearningModal 
}: { 
  data: any, 
  onDelete: (reminderId: number) => void | Promise<void>, 
  onOpenLearningModal: any 
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<any>(null);

  const handleEdit = () => alert(`Edit reminder #${data.id}`);
  const handleDelete = () => alert(`Delete reminder #${data.id}`);
  const handleSync = () => alert(`Sync again reminder #${data.id}`);

  return (
    <div className="border-[1px] border-gray-700 rounded-md p-6 flex flex-col gap-3 shadow-sm bg-white max-w-3xl mx-auto mt-4 relative">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-lg mb-2">Learning Reminder</h3>
          <div className="flex items-center gap-5 mb-2">
            <span className="flex items-center text-gray-700 font-semibold text-base">
              <Clock className="w-5 h-5 mr-1.5" />
              {formatTime(data.schedule?.time)}
            </span>
            <span className="flex items-center text-gray-700 font-semibold text-base">
              {data?.schedule?.frequency === "ONCE" ? 
                <LuCalendarDays className="w-5 h-5 mr-1" /> :
                <PiInfinity className="w-4 h-4 mr-1" />
              }
              {formatFrequency(data.schedule)}
            </span>
          </div>
          <div className="flex items-center text-sm mb-1">
            {getCalendarIcon(data.calendarService)}
            <span className="text-gray-800 font-medium">{getServiceLabel(data.calendarService)}</span>
          </div>
        </div>
        <button
          type="button"
          ref={menuButtonRef}
          className="text-gray-400 hover:bg-gray-100 rounded-full p-1 transition"
          aria-label="Options"
          onClick={() => setMenuOpen((v) => !v)}
        >
          <MoreVertical className="w-5 h-5" />
        </button>
        <LearningReminderMenu
          show={menuOpen}
          onClose={() => setMenuOpen(false)}
          onEdit={handleEdit}
          onSync={handleSync}
          anchorRef={menuButtonRef}
          data={data}
          onDelete={onDelete}
          onOpenLearningModal={onOpenLearningModal}
        />
      </div>
      <div className="text-gray-900 font-semibold text-base mt-1">
        Course: {data.course?.title} : {data.description}
      </div>
    </div>
  );
}