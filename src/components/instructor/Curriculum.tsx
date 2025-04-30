import FormFooterButtons from "./common/FormFooterButtons";
import FormHeader from "./common/FormHeader";
import CourseSectionsBuilder from "./forms/CourseSectionsBuilder";

export function Curriculum() {
  return (
    <section className="space-y-10">
      <FormHeader />
      <CourseSectionsBuilder/>
    </section>
  );
}
