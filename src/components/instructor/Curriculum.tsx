import dynamic from "next/dynamic";
import FormFooterButtons from "./common/FormFooterButtons";
import FormHeader from "./common/FormHeader";

// ⬇️ Dynamically import CourseSectionsBuilder with SSR disabled
const CourseSectionsBuilder = dynamic(() => import("./forms/CourseSectionsBuilder"), { ssr: false });

export function Curriculum() {
  return (
    <section className="space-y-10">
      <FormHeader />
      <CourseSectionsBuilder />
      <FormFooterButtons />
    </section>
  );
}
