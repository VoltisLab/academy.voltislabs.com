'use client'

import Image, { StaticImageData } from 'next/image'
import Link from 'next/link'

interface CourseCardProps {
  title: string
  status: 'DRAFT' | 'PUBLISHED'
  isPublic: boolean
  description: string
  imageUrl?: string | StaticImageData
  editUrl?: string
  isGrid?: boolean
}

export default function MyCourseCard({
  title,
  status,
  isPublic,
  description,
  imageUrl = '/placeholder-icon.png',
  editUrl = '#',
  isGrid = false,
}: CourseCardProps) {
  return (
    <div
      className={`group relative border rounded-md shadow-sm transition-colors duration-200 hover:bg-gray-50
        ${isGrid ? 'flex flex-col items-center p-4 w-full max-w-xs h-[360px] overflow-hidden' : 'flex items-center justify-between p-4 w-full max-w-4xl'}
      `}
    >
      {/* Image */}
      <div
        className={`relative ${
          isGrid ? 'w-full h-40 mb-4' : 'w-16 h-16 mr-4'
        }`}
      >
        <Image
          src={imageUrl}
          alt="Course Icon"
          fill
          className="object-contain rounded-md"
        />
      </div>

      {/* Text Content */}
      <div
        className={`flex flex-col relative ${
          isGrid
            ? 'items-center text-center gap-2 transition-opacity duration-200 z-0'
            : 'flex-1 justify-between gap-2'
        }`}
      >
        <h2 className="font-semibold text-lg text-black">{title}</h2>
        <p className="text-sm text-black">{description}</p>
        <p className="text-sm text-gray-500">
          <span className="font-bold text-xs">{status}</span>{' '}
          <span className="text-xs">{isPublic ? 'Public' : 'Private'}</span>
        </p>
      </div>

      {/* Edit Link - Keep your original style here */}
      <div
        className={`text-sm font-semibold flex text-purple-700 text-center group-hover:flex mt-3 ${
          isGrid ? 'justify-center' : 'ml-auto'
        }`}
      >
        <Link href={editUrl}>Edit / manage course</Link>
      </div>
    </div>
  )
}
