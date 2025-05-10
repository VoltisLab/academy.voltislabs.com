import { useState } from "react";
import FormHeader from "../../layout/FormHeader";
import CourseSectionsBuilder from "./CourseSectionBuilder";
interface BasicInformationFormProps {
  onSaveNext: () => void;
  courseId?: number;
}

const handleCurriculm = () => {

}

export const Curriculum = ({ onSaveNext, courseId }: BasicInformationFormProps) => {
  const [loading, setLoading] = useState<boolean>(false)
  return (
    <section className="space-y-10">
      <FormHeader title="Curriculum" loading={loading} handleCourseCreation={handleCurriculm} />
      <CourseSectionsBuilder onSaveNext={onSaveNext} courseId={courseId}/>
    </section>
  );
}
