// components/loader/loader.tsx
'use client'; // Mark as client component

import { useState, useEffect } from 'react';

export default function VoltisLoader() {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(prev => {
        if (prev >= 100) return 100;
        return prev + 10;
      });
    }, 150);
    
    return () => clearTimeout(timer);
  }, [progress]);
  
  return (
    <div className="fixed inset-0 bg-white bg-opacity-80 flex flex-col items-center justify-center z-50">
      <div className="w-20 h-20 relative">
        <div className="absolute inset-0 border-4 border-indigo-100 rounded-full"></div>
        <div 
          className="absolute inset-0 border-4 border-t-indigo-600 border-r-pink-500 border-b-indigo-600 border-l-pink-500 rounded-full animate-spin"
          style={{ animationDuration: '1s' }}
        ></div>
      </div>
      
      <div className="w-64 h-2 bg-gray-200 rounded-full mt-6 overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-indigo-600 to-pink-500 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      
      <p className="text-indigo-900 mt-4 font-medium font-plus-jakarta">Loading your content...</p>
    </div>
  );
}