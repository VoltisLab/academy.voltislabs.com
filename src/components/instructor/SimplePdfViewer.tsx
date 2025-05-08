'use client';

import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X, Maximize2, AlertTriangle } from "lucide-react";

interface PdfViewerProps {
  onUsePresentation: () => void;
  onCancel: () => void;
  onFileSelected?: (file: File | null) => void;
  isPresentationSelected?: boolean;
}

const SimplePdfViewer: React.FC<PdfViewerProps> = ({
  onUsePresentation,
  onCancel,
  onFileSelected,
  isPresentationSelected = false
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [fileURL, setFileURL] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [pageCount, setPageCount] = useState<number>(0);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const viewerRef = useRef<HTMLDivElement>(null);
  
  // Get page count from PDF using PDF.js
  useEffect(() => {
    const getPdfPageCount = async () => {
      if (!file || typeof window === 'undefined') return;
      
      try {
        // Dynamic import for PDF.js (only on client-side)
        const pdfJsLib = await import('pdfjs-dist');
        
        // Make sure the worker is available
        const workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfJsLib.version}/pdf.worker.min.js`;
        pdfJsLib.GlobalWorkerOptions.workerSrc = workerSrc;
        
        // Convert file to ArrayBuffer
        const arrayBuffer = await file.arrayBuffer();
        
        // Load the PDF document
        const loadingTask = pdfJsLib.getDocument(arrayBuffer);
        const pdfDocument = await loadingTask.promise;
        
        // Get the page count
        const numPages = pdfDocument.numPages;
        setPageCount(numPages);
      } catch (error) {
        console.error('Error getting PDF page count:', error);
        // Fallback to a reasonable default if we can't get the actual count
        const estimatedPages = Math.max(1, Math.ceil(file.size / 50000));
        setPageCount(estimatedPages);
      }
    };
    
    getPdfPageCount();
  }, [file]);

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0];
      
      // Generate object URL for the file
      const url = URL.createObjectURL(selectedFile);
      
      // Simulate upload process
      setIsUploading(true);
      setUploadProgress(0);
      
      const interval = setInterval(() => {
        setUploadProgress((prevProgress) => {
          if (prevProgress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              setIsUploading(false);
              setFile(selectedFile);
              setFileURL(url);
              // Report file selection to parent component
              if (onFileSelected) {
                onFileSelected(selectedFile);
              }
            }, 500);
            return 100;
          }
          return prevProgress + 5;
        });
      }, 100);
    }
  };

  // Toggle fullscreen preview
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Reset file
  const resetFile = () => {
    if (fileURL) {
      URL.revokeObjectURL(fileURL);
    }
    setFile(null);
    setFileURL(null);
    
    // Report file removal to parent component
    if (onFileSelected) {
      onFileSelected(null);
    }
  };

  // Render upload progress
  const renderUploadProgress = () => (
    <div className="space-y-2">
      <div className="overflow-x-auto">
        <div className="grid grid-cols-4 gap-2 md:gap-4 text-base font-bold text-gray-800 border-b border-gray-300 py-2 min-w-max">
          <div>Filename</div>
          <div>Type</div>
          <div>Status</div>
          <div>Date</div>
        </div>
        <div className="grid grid-cols-4 gap-2 md:gap-4 text-sm items-center text-gray-700 font-semibold min-w-max py-2">
          <div className="truncate">{file?.name || "presentation.pdf"}</div>
          <div>Presentation</div>
          <div className="flex items-center">
            <div className="w-20 bg-gray-200 h-2 rounded-full overflow-hidden mr-2">
              <div 
                className="bg-purple-600 h-2 rounded-full" 
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <span className="text-xs">{uploadProgress}%</span>
          </div>
          <div>{new Date().toLocaleDateString()}</div>
        </div>
      </div>
    </div>
  );

  // Render file selection
  const renderFileSelection = () => (
    <div className="flex items-center justify-between">
      <div className="flex-1 border border-gray-500 rounded px-4 py-3 text-sm text-gray-600 truncate">
        {file ? <span>{file.name}</span> : <span>No file selected</span>}
      </div>
      <label className="ml-4 px-2 py-3 border border-purple-700 text-sm font-bold text-purple-700 hover:bg-purple-50 cursor-pointer transition">
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="hidden"
        />
        Select PDF
      </label>
    </div>
  );
  
  // Render selected PDF thumbnail view
  const renderSelectedPdfView = () => {
    if (!file || !fileURL) return null;
    
    return (
      <div className="flex items-center space-x-3">
        <div className="w-16 h-16 border border-gray-300 flex items-center justify-center overflow-hidden bg-gray-50">
          <object
            data={fileURL}
            type="application/pdf"
            className="max-w-full max-h-full object-contain"
            style={{ width: '100%', height: '100%' }}
          >
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <span className="text-xs text-gray-500">PDF</span>
            </div>
          </object>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-800 truncate max-w-md">
            {file.name}
          </p>
          <p className="text-xs text-gray-500">{pageCount} {pageCount === 1 ? 'page' : 'pages'}</p>
        </div>
        <button 
          className="ml-auto px-3 py-1 text-purple-600 text-sm font-bold border border-purple-600 rounded hover:bg-purple-50"
          onClick={() => {
            resetFile();
            if (fileInputRef.current) {
              fileInputRef.current.click();
            }
          }}
        >
          Change
        </button>
      </div>
    );
  };

  // Render PDF viewer using object tag
  const renderPdfViewer = () => {
    if (!fileURL) return null;
    
    if (isFullscreen) {
      return (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col">
          <div className="bg-white px-4 py-2 flex justify-between items-center">
            <h3 className="font-bold text-gray-800">Preview: {file?.name}</h3>
            <button 
              onClick={toggleFullscreen}
              className="text-gray-700 hover:text-gray-900"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 bg-gray-100 overflow-auto p-4">
            <object
              data={fileURL}
              type="application/pdf"
              className="w-full h-full"
            >
              <div className="flex justify-center items-center h-full bg-red-50 p-8 rounded">
                <div className="text-center">
                  <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                  <p className="text-red-700 font-medium text-lg mb-2">Unable to display PDF</p>
                  <p className="text-red-600 mb-4">Your browser might not support embedded PDFs.</p>
                  <a 
                    href={fileURL} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 inline-block"
                  >
                    Download PDF
                  </a>
                </div>
              </div>
            </object>
          </div>
          <div className="bg-gray-100 px-4 py-2 flex justify-end items-center">
            <div className="flex space-x-2">
              <button
                onClick={onUsePresentation}
                className="bg-purple-600 text-white text-sm px-4 py-1 rounded hover:bg-purple-700"
              >
                Use this presentation
              </button>
              <button
                onClick={toggleFullscreen}
                className="border border-gray-300 text-gray-700 text-sm px-4 py-1 rounded hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <>
        <div className="border border-gray-300 rounded pb-2">
          <div className="w-full h-80 bg-white relative flex justify-center items-center overflow-hidden" ref={viewerRef}>
            <object
              data={fileURL}
              type="application/pdf"
              className="w-full h-full"
            >
              <div className="flex justify-center items-center h-full bg-red-50 p-4">
                <div className="text-center">
                  <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                  <p className="text-red-700 font-medium mb-1">Unable to display PDF</p>
                  <a 
                    href={fileURL} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Open PDF
                  </a>
                </div>
              </div>
            </object>
            <button
              onClick={toggleFullscreen}
              className="absolute bottom-2 right-2 p-1 bg-white rounded shadow text-gray-700 hover:text-gray-900"
            >
              <Maximize2 className="h-5 w-5" />
            </button>
          </div>

          {/* Progress bar - shows browser's built-in navigation */}
          <div className="w-full bg-purple-100 h-2 mt-2">
            <div 
              className="bg-purple-600 h-2" 
              style={{ width: '0%' }}
            />
          </div>

          {/* Navigation placeholder */}
          <div className="flex items-center justify-between mt-2 px-4">
            <button 
              className="p-1 rounded text-gray-400"
              disabled
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <div className="flex-1 flex justify-center items-center space-x-1 px-4 overflow-x-auto">
              <div className="text-sm text-gray-500">Use browser's PDF controls to navigate</div>
            </div>
            
            <button 
              className="p-1 rounded text-gray-400"
              disabled
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          
          <div className="px-4 pt-2 text-sm text-center font-medium text-gray-700">
            {file?.name}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex justify-start space-x-2 mt-4">
          <button
            onClick={onUsePresentation}
            className="bg-purple-600 text-white text-sm py-1.5 px-3 rounded hover:bg-purple-700 transition"
          >
            Use this presentation
          </button>
          <button
            onClick={resetFile}
            className="border border-gray-300 text-gray-700 text-sm py-1.5 px-3 rounded hover:bg-gray-50 transition"
          >
            Cancel
          </button>
        </div>
      </>
    );
  };

  return (
    <div className="pdf-viewer">
      {isUploading 
        ? renderUploadProgress() 
        : isPresentationSelected && file
          ? renderSelectedPdfView()
          : file && fileURL
            ? renderPdfViewer() 
            : renderFileSelection()
      }
      
      {!file && !isUploading && (
        <p className="mt-1.5 text-xs text-gray-500">
          <strong>Note:</strong> A presentation means slides (e.g. PowerPoint, Keynote). 
          Slides are a great way to combine text and visuals to explain concepts in an 
          effective and efficient way. Use meaningful graphics and clearly legible text!
        </p>
      )}
    </div>
  );
};

export default SimplePdfViewer;