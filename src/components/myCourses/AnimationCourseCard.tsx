import Image from "next/image";
import { Star } from "lucide-react";

export default function AnimationCourseCard() {
  return (
    <div className="bg-white text-gray-900 rounded-2xl w-full p-4 sm:p-0">
      <h2 className="text-lg sm:text-xl font-bold mb-3 leading-snug">
        Animation is the Key of Successful UI/UX Design
      </h2>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-4">
        <div className="flex items-center gap-3">
          <Image
            src="/mycourse/avatar.png"
            alt="Emerson Siphron"
            width={40}
            height={40}
            className="rounded-full"
          />
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-sm">
            <span className="font-medium sm:border-r sm:border-gray-300 sm:pr-3">
              Emerson Siphron
            </span>
            <span className="text-gray-500 sm:border-r sm:border-gray-300 sm:pr-3">
              UI UX Design · Apps Design
            </span>
            <span className="text-[#04A4F4]">+ Follow Mentor</span>
          </div>
        </div>

        <button className="sm:ml-auto text-sm font-semibold text-gray-800 hover:underline flex items-center gap-1">
          ⭐ 4.5 (500 Reviews)
        </button>
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-4 sm:gap-0">
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Image src="/mycourse/User.svg" alt="Students" width={16} height={16} />
            <span>500 Students</span>
          </div>
          <div className="flex items-center gap-2">
            <Image src="/mycourse/Frame.svg" alt="Modules" width={16} height={16} />
            <span>5 Modules</span>
          </div>
          <div className="flex items-center gap-2">
            <Image src="/mycourse/Clock.svg" alt="Duration" width={16} height={16} />
            <span>1h 30m</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <span>Master</span>
          <Image src="/mycourse/range.svg" alt="Level" width={13} height={12} />
        </div>
      </div>
    </div>
  );
}
