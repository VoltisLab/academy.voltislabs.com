"use client"

import { useState } from "react"
import { MapPin, Play, Brain } from "lucide-react"

// Import all components
import PostInput from "@/components/community/PostInput"
import EventBanner from "@/components/community/EventBanner"
import FilterTabs, { defaultTabs } from "@/components/community/FilterTabs"
import LoadNewPosts from "@/components/community/LoadNewPosts"
import WelcomeChecklist, { defaultWelcomeItems } from "@/components/community/WelcomeChecklist"
import PostCard from "@/components/community/PostCard"
import CommunityInfo from "@/components/community/CommunityInfo"
import Leaderboard, { defaultLeaderboardEntries } from "@/components/community/Leaderboard"
import Pagination from "@/components/community/Pagination"

// Sample posts data
const samplePosts = [
  {
    id: "1",
    author: {
      name: "Munir Ahmad",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
      badge: "3"
    },
    timestamp: "2h",
    title: "This one tab changed everything",
    content: "This one tab changed everything Switched from a scattered desktop to one browser tab: Notion. Now my ideas, projects, and goals live in one place. Less chaos. More clarity. And yes—my desktop",
    engagement: {
      likes: 4,
      comments: 1,
      recentCommenters: [
        { id: "1", name: "John D.", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=24&h=24&fit=crop&crop=face" }
      ],
      lastCommentTime: "35m ago"
    },
    isPinned: true,
    hasWins: true
  },
  {
    id: "2",
    author: {
      name: "Casey Kristof",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
      badge: "3"
    },
    timestamp: "Jan 19",
    category: {
      name: "Announcements",
      icon: <MapPin className="w-3 h-3 text-red-500" />
    },
    title: "!! We're Always Hiring — But Not Just Anyone",
    content: "If you're in this community, you already know we don't operate like a normal company. We move fast. We execute hard. We don't just learn about AI — we build with it daily. If you're ready to join a team that's actually building the future, not just talking about it, then we want to hear from you.",
    media: {
      type: 'document' as const,
      url: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=96&h=96&fit=crop",
      alt: "Document thumbnail"
    },
    engagement: {
      likes: 836,
      comments: 765,
      recentCommenters: [
        { id: "1", name: "Sarah M.", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face" },
        { id: "2", name: "Mike R.", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=24&h=24&fit=crop&crop=face" },
        { id: "3", name: "Lisa K.", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=24&h=24&fit=crop&crop=face" }
      ],
      lastCommentTime: "3h ago"
    },
    isPinned: true
  },
  {
    id: "3",
    author: {
      name: "Liam Ottley",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
      badge: "2"
    },
    timestamp: "May 23",
    category: {
      name: "YouTube Resources",
      icon: <Play className="w-3 h-3 text-red-500" />
    },
    title: "Must Read for Anyone Committed to Starting an AI Agency",
    content: "I've been getting a lot of questions about the best way to start an AI agency. After helping hundreds of entrepreneurs build successful agencies, here's what I've learned works best.",
    media: {
      type: 'image' as const,
      url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=96&h=96&fit=crop",
      alt: "AI Agency concept"
    },
    engagement: {
      likes: 1100,
      comments: 1100,
      recentCommenters: [
        { id: "4", name: "David L.", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=24&h=24&fit=crop&crop=face" },
        { id: "5", name: "Emma W.", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=24&h=24&fit=crop&crop=face" }
      ],
      lastCommentTime: "21m ago"
    },
    isPinned: true
  },
  {
    id: "4",
    author: {
      name: "Silas Sofia",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face"
    },
    timestamp: "Mar 24",
    category: {
      name: "Business & Strategy",
      icon: <Brain className="w-3 h-3 text-red-500" />
    },
    title: "Looking for YouTube Resources? - READ ME",
    content: "I've compiled a comprehensive list of the best YouTube channels and videos for learning AI automation. This includes everything from beginner tutorials to advanced implementation strategies.",
    media: {
      type: 'document' as const,
      url: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=96&h=96&fit=crop",
      alt: "Resource list"
    },
    engagement: {
      likes: 3400,
      comments: 0,
      recentCommenters: []
    },
    isPinned: true
  }
]

// Sample community members
const sampleMembers = [
  { id: "1", name: "Liam Ottley", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face" },
  { id: "2", name: "Casey Kristof", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face" },
  { id: "3", name: "Sarah Chen", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face" },
  { id: "4", name: "Mike Johnson", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face" },
  { id: "5", name: "Emma Wilson", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face" },
  { id: "6", name: "David Brown", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face" },
  { id: "7", name: "Lisa Garcia", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=32&h=32&fit=crop&crop=face" },
  { id: "8", name: "Tom Anderson", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face" }
]

export default function CommunityTestPage() {
  // State management
  const [activeTab, setActiveTab] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [welcomeItems, setWelcomeItems] = useState(defaultWelcomeItems)
  
  // Event handlers
  const handlePostSubmit = (content: string) => {
    console.log("New post:", content)
    alert(`New post created: ${content}`)
  }

  const handleWelcomeItemToggle = (itemId: string) => {
    setWelcomeItems(prev => 
      prev.map(item => 
        item.id === itemId 
          ? { ...item, completed: !item.completed }
          : item
      )
    )
  }

  const handlePostLike = (postId: string) => {
    console.log("Liked post:", postId)
    alert(`Liked post: ${postId}`)
  }

  const handlePostComment = (postId: string) => {
    console.log("Comment on post:", postId)
    alert(`Comment on post: ${postId}`)
  }

  const handleInvitePeople = () => {
    console.log("Invite people clicked")
    alert("Invite people functionality triggered!")
  }

  const handleViewAllLeaderboards = () => {
    console.log("View all leaderboards clicked")
    alert("View all leaderboards functionality triggered!")
  }

  const handleLoadNewPosts = () => {
    console.log("Load new posts clicked")
    alert("Load new posts functionality triggered!")
  }

  return (
    <div className="min-h-screen bg-gray-50">
 
      {/* Main Content */}
      <main className="max-w-[1085px] mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Side - Main Feed */}
          <div className="lg:col-span-2">
            {/* Post Input */}
            <PostInput onSubmit={handlePostSubmit} />

            {/* Event Banner */}
            <EventBanner 
              title="Q&A w/ Liam Ottley" 
              timeLeft="6 days"
              onClick={() => alert("Event clicked!")}
            />

            {/* Filter Tabs */}
            <FilterTabs 
              tabs={defaultTabs}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />

            {/* Load New Posts */}
            <LoadNewPosts 
              count={5}
              onClick={handleLoadNewPosts}
            />

            {/* Welcome Checklist */}
            <WelcomeChecklist 
              items={welcomeItems}
              onItemToggle={handleWelcomeItemToggle}
            />

            {/* Posts Feed */}
            <div className="space-y-4">
              {samplePosts.map((post) => (
                <PostCard
                  key={post.id}
                  {...post}
                  onLike={handlePostLike}
                  onComment={handlePostComment}
                />
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-8">
              <Pagination
                currentPage={currentPage}
                totalPages={1445}
                totalItems={43329}
                itemsPerPage={30}
                onPageChange={setCurrentPage}
              />
            </div>
          </div>

          {/* Right Side - Sidebar */}
          <div className="lg:col-span-1">
            {/* Community Info */}
            <CommunityInfo
              name="AI Automation Agency Hub"
              url="skool.com/learn-ai"
              description="Start Your AI Automation Agency - Created by Liam Ottley"
              bannerImage="https://ext.same-assets.com/637669732/1603192324.jpeg"
              stats={{
                members: "214.5k",
                online: "612",
                admins: "9"
              }}
              recentMembers={sampleMembers}
              links={{
                accelerator: "#",
                youtube: "#"
              }}
              onInvite={handleInvitePeople}
            />

            {/* Leaderboard */}
            <Leaderboard
              title="Leaderboard (30-day)"
              entries={defaultLeaderboardEntries}
              onViewAll={handleViewAllLeaderboards}
            />

            {/* Powered By */}
            <div className="text-center text-sm text-gray-500">
              Powered by 
              <div className="text-center">
            <h1 className="text-2xl font-bold">
              <span className="text-blue-600">s</span>
              <span className="text-red-500">k</span>
              <span className="text-yellow-500">o</span>
              <span className="text-green-500">o</span>
              <span className="text-blue-600">l</span>
            </h1>
          </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 