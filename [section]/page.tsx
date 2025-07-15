import dynamic from "next/dynamic";
import Link from "next/link";
import { notFound } from "next/navigation";
import { IoChevronBack } from "react-icons/io5";

// Lazy import components
const sections = {
  overview: dynamic(() => import("@/app/dashboard/overview/page")),
  "explore": dynamic(
    () => import("@/app/dashboard/explore/page")
  ),
  "my-courses": dynamic(() => import("@/app/dashboard/my-courses/page")),
  message: dynamic(() => import("@/app/dashboard/messages/page")),
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
