import Image from "next/image"

interface ModuleCardProps {
  id: string
  title: string
  description: string
  image: string
  progress: number
  onClick?: () => void
}

export default function ModuleCard({
  title,
  description,
  image,
  progress,
  onClick
}: ModuleCardProps) {
  return (
    <div 
      className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden cursor-pointer hover:shadow-md transition-shadow relative "
      onClick={onClick}
    >
      {/* Image with Overlay */}
      <div className="relative aspect-video">
        <Image
          src={image}
          alt={title}
          fill
          className="w-full h-full object-cover"
        />
        {/* <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
          <div className="text-white text-2xl font-bold">///A</div>
        </div> */}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-gray-900 text-lg mb-2">{title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{description}</p>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-300 rounded-full h-6">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="text-[10px] mt-1 absolute left-6 bottom-5 text-black">{progress}%</div>
      </div>
    </div>
  )
} 