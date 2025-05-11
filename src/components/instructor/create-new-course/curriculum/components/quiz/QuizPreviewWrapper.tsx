"use client";
import React, { useState, ReactElement, ButtonHTMLAttributes } from 'react';
import { createPortal } from 'react-dom';
import QuizPreview, { Quiz } from './QuizPreview';

interface QuizPreviewWrapperProps {
  quiz: Quiz;
  children?: React.ReactNode;
}

const QuizPreviewWrapper: React.FC<QuizPreviewWrapperProps> = ({ quiz, children }) => {
  const [showPreview, setShowPreview] = useState<boolean>(false);

  const openPreview = (): void => {
    setShowPreview(true);
    // Prevent body scrolling when preview is open
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'hidden';
    }
  };

  const closePreview = (): void => {
    setShowPreview(false);
    // Restore body scrolling
    if (typeof document !== 'undefined') {
      document.body.style.overflow = '';
    }
  };

  // Type guard to check if children is a valid React element
  const isReactElement = (
    child: React.ReactNode
  ): child is ReactElement<ButtonHTMLAttributes<HTMLButtonElement>> => {
    return React.isValidElement(child);
  };

  return (
    <>
      {/* Render children with preview button functionality */}
      {children ? (
        isReactElement(children) ? (
          React.cloneElement(children, {
            onClick: (e) => {
              // Preserve existing onClick if present
              if (children.props.onClick) {
                children.props.onClick(e);
              }
              openPreview();
            },
          })
        ) : (
          <div onClick={openPreview}>{children}</div>
        )
      ) : (
        <button
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md"
          onClick={openPreview}
        >
          Preview Quiz
        </button>
      )}

      {/* Render the preview in a portal when showPreview is true */}
      {showPreview && typeof document !== 'undefined' && 
        createPortal(
          <div className="fixed inset-0 z-50 w-full h-full bg-white">
            <QuizPreview quiz={quiz} onClose={closePreview} />
          </div>,
          document.body
        )
      }
    </>
  );
};

export default QuizPreviewWrapper;