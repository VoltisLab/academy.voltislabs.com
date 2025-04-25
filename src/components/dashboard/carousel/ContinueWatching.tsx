"use client";

import { EmblaOptionsType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import { useMemo } from "react";
import CarouselButton, {
  usePrevNextButtons,
} from "./EmblaCarouselArrowButtons";
import { Course } from "@/components/myCourses/types";
import CourseCardDash from "@/components/myCourses/CourseCardDash";

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
export default function ContinueWatching() {
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
    <section className="overflow-y-hidden space-y-1">
      {/* Embla heading */}
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-[#202020] font-semibold">Continue Watching</h2>{" "}
        {/* Carousel buttons */}
        <div className="flex items-center gap-3">
          <CarouselButton
            direction="prev"
            onClick={onPrevButtonClick}
            disabled={prevBtnDisabled}
          />
          <CarouselButton
            direction="next"
            onClick={onNextButtonClick}
            disabled={nextBtnDisabled}
          />
        </div>
      </div>

      {/* Embla container */}
      <div>
        {/* Embla viewport */}
        <div ref={emblaRef} className="overflow-hidden">
          {/* Flex container for the displayed categories */}
          <div className="flex gap-4.5">
            {courses.map((course, idx) => (
              <div key={idx} className="w-[252px] shrink-0 ">
                <CourseCardDash
                  key={course.id}
                  course={course}
                  card_type={"my-courses"}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
