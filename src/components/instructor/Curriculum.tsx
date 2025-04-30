import { BasicInformationFormProps } from "@/lib/types";
import FormFooterButtons from "./common/FormFooterButtons";
import FormHeader from "./common/FormHeader";
import CourseSectionsBuilder from "./forms/CourseSectionsBuilder";

export const Curriculum = ({ onSaveNext, courseId }: BasicInformationFormProps) => {
  return (
    <section className="space-y-10">
      <FormHeader />
      <CourseSectionsBuilder onSaveNext={onSaveNext} courseId={courseId}/>
    </section>
  );
}
