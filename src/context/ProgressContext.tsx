"use client";

import React, { createContext, useContext, useState } from "react";

interface ProgressData {
  completedItems: number;
  totalItems: number;
  completedMinutes: number;
  totalMinutes: number;
  percentage: number;
}

interface ProgressContextType {
  progress: ProgressData;
  updateProgress: (sections: any[]) => void;
}

const ProgressContext = createContext<ProgressContextType | null>(null);

export const ProgressProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [progress, setProgress] = useState<ProgressData>({
    completedItems: 0,
    totalItems: 0,
    completedMinutes: 0,
    totalMinutes: 0,
    percentage: 0,
  });

  const updateProgress = (sections: any[]) => {
    let totalCompleted = 0;
    let totalItems = 0;
    let totalCompletedMinutes = 0;
    let totalMinutes = 0;

    sections.forEach((section) => {
      const countableItems = (section.contentItems || []).filter(
        (item: any) =>
          item.type === "video" ||
          item.type === "article" ||
          item.type === "quiz"
      );

      totalItems += countableItems.length;
      totalCompleted += countableItems.filter(
        (item: any) => item.isCompleted
      ).length;

      countableItems.forEach((item: any) => {
        const durationMatch = item.duration?.match(/(\d+)/);
        const duration = durationMatch ? parseInt(durationMatch[1], 10) : 0;
        totalMinutes += duration;
        if (item.isCompleted) {
          totalCompletedMinutes += duration;
        }
      });
    });

    setProgress({
      completedItems: totalCompleted,
      totalItems,
      completedMinutes: totalCompletedMinutes,
      totalMinutes,
      percentage:
        totalItems > 0 ? Math.round((totalCompleted / totalItems) * 100) : 0,
    });
  };

  return (
    <ProgressContext.Provider value={{ progress, updateProgress }}>
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error("useProgress must be used within a ProgressProvider");
  }
  return context;
};
