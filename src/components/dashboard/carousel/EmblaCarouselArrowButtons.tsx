import React, {
  ComponentPropsWithRef,
  useCallback,
  useEffect,
  useState,
} from "react";
import { EmblaCarouselType } from "embla-carousel";
import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";

// Type definition for our custom hook's return values
type UsePrevNextButtonsType = {
  prevBtnDisabled: boolean; // Indicates if the previous button should be disabled
  nextBtnDisabled: boolean; // Indicates if the next button should be disabled
  onPrevButtonClick: () => void; // Function to handle previous button clicks
  onNextButtonClick: () => void; // Function to handle next button clicks
};

/**
 * Custom hook to handle the carousel's previous/next buttons and their states.
 * It manages button enable/disable states and handles button clicks.
 */
export const usePrevNextButtons = (
  emblaApi: EmblaCarouselType | undefined // Carousel API to control scrolling
): UsePrevNextButtonsType => {
  // States to keep track of button disabled statuses
  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true);

  // Function to scroll the carousel to the previous item
  const onPrevButtonClick = useCallback(() => {
    if (!emblaApi) return; // If API isn't ready, do nothing
    emblaApi.scrollPrev();
  }, [emblaApi]);

  // Function to scroll the carousel to the next item
  const onNextButtonClick = useCallback(() => {
    if (!emblaApi) return; // If API isn't ready, do nothing
    emblaApi.scrollNext();
  }, [emblaApi]);

  // Function to update button states based on the carousel's current position
  const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
    setPrevBtnDisabled(!emblaApi.canScrollPrev()); // Disable prev button if at the start
    setNextBtnDisabled(!emblaApi.canScrollNext()); // Disable next button if at the end
  }, []);

  // Effect to attach `onSelect` function to the carousel events when the API is available
  useEffect(() => {
    if (!emblaApi) return; // Exit if API isn't initialized yet

    // Initialize button states on load
    onSelect(emblaApi);

    // Attach `onSelect` to carousel events to update button states on each interaction
    emblaApi.on("reInit", onSelect).on("select", onSelect);
  }, [emblaApi, onSelect]);

  // Return an object containing the button states and click handlers
  return {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  };
};

// Shared type for button components to inherit HTML button properties
type CarouselButtonProps = ComponentPropsWithRef<"button"> & {
  direction: "prev" | "next"; // Specifies button direction
};

/**
 * CarouselButton Component
 * Renders a reusable button for carousel navigation.
 * - Accepts a `direction` prop to control the icon's orientation (back or forward).
 */
const CarouselButton: React.FC<CarouselButtonProps> = ({
  direction,
  children,
  ...restProps
}) => {
  const Icon = direction === "prev" ? BsChevronLeft : BsChevronRight;

  return (
    <button
      className="flex size-6 p-1.5 cursor-pointer items-center justify-center rounded-full border border-[#9E9E9E] transition disabled:brightness-125 disabled:cursor-not-allowed"
      type="button"
      {...restProps} // Enables additional properties like disabled state
    >
      <Icon className="text-[#9E9E9E]" />{" "}
      {/* Renders left or right icon based on direction prop */}
      {children}
    </button>
  );
};

export default CarouselButton;
