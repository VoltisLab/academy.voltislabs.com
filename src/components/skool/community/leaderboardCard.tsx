import Image from 'next/image';
import React from 'react';

interface LeaderboardEntry {
  rank: number;
  name: string;
  points: number;
  avatar: string;
  hasFireIcon?: boolean;
}

const leaderboardData: LeaderboardEntry[] = [
  { rank: 1, name: "Titus Blair", points: 410, avatar: "/head.jpg" },
  { rank: 2, name: "Michael Wacht", points: 165, avatar: "/head.jpg", hasFireIcon: true },
  { rank: 3, name: "Kamrul Hassan", points: 79, avatar: "/head.jpg" },
  { rank: 4, name: "Ilya Emeliyanov", points: 60, avatar: "/head.jpg" },
  { rank: 5, name: "Yash Chauhan", points: 52, avatar: "/head.jpg", hasFireIcon: true },
  { rank: 6, name: "Shashee Dean", points: 45, avatar: "/head.jpg" },
  { rank: 7, name: "Sandeep Patharkar", points: 42, avatar: "/head.jpg" },
  { rank: 8, name: "Frank van Bokhorst", points: 42, avatar: "/head.jpg" },
  { rank: 9, name: "Jason Hagen", points: 40, avatar: "/head.jpg", hasFireIcon: true },
  { rank: 10, name: "Tatyana Gray", points: 37, avatar: "/head.jpg" }
];

const getRankBadgeColor = (rank: number) => {
  switch (rank) {
    case 1:
      return "bg-yellow-400 text-white";
    case 2:
      return "bg-gray-400 text-white";
    case 3:
      return "bg-amber-600 text-white";
    default:
      return "bg-gray-300 text-gray-600";
  }
};

const getRankEmoji = (rank: number) => {
  switch (rank) {
    case 1:
      return "👑";
    default:
      return rank.toString();
  }
};

export default function LeaderboardCard() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 w-fit mx-auto">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900">Leaderboard (7-day)</h2>
      </div>
      
      {/* Leaderboard List */}
      <div className="px-6 py-4">
        <div className="space-y-7">
          {leaderboardData.map((entry, index) => (
            <div key={index} className="flex items-center justify-between">
              {/* Left side: Rank + Avatar + Name */}
              <div className="flex items-center space-x-3">
                {/* Rank Badge */}
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-medium ${getRankBadgeColor(entry.rank)}`}>
                  {getRankEmoji(entry.rank)}
                </div>
                
                {/* Avatar - specify width/height instead of fill */}
                <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100">
                  <Image 
                    src={entry.avatar} 
                    alt={entry.name}
                    width={32}
                    height={32}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Name with optional fire icon */}
                <div className="flex items-center space-x-1">
                  <span className="text-gray-900 font-medium">{entry.name}</span>
                  {entry.hasFireIcon && (
                    <span className="text-orange-500">🔥</span>
                  )}
                </div>
              </div>
              
              {/* Right side: Points */}
              <div className="pl-8 text-blue-600 font-medium">
                +{entry.points}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
