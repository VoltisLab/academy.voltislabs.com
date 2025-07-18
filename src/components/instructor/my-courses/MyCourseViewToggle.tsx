'use client'

import { MdViewList, MdGridView } from 'react-icons/md'

interface ViewToggleProps {
  isGrid: boolean;
  onToggle: (value: boolean) => void;
}

export default function ViewToggle({ isGrid, onToggle }: ViewToggleProps) {
  return (
    <div className="inline-flex items-center gap-2">
      <button
        onClick={() => onToggle(true)}
        className={`p-2 rounded-md transition-colors duration-200 ${
          isGrid ? 'bg-purple-100 text-purple-700' : 'text-gray-500 hover:text-black'
        }`}
      >
        <MdGridView size={20} />
      </button>
      <button
        onClick={() => onToggle(false)}
        className={`p-2 rounded-md transition-colors duration-200 ${
          !isGrid ? 'bg-purple-100 text-purple-700' : 'text-gray-500 hover:text-black'
        }`}
      >
        <MdViewList size={20} />
      </button>
    </div>
  )
}
