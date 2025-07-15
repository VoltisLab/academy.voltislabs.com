import Image from "next/image";
import { Card_type, Course } from "./types";
import { Heart } from "lucide-react";
import Link from "next/link";

export default function CourseCardDash({ course,card_type }: {card_type: Card_type, course: Course }) {
  return (
    <Link href={`${card_type}/${course.slug}`} key={course.id} className=" rounded-2xl shadow-lg p-2">
      <div className="relative w-full h-40 rounded-xl overflow-hidden">
        <Image
          src={course.image}
          alt={course.title}
          fill
          className="object-cover"
        />

        {/* Heart Icon */}
        <div className="absolute top-2 right-2 bg-[#CCCCCC80] bg-opacity-80 backdrop-blur-sm p-1 rounded-full shadow">
          <Heart className="w-4 h-4 text-white" />
        </div>

        {/* Beginner Label */}
       {card_type =='explore' &&  <div className="absolute bottom-2 right-2 bg-[#F3F3F3] text-gray-700 text-[10px] px-2 py-[2px] rounded-full font-semibold flex items-center justify-center gap-1">
          <span className="text-[12px]">Master</span>
          <Image src="/mycourse/range.svg" alt="Level" width={10} height={10} />
        </div>}
      </div>

      <div className="p-3 space-y-2">
        <span className="bg-[#ECEAFF] text-[#A99EF6] text-[10px] px-2 py-[2px] rounded-full font-semibold">
          {course.tag.toUpperCase()}
        </span>
        <h3 className="text-[13px] mt-2 font-medium leading-tight text-gray-800">
          {course.title}
        </h3>
        {card_type == 'explore' && <div className="flex mt-2 flex-col sm:flex-row justify-between gap-4 sm:gap-0">
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Image
                src="/mycourse/User.svg"
                alt="Students"
                width={16}
                height={16}
              />
              <span className="text-[12px]">500 Students</span>
            </div>
            <div className="flex items-center gap-2">
              <Image
                src="/mycourse/Frame.svg"
                alt="Modules"
                width={16}
                height={16}
              />
              <span className="text-[12px]">5 Modules</span>
            </div>
            <div className="flex items-center gap-2">
              <Image
                src="/mycourse/Clock.svg"
                alt="Duration"
                width={16}
                height={16}
              />
              <span className="text-[12px]">1h 30m</span>
            </div>
          </div>
        </div>}
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="bg-[#A99EF6] h-full"
            style={{ width: `${course.progress}%` }}
          />
        </div>
        {card_type !='explore' && <div className="flex items-center justify-between text-[11px] text-gray-500">
          <span>{course.modules}</span>
          <span>{course.progress}%</span>
        </div>}
        {card_type =='explore' && <div className="flex items-center gap-3">
          <Image
            src="/mycourse/avatar.png"
            alt="Emerson Siphron"
            width={40}
            height={40}
            className="rounded-full"
          />
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-sm">
            <span className="font-medium">
              Emerson Siphron
            </span>
          </div>
        </div>}
      </div>
    </Link>
  );
}
