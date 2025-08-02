import { CheckCircle, Circle, Play, MessageCircle, Download } from "lucide-react"

interface ChecklistItem {
  id: string
  text: string
  completed: boolean
  icon?: React.ReactNode
}

interface WelcomeChecklistProps {
  title?: string
  items: ChecklistItem[]
  onItemToggle?: (itemId: string) => void
}

export default function WelcomeChecklist({ 
  title = "Welcome! Start here", 
  items, 
  onItemToggle 
}: WelcomeChecklistProps) {
  const completedCount = items.filter(item => item.completed).length
  const progressPercentage = (completedCount / items.length) * 100

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200  mb-6">
      {/* Header with Progress Indicator */}
      <div className="flex items-center gap-4 mb-4 p-4 border-b border-gray-100">
        <div className="relative">
          <div className="w-5 h-5 border-2 border-gray-200 rounded-full flex items-center justify-center" 
          >
            <div 
              className="absolute inset-1 border-2 border-green-500 rounded-full"
              style={{ 
                clipPath: `polygon(50% 50%, 50% 0%, ${50 + (progressPercentage / 100) * 50}% 0%, ${50 + (progressPercentage / 100) * 50}% 50%)` 
              }}
            />
            
          </div>
        </div>
        <h2 className=" font-bold text-gray-900">{title}</h2>
      </div>
      
      {/* Checklist Items */}
      <div className="space-y-1 pb-2">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onItemToggle?.(item.id)}
            className="flex items-center gap-2 px-4 pb-1 w-full text-left rounded-lg hover:underline transition-colors"
          >
            {item.completed ? (
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
            ) : (
              <Circle className="w-5 h-5 text-gray-300 flex-shrink-0" />
            )}
            <span className={`text-sm ${item.completed ? 'text-gray-500 line-through' : 'text-blue-600 font-medium'}`}>
              {item.text}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

// Predefined welcome checklist items
export const defaultWelcomeItems: ChecklistItem[] = [
  {
    id: "intro-video",
    text: "Watch 60 sec intro video",
    completed: false,
    icon: <Play className="w-4 h-4" />
  },
  {
    id: "comment",
    text: "Find a post you like and leave a comment",
    completed: false,
    icon: <MessageCircle className="w-4 h-4" />
  },
  {
    id: "download-app",
    text: "Download app",
    completed: false,
    icon: <Download className="w-4 h-4" />
  }
] 