import dynamic from "next/dynamic";
import Link from "next/link";
import { notFound } from "next/navigation";
import { IoChevronBack } from "react-icons/io5";

// Lazy import components
const sections = {
  overview: dynamic(() => import("@/components/dashboard/Overview")),
  explore: dynamic(() => import("@/components/dashboard/ExploreCourses")),
  "my-courses": dynamic(() => import("@/components/dashboard/MyCourses")),
  message: dynamic(() => import("@/components/dashboard/Message")),
};

export default async function SectionPage({
  params,
}: {
  params: { section: string };
}) {
  const param = await params;
  const SectionComponent = sections[param.section as keyof typeof sections];

  if (!SectionComponent) {
    return notFound();
  }

  return (
    <div>
      <SectionComponent />
    </div>
  );
}
