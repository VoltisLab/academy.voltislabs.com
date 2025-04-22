// components/HeroSection.tsx
import Image from 'next/image';
import React from 'react';

const HeroSection = () => {
  return (
    <section className="relative w-full text-white py-16 md:py-28 overflow-hidden bg-white">
      {/* Container */}
      <div className="max-w-7xl mx-auto flex flex-col-reverse md:flex-row items-center justify-between px-6 md:px-12 gap-10">
        
        {/* Left Side: Texts */}
        <div className="w-full md:w-1/2 max-w-xl">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight text-[#230F0F]">
            Learn Any Skill <br /> To Advance Your <br /> Career Path
          </h1>
          <Image
            alt="underline"
            src="/underline.png"
            height={10}
            width={320}
            className="mt-2"
          />
          <p className="mt-6 text-[#230F0F] text-lg md:text-xl leading-relaxed">
            Gain real world experience and master digital skills through immersive internships 
          </p>

          {/* CTA + Reviews */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center mt-8 gap-6">
            <button className="bg-pink-600 hover:bg-pink-700 transition text-white font-semibold px-6 py-3 rounded-md">
              Explore Path
            </button>

            {/* Reviews */}
            <div className="flex items-center space-x-4">
              <div className="flex -space-x-2">
                <Image
                  src="/user1.png"
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
              <div className="text-yellow-400 text-sm">
                ★★★★☆ <span className="text-[#331C1C] ml-1">(4.5/5 from 10k Alumni)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Illustration */}
        <div className="w-full md:w-1/2 max-w-lg">
          <Image
            src="/hero.png"
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
