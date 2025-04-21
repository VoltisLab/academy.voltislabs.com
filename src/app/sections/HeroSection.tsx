// components/HeroSection.tsx
import Image from 'next/image';
import React from 'react';

const HeroSection = () => {
  return (
    <section className="relative w-full  text-white py-16 md:py-28 overflow-hidden">
      {/* Container */}
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-6 md:px-12">
        
        {/* Left Side: Texts */}
        <div className="max-w-xl md:pr-10">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight text-[#230F0F]">
            Learn Any Skill <br /> To Advance Your <br /> Career Path
          </h1>
          <div className="my-4 w-28 h-1 bg-yellow-400 rounded-full" />
          <p className="mt-6 text-[#230F0F] text-[20px] leading-relaxed">
            Want to improve your work skills? You need to study harder with the help of a great mentor to improve your performance at work.
          </p>

          {/* CTA + Reviews */}
          <div className="flex items-center mt-8 space-x-6">
            <button className="bg-pink-600 hover:bg-pink-700 transition text-white font-semibold px-6 py-3 rounded-md">
              Explore Path
            </button>
            <div className="flex items-center space-x-2">
              {/* Avatars */}
              <div className="flex -space-x-2">
                <Image
                  src="/user1.png" // Replace with your avatar path
                  alt="Alumni 1"
                  width={40}
                  height={40}
                  className="rounded-full border-2 border-white"
                />
                <Image
                  src="/user2.png"
                  alt="Alumni 2"
                  width={40}
                  height={40}
                  className="rounded-full border-2 border-white"
                />
                <Image
                  src="/user3.png"
                  alt="Alumni 3"
                  width={40}
                  height={40}
                  className="rounded-full border-2 border-white"
                />
              </div>

              {/* Rating */}
              <div className="flex items-center text-yellow-400 text-sm ml-3">
                ★★★★☆
                <span className="text-[#331C1C] ml-1">(4.5/5 dari 10k Alumni)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Illustration */}
        <div className="mt-12 md:mt-0 relative w-full max-w-lg">
          <Image
            src="/hero.png" // Place your Hero.png in public folder
            alt="Learning Illustration"
            width={600}
            height={600}
            className="w-full h-auto"
            priority
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
