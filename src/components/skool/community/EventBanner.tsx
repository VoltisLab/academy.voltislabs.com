import { Calendar } from "lucide-react"

interface EventBannerProps {
  title: string
  timeLeft: string
  onClick?: () => void
}

export default function EventBanner({ title, timeLeft, onClick }: EventBannerProps) {
  return (
    <div 
      className="my-4 mb-4 cursor-pointer hover:bg-gray-100 transition-colors text-center"
      onClick={onClick}
    >
      <div className="flex items-center justify-center gap-3">
        <Calendar className="w-5 h-5 text-gray-600" />
        <span className="text-sm text-gray-900 font-semibold">
          {title} is happening in {timeLeft}
        </span>
      </div>
    </div>
  )
} 