'use client'
import { useParams } from 'next/navigation'
import Navbar from './Navbar'

export default function ConditionalNavbar() {
  const params = useParams()
  const isCommunityPage = params?.community !== undefined

  if (isCommunityPage) {
    return null
  }

  return <Navbar />
}