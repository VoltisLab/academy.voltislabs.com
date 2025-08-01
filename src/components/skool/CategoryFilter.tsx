"use client"

import { Globe, Search } from "lucide-react"
import { useState } from "react"

interface Category {
  id: string
  label: string
  emoji: string
}

interface CategoryFilterProps {
  categories: Category[]
  activeCategory: string
  onCategoryChange: (categoryId: string) => void
}

const additionalCategories = [
  { id: "relationships", label: "Relationships", emoji: "💕" }
]

const languages = [
  { id: "all", label: "All", selected: true },
  { id: "english", label: "English", selected: false },
  { id: "german", label: "German", selected: false },
  { id: "spanish", label: "Spanish", selected: false },
  { id: "french", label: "French", selected: false },
  { id: "italian", label: "Italian", selected: false }
]

export default function CategoryFilter({ 
  categories, 
  activeCategory, 
  onCategoryChange 
}: CategoryFilterProps) {
  const [showMore, setShowMore] = useState(false)
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false)
  const [languageSearch, setLanguageSearch] = useState("")

  const visibleCategories = showMore 
    ? [...categories, ...additionalCategories]
    : categories.slice(0, 9) // Show first 8 categories initially

  const filteredLanguages = languages.filter(lang => 
    lang.label.toLowerCase().includes(languageSearch.toLowerCase())
  )

  return (
    <div className="flex flex-wrap gap-2 justify-center my-6 relative">
      {visibleCategories.map((category) => (
        <button
          key={category.id}
          onClick={() => onCategoryChange(category.id)}
          className={`rounded-full px-3 py-2 border border-gray-300 text-sm font-semibold cursor-pointer hover:bg-[#909090] hover:text-white transition-colors ${
            activeCategory === category.id
              ? 'bg-[#909090] text-white'
              : 'text-[#909090] bg-white'
          }`}
        >
          {category.emoji && `${category.emoji} `}{category.label}
        </button>
      ))}
      
      {!showMore ? (
        <button 
          onClick={() => setShowMore(true)}
          className="rounded-full border border-gray-300 hover:bg-gray-50 bg-white text-gray-700 px-4 py-2 text-sm font-medium"
        >
          More... 
        </button>
      ) : (
        <button 
          onClick={() => setShowMore(false)}
          className="rounded-full border border-gray-300 hover:bg-gray-50 bg-white text-gray-700 px-4 py-2 text-sm font-medium"
        >
          Less...
        </button>
      )}

      {/* Language Dropdown */}
      <div className="relative">
        <button 
          onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
          className="rounded-full border border-gray-300 hover:bg-gray-50 bg-white text-gray-700 px-2 py-2 text-sm font-medium flex items-center gap-2"
        >
          <Globe className="h-4 w-4" />
        </button>

        {showLanguageDropdown && (
          <div className="absolute top-full right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
            {/* Search Input */}
            <div className="p-3 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search languages..."
                  value={languageSearch}
                  onChange={(e) => setLanguageSearch(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Language Options */}
            <div className="max-h-48 overflow-y-auto">
              {filteredLanguages.map((language) => (
                <button
                  key={language.id}
                  onClick={() => {
                    // Handle language selection
                    setShowLanguageDropdown(false)
                    setLanguageSearch("")
                  }}
                  className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors ${
                    language.selected 
                      ? 'bg-yellow-100 text-yellow-800 font-medium' 
                      : 'text-gray-700'
                  }`}
                >
                  {language.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 