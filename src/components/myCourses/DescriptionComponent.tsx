import React from "react";

const keyPointseg = [
  "Understand the basics of Prototype & Animation",
  "Understand the basics of Microinteraction",
  "Creating Animation (20 case studies) for mobile apps",
  "Presenting designs using Animation",
];

const DescriptionComponent = ({
  title = "Description",
  description = "",
  keyPoints,
}: {
  title?: string;
  description?: string;
  keyPoints?: string[];
}) => {
  return (
    <div className="text-gray-800 mx-auto md:px-4 py-2">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>

      {description ? (
        <div 
          className="mb-4 text-justify text-sm leading-relaxed text-gray-600"
          dangerouslySetInnerHTML={{ __html: description }}
        />
      ) : (
        <p className="mb-4 text-justify text-sm leading-relaxed text-gray-600">
          No description available for this course.
        </p>
      )}

      <h3 className="text-xl font-semibold mt-8 mb-4">Key Point</h3>
      <ul className="space-y-3">
        {keyPoints?.map((point, index) => (
          <li key={index} className="flex items-center gap-2">
            <div
              className={`w-6 h-6 bg-[#ABABAB] text-[white] rounded-full
               flex items-center justify-center text-xs mr-3`}
            >
              {"✓"}
            </div>
            <span className="text-sm text-gray-700">{point}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DescriptionComponent;
