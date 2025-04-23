'use client';
import Link from 'next/link';
import React, { useState } from 'react';
import Image from 'next/image';
import { FiMenu, FiX } from 'react-icons/fi';
import SignupModal from "@/components/modals/SignupModal";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
    const openModal = () => setIsModalOpen(true)
    const closeModal = () => setIsModalOpen(false)

  return (
    <div>
      <header className="w-full bg-white  fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 md:px-12 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <Image
            width={8}
            height={8}
            alt="VL Academy logo"
            src="/logo.svg"
            className="w-8 h-8 bg-[#2F3C8C] rounded-md"
          />
          <span className="text-lg md:text-xl font-semibold text-[#2F3C8C]">
            Voltis Labs Academy
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link href="/" className="text-[#331C1C] font-semibold hover:text-pink-600 transition">Home</Link>
          <Link href="/bootcamp" className="text-[#331C1C] font-semibold hover:text-pink-600 transition">Bootcamp</Link>
          <Link href="/events" className="text-[#331C1C] font-semibold hover:text-pink-600 transition">Events</Link>
          <Link href="/articles" className="text-[#331C1C] font-semibold hover:text-pink-600 transition">Articles</Link>
          <Link href="/contact" className="text-[#331C1C] font-semibold hover:text-pink-600 transition">Contact</Link>
        </nav>

        {/* Contact Button (Desktop) */}
        <div className="hidden md:block">
          
            <button className="border-2 border-pink-500 text-pink-500 font-semibold px-5 py-2 rounded-lg hover:bg-pink-500 hover:text-white transition" onClick={openModal}>
          Login/Signup
            </button>
       
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button onClick={toggleMenu} aria-label="Toggle menu">
            {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-md px-6 pt-4 pb-6 space-y-4 transition-all">
          <Link href="/" className="block text-[#331C1C] font-semibold hover:text-pink-600" onClick={toggleMenu}>Home</Link>
          <Link href="/bootcamp" className="block text-[#331C1C] font-semibold hover:text-pink-600" onClick={toggleMenu}>Bootcamp</Link>
          <Link href="/events" className="block text-[#331C1C] font-semibold hover:text-pink-600" onClick={toggleMenu}>Events</Link>
          <Link href="/articles" className="block text-[#331C1C] font-semibold hover:text-pink-600" onClick={toggleMenu}>Articles</Link>
          <Link href="/contact" className="block text-[#331C1C] font-semibold hover:text-pink-600" onClick={toggleMenu}>Contact</Link>
          <Link href="/contact">
            <button className="w-full mt-4 border-2 border-pink-500 text-pink-500 font-semibold px-5 py-2 rounded-lg hover:bg-pink-500 hover:text-white transition">
              Contact Us
            </button>
          </Link>
        </div>
      )}
    </header>
    <SignupModal isOpen={isModalOpen} onClose={closeModal}/>
    </div>
  );
};

export default Header;
