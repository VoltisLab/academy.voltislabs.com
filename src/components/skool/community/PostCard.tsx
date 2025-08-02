import { ThumbsUp, MessageCircle, MapPin, Trophy } from "lucide-react"
import Image from "next/image"

interface Commenter {
  id: string
  name: string
  avatar: string
}

interface PostCardProps {
  id: string
  author: {
    name: string
    avatar: string
    badge?: string
  }
  timestamp: string
  title: string
  content: string
  media?: {
    type: 'image' | 'video' | 'document'
    url: string
    alt: string
  }
  engagement: {
    likes: number
    comments: number
    recentCommenters: Commenter[]
    lastCommentTime?: string
  }
  isPinned?: boolean
  hasWins?: boolean
  onLike?: (postId: string) => void
  onComment?: (postId: string) => void
}

export default function PostCard({
  id,
  author,
  timestamp,
  title,
  content,
  media,
  engagement,
  isPinned = false,
  hasWins = false,
  onLike,
  onComment
}: PostCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-4 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3">
          <div className="relative">
            {/* Fixed avatar sizing to avoid fill conflicts */}
            <Image
              src={author.avatar}
              alt={author.name}
              width={40}
              height={40}
              className="w-10 h-10 rounded-full object-cover"
            />
            {author.badge && (
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center font-bold">
                {author.badge}
              </div>
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-gray-900 text-sm">{author.name}</h3>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
              <span>{timestamp}</span>
              {hasWins && (
                <>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Trophy className="w-3 h-3 text-yellow-500" />
                    <span>Wins</span>
                  </div>
                </>
              )}
            </div>

            {/* Pinned indicator and title */}
            <div className="flex items-center gap-2 mb-2">
              {isPinned && (
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <MapPin className="w-3 h-3 text-red-500" />
                </div>
              )}
              <h2 className="font-bold text-gray-900 text-base leading-tight">{title}</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mb-4">
        <p className="text-gray-700 text-sm leading-relaxed">{content}</p>
      </div>

      {/* Media */}
      {media && (
        <div className="mb-4">
          {media.type === 'image' && (
            // Wrap image in a relative container and let it fill naturally
            <div className="relative w-full h-32 rounded-lg overflow-hidden">
              <Image
                src={media.url}
                alt={media.alt}
                fill
                className="object-cover"
              />
            </div>
          )}
          {media.type === 'video' && (
            <div className="relative w-full h-32 bg-gray-200 rounded-lg flex items-center justify-center">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                <div className="w-0 h-0 border-l-[8px] border-l-gray-800 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent ml-1"></div>
              </div>
            </div>
          )}
          {media.type === 'document' && (
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-blue-100 rounded flex items-center justify-center">
                <div className="w-6 h-6 bg-blue-600 rounded"></div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">Document</div>
                <div className="text-xs text-gray-500">Click to view</div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Engagement */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => onLike?.(id)}
            className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors"
          >
            <ThumbsUp className="w-4 h-4" />
            <span className="text-sm">{engagement.likes}</span>
          </button>
          <button
            onClick={() => onComment?.(id)}
            className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            <span className="text-sm">{engagement.comments}</span>
          </button>
        </div>

        {/* Recent commenters */}
        {engagement.recentCommenters.length > 0 && (
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {engagement.recentCommenters.slice(0, 3).map((commenter) => (
                <Image
                  key={commenter.id}
                  src={commenter.avatar}
                  alt={commenter.name}
                  width={24}
                  height={24}
                  className="w-6 h-6 rounded-full border-2 border-white"
                  title={commenter.name}
                />
              ))}
            </div>
            {engagement.lastCommentTime && (
              <span className="text-xs text-gray-500">{engagement.lastCommentTime}</span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
