import React from "react";
const descriptionParagraphseg = [
  "The community's need for applications that can facilitate daily activities is increasing as technology advances. Currently, many companies are looking for developers so that they can sell products (goods or services) that can reach wider buyers online...",
  "Our expert Mentors will explain how to create a furniture application from the design to code stage using the flagship Google Flutter SDK framework...",
  "This class is suitable for those of you who want to deepen complete mobile application development on the front-end side...",
];

const keyPointseg = [
  "Understand the basics of Prototype & Animation",
  "Understand the basics of Microinteraction",
  "Creating Animation (20 case studies) for mobile apps",
  "Presenting designs using Animation",
];
const DescriptionComponent = ({
  title = "Description",
  descriptionParagraphs = descriptionParagraphseg,
  keyPoints = keyPointseg,
}) => {
  return (
    <div className="text-gray-800   mx-auto md:px-4 py-2">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>

      {descriptionParagraphs.map((paragraph, index) => (
        <p
          key={index}
          className="mb-4 text-justify text-sm leading-relaxed text-gray-600"
        >
          {paragraph}
        </p>
      ))}

      <h3 className="text-xl font-semibold mt-8 mb-4">Key Point</h3>
      <ul className="space-y-3">
        {keyPoints.map((point, index) => (
          <li key={index} className="flex  items-center gap-2">
            <div
              className={`w-6 h-6 bg-[#ABABAB] text-[white] rounded-full
               flex items-center justify-center text-xs mr-3`}
            >
              { "✓" }
            </div>
            <span className="text-sm text-gray-700 ">{point}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DescriptionComponent;
