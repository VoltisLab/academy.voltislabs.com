import FormFooterButtons from "./common/FormFooterButtons";
import FormHeader from "./common/FormHeader";
import CourseSectionsBuilder from "./forms/CourseSectionsBuilder";
interface BasicInformationFormProps {
  onSaveNext: () => void;
}

export const Curriculum = ({ onSaveNext }: BasicInformationFormProps) => {
  return (
    <section className="space-y-10">
      <FormHeader />
      <CourseSectionsBuilder/>
    </section>
  );
}
