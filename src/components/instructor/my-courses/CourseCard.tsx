'use client'
import Image, { StaticImageData } from 'next/image'
import Link from 'next/link'
import { FiEdit } from 'react-icons/fi'

interface CourseCardProps {
  title: string;
  description: string;
  imageUrl?: string | StaticImageData;
  isGrid?: boolean;
  category?: string;
  progressPercent?: number;
  status?: 'DRAFT' | 'PUBLISHED';
  isPublic?: boolean;
  editUrl?: string;
}

const cleanHtmlContent = (htmlString: string): string => {
    if (!htmlString || htmlString.trim() === '') return '';
    
    // Handle React Quill's empty content pattern
    if (htmlString === '<p><br></p>' || htmlString === '<p></p>') {
      return '';
    }
    
    let cleaned = htmlString;
    
    // Remove outer p tags if the content is just a single paragraph
    // FIXED: Use [\s\S]* instead of .* with /s flag for ES5+ compatibility
    if (cleaned.match(/^<p[^>]*>[\s\S]*<\/p>$/) && !cleaned.includes('</p><p>')) {
      cleaned = cleaned.replace(/^<p[^>]*>/, '').replace(/<\/p>$/, '');
    }
    
    // Clean up other unwanted p tag patterns
    cleaned = cleaned
      .replace(/<p><\/p>/g, '') // Remove empty p tags
      .replace(/<p>\s*<\/p>/g, '') // Remove p tags with only whitespace
      .replace(/^<p><br><\/p>$/, '') // Remove single br in p tag
      .trim();
    
    return cleaned;
  };

export default function MyCourseCard({
  title,
  description,
  imageUrl = '/placeholder-icon.png',
  isGrid = false,
  category = 'FRONTEND',
  progressPercent = 50,
  status = 'DRAFT',
  isPublic = false,
  editUrl = '#',
}: CourseCardProps) {
  if (isGrid) {
    return (
      <div className="rounded-xl relative overflow-hidden shadow-md bg-[#F7F7F7] w-[300px]">
        {/* Image */}
        <div className="relative w-full h-40">
          <Image
            src={imageUrl}
            alt="Course Image"
            fill
            className="object-cover"
          />
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col gap-2">
          <div className='flex items-center justify-between'>
            <span className="text-[10px] font-semibold text-[#A99EF6] uppercase tracking-wide">
              {category}
            </span>
            {/* Edit Icon */}
            <div className="flex justify-center text-purple-700 mt-3">
              <Link href={editUrl}>
                {/* <FiEdit size={18} className="hover:text-purple-800 transition-colors" /> */}
                <p className="text-[#A99EF6] transition-colors font-semibold">Edit</p>

              </Link>
            </div>

          </div>

          <h2 className="text-base font-semibold text-gray-900">{title}</h2>
          <p className="text-sm text-gray-700">{cleanHtmlContent(description)}</p>

          {/* Status and Visibility */}
           <p className="text-xs text-red-700 bg-red-100 absolute top-2 right-2 p-2 rounded-lg">
              <span className="font-bold">{status}</span>
            </p>

          {/* Progress Text */}
          <div className="flex items-center justify-between text-[10px] text-gray-500">
            {/* <span>{progressText}</span> */}
            <span>Your Course is {progressPercent}% completed</span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-300 h-2 rounded-full overflow-hidden">
            <div
              className="bg-[#A99EF6] h-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          
        </div>
      </div>
    )
  }

  // List view
  return (
    <div className="group relative flex items-center gap-4 p-4 w-full max-w-4xl rounded-md shadow-md transition-colors duration-200 hover:bg-gray-50">
      {/* Image */}
      <div className="relative w-16 h-16 shrink-0">
        <Image
          src={imageUrl}
          alt="Course Icon"
          fill
          className="object-contain rounded-md"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col gap-1 flex-1">
        <span className="text-[10px] font-semibold text-[#A99EF6] uppercase tracking-wide">
          {category}
        </span>

        <h2 className="font-semibold text-base text-black">{title}</h2>
        <p className="text-sm text-black">{cleanHtmlContent(description)}</p>

        {/* Status and Visibility */}
       <p className="text-xs text-red-700 bg-red-100 absolute right-2 p-2 rounded-lg">
          <span className="font-bold">{status}</span>
        </p>

        {/* Progress Text */}
        <div className="flex items-center justify-between text-[10px]  text-gray-500">
          {/* <span>{progressText}</span> */}
          <span>Your course is {progressPercent}% completed</span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-300 h-2 rounded-full overflow-hidden">
          <div
            className="bg-[#A99EF6] h-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Edit Icon */}
      <div className="text-purple-700  mt-auto ml-auto">
        <Link href={editUrl}>
          {/* <FiEdit size={18} className="hover:text-purple-800 transition-colors" /> */}
          <p className="text-[#A99EF6] transition-colors font-semibold">Edit</p>
        </Link>
      </div>
    </div>
  )
}
