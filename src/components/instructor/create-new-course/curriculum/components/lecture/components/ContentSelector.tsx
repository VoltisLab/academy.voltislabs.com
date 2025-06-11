import React from 'react';
import { ContentItemType } from '@/lib/types';
import { Play, SquarePlay, FileText } from 'lucide-react';

interface ContentTypeSelectorProps {
  handleContentTypeSelect: (contentType: ContentItemType) => void;
}

export const ContentSelector: React.FC<ContentTypeSelectorProps> = ({ handleContentTypeSelect }) => {
  return (
    <div className="bg-white shadow-sm border border-gray-300 p-2 w-full">          
      <p className="text-xs sm:text-sm text-gray-600 mb-4 mx-auto text-center">
        Select the main type of content. Files and links can be added as resources.
        <a href="#" className="text-indigo-600 hover:text-indigo-700 ml-1">
          Learn about content types.
        </a>
      </p>
    
      <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
        {/* Video Button */}
        {/* Video Button */}
<button
  onClick={() => handleContentTypeSelect('video')}
  className="flex flex-col border border-gray-300 w-24 h-20 group hover:bg-black cursor-pointer rounded-xs transition"
>
  <div className="bg-gray-100 group-hover:bg-black flex-1 flex items-center justify-center relative overflow-hidden">
    <div className="p-1.5 bg-gray-300 group-hover:bg-white rounded-full transition-transform duration-300 group-hover:-translate-y-[150%] absolute">
      <Play className="text-white group-hover:text-black w-4 h-4" />
    </div>
    <div className="p-1.5 bg-gray-300 group-hover:bg-white rounded-full transition-transform duration-300 translate-y-[150%] group-hover:translate-y-0 absolute">
      <Play className="text-white group-hover:text-black w-4 h-4" />
    </div>
  </div>
  <div className="bg-gray-300 group-hover:bg-black text-center py-1 transition-colors duration-150">
    <span className="text-xs text-gray-800 group-hover:text-white transition-colors duration-150">Video</span>
  </div>
</button>

{/* Video & Slide Button */}
<button
  onClick={() => handleContentTypeSelect('video-slide')}
  className="flex flex-col border border-gray-300 w-24 h-20 group hover:bg-black cursor-pointer rounded-xs transition"
>
  <div className="bg-gray-100 group-hover:bg-black flex-1 flex items-center justify-center relative overflow-hidden">
    <SquarePlay className="text-gray-400 group-hover:text-white w-5 h-5 transition-transform duration-300 group-hover:-translate-y-[150%] absolute" />
    <SquarePlay className="text-gray-400 group-hover:text-white w-5 h-5 transition-transform duration-300 translate-y-[150%] group-hover:translate-y-0 absolute" />
  </div>
  <div className="bg-gray-300 group-hover:bg-black text-center py-1 transition-colors duration-150">
    <span className="text-xs text-gray-800 group-hover:text-white leading-tight transition-colors duration-150">
      Video & Slide<br />Mashup
    </span>
  </div>
</button>

{/* Article Button */}
<button
  onClick={() => handleContentTypeSelect('article')}
  className="flex flex-col border border-gray-300 w-24 h-20 group hover:bg-black cursor-pointer rounded-xs transition"
>
  <div className="bg-gray-100 group-hover:bg-black flex-1 flex items-center justify-center relative overflow-hidden">
    <div className="p-1.5 bg-gray-300 group-hover:bg-white rounded-full transition-transform duration-300 group-hover:-translate-y-[150%] absolute">
      <FileText className="text-white group-hover:text-black w-4 h-4" />
    </div>
    <div className="p-1.5 bg-gray-300 group-hover:bg-white rounded-full transition-transform duration-300 translate-y-[150%] group-hover:translate-y-0 absolute">
      <FileText className="text-white group-hover:text-black w-4 h-4" />
    </div>
  </div>
  <div className="bg-gray-300 group-hover:bg-black text-center py-1 transition-colors duration-150">
    <span className="text-xs text-gray-800 group-hover:text-white transition-colors duration-150">Article</span>
  </div>
</button>
      </div>
    </div>
  );
};