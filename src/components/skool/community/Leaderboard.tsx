import { Medal, Flame } from "lucide-react"
import Image from "next/image"

interface LeaderboardEntry {
  id: string
  rank: number
  name: string
  avatar: string
  score: number
  isTopPerformer?: boolean
}

interface LeaderboardProps {
  title: string
  entries: LeaderboardEntry[]
  onViewAll?: () => void
}

export default function Leaderboard({ title, entries, onViewAll }: LeaderboardProps) {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Medal className="w-4 h-4 text-yellow-500 fill-current" />
      case 2:
        return <Medal className="w-4 h-4 text-gray-400 fill-current" />
      case 3:
        return <Medal className="w-4 h-4 text-amber-600 fill-current" />
      default:
        return <span className="w-4 h-4 text-gray-500 text-xs font-bold">{rank}</span>
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <h3 className="font-semibold text-gray-900 mb-4">{title}</h3>

      <div className="space-y-3">
        {entries.map((entry) => (
          <div key={entry.id} className="flex items-center gap-3">
            <div className="flex items-center justify-center w-6 h-6">
              {getRankIcon(entry.rank)}
            </div>

            {/* Fixed avatar sizing */}
            <Image
              src={entry.avatar}
              alt={entry.name}
              width={32}
              height={32}
              className="w-8 h-8 rounded-full object-cover"
            />

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{entry.name}</p>
            </div>

            <div className="flex items-center gap-1">
              {entry.isTopPerformer && (
                <Flame className="w-3 h-3 text-red-500" />
              )}
              <span className="text-sm font-bold text-blue-600">+{entry.score.toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>

      {onViewAll && (
        <button
          onClick={onViewAll}
          className="w-full mt-4 text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors"
        >
          See all leaderboards
        </button>
      )}
    </div>
  )
}

// Predefined leaderboard data
export const defaultLeaderboardEntries: LeaderboardEntry[] = [
  {
    id: "1",
    rank: 1,
    name: "Ivonne Teoh",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face",
    score: 939,
    isTopPerformer: true
  },
  {
    id: "2",
    rank: 2,
    name: "Mihai Paun",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face",
    score: 584
  },
  {
    id: "3",
    rank: 3,
    name: "Sayyed Ali",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face",
    score: 394
  },
  {
    id: "4",
    rank: 4,
    name: "Andrea Choonoo",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face",
    score: 190
  },
  {
    id: "5",
    rank: 5,
    name: "Ilya Emeliyanov",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=32&h=32&fit=crop&crop=face",
    score: 183
  }
]
