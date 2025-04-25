import FormFooterButtons from "./common/FormFooterButtons";
import FormHeader from "./common/FormHeader";
import CourseBasicInfoForm from "./forms/CourseBasicInfoForm";

export function BasicInformationForm() {
  return (
    <section className="space-y-10">
      <FormHeader />
      <CourseBasicInfoForm />
      <FormFooterButtons/>
    </section>
      
  
  );
}
