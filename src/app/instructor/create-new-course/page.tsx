"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { BasicInformationForm } from "@/components/instructor/create-new-course/basic-information/BasicInformationForm";
import { AdvanceInformationForm } from "@/components/instructor/create-new-course/advance-information/AdvancedInformation";
import { Curriculum } from "@/components/instructor/create-new-course/curriculum/Curriculum";
import Image from "next/image";
import { toast } from "react-hot-toast";

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

function CourseFormTabsInner() {
  const [activeTab, setActiveTab] = useState("basic");
  const [courseId, setCourseId] = useState<number | null>(null);

  // Track completion status of each tab
  const [completedTabs, setCompletedTabs] = useState<Set<string>>(new Set());

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
      const nextTab = tabs[currentIndex + 1].key;
      setActiveTab(nextTab);
    }
  };

  // Function to handle saving courseId, mark basic tab as completed, and move to next tab
  const handleBasicInfoSave = (id: number) => {
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

  // Function to handle publish course
  const handlePublishCourse = () => {
    // TODO: Implement publish course functionality
    // This will call the backend API to publish the course
    console.log("Publishing course:", courseId);
    toast.success("Course published successfully!");
    // After publishing, you might want to redirect to the course dashboard
    // router.push(`/instructor/dashboard`);
  };

  // Function to check if course can be published
  const canPublishCourse = () => {
    // Check if all required steps are completed
    return courseId !== undefined;
  };

  return (
    <div className="bg-white w-full xl:max-w-[90rem] p-1 mx-auto min-h-screen">
      {/* Mobile Tabs - Horizontally Scrollable */}
      <div className="md:hidden border-b border-gray-200 pb-2">
        <div className="flex items-center overflow-x-auto scrollbar-hide gap-8 px-1">
          {tabs.map((tab) => {
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
        {activeTab === "publish" && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Publish Your Course
              </h2>
              <p className="text-gray-600 mb-6">
                You're almost there! Review your course details and publish it
                to make it available to students.
              </p>

              {/* Publish Button */}
              <div className="flex items-center justify-between">
                <button
                  onClick={() => handleTabClick("curriculum")}
                  className="text-gray-500 font-medium text-sm px-5 py-2 rounded-md hover:bg-gray-100"
                >
                  ← Back to Curriculum
                </button>
                <button
                  onClick={handlePublishCourse}
                  disabled={!canPublishCourse()}
                  className={`px-6 py-3 rounded-md font-medium text-sm ${
                    canPublishCourse()
                      ? "bg-green-600 text-white hover:bg-green-700"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  Publish Course
                </button>
              </div>
            </div>
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

// Main component
export default function CourseFormTabs() {
  return <CourseFormTabsInner />;
}
