import Image from "next/image";
import { Star } from "lucide-react";

const isValidImageSrc = (src: string) =>
  src?.startsWith("/") || src?.startsWith("http://") || src?.startsWith("https://");
export default function AnimationCourseCard({data}: {data?: any}) {
  return (
    <div className="bg-white text-gray-900 rounded-2xl w-full p-4 sm:p-0">
      <h2 className="text-lg sm:text-xl font-bold mb-3 leading-snug">
    {data?.title}     
     </h2>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="relative h-[40px] w-[40px]">
          <Image
            src={isValidImageSrc(data?.instructor?.profilePictureUrl) ? data?.instructor?.profilePictureUrl :"/mycourse/avatar.png"}
            alt="Emerson Siphron"
            fill
            className="rounded-full object-cover"
          />

          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-sm">
            <span className="font-medium sm:border-r sm:border-gray-300 sm:pr-3">
             {data?.instructor?.fullName}
            </span>
            <span className="text-gray-500 sm:border-r sm:border-gray-300 sm:pr-3">
              {data?.category?.name}
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
            <span>{data?.section?.length} Modules</span>
          </div>
          <div className="flex items-center gap-2">
            <Image src="/mycourse/Clock.svg" alt="Duration" width={16} height={16} />
{data?.duration ? (
  (() => {
    const duration = JSON.parse(data.duration);
    return (
      <span>
        {duration.value} {duration.unit?.toLowerCase()}
        {duration.value > 1 && "s"}
      </span>
    );
  })()
) : (
  ""
)}          </div>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <span>{data?.level?.charAt(0)?.toUpperCase() + data?.level?.slice(1)?.toLowerCase()}</span>
          <Image src="/mycourse/range.svg" alt="Level" width={13} height={12} />
        </div>
      </div>
    </div>
  );
}
