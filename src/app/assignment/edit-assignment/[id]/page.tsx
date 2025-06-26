"use client";
import AssignmentEditor from "@/components/instructor/create-new-course/curriculum/components/assignment/AssignmentEditor";
import { AssignmentProvider } from "@/context/AssignmentDataContext";
import React from "react";
import { Toaster } from "react-hot-toast";

const page = () => {
  return (
    <div>
      <AssignmentProvider>
        <Toaster />
        <AssignmentEditor
          initialData={{
            id: "1",
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
            isPublished: false,
          }}
          newAssinment={1}
          onClose={() => {}}
          onSave={(data) => console.log("Saved:", data)}
        />
      </AssignmentProvider>
    </div>
  );
};

export default page;
