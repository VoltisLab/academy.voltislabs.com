import React from "react";

interface TitleProp {
  children: string;
  className?: string;
  props?: any;
}

const Title = ({ children, className, props }: TitleProp) => {
  return (
    <h1
      {...props}
      className={`md:text-[2.4rem] font-semibold mx-auto md:w-[75%] w-full text-[2rem] ${className}`}
    >
      {children}
    </h1>
  );
};

export default Title;
