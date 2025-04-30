"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { BasicInformationForm } from "@/components/instructor/BasicInformationForm";
import { AdvanceInformationForm } from "@/components/instructor/AdvanceInformation";
import { Curriculum } from "@/components/instructor/Curriculum";
import Image from "next/image";
import FormFooterButtons from "@/components/instructor/common/FormFooterButtons";

const tabs = [
  { name: "Basic Information", key: "basic", icon: "/icons/Stack.svg" },
  { name: "Advanced Information", key: "advanced", icon: "/icons/ClipboardText.svg" },
  { name: "Curriculum", key: "curriculum", icon: "/icons/MonitorPlay.svg" },
  { name: "Publish Course", key: "publish", icon: "/icons/PlayCircle.svg" },
];

export default function CourseFormTabs() {
  const [activeTab, setActiveTab] = useState("basic");

  // Function to handle moving to next tab
  const handleNextTab = () => {
    const currentIndex = tabs.findIndex(tab => tab.key === activeTab);
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1].key);
    }
  };

  return (
    <div className="bg-white max-w-[90rem] mx-auto min-h-screen">
      {/* Tabs */}
      <div className="flex items-center border-b border-gray-200 px-6">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "relative px-4 py-4 text-sm font-medium text-gray-500 border-b-2 border-transparent hover:text-black transition flex items-center gap-2",
              activeTab === tab.key && "text-black font-bold border-[#FF6636]"
            )}
          >
            <Image
              src={tab.icon}
              alt={tab.name}
              width={20}
              height={20}
              className="object-contain"
            />
            <div className="flex items-center gap-1">
              {tab.name}
              {tab.key === "basic" && (
                <span className="text-green-600 text-xs">7/12</span>
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === "basic" && <BasicInformationForm onSaveNext={handleNextTab} />}
        {activeTab === "advanced" && <AdvanceInformationForm onSaveNext={handleNextTab} />}
        {activeTab === "curriculum" && <Curriculum onSaveNext={handleNextTab} />}
        {activeTab === "publish" && <p>Publish Step</p>}
      </div>
    </div>
  );
}