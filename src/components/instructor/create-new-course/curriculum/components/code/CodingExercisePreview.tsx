import { CodingExercisePreviewData } from "@/lib/types";
import { ArrowBigLeft, ArrowLeft, Lock, X } from "lucide-react";
import { useState } from "react";

interface CodingExercisePreviewProps {
  data: CodingExercisePreviewData;
  onClose: () => void;
}

const CodingExercisePreview: React.FC<CodingExercisePreviewProps> = ({
  data,
  onClose,
}) => {
  const [navi, setNavi] = useState<"instruction" | "hint" | "solution">(
    "instruction"
  );
  // Render your preview UI here using the data
  return (
    <div className="fixed inset-0 z-50 bg-white overflow-auto flex">
      {/* First section: Instruction and controls */}
      <div className="w-sm">
        <nav className="px-2 border-b-1 border-zinc-600/50 flex">
          {/* Controls */}
          <div className="flex w-[80%] overflow-auto text-sm">
            <button
              className={`px-4 py-2 transition ${
                navi === "instruction" ? "border-b-2 border-zinc-600" : ""
              }`}
              onClick={() => setNavi("instruction")}
            >
              Instructions
            </button>
            <button
              className={`px-4 py-2 transition ${
                navi === "hint" ? "border-b-2 border-zinc-600" : ""
              }`}
              onClick={() => setNavi("hint")}
            >
              Hints
              <Lock />
            </button>
            <button
              className={`px-4 py-2 transition ${
                navi === "solution" ? "border-b-2 border-zinc-600" : ""
              }`}
              onClick={() => setNavi("solution")}
            >
              Solution explanation
            </button>
          </div>

          {/* expand  */}
          <button className="hover:bg-purple-200">
            {" "}
            <ArrowLeft size={17} />
          </button>
        </nav>
      </div>

      {/* ------------------------------------------------------------------- */}
      <div className="bg-green-300 flex-1">hey</div>
      <div className="bg-red-300 flex-1">hey</div>
    </div>
  );
};

export default CodingExercisePreview;

// const DontTouchnow = () => {
//   return (
//     <div>
//       {/* Preview header */}
//       <div className="p-4 border-b flex justify-between items-center">
//         <h2 className="text-xl font-bold">Preview: {data.exercise.title}</h2>
//         <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
//           <X size={24} />
//         </button>
//       </div>

//       {/* Preview content */}
//       <div className="p-4">
//         {/* Render exercise details */}
//         <div className="mb-6">
//           <h3 className="font-bold mb-2">Exercise Details</h3>
//           <p>
//             <strong>Language:</strong> {data.exercise.language}{" "}
//             {data.exercise.version && `(${data.exercise.version})`}
//           </p>
//           <p>
//             <strong>Learning Objective:</strong>{" "}
//             {data.exercise.learningObjective || "Not specified"}
//           </p>
//         </div>

//         {/* Render instructions */}
//         <div className="mb-6">
//           <h3 className="font-bold mb-2">Instructions</h3>
//           <div
//             dangerouslySetInnerHTML={{
//               __html: data.content.instructions || "No instructions provided",
//             }}
//           />
//         </div>

//         {/* Render code files */}
//         <div className="mb-6">
//           <h3 className="font-bold mb-2">Code Files</h3>
//           {data.content.files.map((file) => (
//             <div key={file.id} className="mb-4">
//               <h4 className="font-medium">{file.name}</h4>
//               <pre className="bg-gray-100 p-2 rounded overflow-x-auto">
//                 {file.content}
//               </pre>
//             </div>
//           ))}
//         </div>

//         {/* Render test results if available */}
//         {data.testResults && (
//           <div className="mb-6">
//             <h3 className="font-bold mb-2">Test Results</h3>
//             <div
//               className={`p-3 rounded ${
//                 data.testResults.success ? "bg-green-100" : "bg-red-100"
//               }`}
//             >
//               <p>{data.testResults.message}</p>
//               <ul className="mt-2">
//                 {data.testResults.results.map((result, idx) => (
//                   <li key={idx} className="flex items-center">
//                     {result.passed ? "✓" : "✗"} {result.name}
//                     {result.error && (
//                       <span className="text-red-600 ml-2">
//                         ({result.error})
//                       </span>
//                     )}
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };
