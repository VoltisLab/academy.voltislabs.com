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
      <Title className="text-[#313273]">{title}</Title>
      <div className="text-center px-4 sm:px-10 md:px-20 !text-[#313273] xl:px-56 mt-4 ">
        <Subtitle className="font-medium mb-8 text-[#313273]">{subTitle}</Subtitle>
        <Subtitle className="text-[#313273] font-normal ">
          {secondaryText}
        </Subtitle>
      </div>
    </div>
  );
};

export default TitleSection;
