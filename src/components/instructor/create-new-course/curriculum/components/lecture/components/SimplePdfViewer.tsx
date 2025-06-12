'use client';

import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X, Maximize2, AlertTriangle, Upload, CheckCircle } from "lucide-react";

interface PdfViewerProps {
  onUsePresentation: () => void;
  onCancel: () => void;
  onFileSelected?: (file: File | null) => void;
  isPresentationSelected?: boolean;
  onFileUpload?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  uploadedFileUrl?: string | null;
  // NEW: Additional props for upload state management
  isUploading?: boolean;
  uploadProgress?: number;
  uploadError?: string | null;
}

const SimplePdfViewer: React.FC<PdfViewerProps> = ({
  onUsePresentation,
  onCancel,
  onFileSelected,
  isPresentationSelected = false,
  onFileUpload,
  uploadedFileUrl,
  // NEW: Upload state props with defaults
  isUploading: externalIsUploading = false,
  uploadProgress: externalUploadProgress = 0,
  uploadError = null
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [fileURL, setFileURL] = useState<string | null>(null);
  const [internalIsUploading, setInternalIsUploading] = useState<boolean>(false);
  const [internalUploadProgress, setInternalUploadProgress] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [pageCount, setPageCount] = useState<number>(0);
  const [uploadCompleted, setUploadCompleted] = useState<boolean>(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const viewerRef = useRef<HTMLDivElement>(null);
  
  // Determine which upload state to use (external or internal)
  const isUploading = externalIsUploading || internalIsUploading;
  const uploadProgress = externalIsUploading ? externalUploadProgress : internalUploadProgress;
  
  // Effect to handle uploadedFileUrl changes
  useEffect(() => {
    if (uploadedFileUrl && file) {
      setFileURL(uploadedFileUrl);
      setUploadCompleted(true);
      setInternalIsUploading(false);
      setInternalUploadProgress(0);
    }
  }, [uploadedFileUrl, file]);
  
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
        
        // Use the uploaded file URL if available, otherwise use the local file
        let arrayBuffer: ArrayBuffer;
        
        if (uploadedFileUrl) {
          // Fetch the uploaded file
          const response = await fetch(uploadedFileUrl);
          arrayBuffer = await response.arrayBuffer();
        } else {
          // Use local file
          arrayBuffer = await file.arrayBuffer();
        }
        
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
  }, [file, uploadedFileUrl]);

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0];
      
      // Validate file type
      if (!selectedFile.type.includes('pdf') && 
          !selectedFile.name.toLowerCase().endsWith('.pdf') &&
          !selectedFile.name.toLowerCase().endsWith('.ppt') &&
          !selectedFile.name.toLowerCase().endsWith('.pptx')) {
        alert('Please select a PDF or PowerPoint file.');
        return;
      }
      
      setFile(selectedFile);
      setUploadCompleted(false);
      
      // Report file selection to parent component
      if (onFileSelected) {
        onFileSelected(selectedFile);
      }
      
      // If external upload function is provided, use it
      if (onFileUpload) {
        onFileUpload(event);
      } else {
        // Fallback to internal upload simulation
        simulateInternalUpload(selectedFile);
      }
    }
  };

  // Internal upload simulation (fallback)
  const simulateInternalUpload = (selectedFile: File) => {
    const url = URL.createObjectURL(selectedFile);
    
    setInternalIsUploading(true);
    setInternalUploadProgress(0);
    
    const interval = setInterval(() => {
      setInternalUploadProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setInternalIsUploading(false);
            setFileURL(url);
            setUploadCompleted(true);
          }, 500);
          return 100;
        }
        return prevProgress + 5;
      });
    }, 100);
  };

  // Toggle fullscreen preview
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Reset file
  const resetFile = () => {
    if (fileURL && !uploadedFileUrl) {
      URL.revokeObjectURL(fileURL);
    }
    setFile(null);
    setFileURL(null);
    setUploadCompleted(false);
    setInternalIsUploading(false);
    setInternalUploadProgress(0);
    
    // Report file removal to parent component
    if (onFileSelected) {
      onFileSelected(null);
    }
    
    // Clear file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle upload error
  const renderUploadError = () => {
    if (!uploadError) return null;
    
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
        <div className="flex items-center">
          <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
          <div>
            <h3 className="text-sm font-medium text-red-800">Upload Failed</h3>
            <p className="text-sm text-red-700 mt-1">{uploadError}</p>
          </div>
        </div>
        <div className="mt-3">
          <button
            onClick={() => {
              resetFile();
              if (fileInputRef.current) {
                fileInputRef.current.click();
              }
            }}
            className="text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  };

  // Render upload progress
  const renderUploadProgress = () => (
    <div className="space-y-3">
      {renderUploadError()}
      
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
            {uploadError ? (
              <span className="text-red-600 flex items-center">
                <AlertTriangle className="w-4 h-4 mr-1" />
                Failed
              </span>
            ) : uploadProgress === 100 ? (
              <span className="text-green-600 flex items-center">
                <CheckCircle className="w-4 h-4 mr-1" />
                Complete
              </span>
            ) : (
              <>
                <div className="w-20 bg-gray-200 h-2 rounded-full overflow-hidden mr-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <span className="text-xs">{Math.round(uploadProgress)}%</span>
              </>
            )}
          </div>
          <div>{new Date().toLocaleDateString()}</div>
        </div>
      </div>
      
      {uploadProgress === 100 && !uploadError && (
        <div className="flex items-center text-green-600 text-sm font-medium">
          <CheckCircle className="w-4 h-4 mr-2" />
          Upload completed successfully!
        </div>
      )}
    </div>
  );

  // Render file selection
  const renderFileSelection = () => (
    <div className="space-y-3">
      {renderUploadError()}
      
      <div className="flex items-center justify-between">
        <div className="flex-1 border border-gray-500 rounded px-4 py-3 text-sm text-gray-600 truncate">
          {file ? <span>{file.name}</span> : <span>No file selected</span>}
        </div>
        <label className="ml-4 px-2 py-3 border border-purple-700 text-sm font-bold text-purple-700 hover:bg-purple-50 cursor-pointer transition flex items-center">
          <Upload className="w-4 h-4 mr-2" />
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.ppt,.pptx"
            onChange={handleFileChange}
            className="hidden"
            disabled={isUploading}
          />
          {isUploading ? 'Uploading...' : 'Select File'}
        </label>
      </div>
    </div>
  );
  
  // Render selected PDF thumbnail view
  const renderSelectedPdfView = () => {
    if (!file) return null;
    
    return (
      <div className="space-y-3">
        {renderUploadError()}
        
        <div className="flex items-center space-x-3 p-3 bg-green-50 border border-green-200 rounded-md">
          <div className="w-16 h-16 border border-gray-300 flex items-center justify-center overflow-hidden bg-white rounded">
            {fileURL ? (
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
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <Upload className="w-6 h-6 text-gray-400" />
              </div>
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center mb-1">
              <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
              <p className="text-sm font-medium text-green-800">
                Presentation Selected
              </p>
            </div>
            <p className="text-sm text-gray-700 truncate max-w-md">
              {file.name}
            </p>
            {pageCount > 0 && (
              <p className="text-xs text-gray-500">
                {pageCount} {pageCount === 1 ? 'page' : 'pages'}
              </p>
            )}
          </div>
          <button 
            className="px-3 py-1 text-purple-600 text-sm font-bold border border-purple-600 rounded hover:bg-purple-50 transition"
            onClick={() => {
              resetFile();
              if (fileInputRef.current) {
                fileInputRef.current.click();
              }
            }}
            disabled={isUploading}
          >
            Change
          </button>
        </div>
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
                disabled={!uploadCompleted}
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
      <div className="space-y-3">
        {renderUploadError()}
        
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
          
          <div className="px-4 pt-2 text-sm text-center font-medium text-gray-700">
            {file?.name}
            {uploadCompleted && (
              <span className="ml-2 text-green-600">
                <CheckCircle className="w-4 h-4 inline" />
              </span>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex justify-start space-x-2">
          <button
            onClick={onUsePresentation}
            className="bg-purple-600 text-white text-sm py-1.5 px-3 rounded hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!uploadCompleted || uploadError !== null}
          >
            Use this presentation
          </button>
          <button
            onClick={resetFile}
            className="border border-gray-300 text-gray-700 text-sm py-1.5 px-3 rounded hover:bg-gray-50 transition"
            disabled={isUploading}
          >
            Cancel
          </button>
        </div>
      </div>
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