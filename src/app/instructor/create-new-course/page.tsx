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
    progress: "7/12",
  },
  {
    name: "Advanced Information",
    shortName: "Advanced",
    key: "advanced",
    icon: "/icons/ClipboardText.svg",
  },
  {
    name: "Curriculum",
    key: "curriculum",
    icon: "/icons/MonitorPlay.svg",
  },
  {
    name: "Publish Course",
    shortName: "Publish",
    key: "publish",
    icon: "/icons/PlayCircle.svg",
  },
];

export default function CourseFormTabs() {
  const [activeTab, setActiveTab] = useState("basic");
  const [courseId, setCourseId] = useState<number | null>(null);

  // Track completion status of each tab
  const [completedTabs, setCompletedTabs] = useState<Set<string>>(new Set());

  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>(
    {
      basic: false,
      advanced: false,
      curriculum: false,
    }
  );

  // Get active tab data
  const currentTab = tabs.find((tab) => tab.key === activeTab) || tabs[0];

  // Check if a tab is completed
  const isTabCompleted = (tabKey: string) => {
    return completedTabs.has(tabKey);
  };

  // Function to handle tab click
  const handleTabClick = (tabKey: string) => {
    setActiveTab(tabKey);
  };

  // Function to mark current tab as completed and move to next tab
  const handleNextTab = () => {
    // Mark current tab as completed
    setCompletedTabs((prev) => new Set([...prev, activeTab]));

    // Move to next tab if available
    const currentIndex = tabs.findIndex((tab) => tab.key === activeTab);
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1].key);
    }
  };

  // Function to handle saving courseId, mark basic tab as completed, and move to next tab
  const handleBasicInfoSave = (id: number) => {
    console.log("Course ID received in parent:", id);
    setCourseId(id);
    handleNextTab(); // This will mark basic as completed and move to advanced
  };

  // Function to handle advanced info completion
  const handleAdvancedInfoSave = () => {
    handleNextTab(); // Mark advanced as completed and move to curriculum
  };

  // Function to handle curriculum completion
  const handleCurriculumSave = () => {
    handleNextTab(); // Mark curriculum as completed and move to publish
  };

  return (
    <div className="bg-white w-full xl:max-w-[90rem] p-1 mx-auto min-h-screen">
      {/* Mobile Tabs - Horizontally Scrollable */}
      <div className="md:hidden border-b border-gray-200 pb-2">
        <div className="flex items-center overflow-x-auto scrollbar-hide gap-8 px-1">
          {tabs.map((tab) => {
            const isCompleted = isTabCompleted(tab.key);
            const isActive = activeTab === tab.key;

            return (
              <button
                key={tab.key}
                onClick={() => handleTabClick(tab.key)}
                className={cn(
                  "py-3 flex-shrink-0 flex items-center gap-1 whitespace-nowrap transition-all relative",
                  isActive
                    ? "text-[#313273] font-bold border-b-2 border-pink-600"
                    : "text-gray-500 font-normal text-sm hover:text-[#313273]"
                )}
              >
                <div className="relative">
                  <Image
                    src={tab.icon}
                    alt={tab.name}
                    width={18}
                    height={18}
                    className="object-contain"
                  />
                  {isCompleted && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}
                </div>
                <span>{tab.shortName || tab.name}</span>
                {tab.progress && isActive && (
                  <span className="text-green-600 text-xs bg-green-50 px-1.5 py-0.5 rounded-full">
                    {tab.progress}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Desktop Tabs - Full width */}
      <div className="hidden md:flex items-center border-b border-gray-200 px-2">
        {tabs.map((tab) => {
          const isCompleted = isTabCompleted(tab.key);
          const isActive = activeTab === tab.key;

          return (
            <button
              key={tab.key}
              onClick={() => handleTabClick(tab.key)}
              className={cn(
                "relative py-4 px-2 lg:px-4 text-sm font-medium border-b-2 border-transparent transition flex items-center gap-1 lg:gap-2",
                isActive
                  ? "text-[#313273] font-bold border-b-pink-600"
                  : "text-gray-500 hover:text-[#313273]"
              )}
            >
              <div className="relative">
                <Image
                  src={tab.icon}
                  alt={tab.name}
                  width={20}
                  height={20}
                  className="object-contain flex-shrink-0"
                />
                {isCompleted && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-1 whitespace-nowrap">
                <span className="hidden lg:inline">{tab.name}</span>
                <span className="lg:hidden">{tab.shortName || tab.name}</span>
                {tab.progress && isActive && (
                  <span className="text-green-600 text-xs">{tab.progress}</span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="p-2">
        {activeTab === "basic" && (
          <BasicInformationForm onSaveNext={handleBasicInfoSave} />
        )}
        {activeTab === "advanced" && courseId && (
          <AdvanceInformationForm
            onSaveNext={handleAdvancedInfoSave}
            courseId={courseId}
          />
        )}
        {activeTab === "curriculum" && courseId && (
          <Curriculum onSaveNext={handleCurriculumSave} courseId={courseId} />
        )}
        {activeTab === "publish" && courseId && (
          <div>
            <p>Publish Step</p>
            <p className="text-sm text-gray-500">Course ID: {courseId}</p>
          </div>
        )}
      </div>

      {/* Progress indicator for mobile & tablet */}
      <div className="md:hidden px-3 mt-4 mb-2">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>
            Step {tabs.findIndex((tab) => tab.key === activeTab) + 1} of{" "}
            {tabs.length}
          </span>
          {activeTab === "basic" && (
            <span className="text-green-600">7/12 completed</span>
          )}
        </div>
        <div className="w-full bg-gray-200 h-1 mt-2 rounded-full overflow-hidden">
          <div
            className="bg-pink-600 h-full rounded-full"
            style={{
              width: `${
                ((completedTabs.size +
                  (activeTab === tabs[tabs.length - 1].key ? 1 : 0)) /
                  tabs.length) *
                100
              }%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
