"use client"

import CommunityCard from '@/components/skool/community/communityCard'
import { Play, Lock, Users, Tag, Star } from "lucide-react"
import Image from 'next/image'
import { useState } from 'react'

// Using a single community object directly
const community = {
  id: 1,
  rank: 1,
  name: "Brotherhood Of Scent",
  description: "#1 Fragrance Community 🏆 Our mission is to help YOU leverage the power of scent to become the man you know yourself to be. Join thousands of fragrance enthusiasts who share their passion for colognes, perfumes, and the art of smelling great.",
  members: "8k Members",
  price: "Free",
  category: "Self-improvement",
  image: "https://ext.same-assets.com/637669732/1603192324.jpeg",
  avatar: "https://ext.same-assets.com/637669732/43396394.jpeg"
}

// Video series data with actual YouTube links
const videoSeries = [
  {
    id: 1,
    title: "How to Choose Your Signature Scent",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    videoId: "dQw4w9WgXcQ",
    duration: "12:34",
    views: "2.1M views"
  },
  {
    id: 2,
    title: "Top 10 Men's Fragrances 2024",
    thumbnail: "https://img.youtube.com/vi/9bZkp7q19f0/maxresdefault.jpg",
    videoId: "9bZkp7q19f0",
    duration: "15:22",
    views: "1.8M views"
  },
  {
    id: 3,
    title: "Fragrance Layering Techniques",
    thumbnail: "https://img.youtube.com/vi/jNQXAC9IVRw/maxresdefault.jpg",
    videoId: "jNQXAC9IVRw",
    duration: "8:45",
    views: "956K views"
  },
  {
    id: 4,
    title: "Understanding Fragrance Notes",
    thumbnail: "https://img.youtube.com/vi/kJQP7kiw5Fk/maxresdefault.jpg",
    videoId: "kJQP7kiw5Fk",
    duration: "11:18",
    views: "1.2M views"
  },
  {
    id: 5,
    title: "Seasonal Fragrance Guide",
    thumbnail: "https://img.youtube.com/vi/oHg5SJYRHA0/maxresdefault.jpg",
    videoId: "oHg5SJYRHA0",
    duration: "13:27",
    views: "789K views"
  },
  {
    id: 6,
    title: "Luxury vs Designer Fragrances",
    thumbnail: "https://img.youtube.com/vi/ZZ5LpwO-An4/maxresdefault.jpg",
    videoId: "ZZ5LpwO-An4",
    duration: "16:42",
    views: "1.5M views"
  }
]

export default function CommunityDetailPage() {
  const [currentVideo, setCurrentVideo] = useState(videoSeries[0])
  const [isPlaying, setIsPlaying] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Main Content */}
      <main className="max-w-[1085px] mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Side - Video Preview and Description */}
          <div className="lg:col-span-2">
            {/* Video Preview Area */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">{community.name}</h1>
              
              {/* Main Video Player */}
              <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden mb-4">
                {isPlaying ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${currentVideo.videoId}?autoplay=1`}
                    title={currentVideo.title}
                    className="w-full h-full"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div className="relative w-full h-full">
                    <Image 
                      src={currentVideo.thumbnail} 
                      alt={currentVideo.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                      <button 
                        onClick={() => setIsPlaying(true)}
                        className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center hover:bg-opacity-100 transition-all"
                      >
                        <Play className="w-8 h-8 text-gray-800 ml-1" />
                      </button>
                    </div>
                    <div className="absolute bottom-4 left-4 bg-black bg-opacity-70 text-white text-sm px-2 py-1 rounded">
                      {currentVideo.duration}
                    </div>
                    <div className="absolute bottom-4 right-4 bg-opacity-70 text-white text-sm px-2 py-1 rounded">
                      1.2x
                    </div>
                  </div>
                )}
              </div>

              {/* Video Thumbnails Section */}
              <div className="grid grid-cols-6 gap-4 mb-4">
                {videoSeries.map((video) => (
                  <div 
                    key={video.id}
                    className="relative rounded-lg overflow-hidden cursor-pointer group"
                    onClick={() => {
                      setCurrentVideo(video)
                      setIsPlaying(false)
                    }}
                  >
                    <div className="aspect-video relative">
                      <Image
                        src={video.thumbnail} 
                        alt={video.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-8 h-8 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
                          <Play className="w-4 h-4 text-gray-800 ml-0.5" />
                        </div>
                      </div>
                      <div className="absolute bottom-1 right-1 bg-black bg-opacity-70 text-white text-xs px-1 py-0.5 rounded">
                        {video.duration}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Community Info */}
              <div className="py-6">
                {/* Tags */}
                <div className="flex items-center gap-4 mb-4 text-sm font-semibold text-gray-800">
                  <div className="flex items-center gap-1">
                    <Lock className="h-4 w-4" />
                    <span>Private</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{community.members}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Tag className="h-4 w-4" />
                    <span>{community.price}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {/* Fixed avatar sizing */}
                    <Image 
                      src={community.avatar} 
                      alt="Admin" 
                      width={20}
                      height={20}
                      className="w-5 h-5 rounded-full"
                    />
                    <span>By Antonio O. Centeno</span>
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  </div>
                </div>

                <p className="text-gray-600 mb-6">
                  This group is hosted by Antonio Centeno and Real Men Real Style team.
                </p>

                {/* Community Rules */}
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">COMMUNITY RULES:</h2>
                  <ol className="list-decimal list-inside space-y-2 text-gray-700">
                    <li>Be Respectful: Treat others kindly, no profanities, and offer constructive criticism.</li>
                    <li>This isn&apos;t a place to ask for donations or sell things.</li>
                    <li>Talk about things that relate to men&apos;s fragrances.</li>
                    <li>Share tips, support each other, engage and be active.</li>
                    <li>Inactive accounts are deleted within 30 days.</li>
                  </ol>
                </div>

                {/* Community Benefits */}
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">THIS COMMUNITY IS FOR YOU IF YOU&apos;RE LOOKING TO:</h2>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>Learn about fragrance, cologne, Parfum, EDT, EDP, & perfumes.</li>
                    <li>Build connections with like-minded people</li>
                    <li>Learn from other fragrance lovers.</li>
                    <li>Teach others what you&apos;ve learned & share your opinions.</li>
                    <li>Become your best self.</li>
                  </ul>
                </div>

                {/* Inside Community */}
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">INSIDE THIS COMMUNITY YOU&apos;LL FIND:</h2>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>Access to courses and training.</li>
                    <li>Exclusive Coaching sessions and LIVE events.</li>
                    <li>Unfiltered reviews and recommendations.</li>
                    <li>Discounts & Giveaways</li>
                  </ul>
                </div>

                <p className="text-sm text-gray-500">
                  *This community is for gentlemen who love fragrances and are aged 18+ and up.
                </p>
              </div>
            </div>
          </div>

          {/* Right Side - Community Details */}
          <div className="lg:col-span-1">
            <CommunityCard />
          </div>
        </div>
      </main>
    </div>
  )
}
