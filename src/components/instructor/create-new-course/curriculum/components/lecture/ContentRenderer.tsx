/*
 * STEP 4: Create Content Renderers for Different Content Types
 * These components render different content types (video, article, quiz, etc.)
 */

import React from 'react';
import { Lecture, ArticleContent, VideoContent, PreviewType, SourceCodeFile, ExternalResourceItem } from '@/lib/types';
import { FileDown, FileText, SquareArrowOutUpRight } from 'lucide-react';
import StudentVideoPreview from './StudentVideoPeview';
import InstructorVideoPreview from './InstructorVideoPeview';

// Props for content renderers
interface ContentRendererProps {
  contentType: PreviewType;
  previewMode: 'instructor' | 'student';
  lecture: Lecture;
  videoContent?: VideoContent;
  articleContent?: ArticleContent;
  quizContent?: any;
  assignmentContent?: any;
  codingExerciseContent?: any;
  uploadedFiles: Array<{name: string, size: string}>;
  sourceCodeFiles: SourceCodeFile[];
  externalResources: ExternalResourceItem[];
  setShowPreview: React.Dispatch<React.SetStateAction<boolean>>;
}

// Article content renderer
export const ArticleRenderer: React.FC<ContentRendererProps> = ({
  lecture,
  articleContent,
  uploadedFiles,
  sourceCodeFiles,
  externalResources,
}) => {
  return (
    <div className="flex-1 overflow-y-auto p-6">
      <h1 className="text-3xl font-bold mb-6">{lecture.name || "Demo lecture 1"}</h1>
      <div 
        className="prose max-w-none mb-6" 
        dangerouslySetInnerHTML={{ __html: articleContent?.text || "This is an article I just added." }} 
      />
      
      {/* Resources section for article */}
      {(uploadedFiles.length > 0 || sourceCodeFiles.length > 0 || externalResources.length > 0) && (
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-medium mb-4">Resources for this lecture</h3>
          
          {uploadedFiles.map((file, index) => (
            <div key={`file-${index}`} className="flex items-center mb-3">
              <FileDown className="w-4 h-4 mr-2 text-gray-600" />
              <span className="text-gray-800">{file.name}</span>
            </div>
          ))}
          
          {sourceCodeFiles.map((file, index) => (
            <div key={`sourcecode-${index}`} className="flex items-center mb-3">
              <FileText className="w-4 h-4 mr-2 text-gray-600" />
              <span className="text-gray-800">{file.name}</span>
            </div>
          ))}
          
          {externalResources.map((resource, index) => (
            <div key={`resource-${index}`} className="flex items-center mb-3">
              <SquareArrowOutUpRight className="w-4 h-4 mr-2 text-gray-600" />
              <a href={resource.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                {resource.title}
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Quiz content renderer
export const QuizRenderer: React.FC<ContentRendererProps> = ({
  lecture,
}) => {
  return (
    <div className="flex-1 overflow-y-auto p-6">
      <h1 className="text-3xl font-bold mb-2">Quiz one</h1>
      <p className="text-sm text-gray-600 mb-4">Quiz 1 | 1 question</p>
      <p className="mb-8">This is my first quiz</p>
      
      <div className="flex">
        <button className="bg-purple-600 text-white px-4 py-2 rounded-md mr-2">
          Start quiz
        </button>
        <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md">
          Skip quiz
        </button>
      </div>
    </div>
  );
};

// Assignment content renderer
export const AssignmentRenderer: React.FC<ContentRendererProps> = ({
  lecture,
}) => {
  return (
    <div className="flex-1 overflow-y-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Assignment: Differentiate between client side and server side rendering...</h1>
      
      {/* Assignment loading spinner */}
      <div className="flex justify-center items-center my-16">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
      
      <div className="flex justify-end mt-8">
        <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md mr-2">
          Skip assignment
        </button>
        <button className="bg-purple-600 text-white px-4 py-2 rounded-md">
          Start assignment
        </button>
      </div>
    </div>
  );
};

// Coding exercise content renderer
export const CodingExerciseRenderer: React.FC<ContentRendererProps> = ({
  lecture,
}) => {
  return (
    <div className="flex h-full">
      {/* Instructions sidebar */}
      <div className="w-1/4 border-r border-gray-200 overflow-y-auto">
        <div className="p-4 border-b border-gray-200 flex items-center">
          <button className="mr-2 text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <h3 className="font-medium">Instructions</h3>
        </div>
        <div className="p-4">
          <p>Write a python script to implement face recognition.</p>
        </div>
      </div>
      
      {/* Code editor area */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 bg-gray-900 p-4">
          {/* Code editor would go here */}
          <div className="text-gray-300 font-mono text-sm h-full">
            <pre>{`# Write your code here
import cv2
import numpy as np

def face_recognition():
    # Your implementation here
    pass
`}</pre>
          </div>
        </div>
        
        {/* Controls */}
        <div className="bg-gray-800 p-4 flex justify-between items-center text-white">
          <div>
            <button className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded mr-2">
              Run tests
            </button>
            <button className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded">
              Reset
            </button>
          </div>
          <div className="text-sm text-gray-400">
            All changes saved | Line 1, Column 1
          </div>
        </div>
      </div>
    </div>
  );
};

// Main content renderer that selects the appropriate renderer based on content type
const ContentRenderer: React.FC<ContentRendererProps> = (props) => {
  const { contentType, previewMode, videoContent, setShowPreview, lecture } = props;
  
  switch(contentType) {
    case 'video':
      if (videoContent) {
        if (previewMode === 'student') {
          return <StudentVideoPreview videoContent={videoContent} setShowVideoPreview={setShowPreview} lecture={lecture} />;
        }
        return <InstructorVideoPreview videoContent={videoContent} setShowVideoPreview={setShowPreview} lecture={lecture} />;
      }
      break;
    case 'article':
      return <ArticleRenderer {...props} />;
    case 'quiz':
      return <QuizRenderer {...props} />;
    case 'assignment':
      return <AssignmentRenderer {...props} />;
    case 'coding-exercise':
      return <CodingExerciseRenderer {...props} />;
    default:
      return (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500">No preview content available</p>
        </div>
      );
  }
  
  return null;
};

export default ContentRenderer;