import { ArrowLeft } from "lucide-react";

export default function CourseHeader({ title }: { title: string }) {
  return (
    <div className="flex cursor-pointer items-center gap-2 w-full overflow-hidden ">
      <button className="bg-[#F6F6F8] rounded-full p-2">
        <ArrowLeft className="w-4 h-4" />
      </button>
      <div className="flex-1  text-[#1A1A1A] truncate text-sm font-medium">
         <span className="text-decoration underline">{title}</span><span className="text-decoration none">{' '}/{' '} details</span>
      </div>
    </div>
  );
}
