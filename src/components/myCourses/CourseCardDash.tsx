import Image from "next/image";
import { Card_type, Course } from "./types";
import { Heart } from "lucide-react";
import Link from "next/link";

const isValidImageSrc = (src: string) =>
  src?.startsWith("/") || src?.startsWith("http://") || src?.startsWith("https://");
export default function CourseCardDash({ course,card_type }: {card_type: Card_type, course: any }) {
  return (
    <Link href={`${card_type}/${course?.id}`} key={course?.id} className=" rounded-2xl shadow-lg p-2">
      <div className="relative w-full h-40 rounded-xl overflow-hidden">
        <Image
          src={course?.banner?.url}
          alt={course?.title}
          fill
          className="object-cover"
        />

        {/* Heart Icon */}
        <div className="absolute top-2 right-2 bg-[#CCCCCC80] bg-opacity-80 backdrop-blur-sm p-1 rounded-full shadow">
          <Heart className="w-4 h-4 text-white" />
        </div>

        {/* Beginner Label */}
       {card_type =='explore' &&  <div className="absolute bottom-2 right-2 bg-[#F3F3F3] text-gray-700 text-[10px] px-2 py-[2px] rounded-full font-semibold flex items-center justify-center gap-1">
          <span className="text-[12px]">{course?.level?.charAt(0)?.toUpperCase() + course?.level?.slice(1)?.toLowerCase()}</span>
          <Image src="/mycourse/range.svg" alt="Level" width={10} height={10} />
        </div>}
      </div>

      <div className="p-3 space-y-2">
        <span className="bg-[#ECEAFF] text-[#A99EF6] text-[10px] px-2 py-[2px] rounded-full font-semibold">
          {course?.category?.name?.toUpperCase()}
        </span>
        <h3 className="text-[13px] mt-2 font-medium leading-tight text-gray-800">
          {course?.title}
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
              <span className="text-[12px]">{course?.sections?.length} Modules</span>
            </div>
            <div className="flex items-center gap-2">
              <Image
                src="/mycourse/Clock.svg"
                alt="Duration"
                width={16}
                height={16}
              />
              <span className="text-[12px]">{JSON.parse(course?.duration)?.value} {JSON.parse(course?.duration)?.unit?.toLowerCase()}{JSON.parse(course?.duration)?.value>1 && "s"}</span>
            </div>
          </div>
        </div>}
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="bg-[#A99EF6] h-full"
            style={{ width: `${course?.progress}%` }}
          />
        </div>
        {card_type !='explore' && <div className="flex items-center justify-between text-[11px] text-gray-500">
          <span>{course?.modules}</span>
          <span>{course?.progress}%</span>
        </div>}
        {card_type =='explore' && <div className="flex items-center gap-3">
          <div className="relative h-[40px] w-[40px] ">
          <Image
            src={ isValidImageSrc(course?.instructor?.profilePictureUrl) ? course?.instructor?.profilePictureUrl : "/mycourse/avatar.png"}
            alt={course?.instructor?.fullName}
           fill
            className="rounded-full object-cover"
          />

          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-sm">
            <span className="font-medium">
              {course?.instructor?.fullName}
            </span>
          </div>
        </div>}
      </div>
    </Link>
  );
}
