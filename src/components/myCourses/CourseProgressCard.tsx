import Image from "next/image";
import { Star } from "lucide-react";
import { Card_type } from "./types";

interface Module {
  title: string;
  duration: string;
  completed: boolean;
}

interface CourseProgressCardProps {
  card_type: Card_type;
  title: string;
  author: string;
  rating: number;
  avatarUrl: string;
  completedModules: number;
  totalModules: number;
  modules: Module[];
}

export default function CourseProgressCard({
  title,
  author,
  rating,
  card_type = "my-courses",
  avatarUrl,
  completedModules,
  totalModules,
  modules,
}: CourseProgressCardProps) {
  const progress = Math.floor((completedModules / totalModules) * 100);

  return (
    <div className="shadow-md bg-white hidden md:block rounded-2xl  p-8 max-w-96 text-gray-900 font-sans">
      <h2 className="text-xl font-bold leading-snug mb-3">{title}</h2>
      <div className="flex items-center gap-3 mb-4">
        <div className="relative h-[36px] w-[36px]">
          <Image
            src={avatarUrl}
            alt={author}
            fill
            className="rounded-full object-cover"
          />

        </div>
        <span className="text-sm font-medium">{author}</span>
        <div className="flex items-center gap-1 ml-auto text-sm text-yellow-500">
          <Star size={16} fill="currentColor" />
          <span>{rating.toFixed(1)}</span>
        </div>
      </div>

      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-1">
        <div
          className="h-full bg-gray-600"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <div className="text-xs flex justify-between my-5 text-gray-500 mb-4">
        <span>
          {completedModules}/{totalModules} Module &nbsp;&nbsp;&nbsp;{" "}
        </span>
        <span>{progress}%</span>
      </div>

      <div className="text-sm font-medium mb-2">
        {totalModules} Module{" "}
        <span className="float-right font-normal text-gray-400">
          {completedModules}/{totalModules} Done
        </span>
      </div>

      <div className="space-y-3">
        {modules?.map((module, index) => (
          <div key={index} className={`flex items-center text-sm `}>
            <div
              className={`w-6 h-6 ${
                module?.completed
                  ? "bg-[#25C78B] rounded-full    ` text-white"
                  : "bg-gray-100 text-gray-800 rounded-[8px]"
              }  flex items-center justify-center text-xs mr-3`}
            >
              {module?.completed ? "✓" : index + 1}
            </div>
            <span
              className={`${
                module?.completed ? "text-gray-400 line-through" : ""
              } flex-1`}
            >
              {module?.title}
            </span>
            <span className="text-gray-400">{module.duration ?? "10:00"}</span>
          </div>
        ))}
      </div>

      <div className="flex gap-2 mt-6">
        {card_type === "explore" ? (
          <button className="flex-1 cursor-pointer bg-[#313273] text-white text-sm rounded-lg py-4 transition">
            Enroll
          </button>
        ) : (
          <>
            <button className="flex-1 cursor-pointer border border-gray-300 text-gray-700 text-sm rounded-lg py-4 hover:bg-gray-100 transition">
              Give Review
            </button>
            <button className="flex-1  bg-[#ABABAB] text-white text-sm rounded-lg py-4 hover:bg-gray-700 transition">
              Next Module
            </button>
          </>
        )}
      </div>
    </div>
  );
}
