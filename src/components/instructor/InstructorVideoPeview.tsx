import { Lecture, VideoContent } from "@/lib/types";
import { ChevronDown, ChevronUp, Play, X } from "lucide-react";
import { useState } from "react";

 type ChildProps = {
    videoContent: VideoContent;
    setShowVideoPreview: React.Dispatch<React.SetStateAction<boolean>>;
    lecture: Lecture;
  };

const InstructorVideoPreview = ({videoContent, setShowVideoPreview, lecture}: ChildProps) => {
  // Using a proper type-safe useState
  const [activeTab, setActiveTab] = useState<'overview' | 'notes' | 'announcements' | 'reviews' | 'learning-tools'>('overview');
  
  if (!videoContent.selectedVideoDetails) return null;
  
 return (
     <div className="fixed inset-0 bg-white z-[9999] overflow-auto flex">
       {/* Video player section */}
       <div className="flex-1 bg-black">
         <div className="relative w-full h-full flex items-center justify-center">
           {/* Video player with play button overlay */}
           <div className="relative w-full max-w-4xl mx-auto">
             <div className="bg-red-600 w-full" style={{ paddingBottom: '56.25%' }}> {/* 16:9 aspect ratio */}
               <div className="absolute inset-0 flex items-center justify-center">
                 <button 
                   className="rounded-full bg-black bg-opacity-70 p-4"
                   type="button"
                   aria-label="Play video"
                 >
                   <Play className="w-8 h-8 text-white" />
                 </button>
               </div>
             </div>
             
             {/* Video controls */}
             <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
               <div className="flex items-center text-white">
                 <button 
                   className="mr-4"
                   type="button"
                   aria-label="Play/Pause"
                 >
                   <Play className="w-6 h-6" />
                 </button>
                 
                 <div className="flex-1 mx-2">
                   <div className="h-1 bg-gray-600 rounded-full">
                     <div className="h-1 bg-white rounded-full w-0"></div>
                   </div>
                   <div className="flex justify-between text-xs mt-1">
                     <span>0:00</span>
                     <span>0:00</span>
                   </div>
                 </div>
                 
                 <button 
                   className="ml-4"
                   type="button"
                   aria-label="Expand course content"
                 >
                   <ChevronUp className="w-6 h-6" />
                 </button>
               </div>
             </div>
           </div>
         </div>
       </div>
       
       {/* Course content sidebar */}
       <div className="w-80 border-l border-gray-200 flex flex-col">
         {/* Header with close button */}
         <div className="flex justify-between items-center border-b border-gray-200 p-4">
           <h2 className="font-semibold">Course content</h2>
           <button 
             onClick={() => setShowVideoPreview(false)} 
             className="text-gray-500 hover:text-gray-700"
             type="button"
             aria-label="Close preview"
           >
             <X className="w-5 h-5" />
           </button>
         </div>
         
         {/* Section with lecture */}
         <div className="p-4 border-b border-gray-200">
           <div className="flex justify-between items-center mb-2">
             <h3 className="font-semibold">Section 1: Demo Section</h3>
             <ChevronUp className="w-4 h-4" />
           </div>
           <p className="text-sm text-gray-500">0/1 | 2min</p>
         </div>
         
         {/* Lecture item */}
         <div className="p-4 bg-gray-100 border-l-4 border-indigo-600">
           <div className="flex items-start">
             <input type="checkbox" className="mt-1 mr-2" aria-label="Mark lecture as complete" />
             <div>
               <p className="font-medium">1. {lecture.name}</p>
               <div className="flex items-center text-xs text-gray-500 mt-1">
                 <Play className="w-3 h-3 mr-1" />
                 <span>2min</span>
               </div>
             </div>
           </div>
         </div>
         
         {/* Bottom navigation buttons */}
         <div className="mt-auto p-4 border-t border-gray-200">
           <button 
             className="bg-indigo-600 text-white w-8 h-8 rounded-full flex items-center justify-center mx-auto"
             type="button"
             aria-label="Next lecture"
           >
             <ChevronDown className="w-5 h-5" />
           </button>
         </div>
       </div>
     </div>
   );
};

export default InstructorVideoPreview
