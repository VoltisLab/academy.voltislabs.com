import Image from "next/image";

export default function CourseCard({
  title,
  date,
  description,
  image,
}: // students,
{
  title: string;
  date: string;
  description: string;
  image: string;
  students: number;
}) {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md">
      {/* Image */}
      <div className="relative h-[193px] w-full">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover w-full h-full"
        />
      </div>

      {/* Content */}
      <div className="p-4 space-y-2">
        <p className="text-xs text-gray-500">{date}</p>
        <h3 className="font-semibold text-[24px] h-[60px] text-black leading-tight line-clamp-2">
          {title}
        </h3>
        <p
          className="h-[72px] text-[16px] text-[#4D4D4D] line-clamp-4"
          dangerouslySetInnerHTML={{ __html: description }}
        />

        <div className="flex items-center justify-between pt-4">
          <span className="text-[#DC4298] font-bold text-sm">FREE</span>
          <button className="text-[#DC4298] border border-[#DC4298] rounded-full px-3 py-1 text-sm hover:bg-pink-50 transition">
            Read more
          </button>
        </div>
      </div>
    </div>
  );
}
