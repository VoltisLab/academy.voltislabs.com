interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function Pagination({ 
  currentPage, 
  totalPages, 
  onPageChange 
}: PaginationProps) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      <button 
        className="px-3 py-1 text-xs text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        ← Previous
      </button>
      
      {[1, 2, 3, 4, 5].map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`w-8 h-8 rounded-full text-xs font-medium transition-colors ${
            currentPage === page
              ? 'bg-yellow-400 text-black hover:bg-yellow-500'
              : 'hover:bg-gray-100'
          }`}
        >
          {page}
        </button>
      ))}
      
      <span className="text-gray-400">...</span>
      
      <button
        onClick={() => onPageChange(totalPages)}
        className="w-8 h-8 rounded-full text-xs font-medium hover:bg-gray-100"
      >
        {totalPages}
      </button>
      
      <button 
        className="px-3 py-1 text-xs hover:text-gray-600"
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next →
      </button>
    </div>
  )
} 