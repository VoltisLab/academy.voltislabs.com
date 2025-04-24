import Image from "next/image";
import { Star } from "lucide-react";

export default function AnimationCourseCard() {
  return (
    <div className="bg-white   text-gray-900 rounded-2xl  w-full">
      <h2 className="text-[1.5rem] font-bold mb-2">
        Animation is the Key of Successfull UI/UX Design
      </h2>

      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-2 ">
          <Image
            src="/mycourse/avatar.png"
            alt="Emerson Siphron"
            width={40}
            height={40}
            className="rounded-full"
          />
          <div className="flex gap-2 ">
            <span className="font-medium border-r border-gray-300 pr-4">
              Emerson Siphron
            </span>
            <span className="text-gray-500 border-r border-gray-300 pr-4">
              UI UX Design · Apps Design
            </span>
            <span className="t text-blue-500 "> + Follow Mentor</span>
          </div>
        </div>
        <button className="ml-auto text-blue-500 font-semibold text-sm hover:underline">
          ⭐ 4,5 (500 Reviews)
        </button>
      </div>

      <div className="flex justify-between ">
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-1">
            <span>
              <Image
                src="/mycourse/User.svg"
                alt="user"
                width={16}
                height={16}
                className="rounded-full"
              />
            </span>
            <span className="ta">500 Student</span>
          </div>
          <div className="flex items-center gap-1">
            <span>
              <Image
                src="/mycourse/Frame.svg"
                alt="FRAME"
                width={16}
                height={16}
                className="rounded-full"
              />
            </span>
            <span>5 Module</span>
          </div>
          <div className="flex items-center gap-1">
            <span>
              <Image
                src="/mycourse/Clock.svg"
                alt="clock"
                width={16}
                height={16}
                className="rounded-full"
              />
            </span>
            <span>1h 30m</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <span>Master</span>
          <Image
            src="/mycourse/range.svg"
            alt="clock"
            width={13}
            height={12}
          />
        </div>
      </div>
    </div>
  );
}
