import { Filter, MapPin, Play, Brain, Bot, Trophy, Briefcase, HelpCircle } from "lucide-react"
import { useState } from "react"

interface FilterTab {
  id: string
  label: string
  icon?: React.ReactNode
  count?: number
}

interface FilterTabsProps {
  tabs: FilterTab[]
  activeTab: string
  onTabChange: (tabId: string) => void
}

export default function FilterTabs({ tabs, activeTab, onTabChange }: FilterTabsProps) {
  const [showAllTabs, setShowAllTabs] = useState(false)
  
  // Show only first 4 tabs by default, rest are hidden
  const visibleTabs = tabs.slice(0, 4)
  const hiddenTabs = tabs.slice(4)
  const hasMoreTabs = tabs.length > 4

  return (
    <div className="mb-6">
      {/* First row - always visible tabs */}
      <div className="flex items-center gap-2 mb-2">
        {visibleTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? "bg-gray-200 text-gray-900"
                : "bg-white text-gray-900 hover:bg-gray-50 border border-gray-200"
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {tab.count && (
              <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">
                {tab.count}
              </span>
            )}
          </button>
        ))}
        
        {/* More/Less button */}
        {hasMoreTabs && (
          <button
            onClick={() => setShowAllTabs(!showAllTabs)}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors bg-white text-gray-900 hover:bg-gray-50 border border-gray-200"
          >
            <span>{showAllTabs ? "Less..." : "More..."}</span>
          </button>
        )}

        {/* Filter icon */}
        <div className="flex items-center gap-2 ml-auto">
          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Second row - hidden tabs (only shown when expanded) */}
      {showAllTabs && hasMoreTabs && (
        <div className="flex items-center gap-2">
          {hiddenTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? "bg-gray-200 text-gray-900"
                  : "bg-white text-gray-900 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.count && (
                <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// Predefined tab configurations with exact icons from the image
export const defaultTabs: FilterTab[] = [
  { id: "all", label: "All" },
  { id: "announcements", label: "Announcements", icon: <MapPin className="w-4 h-4 text-red-500" /> },
  { id: "youtube", label: "YouTube Resources", icon: <Play className="w-4 h-4 text-black" /> },
  { id: "business", label: "Business & Strategy", icon: <Brain className="w-4 h-4 text-pink-500" /> },
  { id: "tech", label: "Tech & Tools", icon: <Bot className="w-4 h-4 text-gray-600" /> },
  { id: "wins", label: "Wins", icon: <Trophy className="w-4 h-4 text-yellow-500" /> },
  { id: "jobs", label: "Job Board / Hiring", icon: <Briefcase className="w-4 h-4 text-red-500" /> },
  { id: "help", label: "Ask for Help", icon: <HelpCircle className="w-4 h-4 text-red-500" /> },
] 