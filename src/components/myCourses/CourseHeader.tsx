"use client";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation"; // ✅ not next/router

export default function CourseHeader({ title }: { title: string }) {
  const router = useRouter();

  return (
    <div className="flex cursor-pointer items-center gap-2 w-full overflow-hidden">
      <button
        className="bg-[#F6F6F8] rounded-full p-2"
        onClick={() => router.back()}
      >
        <ArrowLeft className="w-4 h-4" />
      </button>
      <div className="flex-1 text-[#1A1A1A] truncate text-sm font-medium">
        <span className="underline">{title}</span>
        <span className="no-underline">{' / '}details</span>
      </div>
    </div>
  );
}
