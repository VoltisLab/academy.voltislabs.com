"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { ExtendedLecture } from "@/lib/types";

interface AssignmentContextProps {
  assignmentData: ExtendedLecture;
  setAssignmentData: (data: any) => void;
}

const AssignmentContext = createContext<AssignmentContextProps | undefined>(
  undefined
);

interface AssignmentProviderProps {
  children: ReactNode;
  initialData?: ExtendedLecture;
}

export const AssignmentProvider = ({
  children,
  initialData,
}: AssignmentProviderProps) => {
  const [assignmentData, setAssignmentData] = useState<ExtendedLecture>({
    id: Date.now().toString(),
    name: "",
    description: "",
    captions: "",
    lectureNotes: "",
    attachedFiles: [],
    videos: [],
    contentType: "assignment",
    isExpanded: false,
    assignmentTitle: "",
    assignmentDescription: "",
    estimatedDuration: 0,
    durationUnit: "minutes",
    assignmentInstructions: "",
    assignmentQuestions: [],
    // isPublished: false,
    ...initialData,
    isPublished:
      initialData?.isPublished !== undefined ? initialData.isPublished : false,
  });

  useEffect(() => {
    console.log("AssignmentProvider initialData changed:", initialData);
  }, [initialData]);

  useEffect(() => {
    if (initialData && initialData.id !== assignmentData.id) {
      setAssignmentData({
        ...{
          id: Date.now().toString(),
          name: "",
          description: "",
          captions: "",
          lectureNotes: "",
          attachedFiles: [],
          videos: [],
          contentType: "assignment",
          isExpanded: false,
          assignmentTitle: "",
          assignmentDescription: "",
          estimatedDuration: 0,
          durationUnit: "minutes",
          assignmentInstructions: "",
          assignmentQuestions: [],
        },
        ...initialData,
        isPublished: initialData.isPublished ?? false,
      });
    }
  }, [initialData?.id]); // Only react to ID changes

  return (
    <AssignmentContext.Provider value={{ assignmentData, setAssignmentData }}>
      {children}
    </AssignmentContext.Provider>
  );
};

export const useAssignment = () => {
  const context = useContext(AssignmentContext);
  if (!context) {
    throw new Error("useAssignment must be used within an AssignmentProvider");
  }
  return context;
};
