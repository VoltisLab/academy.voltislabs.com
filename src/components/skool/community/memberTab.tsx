import React, { useState } from 'react';

export default function CommunityTabs() {
  const [activeTab, setActiveTab] = useState('members');

  const tabs = [
    { id: 'members', label: 'Members', count: '106485' },
    { id: 'admins', label: 'Admins', count: '10' },
    { id: 'online', label: 'Online', count: '506' }
  ];

  return (
    <div className="flex items-center justify-between p-2 max-w-4xl mx-auto">
      {/* Left side - Stats tabs */}
      <div className="flex items-center space-x-2">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium cursor-pointer transition-colors ${
              activeTab === tab.id
                ? 'bg-gray-500 text-white'
                : 'text-gray-500 hover:bg-gray-200'
            }`}
          >
            {tab.label} {tab.count}
          </div>
        ))}
      </div>
      
      {/* Right side - Invite button */}
      <div className="bg-yellow-300 text-gray-900 px-6 py-2 rounded-lg text-sm font-bold hover:bg-yellow-400 cursor-pointer">
        INVITE
      </div>
    </div>
  );
}