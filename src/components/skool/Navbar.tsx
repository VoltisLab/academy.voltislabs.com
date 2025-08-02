"use client"

import { useAuthModal } from "@/lib/AuthModalContext"
import { ChevronUp, ChevronDown, Search, Settings, Plus, Compass } from "lucide-react"
import { useState, useEffect } from "react"

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const { openModal } = useAuthModal();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleChevronClick = () => {
    setIsDropdownOpen(!isDropdownOpen)
  }

  const handleDropdownClose = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsDropdownOpen(false)
    }
  }

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-6 py-2 sticky top-0 z-50">
        <div className="max-w-[1085px] mx-auto flex items-center justify-between">
          {/* Skool Logo */}
          <div className="flex items-center gap-2 relative">
            <div className="text-center">
              <h1 className="text-2xl font-bold">
                <span className="text-blue-600">s</span>
                <span className="text-red-500">k</span>
                <span className="text-yellow-500">o</span>
                <span className="text-green-500">o</span>
                <span className="text-blue-600">l</span>
              </h1>
            </div>
            <div 
              className="flex flex-col cursor-pointer hover:bg-gray-200 rounded-full px-2 transition-colors"
              onClick={handleChevronClick}
            >
              <ChevronUp className="h-4 w-4 text-gray-700" />
              <ChevronDown className="h-4 w-4 text-gray-700" />
            </div>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute top-full left-0  bg-white max-w-[230px] p-2 rounded-lg shadow-lg border border-gray-200 w-52 z-50">
                {/* Search Bar */}
                <div className="p-1.5 ">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="text"
                      placeholder="Search"
                      className="w-full pl-10 pr-10 py-2 text-sm border border-gray-300 rounded-lg bg-gray-200"
                    />
                    <Settings className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 cursor-pointer" />
                  </div>
                </div>

                {/* Create a community */}
                <div className="p-1">
                  <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-200 p-1 rounded-lg transition-colors">
                    <div className="w-6 h-6 bg-gray-200 rounded flex items-center justify-center">
                      <Plus className="h-4 w-4 text-gray-600" />
                    </div>
                    <span className="text-xs font-medium text-gray-700">Create a community</span>
                  </div>
                </div>

                {/* Discover communities */}
                <div className="p-1">
                  <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-200 p-1 rounded-lg transition-colors">
                    <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                      <Compass className="h-4 w-4 text-gray-600" />
                    </div>
                    <span className="text-xs font-medium text-gray-700">Discover communities</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Search Bar in Header - Only show when scrolled */}
          {isScrolled && (
            <div className="flex-1 max-w-2xl mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#909090] h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search for anything"
                  className="w-full pl-10 py-4 text-sm border text-[#909090] placeholder:text-[#909090] placeholder:font-semibold border-gray-300 rounded-lg bg-gray-200 focus:border-transparent outline-none"
                />
              </div>
            </div>
          )}

          {/* Login Button */}

            <button onClick={() => openModal('login')} className="px-5 font-bold py-2 text-sm text-[#909090] cursor-pointer bg-white border border-gray-300 rounded-md hover:text-gray-900 transition-colors">
              LOG IN
            </button>

        </div>
      </header>

      {/* Backdrop for closing dropdown */}
      {isDropdownOpen && (
        <div 
          className="fixed inset-0 z-40"
          onClick={handleDropdownClose}
        />
      )}
    </>
  )
} 