import FormFooterButtons from "./common/FormFooterButtons";
import FormHeader from "./common/FormHeader";
import CourseDescriptionEditor from "./forms/CourseDescriptionEditor";
import CourseObjectivesInput from "./forms/CourseObjectivesInput";
import MediaUploadForm from "./forms/MediaUploadForm";

export function AdvanceInformationForm() {
  return (
    <section className="space-y-10">
      <FormHeader />
     <MediaUploadForm/>
     <CourseDescriptionEditor/>
     <CourseObjectivesInput title="tt"/>
      <FormFooterButtons/>
    </section>
      
  
  );
}
