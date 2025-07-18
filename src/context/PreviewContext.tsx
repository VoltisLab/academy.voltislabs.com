"use client";

import React, { createContext, useContext, useRef, useState } from "react";

interface PreviewContextType {
  expandedView: boolean;
  toggleExpandedView: () => void;
  parentRef: React.RefObject<HTMLDivElement | null>;
  showQuizShortcut: boolean;
  setShowQuizShortcut: (show: boolean) => void;
  showVideoShortcut: boolean;
  setShowVideoShortcut: (show: boolean) => void;
}

const PreviewContext = createContext<PreviewContextType | null>(null);

export const PreviewProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [expandedView, setExpandedView] = useState(false);
  const [showQuizShortcut, setShowQuizShortcut] = useState(false);
  const [showVideoShortcut, setShowVideoShortcut] = useState(false);
  const parentRef = useRef<HTMLDivElement>(null);

  const toggleExpandedView = () => setExpandedView(!expandedView);

  return (
    <PreviewContext.Provider
      value={{
        expandedView,
        toggleExpandedView,
        parentRef,
        showQuizShortcut,
        setShowQuizShortcut,
        showVideoShortcut,
        setShowVideoShortcut,
      }}
    >
      {children}
    </PreviewContext.Provider>
  );
};

export const usePreviewContext = () => {
  const context = useContext(PreviewContext);
  if (!context) {
    throw new Error("usePreviewContext must be used within a PreviewProvider");
  }
  return context;
};
