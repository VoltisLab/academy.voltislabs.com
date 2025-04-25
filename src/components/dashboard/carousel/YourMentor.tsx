"use client";

import { EmblaOptionsType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import { useMemo } from "react";
import CarouselButton, {
  usePrevNextButtons,
} from "./EmblaCarouselArrowButtons";
import { Course } from "@/components/myCourses/types";
import CourseCardDash from "@/components/myCourses/CourseCardDash";
import Image from "next/image";

// Constants for carousel options and review data
const CAROUSEL_OPTIONS: EmblaOptionsType = {
  dragFree: true,
  slidesToScroll: "auto",
};

const courses: Course[] = [
  {
    id: 1,
    image: "/courses/backend.png",
    tag: "Frontend",
    title: "Beginner's Guide To Becoming A Professional Frontend Developer",
    modules: "3/5 Module",
    progress: 60,
    slug: "backend",
  },
  {
    id: 2,
    image: "/courses/frontend.png",
    tag: "Frontend",
    title: "Beginner's Guide To Becoming A Professional Frontend Developer",
    modules: "1/5 Module",
    progress: 20,
    slug: "frontend",
  },
  {
    id: 3,
    image: "/courses/graphic.png",
    tag: "Frontend",
    title: "Beginner's Guide To Becoming A Professional Frontend Developer",
    modules: "3/5 Module",
    progress: 60,
    slug: "graphic",
  },
  {
    id: 4,
    image: "/courses/pm.png",
    tag: "Frontend",
    title: "Beginner's Guide To Becoming A Professional Frontend Developer",
    modules: "1/5 Module",
    progress: 20,
    slug: "pm",
  },
  {
    id: 5,
    image: "/courses/graphic.png",
    tag: "Frontend",
    title: "Beginner's Guide To Becoming A Professional Frontend Developer",
    modules: "3/5 Module",
    progress: 60,
    slug: "graphic",
  },
  {
    id: 6,
    image: "/courses/pm.png",
    tag: "Frontend",
    title: "Beginner's Guide To Becoming A Professional Frontend Developer",
    modules: "1/5 Module",
    progress: 20,
    slug: "pm",
  },
];
// Main Reviews component
export default function YourMentor() {
  // Memoizing the carousel options to avoid re-creation on every render
  const options = useMemo(() => CAROUSEL_OPTIONS, []);

  // Initializing embla carousel with custom options
  const [emblaRef, emblaApi] = useEmblaCarousel(options);

  // Destructuring functions and states for carousel buttons
  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(emblaApi);

  return (
    <section className="overflow-y-hidden">
      {/* Embla container */}
      <div>
        {/* Embla viewport */}
        <div ref={emblaRef} className="overflow-hidden">
          {/* Flex container for the displayed categories */}
          <div className="flex gap-4.5 select-none cursor-grab">
            {courses.map((course, idx) => (
              <div key={idx} className="w-[224px] shrink-0">
                <div className="bg-white/30 relative space-y-4 p-3 shadow border-b border-gray-200 rounded-t-xl">
                  <div className="size-[42px] relative">
                    <Image
                      src={"/guy.jpg"}
                      alt="Logo"
                      fill
                      sizes="(max-width: 768px) 100vw, 128px"
                      className="object-cover rounded-full"
                    />
                  </div>

                  <div className="text-[#202020] space-y-0.5">
                    <h1 className="text-xs font-semibold">
                      Prashant kumar Singh
                    </h1>
                    <p className="text-[10px]">Software Developer</p>
                  </div>

                  <button className="absolute right-2 top-2 inline-block text-[10px] bg-[#ECEBFF] text-[#313273] rounded-[8px] px-3 py-1">
                    Frontend
                  </button>
                </div>

                <div className="p-3 space-y-2.5">
                  <div>
                    <p className="text-[#525255] text-[10px] font-medium mb-0.5">
                      Course Title
                    </p>
                    <p className="text-sm font-semibold">
                      Beginner’s Guide to becoming a professional frontend
                      developer
                    </p>
                  </div>
                  <button className="text-xs w-full bg-[#3366CC33] rounded-[16px] px-3 py-1 text-[#3366CC]">
                    Show details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
