"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { BasicInformationForm } from "@/components/instructor/BasicInformationForm";
import { AdvanceInformationForm } from "@/components/instructor/AdvanceInformation";
import { Curriculum } from "@/components/instructor/Curriculum";
const tabs = [
  { name: "Basic Information", key: "basic" },
  { name: "Advanced Information", key: "advanced" },
  { name: "Curriculum", key: "curriculum" },
  { name: "Publish Course", key: "publish" },
];

export default function CourseFormTabs() {
  const [activeTab, setActiveTab] = useState("basic");

  return (
    <div className="bg-white max-w-[90rem] mx-auto min-h-screen">
      {/* Tabs */}
      <div className="flex items-center border-b border-gray-200 px-6">
        {tabs.map((tab, index) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "relative px-4 py-4 text-sm font-medium text-gray-500 border-b-2 border-transparent hover:text-black transition",
              activeTab === tab.key &&
                "text-black border-[#8B5CF6] font-semibold"
            )}
          >
            <div className="flex items-center gap-2">
              {tab.name}
              {tab.key === "basic" && <span className="text-green-600 text-xs">7/12</span>}
            </div>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === "basic" && <BasicInformationForm />}
        {activeTab === "advanced" && <AdvanceInformationForm />}
        {activeTab === "curriculum" && <Curriculum/>}
        {activeTab === "publish" && <p>Publish Step</p>}
      </div>
    </div>
  );
}


