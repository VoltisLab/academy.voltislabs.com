"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import SearchBar from "./SearchBar"
import CategoryFilter from "./CategoryFilter"
import CommunityCard from "./CommunityCard"
import Link from "next/link"

// Sample community data based on the original site
const communities = [
  {
    id: 1,
    rank: 1,
    name: "Brotherhood Of Scent",
    description: "#1 Fragrance Community 🏆 Our mission is to help YOU leverage the power of scent to become the man you know yourself to be. Join thousands of fragrance enthusiasts who share their passion for colognes, perfumes, and the art of smelling great.",
    members: "8k Members",
    price: "Free",
    category: "Self-improvement",
    image: "https://ext.same-assets.com/637669732/1603192324.jpeg",
    avatar: "https://ext.same-assets.com/637669732/43396394.jpeg"
  },
  {
    id: 2,
    rank: 2,
    name: "Abbew Crew",
    description: "Transform your body and mind with proven fitness strategies. My mission is to help people reclaim their health, body and energy. Achieving fat loss or muscle building is not complicated - join our community of fitness enthusiasts and get the results you deserve.",
    members: "13.6k Members",
    price: "$129",
    category: "Health",
    image: "https://ext.same-assets.com/637669732/2533540919.jpeg",
    avatar: "https://ext.same-assets.com/637669732/2074302467.jpeg"
  },
  {
    id: 3,
    rank: 3,
    name: "Zero To Founder by Tom Bilyeu",
    description: "Start your business and get on the path to financial freedom with billion-dollar founder Tom Bilyeu. Learn proven strategies, connect with fellow entrepreneurs, and build the business of your dreams. From idea to IPO, we've got you covered.",
    members: "1.4k Members",
    price: "$119/month",
    category: "Money",
    image: "https://ext.same-assets.com/637669732/553352441.jpeg",
    avatar: "https://ext.same-assets.com/637669732/2500256124.jpeg"
  },
  {
    id: 4,
    rank: 4,
    name: "Calligraphy Skool",
    description: "Learn modern calligraphy the fun, easy way! ✏️ With sisters Jordan & Jillian",
    members: "1.3k Members",
    price: "$9/month",
    category: "Hobbies",
    image: "https://ext.same-assets.com/637669732/3111728284.jpeg",
    avatar: "https://ext.same-assets.com/637669732/979783902.jpeg"
  },
  {
    id: 5,
    rank: 5,
    name: "That Pickleball School",
    description: "🏓 THAT place for all pickleball players who want to get better.",
    members: "1k Members",
    price: "$39/month",
    category: "Sports",
    image: "https://ext.same-assets.com/637669732/1559167490.jpeg",
    avatar: "https://ext.same-assets.com/637669732/2757558337.jpeg"
  },
  {
    id: 6,
    rank: 6,
    name: "The Lady Change",
    description: "THE #1 community for menopausal (peri & post) women to lose weight, get healthier and regain their confidence!",
    members: "1.5k Members",
    price: "$49/month",
    category: "Health",
    image: "https://ext.same-assets.com/637669732/2789519886.jpeg",
    avatar: "https://ext.same-assets.com/637669732/2361569434.jpeg"
  },
  {
    id: 7,
    rank: 7,
    name: "Unison Producer Growth Hub",
    description: "The #1 free community for music producers to grow, learn, connect and simplify the process of producing pro-quality music.",
    members: "33.1k Members",
    price: "Free",
    category: "Music",
    image: "https://ext.same-assets.com/637669732/4164097084.jpeg",
    avatar: "https://ext.same-assets.com/637669732/3948433604.jpeg"
  },
  {
    id: 8,
    rank: 8,
    name: "The Aspinall Way",
    description: "Join the FIRST and ONLY Community Created by a UFC Champion, Become Extraordinary Today!🥇",
    members: "15.9k Members",
    price: "Free",
    category: "Sports",
    image: "https://ext.same-assets.com/637669732/2937592109.jpeg",
    avatar: "https://ext.same-assets.com/637669732/1447937987.jpeg"
  },
  {
    id: 9,
    rank: 9,
    name: "Day by Day Wellness Club",
    description: "#1 community dedicated to anyone on their journey to becoming their best self.",
    members: "55.9k Members",
    price: "Free",
    category: "Self-improvement",
    image: "https://ext.same-assets.com/637669732/1591204924.jpeg",
    avatar: "https://ext.same-assets.com/637669732/2471419055.jpeg"
  }
]

const categories = [
  { id: "all", label: "All", emoji: "" },
  { id: "hobbies", label: "Hobbies", emoji: "🎪" },
  { id: "music", label: "Music", emoji: "🎵" },
  { id: "money", label: "Money", emoji: "💰" },
  { id: "spirituality", label: "Spirituality", emoji: "🕯️" },
  { id: "tech", label: "Tech", emoji: "🖥️" },
  { id: "health", label: "Health", emoji: "🥕" },
  { id: "sports", label: "Sports", emoji: "⚽" },
  { id: "self-improvement", label: "Self-improvement", emoji: "📈" },
]

export default function HomePage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)

  // Filter communities based on search and category
  const filteredCommunities = useMemo(() => {
    return communities.filter(community => {
      const matchesSearch = community.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           community.description.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesCategory = activeCategory === "all" ||
                             community.category?.toLowerCase() === activeCategory.toLowerCase()

      return matchesSearch && matchesCategory
    })
  }, [searchTerm, activeCategory])

  const handleCommunityClick = (communityId: number) => {
    router.push(`/community/${communityId}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="max-w-[1085px] mx-auto py-8">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-2">
            Discover communities
          </h1>
          <Link href="/create-account">
          <p className="text-[#909090] mb-8">
            or <span className="text-[#2E6EF5] font-semibold hover:underline">create your own</span>
          </p>
          </Link>

          {/* Search Bar */}
          <SearchBar
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-2xl mx-auto mb-8"
          />
        </div>

        {/* Category Filters */}
        <CategoryFilter
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        {/* Communities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredCommunities.map((community) => (
            <CommunityCard 
              key={community.id} 
              community={community} 
              onClick={() => handleCommunityClick(community.id)}
            />
          ))}
        </div>

        {filteredCommunities.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No communities found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search or browse different categories
            </p>
            <button
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              onClick={() => {
                setSearchTerm("")
                setActiveCategory("all")
              }}
            >
              Clear filters
            </button>
          </div>
        )}


      </main>

      {/* Footer Section - Only show if we have results */}
      {filteredCommunities.length > 0 && (
        <div className="bg-gray-50 border-t border-gray-200 mt-16">
          <div className="max-w-[1085px] mx-auto px-6 py-8">
            <div className="flex items-center justify-between">
              {/* Left Side - Pagination */}
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="text-gray-400 hover:text-gray-600 text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ← Previous
                </button>
                
                {[1, 2, 3, 4, 5].map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 rounded-full text-xs font-medium transition-colors ${
                      currentPage === page
                        ? 'bg-[#F8D481] text-black'
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                
                <span className="text-gray-400 text-xs">...</span>
                
                <button 
                  onClick={() => setCurrentPage(34)}
                  className="w-8 h-8 rounded-full text-xs font-medium text-gray-400 hover:text-gray-600"
                >
                  34
                </button>
                
                <button 
                  onClick={() => setCurrentPage(Math.min(34, currentPage + 1))}
                  className="text-gray-400 hover:text-gray-600 text-xs"
                >
                  Next →
                </button>
              </div>

              {/* Right Side - Footer Links */}
              <div className="flex items-center gap-8 text-sm text-gray-400">
                <a href="#" className="hover:text-gray-600">Community</a>
                <a href="#" className="hover:text-gray-600">Affiliates</a>
                <a href="#" className="hover:text-gray-600">Support</a>
                <a href="#" className="hover:text-gray-600">Careers</a>
                <span>...</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 