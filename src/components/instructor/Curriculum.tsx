import FormFooterButtons from "./common/FormFooterButtons";
import FormHeader from "./common/FormHeader";
import CourseSectionsBuilder from "./forms/CourseSectionsBuilder";

interface BasicInformationFormProps {
  onSaveNext: () => void;
  courseId?: number;
}
export const Curriculum = ({ onSaveNext, courseId }: BasicInformationFormProps) => {
  return (
    <section className="space-y-10">
      <FormHeader />
      <CourseSectionsBuilder/>
    </section>
  );
}
