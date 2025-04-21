// components/Header.tsx
import Link from 'next/link';
import React from 'react';
import Image from 'next/image';
const Header = () => {
  return (
    <header className="w-full flex justify-between items-center px-6 md:px-12 py-5 bg-transparent">
      {/* Logo */}
      <div className="flex items-center space-x-2">
        <Image  width={8} height={8} alt='vl Academy logo' src={'/logo.svg'} className="w-8 h-8 bg-[#2F3C8C] rounded-md" />
        <span className="text-lg md:text-xl font-semibold text-[#2F3C8C]">
          Voltis Labs Academy
        </span>
      </div>

      {/* Navigation */}
      <nav className="hidden md:flex items-center space-x-8">
        <Link href="/" className="text-[#331C1C] font-semibold hover:text-pink-600 transition">
          Home
        </Link>
        <Link href="/bootcamp" className="text-[#331C1C] font-semibold hover:text-pink-600 transition">
          Bootcamp
        </Link>
        <Link href="/events" className="text-[#331C1C] font-semibold hover:text-pink-600 transition">
          Events
        </Link>
        <Link href="/articles" className="text-[#331C1C] font-semibold hover:text-pink-600 transition">
          Articles
        </Link>
        <Link href="/contact" className="text-[#331C1C] font-semibold hover:text-pink-600 transition">
          Contact Us
        </Link>
      </nav>

      {/* Contact Us Button */}
      <div className="ml-4">
        <Link href="/contact">
          <button className="border-2 border-pink-500 text-pink-500 font-semibold px-5 py-2 rounded-lg hover:bg-pink-500 hover:text-white transition">
            Contact Us
          </button>
        </Link>
      </div>
    </header>
  );
};

export default Header;
