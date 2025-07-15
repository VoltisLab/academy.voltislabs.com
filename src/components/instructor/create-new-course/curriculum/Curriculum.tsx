import { useState } from "react";
import FormHeader from "../../layout/FormHeader";
import CourseSectionsBuilder from "./CourseSectionBuilder";
import { AssignmentProvider } from "@/context/AssignmentDataContext";
import { ExtendedLecture } from "@/lib/types";

interface CurriculumProps {
  onSaveNext: () => void;
  courseId?: number;
}

const handleCurriculm = () => {};

export const Curriculum = ({ onSaveNext, courseId }: CurriculumProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [currentAssignment, setCurrentAssignment] = useState<{
    sectionId: string;
    lectureId: string;
    data: ExtendedLecture;
  } | null>(null);
  return (
    <AssignmentProvider initialData={currentAssignment?.data}>
      <section className="space-y-10 pb-6">
        <FormHeader
          title="Curriculum"
          loading={loading}
          handleCourseCreation={handleCurriculm}
        />
        <CourseSectionsBuilder
          onSaveNext={onSaveNext}
          courseId={courseId}
          currentAssignment={currentAssignment}
          setCurrentAssignment={setCurrentAssignment}
        />
      </section>
    </AssignmentProvider>
  );
};
