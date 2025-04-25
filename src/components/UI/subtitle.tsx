import React from "react";

interface TitleProp {
  children: string;
  className?: string;
  props?: React.HTMLAttributes<HTMLHeadingElement>;
}

const Subtitle = ({ children, className, props }: TitleProp) => {
  return (
    <h1
      {...props}
      className={`md:text-[.9rem] mx-auto md:w-[65%] w-[90%] text-base ${className}`}
    >
      {children}
    </h1>
  );
};

export default Subtitle;