import { useState } from 'react';
import clsx from 'clsx';

const tabs = ['About', 'Assignment', 'Tools', 'Review'];

export default function TabComponent({ children }: { children: React.ReactNode[] }) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="w-full">
      <div className="flex space-x-6 border-b border-gray-800">
        {tabs.map((tab, index) => (
          <button
            key={tab}
            onClick={() => setActiveTab(index)}
            className={clsx(
              'pb-2 text-sm font-medium',
              activeTab === index ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-400'
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
