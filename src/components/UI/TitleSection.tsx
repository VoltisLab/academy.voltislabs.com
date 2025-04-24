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
      <Title className="text-white">{title}</Title>
      <div className="text-center px-4 sm:px-10 md:px-20 !text-white xl:px-56 mt-4 ">
        <Subtitle className="font-medium mb-8 text-white">{subTitle}</Subtitle>
        <Subtitle className="text-white font-normal ">
          {secondaryText}
        </Subtitle>
      </div>
    </div>
  );
};

export default TitleSection;
