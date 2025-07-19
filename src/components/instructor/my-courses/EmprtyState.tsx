import { BookOpen, Clock, Pencil, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

const statusIcons: Record<string, React.ReactNode> = {
  ALL: <BookOpen className="w-14 h-14 text-gray-300 mb-4" />,
  DRAFT: <Pencil className="w-14 h-14 text-red-400 mb-4" />,
  PUBLISHED: <CheckCircle className="w-14 h-14 text-green-400 mb-4" />,
  PROCESSING: <Clock className="w-14 h-14 text-yellow-400 mb-4" />,
};

export function EmptyCourses({ status = "ALL" }: { status?: string }) {
  // Capitalize for text
  const getLabel = () => {
    if (status === "ALL" || !status)
      return (
        <>
          You haven’t created any courses yet.
          <br />
          Click <Link href={"/instructor/create-new-course"} prefetch className="font-bold">“Create”</Link>  to get started!
        </>
      );
    if (status === "PROCESSING")
      return <>No pending course found.</>;
    if (status === "DRAFT")
      return <>No draft course found.</>;
    if (status === "PUBLISHED")
      return <>No published course found.</>;
    // fallback
    return <>No course found for selected filter.</>;
  };

  return (
    <motion.div
      className="flex flex-col items-center justify-center py-24"
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
    >
      {/* Icon */}
      {statusIcons[status || "ALL"] || statusIcons.ALL}
      <h3 className="text-lg font-bold text-gray-600 mb-1">
        {status === "PROCESSING" || !status
          ? "No Courses Found"
          : status === "PROCESSING"
          ? "No Pending Course"
          : status === "DRAFT"
          ? "No Draft Course"
          : status === "PUBLISHED"
          ? "No Published Course"
          : "No Courses"}
      </h3>
      <div className="text-gray-400 text-sm text-center max-w-xs">
        {getLabel()}
      </div>
    </motion.div>
  );
}
