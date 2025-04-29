"use client"

// components/HeroSection.tsx
import Image from 'next/image';
import React from 'react';
import { motion } from 'framer-motion';

const HeroSection = () => {
  return (
    <section className="relative w-full text-white py-16 md:py-28 overflow-hidden">
      {/* Animated background shapes */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-purple-500 opacity-10"></div>
        <div className="absolute top-40 -left-20 w-72 h-72 rounded-full bg-indigo-400 opacity-10"></div>
        
        <motion.div 
          className="absolute top-1/4 left-1/3 w-4 h-4 rounded-full bg-yellow-300"
          animate={{ 
            y: [0, 10, 0],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
          }}
        />
        
        <motion.div 
          className="absolute top-1/2 right-1/4 w-6 h-6 rounded-full bg-pink-400"
          animate={{ 
            y: [0, -15, 0],
            opacity: [0.3, 0.8, 0.3]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
          }}
        />
      </div>
    
      {/* Container */}
      <div className="container mt-10 mx-auto flex flex-col md:flex-row items-center justify-between px-6 md:px-12">
        
        {/* Left Side: Texts */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-xl md:pr-10"
        >
          <h1 className="text-4xl md:text-6xl font-bold leading-tight text-[#230F0F]">
            Learn by <br /> Building the Future
          </h1>
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: 0.3, duration: 0.5, origin: 0 }}
          >
            <Image alt='underline' src={'/underline.png'} height={10} width={320}/>
          </motion.div>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-6 text-[#230F0F] text-[20px] leading-relaxed"
          >
            Join Voltis Labs Academy - where ambitious creators, developers, and innovators build real-world skills by working on real-world projects.
          </motion.p>

          {/* CTA + Reviews */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="block md:flex items-center mt-8 space-x-6"
          >
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-[#313273] hover:bg-indigo-900 transition text-white font-semibold px-3 py-3 rounded-md shadow-lg"
            >
              View Programmes
            </motion.button>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="flex md:mt-0 mt-5 items-center space-x-2"
            >
              {/* Avatars */}
              <div className="flex -space-x-2">
                <motion.div whileHover={{ y: -5, transition: { duration: 0.2 } }}>
                  <Image
                    src="/user1.png"
                    alt="Alumni 1"
                    width={40}
                    height={40}
                    className="rounded-full border-2 border-white"
                  />
                </motion.div>
                <motion.div whileHover={{ y: -5, transition: { duration: 0.2 } }}>
                  <Image
                    src="/user2.png"
                    alt="Alumni 2"
                    width={40}
                    height={40}
                    className="rounded-full border-2 border-white"
                  />
                </motion.div>
                <motion.div whileHover={{ y: -5, transition: { duration: 0.2 } }}>
                  <Image
                    src="/user3.png"
                    alt="Alumni 3"
                    width={40}
                    height={40}
                    className="rounded-full border-2 border-white"
                  />
                </motion.div>
              </div>

              {/* Rating */}
              <div className="flex items-center text-yellow-400 text-sm ml-3">
                ★★★★☆
                <span className="text-[#331C1C] ml-1">(4.5/5 dari 10k Alumni)</span>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Right Side: Illustration */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mt-12 md:mt-0 relative w-full max-w-lg"
        >
          <motion.div
            animate={{ 
              y: [0, -10, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Image
              src="/hero.png"
              alt="Learning Illustration"
              width={600}
              height={600}
              className="w-full h-auto"
              priority
            />
          </motion.div>
          
          {/* Decorative elements */}
          <motion.div 
            className="absolute -top-4 -right-4 w-16 h-16 bg-pink-500 rounded-full opacity-20"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.3, 0.2]
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
            }}
          />
          <motion.div 
            className="absolute bottom-10 -left-8 w-24 h-24 bg-indigo-500 rounded-full opacity-20"
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.2, 0.3, 0.2]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
            }}
          />
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection