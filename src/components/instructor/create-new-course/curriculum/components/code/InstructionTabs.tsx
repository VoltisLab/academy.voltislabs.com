import { ChevronDown, Code, Plus } from "lucide-react";
import { useState } from "react";
import ReactQuill from "react-quill-new";
import 'react-quill-new/dist/quill.snow.css';
export interface InstructionTabsProps {
  defaultInstructions: string;
  defaultHints: string;
  defaultSolutionExplanation: string;
  defaultRelatedLectures?: string[];
  onInstructionsChange: (value: string) => void;
  onHintsChange: (value: string) => void;
  onSolutionExplanationChange: (value: string) => void;
  onRelatedLecturesChange?: (lectures: string[]) => void;
  solutionCode: string;
}
// Reusable Rich Text Editor Component
const RichTextEditor: React.FC<{
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  fullHeight?: boolean;
}> = ({ value, onChange, placeholder, fullHeight = false }) => {
  const modules = {
    toolbar: [
      ['bold', 'italic'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link', 'image'],
      ['code-block']
    ]
  };

  return (
    <div className={`rich-text-editor ${fullHeight ? 'h-full flex flex-col' : ''} focus-within:outline focus-within:outline-[#6D28D2] rounded-lg `}>
      <ReactQuill
        value={value}
        onChange={onChange}
        modules={modules}
        placeholder={placeholder}
        theme="snow"
        className={fullHeight ? 'flex-grow  rounded-lg' : ''}
        style={fullHeight ? { height: 'calc(100% - 42px)', display: 'flex', flexDirection: 'column' } : {}}
      />
    </div>
  );
};

// Instruction Tabs Component
const InstructionTabs: React.FC<InstructionTabsProps> = ({
  defaultInstructions,
  defaultHints,
  defaultSolutionExplanation,
  defaultRelatedLectures = [],
  onInstructionsChange,
  onHintsChange,
  onSolutionExplanationChange,
  onRelatedLecturesChange,
  solutionCode
}) => {
  const [activeTab, setActiveTab] = useState<'instructions' | 'relatedLectures' | 'hints' | 'solution'>('instructions');
  const [selectedLectures, setSelectedLectures] = useState<string[]>(defaultRelatedLectures);

  const handleLectureSelection = (lectureName: string) => {
    const newSelection = selectedLectures.includes(lectureName)
      ? selectedLectures.filter(l => l !== lectureName)
      : [...selectedLectures, lectureName];
    
    setSelectedLectures(newSelection);
    if (onRelatedLecturesChange) {
      onRelatedLecturesChange(newSelection);
    }
  };

  const handlePasteSolutionCode = () => {
    // Append the solution code to the current explanation
    const updatedExplanation = defaultSolutionExplanation + 
      "\n\n```javascript\n" + solutionCode + "\n```";
    onSolutionExplanationChange(updatedExplanation);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex border-b border-gray-200">
        <button
          className={`px-4 py-2 ${activeTab === 'instructions' ? 'border-b-2 border-[#6D28D2] text-[#6D28D2] font-medium' : 'text-gray-500'}`}
          onClick={() => setActiveTab('instructions')}
        >
          Instructions
        </button>
        <button
          className={`px-4 py-2 ${activeTab === 'relatedLectures' ? 'border-b-2 border-[#6D28D2] text-[#6D28D2] font-medium' : 'text-gray-500'}`}
          onClick={() => setActiveTab('relatedLectures')}
        >
          Related lectures
        </button>
        <button
          className={`px-4 py-2 ${activeTab === 'hints' ? 'border-b-2 border-[#6D28D2] text-[#6D28D2] font-medium' : 'text-gray-500'}`}
          onClick={() => setActiveTab('hints')}
        >
          Hints
        </button>
        <button
          className={`px-4 py-2 ${activeTab === 'solution' ? 'border-b-2 border-[#6D28D2] text-[#6D28D2] font-medium' : 'text-gray-500'}`}
          onClick={() => setActiveTab('solution')}
        >
          Solution explanation
        </button>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto">
        {activeTab === 'instructions' && (
          <div className="h-full">
            <div className="text-gray-700 mb-4">
              <p>Write clear instructions for your exercise. Guide learners on what to implement, but don't give away the solution.</p>
            </div>
            <RichTextEditor
              value={defaultInstructions}
              onChange={onInstructionsChange}
              placeholder="Write instructions here."
              fullHeight={true}
            />
          </div>
        )}

        {activeTab === 'relatedLectures' && (
          <div className="h-full">
            <div className="text-gray-700 mb-4">
              <p>Provide lectures as a resource for learners to reference as they attempt the exercise in case they need more information or are unsure where to start. You can add max. 3 related lectures.</p>
            </div>
            <div className="mb-4">
              <div className="relative">
                <select
                  className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 appearance-none focus:outline-none focus:ring-2 focus:ring-[#6D28D2]"
                >
                  <option>Select</option>
                  <option>Introduction to React</option>
                  <option>Component Basics</option>
                  <option>React Hooks</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </div>
              </div>
              <div className="text-sm text-gray-500 text-right mt-1">Optional</div>
            </div>
            <div className="mt-6">
              <button className="flex items-center text-[#6D28D2] text-sm">
                <Plus size={16} className="mr-1" /> Add more
              </button>
            </div>
          </div>
        )}
        
        {activeTab === 'hints' && (
          <div className="h-full">
            <div className="text-gray-700 mb-4">
              <p>Hints will be unlocked after the second failed attempt of the exercise so that learners can get more support beyond the related lectures and tests. Hints are a way to nudge learners toward the solution without telling them how to solve the problem.</p>
            </div>
            <RichTextEditor
              value={defaultHints}
              onChange={onHintsChange}
              placeholder="Write hints here."
              fullHeight={true}
            />
          </div>
        )}
        
        {activeTab === 'solution' && (
          <div className="h-full">
            <div className="text-gray-700 mb-4">
              <p>Solution explanation will be unlocked after the third fail attempt. You can paste your solution code here by adding a description of why the code is written a particular way or you can share a step-by-step solution explanation.</p>
            </div>
            <div className="flex items-center mb-2">
              <button 
                className="flex items-center text-[#6D28D2] text-sm px-2 py-1 hover:bg-purple-50"
                onClick={handlePasteSolutionCode}
              >
                <Code size={12} className="mr-1 border border-[#6D28D2] rounded font-bold border border-[#6D28D2] text-xs " /> Paste solution code
              </button>
            </div>
            <RichTextEditor
              value={defaultSolutionExplanation}
              onChange={onSolutionExplanationChange}
              placeholder="Write a solution explanation here."
              fullHeight={true}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default InstructionTabs;