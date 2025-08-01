"use client"
import CommunityCard from '@/components/skool/CommunityCard'
import MemberList from '@/components/skool/community/memberList'
import CommunityTabs from '@/components/skool/community/memberTab'
import React from 'react'
import { useParams } from 'next/navigation'

const page = () => {
  const params = useParams()
  const communitySlug = params?.community as string || ''
  
  // Create community object with required properties
  const community = {
    id: communitySlug,
    name: communitySlug,
    slug: communitySlug,
    // Add other required properties as needed
  }

  return (
    <div className='w-full flex justify-center'>
        <div className='w-[65%] grid grid-cols-4 gap-4'>
            <div className="col-span-3 h-full ">
                <CommunityTabs/>
                <MemberList/>
            </div>

        <CommunityCard community={community as any}/>
        </div>
    </div>
  )
}

export default page