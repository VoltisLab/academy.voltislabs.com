"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, List, Calendar as CalendarIcon, Link as LinkIcon, ChevronDown } from "lucide-react"
import Image from "next/image"

interface CalendarEvent {
  id: string
  date: string
  time: string
  title: string
  description?: string
  meetingLink?: string
  image?: string
}

interface EventModalProps {
  event: CalendarEvent | null
  isOpen: boolean
  onClose: () => void
}

function EventModal({ event, isOpen, onClose }: EventModalProps) {
  const [showDropdown, setShowDropdown] = useState(false)

  if (!isOpen || !event) return null

  const formatEventDate = (dateStr: string, time: string) => {
    const date = new Date(dateStr)
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    
    const dayName = dayNames[date.getDay()]
    const month = monthNames[date.getMonth()]
    const day = date.getDate()
    const suffix = ['th', 'st', 'nd', 'rd'][day % 10 > 3 ? 0 : (day % 100 - day % 10 != 10 ? 1 : 0)] || 'th'
    
    return `${dayName}, ${month} ${day}${suffix} @ ${time} - ${time.split(':')[0]}:${parseInt(time.split(':')[1]) + 30}pm`
  }

  const calendarOptions = [
    'Google',
    'Apple',
    'Yahoo',
    'Outlook',
    'Outlook.com'
  ]

  const handleAddToCalendar = (option: string) => {
    console.log(`Adding to ${option} calendar`)
    setShowDropdown(false)
    // Here you would implement the actual calendar integration
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div 
      className="fixed inset-0 bg-transparent backdrop-blur-xs bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg max-w-xs w-full max-h-[100vh] shadow-lg">
        {/* Upper Section - Visual Banner */}
        <div className="relative h-40 bg-gradient-to-br from-blue-900 to-blue-700">
          <Image
            src="https://ext.same-assets.com/637669732/1603192324.jpeg"
            alt="Liam Ottley"
            fill
            className="absolute inset-0 w-full h-full object-cover"
          />
          
        </div>

        {/* Lower Section - Event Details */}
        <div className="px-6 pb-6 pt-4">
          {/* Event Title */}
          <h2 className="text-lg font-bold text-gray-900 mb-2">{event.title}</h2>

          {/* Date & Time */}
          <div className="flex items-center gap-2 ">
            <CalendarIcon className="w-4 h-4 text-gray-800" />
            <span className="text-xs text-gray-800 font-bold">
              {formatEventDate(event.date, event.time)}
            </span>
          </div>

          {/* Timezone */}
          <div className="text-xs text-gray-500 mb-2 ml-6">Lagos time</div>

          {/* Meeting Link */}
          {event.meetingLink && (
            <div className="flex items-center gap-2 mb-2">
              <LinkIcon className="w-4 h-4 text-gray-500" />
              <a
                href={event.meetingLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                {event.meetingLink}
              </a>
            </div>
          )}

          {/* Description */}
          <p className="text-xs text-gray-700 mb-2 leading-relaxed">
            {event.description || "Questions & Answers with Liam Ottley, creator of the AAA model, founder and CEO of Morningside AI. Benefit from his 6+ years experience running online businesses and 2+ years specialized in AI business from AAA to SaaS to Education."}
          </p>

          {/* Add to Calendar Button with Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setShowDropdown(!showDropdown)}
              className="w-full bg-blue-700 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded flex items-center justify-center gap-2 transition-colors"
            >
              <CalendarIcon className="w-4 h-4" />
              <span className="text-xs">ADD TO CALENDAR</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {showDropdown && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-28 overflow-y-auto">
                {calendarOptions.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAddToCalendar(option)}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                  >
                    <span className="text-sm font-medium text-gray-900">{option}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 6, 1)) // July 2025
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar')
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Sample events data with more details
  const events: CalendarEvent[] = [
    { 
      id: "1", 
      date: "2025-06-30", 
      time: "5:30pm", 
      title: "Q&A w/ Liam Ottley",
      meetingLink: "https://meet.google.com/srb-ptch-umi",
      description: "Questions & Answers with Liam Ottley, creator of the AAA model, founder and CEO of Morningside AI. Benefit from his 6+ years experience running online businesses and 2+ years specialized in AI business from AAA to SaaS to Education."
    },
    { 
      id: "2", 
      date: "2025-07-07", 
      time: "3pm", 
      title: "90-Minute Q&A Session",
      meetingLink: "https://meet.google.com/abc-def-ghi"
    },
    { 
      id: "3", 
      date: "2025-07-08", 
      time: "5:30pm", 
      title: "Q&A w/ Liam Ottley",
      meetingLink: "https://meet.google.com/srb-ptch-umi"
    },
  ]

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay() + 1) // Start from Monday
    
    const days = []
    const current = new Date(startDate)
    
    while (current <= lastDay || days.length < 42) {
      days.push(new Date(current))
      current.setDate(current.getDate() + 1)
    }
    
    return days
  }

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0]
  }

  const getEventsForDate = (date: Date) => {
    const dateStr = formatDate(date)
    return events.filter(event => event.date === dateStr)
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth() && date.getFullYear() === currentDate.getFullYear()
  }

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedEvent(null)
  }

  const days = getDaysInMonth(currentDate)
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]

  return (
    <div className="min-h-screen ">
      <div className="max-w-[1085px] mx-auto bg-white rounded-lg border border-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 px-6 pt-6">
          {/* Left side */}
          <div className="flex items-center gap-4">
            <button
              onClick={goToToday}
              className="px-4 py-2 text-xs rounded-full text-gray-400 border border-gray-200 hover:bg-[#909090] hover:text-white transition-colors "
            >
              Today
            </button>
          </div>

          {/* Center - Month Navigation */}
          <div className="flex items-center gap-4">
            <button
              onClick={goToPreviousMonth}
              className="p-2 hover:bg-gray-200 rounded-full transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-400" />
            </button>
            
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h1>
              <p className="text-sm text-gray-500">
                {new Date().toLocaleTimeString('en-US', { 
                  hour: 'numeric', 
                  minute: '2-digit',
                  hour12: true 
                })} Lagos time
              </p>
            </div>

            <button
              onClick={goToNextMonth}
              className="p-2 hover:bg-gray-200 rounded-full transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Right side - View toggles */}
          <div className="flex items-center bg-gray-100 rounded-lg border border-gray-200">
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-l-md transition-colors ${
                viewMode !== 'list' ? 'bg-white text-gray-900 ' : 'shadow text-gray-600 hover:text-gray-900'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`p-2 rounded-r-md transition-colors ${
                viewMode !== 'calendar' ? 'bg-white text-gray-900 ' : 'shadow text-gray-600 hover:text-gray-900'
              }`}
            >
              <CalendarIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        {viewMode === 'calendar' && (
          <div className="bg-white border border-gray-200 overflow-hidden">
            {/* Days of the week header */}
            <div className="grid grid-cols-7 border-b border-gray-200">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                <div 
                  key={day} 
                  className={`p-3 text-center text-sm font-bold text-gray-800 ${
                    index < 6 ? 'border-r border-gray-200' : ''
                  }`}
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7">
              {days.map((date, index) => {
                const dayEvents = getEventsForDate(date)
                const isCurrentMonthDay = isCurrentMonth(date)
                const isTodayDate = isToday(date)

                return (
                  <div
                    key={index}
                    className={`min-h-[100px] border-r border-b border-gray-200 p-2 ${
                      !isCurrentMonthDay ? 'bg-gray-50' : 'bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className={`text-sm font-medium ${
                          isCurrentMonthDay ? 'text-gray-900' : 'text-gray-400'
                        }`}
                      >
                        {date.getDate()}
                      </span>
                      {isTodayDate && (
                        <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">
                            {date.getDate()}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Events */}
                    <div className="space-y-1">
                      {dayEvents.map((event) => (
                        <button
                          key={event.id}
                          onClick={() => handleEventClick(event)}
                          className="w-full text-left text-xs hover:underline truncate cursor-pointer text-blue-800 p-1 rounded transition-colors"
                          title={`${event.time} - ${event.title}`}
                        >
                          {event.time} - {event.title}
                        </button>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* List View */}
        {viewMode === 'list' && (
          <div className="space-y-4">
            {events.map((event) => (
              <div key={event.id} className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-4">
                  <div className="text-sm text-gray-500">{event.date}</div>
                  <div className="text-sm font-medium">{event.time}</div>
                  <div className="text-gray-900">{event.title}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Event Modal */}
      <EventModal 
        event={selectedEvent} 
        isOpen={isModalOpen} 
        onClose={closeModal} 
      />
    </div>
  )
} 