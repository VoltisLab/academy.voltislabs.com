import LeaderboardCard from '@/components/skool/community/leaderboardCard'
import Image from 'next/image'
import React from 'react'




const page = () => {


    const UserLevel = () => {
        return (
            <div className=' flex items-center gap-2'>
                <div className='bg-yellow-200 h-fit w-fit rounded-full px-4 py-2'>
                    1
                </div>
                <div>
                    <p className='text-base font-semibold'>Level 1 - AI Explorer 🛠️</p>
                    <p className='text-sm text-gray-400'>93% of members</p>
                </div>
            </div>
        )
    }


  return (
    <div className='w-full flex flex-col items-center gap-4'>
        <div className='bg-white h-fit flex rounded-2xl items-center justify-center gap-12 w-[65%] py-6'>
            <div className='flex flex-col items-center text-center w-fit'>
                <div className="relative w-62 h-62 rounded-full bg-white shadow-inner p-1.5 border-[6px] border-[#f8f7f5]">
                    <Image
                        src="/head.jpg" // Replace with your actual image path
                        alt="Profile"
                        fill
                        className="rounded-full object-cover"
                    />
                    <div className="absolute bottom-0 right-0 bg-[#4c56ac] text-white text-sm font-bold w-10 h-10 rounded-full flex items-center justify-center border-[3px] border-white">
                        1
                    </div>
                </div>

                <div className='text-center  w-fit'>
                    <p className='font-bold text-2xl'>John Doe</p>
                    <p className='text-blue-800 font-bold'>Level 1 - AI Explorer 🛠️</p>
                    <span className='flex gap-1 text-gray-300 w-fit items-center'><p className='text-blue-800'>5</p> points to level up </span>
                </div>
            </div>
            <div className='flex gap-12'>

            <div className='space-y-4'>
                {
                    [1,2,3,4,5].map((item) => (
                        <UserLevel key={item}/>
                    ))
                }
            </div>
             <div className='space-y-4'>
                {
                    [1,2,3,4].map((item) => (
                        <UserLevel key={item}/>
                    ))
                }
            </div>
            </div>
        </div>
        <p className='text-sm text-start  w-[60%] italic text-gray-300'>Last updated: Jul 30th 2025 2:35pm</p>
        <div className='flex justify-between w-[65%]'>
            <LeaderboardCard/>
            <LeaderboardCard/>
            <LeaderboardCard/>

        </div>
    </div>
  )
}

export default page