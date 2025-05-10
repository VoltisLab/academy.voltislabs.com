"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { BasicInformationForm } from "@/components/instructor/create-new-course/basic-information/BasicInformationForm";
import { AdvanceInformationForm } from "@/components/instructor/create-new-course/advance-information/AdvancedInformation";
import { Curriculum } from "@/components/instructor/create-new-course/curriculum/Curriculum";
import Image from "next/image";

// Define tab interface
interface Tab {
  name: string;
  key: string;
  icon: string;
  progress?: string;
  shortName?: string; // For medium screens with limited space
}

// Tab data
const tabs: Tab[] = [
  { 
    name: "Basic Information", 
    shortName: "Basic", 
    key: "basic", 
    icon: "/icons/Stack.svg", 
    progress: "7/12" 
  },
  { 
    name: "Advanced Information", 
    shortName: "Advanced", 
    key: "advanced", 
    icon: "/icons/ClipboardText.svg" 
  },
  { 
    name: "Curriculum", 
    key: "curriculum", 
    icon: "/icons/MonitorPlay.svg" 
  },
  { 
    name: "Publish Course", 
    shortName: "Publish", 
    key: "publish", 
    icon: "/icons/PlayCircle.svg" 
  },
];

export default function CourseFormTabs() {
  const [activeTab, setActiveTab] = useState("basic");
  const [courseId, setCourseId] = useState<number | null>(null);

  // Get active tab data
  const currentTab = tabs.find(tab => tab.key === activeTab) || tabs[0];
  
  // Function to handle moving to next tab
  const handleNextTab = () => {
    const currentIndex = tabs.findIndex(tab => tab.key === activeTab);
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1].key);
    }
  };

  // Function to handle saving courseId and moving to next tab
  const handleBasicInfoSave = (id: number) => {
    console.log("Course ID received in parent:", id);
    setCourseId(id);
    handleNextTab();
  };

  return (
    <div className="bg-white w-full xl:max-w-[90rem] p-1 mx-auto min-h-screen">
      {/* Mobile Tabs - Horizontally Scrollable */}
      <div className="md:hidden border-b border-gray-200 pb-2">
        <div className="flex items-center overflow-x-auto scrollbar-hide gap-8 px-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "py-3 flex-shrink-0 flex items-center gap-1 whitespace-nowrap text-gray-500 transition-all",
                activeTab === tab.key 
                  ? "text-[#313273] font-bold border-b-2 border-pink-600" 
                  : "font-normal text-sm"
              )}
            >
              <Image
                src={tab.icon}
                alt={tab.name}
                width={18}
                height={18}
                className="object-contain"
              />
              <span>{tab.shortName || tab.name}</span>
              {tab.progress && activeTab === tab.key && (
                <span className="text-green-600 text-xs bg-green-50 px-1.5 py-0.5 rounded-full">
                  {tab.progress}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Desktop Tabs - Full width */}
      <div className="hidden md:flex items-center border-b border-gray-200 px-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "relative py-4 px-2 lg:px-4 text-sm font-medium  border-b-2 border-transparent hover:text-[#313273] transition flex items-center gap-1 lg:gap-2",
              activeTab === tab.key?  "text-[#313273] font-bold border-b-pink-600" : "text-gray-500"
            )}
          >
            <Image
              src={tab.icon}
              alt={tab.name}
              width={20}
              height={20}
              className="object-contain flex-shrink-0"
            />
            <div className="flex items-center gap-1 whitespace-nowrap">
              <span className="hidden lg:inline">{tab.name}</span>
              <span className="lg:hidden">{tab.shortName || tab.name}</span>
              {tab.progress && (
                <span className="text-green-600 text-xs">{tab.progress}</span>
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-2">
        {activeTab === "basic" && <BasicInformationForm onSaveNext={handleBasicInfoSave} />}
        {activeTab === "advanced" && (
          <AdvanceInformationForm 
            onSaveNext={handleNextTab} 
            courseId={courseId || 0} 
          />
        )}
        {activeTab === "curriculum" && (
          <Curriculum 
            onSaveNext={handleNextTab} 
            courseId={courseId || 0} 
          />
        )}
        {activeTab === "publish" && (
          <div>
            <p>Publish Step</p>
            {courseId && <p className="text-sm text-gray-500">Course ID: {courseId}</p>}
          </div>
        )}
      </div>

      {/* Progress indicator for mobile & tablet */}
      <div className="md:hidden px-3 mt-4 mb-2">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Step {tabs.findIndex(tab => tab.key === activeTab) + 1} of {tabs.length}</span>
          {activeTab === "basic" && <span className="text-green-600">7/12 completed</span>}
        </div>
        <div className="w-full bg-gray-200 h-1 mt-2 rounded-full overflow-hidden">
          <div 
            className="bg-pink-600 h-full rounded-full" 
            style={{
              width: `${((tabs.findIndex(tab => tab.key === activeTab) + 1) / tabs.length) * 100}%`
            }}
          />
        </div>
      </div>
    </div>
  );
}