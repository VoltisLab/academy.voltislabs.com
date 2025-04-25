"use client";

import { EmblaOptionsType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import { useMemo } from "react";
import CarouselButton, {
  usePrevNextButtons,
} from "./EmblaCarouselArrowButtons";

// Constants for carousel options and review data
const CAROUSEL_OPTIONS: EmblaOptionsType = {
  dragFree: true,
  slidesToScroll: 1,
};

const slides = [
  {
    image: "/images/newin.webp",
    name: "Beachwear from £8",
    link: "/categories/beachwear",
  },
  {
    image: "/images/dresses.webp",
    name: "Dresses 30% off",
    link: "/categories/dresses",
  },
  {
    image: "/images/swim.webp",
    name: "Swim 30% off",
    link: "/categories/swim",
  },
  {
    image: "/images/dsgn.webp",
    name: "Co-ords from £10",
    link: "/categories/co-ords",
  },
  {
    image: "/images/tops.webp",
    name: "Tops £10 and under",
    link: "/categories/tops",
  },
  {
    image: "/images/swim.webp",
    name: "Swim 30% off",
    link: "/categories/swim",
  },
  {
    image: "/images/dsgn.webp",
    name: "Co-ords from £10",
    link: "/categories/co-ords",
  },
  {
    image: "/images/tops.webp",
    name: "Tops £10 and under",
    link: "/categories/tops",
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
            {slides.map((slide, idx) => (
              <div
                key={idx}
                className="h-[258px] w-[31.5%] shrink-0 shadow bg-white"
              >
                Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                Voluptatem vero, nisi hic soluta fugiat error ad magnam rerum
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
