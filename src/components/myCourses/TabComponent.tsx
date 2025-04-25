'use client'
import { useState } from 'react';
import clsx from 'clsx';

const tabsEg = ['About', 'Assignment', 'Tools', 'Review'];

export default function TabComponent({ children,tabs=tabsEg }: {tabs:string[], children: React.ReactNode[] }) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="w-full">
      <div className="flex space-x-6 border-b border-gray-400">
        {tabs.map((tab, index) => (
          <button
            key={tab}
            onClick={() => setActiveTab(index)}
            className={clsx(
              'pb-2 text-sm ',
              activeTab === index ? 'font-bold text-[#1E293B] border-b-2 border-[#4F46E5]' : 'font-medium text-gray-400'
            )}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="mt-4">
        {children[activeTab]}
      </div>
    </div>
  );
}
