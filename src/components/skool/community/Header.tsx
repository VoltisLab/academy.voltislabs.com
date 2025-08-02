'use client';

import { useState } from 'react';
import { HiOutlineSearch, HiMenu, HiX } from 'react-icons/hi';
import { FaChevronDown } from 'react-icons/fa';
import { BiMessageRounded } from 'react-icons/bi';
import { IoNotificationsOutline } from 'react-icons/io5';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import DropdownPanel from '../DropdownPanel';
import LogoutModal from '../auth/LogoutModal';

export default function Header() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const params = useParams();
  const pathname = usePathname();
  const community = params?.community;  const segments = pathname?.split("/").filter(Boolean) || [];
  const currentTab = segments[segments.length - 1] ?? "";
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLogout = () => {
    setIsModalOpen(false);

    // TODO: Add your logout logic here
    window.location.href= "/login"
    console.log("User logged out");
  };


  const tabs = [
    { name: 'Community', link: '/' },
    { name: 'Classroom', link: '/classroom' },
    { name: 'Calendar', link: '/calendar' },
    { name: 'Members', link: '/members' },
    { name: 'Map', link: '/map' },
    { name: 'Leaderboards', link: '/leaderboards' },
    { name: 'About', link: '/about' },
  ];

  return (
    <header className="w-full bg-white border-b border-b-gray-200 py-3 flex flex-col items-center relative z-50">
      {/* Top Bar */}
      <div className="flex w-full lg:w-[90%] xl:w-[60%] items-center justify-between gap-3 px-4">
        {/* Logo and Title */}
        <div className="flex items-center gap-2">
          <div className="bg-black w-8 h-8 rounded-md flex items-center justify-center">
            <span className="text-white font-bold text-base">AIS</span>
          </div>
          <span className="text-base font-semibold">AI Automation Society</span>
          <FaChevronDown className="text-gray-500 text-xs mt-[1px]" />
        </div>

        {/* Hamburger - Mobile Only */}
        <div className="flex items-center gap-3 lg:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-gray-600 focus:outline-none"
          >
            {mobileMenuOpen ? <HiX size={26} /> : <HiMenu size={26} />}
          </button>
        </div>

        {/* Search Bar - Hidden on very small screens */}
        <div className="hidden w-full lg:flex lg:flex-1">
          <div className="flex items-center bg-gray-200 rounded-md px-3 py-2 w-full">
            <HiOutlineSearch size={20} className="text-gray-500" />
            <input
              type="text"
              placeholder="Search"
              className="bg-transparent outline-none text-base px-2 w-full"
            />
          </div>
        </div>

        {/* Right Icons */}
        <div className="flex items-center gap-4">
          {/* Chat */}
          <div className="relative">
            <BiMessageRounded
              size={24}
              className="text-gray-500 cursor-pointer"
              onClick={() => {
                setIsChatOpen((prev) => !prev);
                setIsNotificationOpen(false);
                setIsProfileOpen(false);
              }}
            />
            <DropdownPanel isOpen={isChatOpen} onClose={() => setIsChatOpen(false)}>
              {/* Chat Panel */}
              <div className="flex items-center justify-between px-4 py-2 border-b border-b-gray-200">
                <h3 className="font-semibold text-base">Chats</h3>
                <span className="text-base text-blue-500 cursor-pointer">All</span>
              </div>
              <div className="p-2 border-b border-b-gray-200">
                <div className="flex items-center bg-gray-100 rounded-md px-2 py-1">
                  <HiOutlineSearch className="text-gray-400 mr-2" />
                  <input
                    type="text"
                    placeholder="Search users"
                    className="text-base bg-transparent outline-none w-full"
                  />
                </div>
              </div>
              <div className="p-4 text-center text-base text-gray-400">No chats yet</div>
            </DropdownPanel>
          </div>

          {/* Notification */}
          <div className="relative">
            <IoNotificationsOutline
              size={24}
              className="text-gray-500 cursor-pointer"
              onClick={() => {
                setIsNotificationOpen((prev) => !prev);
                setIsChatOpen(false);
                setIsProfileOpen(false);
              }}
            />
            <DropdownPanel isOpen={isNotificationOpen} onClose={() => setIsNotificationOpen(false)}>
              <div className="flex items-center justify-between px-4 py-2 border-b border-b-gray-200">
                <h3 className="font-semibold text-base">Notifications</h3>
                <span className="text-base text-blue-500 cursor-pointer">Mark all read</span>
              </div>
              <div className="p-4 text-center text-base text-gray-400">No notifications yet</div>
            </DropdownPanel>
          </div>

          {/* Profile */}
          <div className="relative">
            <div className="relative cursor-pointer h-[30px] w-[30px]" onClick={() => {
              setIsProfileOpen((prev) => !prev);
              setIsChatOpen(false);
              setIsNotificationOpen(false);
            }}>
              <Image
                src="/img1.jpg"
                alt="Profile"
                fill
                className="rounded-full bg-black object-cover"
              />
            </div>
            <DropdownPanel isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} align="right" type="profile">
              <div className="space-y-2">
                <div className="p-4 border-b border-b-gray-200 font-semibold text-base truncate">
                  kawekwuneemmanuel20...
                </div>
                <ul className="text-base px-4 py-2 space-y-4">
                  <li className="cursor-pointer hover:underline">Profile</li>
                  <li className="cursor-pointer hover:underline">Settings</li>
                  <li className="cursor-pointer hover:underline">Affiliates</li>
                </ul>
                <hr className="bg-gray-200 text-gray-200" />
                <ul className="text-base px-4 py-2 space-y-2 text-gray-400">
                  <li className="cursor-not-allowed">Help center</li>
                  <li className="cursor-not-allowed">Create a community</li>
                  <li className="cursor-not-allowed">Discover communities</li>
                </ul>
                <div className="px-4 pb-3 pt-2">
                  <button onClick={() => setIsModalOpen(true)} className="text-base text-red-500 hover:underline">Log out</button>
                </div>
              </div>
            </DropdownPanel>
          </div>
        </div>
      </div>

      {/* Desktop Nav Tabs */}
      <nav className="hidden lg:flex gap-6 mt-2 w-full lg:w-[90%] xl:w-[60%] px-4">
        {tabs.map((tab) => {
          const isActive =
            (tab.link === '/' && pathname === `/${community}`) ||
            tab.link.slice(1) === currentTab;

          return (
            <Link href={`/${community}${tab.link}`} key={tab.name}>
              <span
                className={`text-base cursor-pointer ${
                  isActive
                    ? 'font-semibold border-b-4 border-black pb-2 text-black'
                    : 'text-gray-500'
                }`}
              >
                {tab.name}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div className="lg:hidden w-full px-4 mt-2">
          <div className="flex flex-col space-y-2 pb-4">
            {tabs.map((tab) => {
              const isActive =
                (tab.link === '/' && pathname === `/${community}`) ||
                tab.link.slice(1) === currentTab;

              return (
                <Link href={`/${community}${tab.link}`} key={tab.name} onClick={() => setMobileMenuOpen(false)}>
                  <span
                    className={`block text-base ${
                      isActive ? 'font-semibold text-black' : 'text-gray-500'
                    }`}
                  >
                    {tab.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
      <LogoutModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleLogout}
      />
    </header>
  );
}
