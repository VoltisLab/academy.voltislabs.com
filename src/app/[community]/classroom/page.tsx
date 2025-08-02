"use client"

import ModuleCard from "@/components/skool/classroom/ModuleCard"

// Sample module data matching the reference image
const modules = [
  {
    id: "1",
    title: "Start Here",
    description: "Begin your journey to creating a profitable and scalable AI business here.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
    progress: 0
  },
  {
    id: "2", 
    title: "The AAA Model",
    description: "Before you dive into building your AAA, you must first understand the model and the...",
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop",
    progress: 0
  },
  {
    id: "3",
    title: "Success Stories", 
    description: "Hear the stories from regular people taking the AAA opportunity and seeing life-changi...",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop",
    progress: 0
  },
  {
    id: "4",
    title: "Mindset",
    description: "Even with the perfect business model and perfect timing, without the right mindset yo...",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop",
    progress: 0
  },
  {
    id: "5",
    title: "AI Foundations",
    description: "Before you start your AI Automation Agency, you need to build a base of AI Automation...",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop",
    progress: 0
  },
  {
    id: "6",
    title: "Launch",
    description: "With your skills, mindset and understanding of the business model, you're ready to pick...",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
    progress: 0
  }
]

export default function ClassroomPage() {
  const handleModuleClick = (moduleId: string) => {
    console.log("Module clicked:", moduleId)
    alert(`Module "${modules.find(m => m.id === moduleId)?.title}" clicked!`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="max-w-[1085px] mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module) => (
            <ModuleCard
              key={module.id}
              {...module}
              onClick={() => handleModuleClick(module.id)}
            />
          ))}
        </div>
      </main>
    </div>
  )
} 