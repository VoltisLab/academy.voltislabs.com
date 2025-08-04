import Image from "next/image";
import { useRouter } from "next/navigation";

export default function CourseCard({
  title,
  date,
  description,
  image,
  id,
}: {
  title: string;
  date: string;
  description: string;
  image: string;
  students: number;
  id?: string;
}) {
  const router = useRouter();

  const handleCardClick = () => {
    if (id) {
      router.push(`/programmes/${id}`);
    }
  };

  return (
    <div 
      className="bg-white rounded-xl overflow-hidden shadow-md cursor-pointer hover:shadow-lg transition-shadow duration-300"
      onClick={handleCardClick}
    >
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
          <button 
            className="text-[#DC4298] border border-[#DC4298] rounded-full px-3 py-1 text-sm hover:bg-pink-50 transition"
            onClick={(e) => {
              e.stopPropagation();
              if (id) {
                router.push(`/programmes/${id}`);
              }
            }}
          >
            Read more
          </button>
        </div>
      </div>
    </div>
  );
}
