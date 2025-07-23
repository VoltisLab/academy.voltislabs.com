import React from "react";
import { IoPlayOutline } from "react-icons/io5";
import { MdStar } from "react-icons/md";

interface BannerProps {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
  actionIcon?: React.ReactNode;
  children?: React.ReactNode;
}

const Banner: React.FC<BannerProps> = ({
  title,
  subtitle = "Online Course",
  actionLabel = "Join Now",
  onAction,
  actionIcon = <IoPlayOutline className="size-2 text-black" />,
  children,
}) => {
  return (
    <div className="relative bg-[#313273] text-white rounded-[20px] px-6 py-5 space-y-4 overflow-hidden">
      <p className="uppercase text-xs">{subtitle}</p>
      <p className="font-semibold text-2xl lg:w-2/3 xl:w-1/2">{title}</p>
      {children}
      {actionLabel && (
        <button
          className="bg-[#202020] flex items-center gap-2 py-2 px-4 rounded-[40px] transition cursor-pointer hover:bg-black"
          onClick={onAction}
        >
          <span className="text-xs">{actionLabel}</span>
          <span className="bg-white flex justify-center items-center rounded-full size-5">
            {actionIcon}
          </span>
        </button>
      )}
      {/* Stars background */}
      <MdStar className="absolute text-white/10 size-14.5 top-5 right-[157px] pointer-events-none" />
      <MdStar className="absolute text-white/10 h-29.5 w-20 top-28 right-[148px] pointer-events-none" />
      <MdStar className="absolute text-white/25 w-[80px] h-[80px] top-[45px] right-[77px] pointer-events-none" />
      <MdStar className="absolute text-white/10 w-[61px] h-[118px] -top-[59px] right-[26px] pointer-events-none" />
      <MdStar className="absolute text-white/10 w-[80px] h-[80px] top-[93px] right-[7px] pointer-events-none" />
    </div>
  );
};

export default Banner; 