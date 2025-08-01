interface LoadNewPostsProps {
  count: number
  onClick?: () => void
}

export default function LoadNewPosts({ count, onClick }: LoadNewPostsProps) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-yellow-100 hover:bg-yellow-200 text-gray-900 font-medium py-1 px-4 rounded-lg transition-colors mb-6"
    >
      Load {count} new posts
    </button>
  )
} 