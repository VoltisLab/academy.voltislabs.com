'use client'

import { MdViewList, MdGridView } from 'react-icons/md'

interface ViewToggleProps {
  isGrid: boolean
  onToggle: (value: boolean) => void
}

export default function ViewToggle({ isGrid, onToggle }: ViewToggleProps) {
  return (
    <div className="inline-flex items-center border rounded-md overflow-hidden text-sm font-medium">
      <button
        onClick={() => onToggle(false)}
        className={`flex items-center gap-1 px-4 py-2 transition-colors duration-200 ${
          !isGrid
            ? 'bg-purple-700 text-white'
            : 'bg-white text-gray-700 hover:bg-gray-100'
        }`}
      >
        <MdViewList size={18} />
        List
      </button>
      <button
        onClick={() => onToggle(true)}
        className={`flex items-center gap-1 px-4 py-2 transition-colors duration-200 ${
          isGrid
            ? 'bg-purple-700 text-white'
            : 'bg-white text-gray-700 hover:bg-gray-100'
        }`}
      >
        <MdGridView size={18} />
        Grid
      </button>
    </div>
  )
}
