import React from 'react';
import Image from 'next/image';

const memberAvatars = [
  "/head.jpg",
  "/head.jpg",
  "/head.jpg",
  "/head.jpg",
  "/head.jpg",
  "/head.jpg",
  "/head.jpg"
];

export default function AISCommunityCard() {
  return (
    <div className="bg-white rounded-lg shadow-lg max-w-sm mx-auto overflow-hidden">
      {/* Header with gradient background and profile */}
      <div className="relative h-32 bg-gradient-to-r from-blue-900 via-blue-800 to-purple-900">
        {/* AIS Text */}
        <div className="absolute top-4 left-4">
          <h1 className="text-white text-4xl font-bold italic transform -skew-x-12">AIS</h1>
        </div>
      </div>
      
      {/* Content */}
      <div className="px-6 pt-10 pb-6">
        {/* Title and URL */}
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-900 mb-1">AI Automation Society</h2>
          <p className="text-gray-500 text-sm">skool.com/ai-automation-society</p>
        </div>
        
        {/* Description */}
        <p className="text-gray-700 text-sm mb-6 leading-relaxed">
          A community for mastering AI-driven automation and AI agents. Learn, collaborate, and optimize your workflows!
        </p>
        
        {/* Menu Items */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center text-gray-600 text-sm">
            <span className="mr-2">🚀</span>
            <span>Upgrade to AIS+</span>
          </div>
          <div className="flex items-center text-gray-600 text-sm">
            <span className="mr-2">📋</span>
            <span>Rules and Guidelines</span>
          </div>
          <div className="flex items-center text-gray-600 text-sm">
            <span className="mr-2">💬</span>
            <span>n8n Questions Guidelines</span>
          </div>
        </div>
        
        {/* Stats */}
        <div className="flex justify-between mb-6 px-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">106.4k</div>
            <div className="text-xs text-gray-500">Members</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">510</div>
            <div className="text-xs text-gray-500">Online</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">10</div>
            <div className="text-xs text-gray-500">Admins</div>
          </div>
        </div>
        
        {/* Member Avatars */}
        <div className="flex justify-center mb-6">
          <div className="flex -space-x-2">
            {memberAvatars.map((avatar, index) => (
              <div key={index} className="w-8 h-8 rounded-full overflow-hidden border-2 border-white bg-gray-100">
                <Image 
                  src={avatar}
                  alt={`Member ${index + 1}`}
                  width={32}
                  height={32}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
        
        {/* Invite Button */}
        <button className="w-full py-3 px-4 border-2 border-gray-300 text-gray-600 font-medium rounded-lg hover:bg-gray-50 transition-colors">
          INVITE PEOPLE
        </button>
        
        {/* Footer */}
        <div className="text-center mt-6">
          <span className="text-gray-400 text-sm">Powered by </span>
          <span className="text-gray-600 font-semibold text-sm">skool</span>
        </div>
      </div>
    </div>
  );
}
