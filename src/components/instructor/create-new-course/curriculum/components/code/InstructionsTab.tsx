import React, { useState } from 'react';
import { Bold, Italic, List, ListOrdered, Link2, Image } from 'lucide-react';

type InstructionTab = 'instructions' | 'relatedLectures' | 'hints' | 'solutionExplanation';

interface InstructionTabsProps {
  defaultInstructions?: string;
  defaultHints?: string;
  defaultSolutionExplanation?: string;
  onInstructionsChange?: (instructions: string) => void;
  onHintsChange?: (hints: string) => void;
  onSolutionExplanationChange?: (explanation: string) => void;
}

const InstructionTabs: React.FC<InstructionTabsProps> = ({
  defaultInstructions = '',
  defaultHints = '',
  defaultSolutionExplanation = '',
  onInstructionsChange,
  onHintsChange,
  onSolutionExplanationChange
}) => {
  const [activeTab, setActiveTab] = useState<InstructionTab>('instructions');
  const [instructions, setInstructions] = useState(defaultInstructions);
  const [hints, setHints] = useState(defaultHints);
  const [solutionExplanation, setSolutionExplanation] = useState(defaultSolutionExplanation);

  const handleInstructionsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInstructions(e.target.value);
    if (onInstructionsChange) {
      onInstructionsChange(e.target.value);
    }
  };

  const handleHintsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setHints(e.target.value);
    if (onHintsChange) {
      onHintsChange(e.target.value);
    }
  };

  const handleSolutionExplanationChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSolutionExplanation(e.target.value);
    if (onSolutionExplanationChange) {
      onSolutionExplanationChange(e.target.value);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex space-x-4">
          <button
            className={`px-4 py-2 border-b-2 text-sm font-medium ${
              activeTab === 'instructions' 
                ? 'border-gray-700 text-gray-800 font-bold' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('instructions')}
          >
            Instructions
          </button>
          <button
            className={`px-4 py-2 border-b-2 text-sm font-medium ${
              activeTab === 'relatedLectures' 
                ? 'border-gray-700 text-gray-800 font-bold' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('relatedLectures')}
          >
            Related lectures
          </button>
          <button
            className={`px-4 py-2 border-b-2 text-sm font-medium ${
              activeTab === 'hints' 
                ? 'border-gray-700 text-gray-800 font-bold' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('hints')}
          >
            Hints
          </button>
          <button
            className={`px-4 py-2 border-b-2 text-sm font-medium ${
              activeTab === 'solutionExplanation' 
                ? 'border-gray-700 text-gray-800 font-bold' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('solutionExplanation')}
          >
            Solution explanation
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 p-4 overflow-y-auto">
        {activeTab === 'instructions' && (
          <>
            <p className="text-gray-700 mb-4">
              Provide instructions so learners know what they're solving. Use accurate, grammatically
              correct language and avoid biases.
            </p>
            <div className="flex items-center space-x-2 border-b border-gray-200 pb-2 mb-2">
              <button className="p-1 hover:bg-gray-100 rounded">
                <Bold size={18} />
              </button>
              <button className="p-1 hover:bg-gray-100 rounded">
                <Italic size={18} />
              </button>
              <button className="p-1 hover:bg-gray-100 rounded">
                <ListOrdered size={18} />
              </button>
              <button className="p-1 hover:bg-gray-100 rounded">
                <List size={18} />
              </button>
              <button className="p-1 hover:bg-gray-100 rounded">
                <Link2 size={18} />
              </button>
              <button className="p-1 hover:bg-gray-100 rounded">
                <Image size={18} />
              </button>
            </div>
            <textarea
              value={instructions}
              onChange={handleInstructionsChange}
              className="w-full h-64 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Write the problem definition here."
            />
          </>
        )}

        {activeTab === 'relatedLectures' && (
          <div className="p-4 text-center text-gray-500">
            <p>You can add related lectures from your course to provide additional context.</p>
            <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md">
              Add Related Lecture
            </button>
          </div>
        )}

        {activeTab === 'hints' && (
          <>
            <p className="text-gray-700 mb-4">
              Provide hints to guide learners who get stuck without giving away the solution.
            </p>
            <textarea
              value={hints}
              onChange={handleHintsChange}
              className="w-full h-64 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Write helpful hints here."
            />
          </>
        )}

        {activeTab === 'solutionExplanation' && (
          <>
            <p className="text-gray-700 mb-4">
              Explain your solution approach so learners can understand the reasoning behind it.
            </p>
            <textarea
              value={solutionExplanation}
              onChange={handleSolutionExplanationChange}
              className="w-full h-64 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Explain your solution approach here."
            />
          </>
        )}
      </div>
    </div>
  );
};

export default InstructionTabs;