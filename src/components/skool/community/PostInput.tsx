"use client"

import Image from "next/image"
import { useState } from "react"

interface PostInputProps {
  placeholder?: string
  userAvatar?: string
  onSubmit?: (content: string) => void
}

export default function PostInput({ 
  placeholder = "Write something", 
  userAvatar = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face",
  onSubmit 
}: PostInputProps) {
  const [content, setContent] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (content.trim() && onSubmit) {
      onSubmit(content.trim())
      setContent("")
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-2">
      <div className="flex items-center gap-3">
        {/* Explicit width/height instead of fill */}
        <Image
          src={userAvatar}
          alt="User avatar"
          width={32}
          height={32}
          className="w-8 h-8 rounded-full object-cover flex-shrink-0"
        />
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={placeholder}
          className="flex-1 p-2 text-sm border-0 placeholder:font-semibold outline-none bg-transparent placeholder:text-gray-400"
          onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter' && content.trim()) {
              handleSubmit(e as React.FormEvent)
            }
          }}
        />
      </div>
    </div>
  )
}
