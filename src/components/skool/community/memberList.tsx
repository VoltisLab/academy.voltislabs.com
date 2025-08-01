import Image from 'next/image';
import React from 'react';

interface Member {
  name: string;
  username: string;
  role: string;
  roleColor: string;
  description: string;
  activeTime: string;
  joinedDate: string;
  avatar: string;
  level: number;
  hasFireIcon?: boolean;
  hasDiamondIcon?: boolean;
  hasStarIcon?: boolean;
}

const members: Member[] = [
  {
    name: "Nate Herk",
    username: "@nate-herk-9178",
    role: "(Owner)",
    roleColor: "text-blue-600",
    description: "Co-Founder @ TrueHorizon AI. Sharing my knowledge of AI Automations through YouTube.",
    activeTime: "Active 1m ago",
    joinedDate: "Joined Oct 15, 2024",
    avatar: "/head.jpg",
    level: 8,
    hasDiamondIcon: true,
    hasStarIcon: true
  },
  {
    name: "Yash Chauhan",
    username: "@yashchauhan",
    role: "(Moderator)",
    roleColor: "text-blue-600",
    description: "AIS+ Community Manager | AI Automation Enthusiast | Mechanical Design Engineer (R&D)",
    activeTime: "Active 12m ago",
    joinedDate: "Joined Jan 7, 2025",
    avatar: "/head.jpg",
    level: 6,
    hasFireIcon: true
  },
  {
    name: "Meghan Cox",
    username: "@meghan-cox-8316",
    role: "(Admin)",
    roleColor: "text-blue-600",
    description: "Testing",
    activeTime: "Active 23m ago",
    joinedDate: "Joined Jun 26, 2025",
    avatar: "/head.jpg",
    level: 6
  }
];

export default function MemberList() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {members.map((member, index) => (
        <div key={index} className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-start justify-between">
            {/* Left side - Profile info */}
            <div className="flex items-start space-x-4">
              {/* Avatar with level */}
              <div className="relative">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100">
                  <Image 
                    src={member.avatar} 
                    alt={member.name}
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Level badge */}
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {member.level}
                </div>
              </div>
              
              {/* Profile details */}
              <div className="flex-1">
                {/* Name and role */}
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="font-semibold text-gray-900">{member.name}</h3>
                  {member.hasDiamondIcon && (
                    <span className="text-blue-500">💎</span>
                  )}
                  {member.hasStarIcon && (
                    <span className="text-yellow-500">⭐</span>
                  )}
                  {member.hasFireIcon && (
                    <span className="text-orange-500">🔥</span>
                  )}
                  <span className={`text-sm font-medium ${member.roleColor}`}>
                    {member.role}
                  </span>
                </div>
                
                {/* Username */}
                <p className="text-gray-500 text-sm mb-3">{member.username}</p>
                
                {/* Description */}
                <p className="text-gray-700 text-sm mb-4 leading-relaxed">
                  {member.description}
                </p>
                
                {/* Activity info */}
                <div className="flex items-center space-x-4 text-gray-500 text-sm">
                  <div className="flex items-center space-x-1">
                    <span className="w-4 h-4 text-gray-400">🕐</span>
                    <span>{member.activeTime}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="w-4 h-4 text-gray-400">📅</span>
                    <span>{member.joinedDate}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right side - Chat button */}
            <button className="flex items-center space-x-2 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <span className="text-sm font-medium">CHAT</span>
              <span className="text-gray-400">💬</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
