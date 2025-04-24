import React from "react";
import Title from "./Title";
import Subtitle from "./subtitle";

interface TitleProps {
  title: string;
  subTitle: string;
  secondaryText: string;
  containerStyle?: string;
}

const TitleSection = ({
  title,
  subTitle,
  secondaryText,
  containerStyle,
}: TitleProps) => {
  return (
    <div className={`text-center px-4 pt-20 ${containerStyle}`}>
      <Title className="text-[#DC4298]">{title}</Title>
      <div className="text-center px-4 sm:px-10 md:px-20 !text-[#DC4298] xl:px-56 mt-4 ">
        <Subtitle className="font-medium mb-8 text-[#DC4298]">{subTitle}</Subtitle>
        <Subtitle className="text-[#DC4298] font-normal ">
          {secondaryText}
        </Subtitle>
      </div>
    </div>
  );
};

export default TitleSection;
