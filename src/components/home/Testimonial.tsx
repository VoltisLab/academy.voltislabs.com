"use client";

import Image from "next/image";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from 'framer-motion';

// Define TypeScript interfaces
interface Testimonial {
  image: string;
  name: string;
  role: string;
  quote: string;
}

interface AnimatedBubbleProps {
  size: number;
  left: string;
  top: string;
  delay: number;
  duration: number;
}

interface BubbleProps {
  id: number;
  size: number;
  left: string;
  top: string;
  delay: number;
  duration: number;
}

// Testimonial data
const testimonials: Testimonial[] = [
  {
    image: "/testi.jpg",
    name: "Briana Patton",
    role: "Designer at Salesforce",
    quote: `Higher education in the era of the industrial revolution 4.0 requires breakthrough learning using digital platforms that answer the challenges of millennial students to study anywhere`,
  },
  {
    image: "/testi2.png",
    name: "Jordan Smith",
    role: "Software Engineer at Google",
    quote: `Voltis Labs Academy helped me bridge the gap between theory and industry. I was able to land a tech internship right after the program.`,
  },
  {
    image: "/testi3.png",
    name: "Amina Yusuf",
    role: "UI/UX Designer at Shopify",
    quote: `I loved the practical workshops and mentoring sessions. They gave me clarity on career direction and real skills employers want.`,
  },
];

// Animated Bubble component
const AnimatedBubble = ({ size, left, top, delay, duration }: AnimatedBubbleProps) => {
  const bubbleVariants = {
    animate: {
      opacity: [0, 0.7, 0.5, 0.2, 0],
      scale: [0.5, 1, 1.1, 1, 0.9],
      y: [0, -30, -60, -100, -120],
      transition: {
        delay,
        duration,
        repeat: Infinity,
        repeatType: "loop" as const,
        ease: "easeInOut",
      }
    }
  };

  return (
    <motion.div
      className="absolute rounded-full bg-indigo-400/20 backdrop-blur-sm pointer-events-none"
      style={{
        width: size,
        height: size,
        left,
        top,
        zIndex: 1,
      }}
      initial={{ opacity: 0, scale: 0.5, y: 0 }}
      animate="animate"
      variants={bubbleVariants}
    />
  );
};

export default function Testimonial() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1); // 1 for right-to-left, -1 for left-to-right
  const [isAnimating, setIsAnimating] = useState(false);
  const [autoplay, setAutoplay] = useState(true);

  // Generate random bubbles once
  const bubbles: BubbleProps[] = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    size: Math.random() * 50 + 20, // Size between 20px and 70px
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    delay: Math.random() * 5,
    duration: Math.random() * 10 + 10, // Duration between 10s and 20s
  }));

  // Navigation functions
  const nextTestimonial = useCallback(() => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setDirection(1); // Right to left transition
    setIndex(prev => (prev + 1) % testimonials.length);
    
    // Reset autoplay timer on manual navigation
    setAutoplay(false);
    setTimeout(() => setAutoplay(true), 6000);
  }, [isAnimating, testimonials.length]);

  const prevTestimonial = useCallback(() => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setDirection(-1); // Left to right transition
    setIndex(prev => (prev - 1 + testimonials.length) % testimonials.length);
    
    // Reset autoplay timer on manual navigation
    setAutoplay(false);
    setTimeout(() => setAutoplay(true), 6000);
  }, [isAnimating, testimonials.length]);

  // Handle animation completion
  const handleAnimationComplete = useCallback(() => {
    setIsAnimating(false);
  }, []);

  // Auto-rotation for testimonials
  useEffect(() => {
    if (!autoplay || isAnimating) return;
    
    const timer = setTimeout(() => {
      nextTestimonial();
    }, 6000);
    
    return () => clearTimeout(timer);
  }, [index, isAnimating, autoplay, nextTestimonial]);

  // Simple horizontal slide variants
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
    }),
    center: {
      x: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    },
    exit: (direction: number) => ({
      x: direction < 0 ? '100%' : '-100%',
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };

  const currentTestimonial = testimonials[index];

  return (
    <section className="py-16 bg-gradient-to-b from-[#313273] to-indigo-900 text-white overflow-hidden relative">
      {/* Animated Bubbles Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {bubbles.map((bubble) => (
          <AnimatedBubble
            key={bubble.id}
            size={bubble.size}
            left={bubble.left}
            top={bubble.top}
            delay={bubble.delay}
            duration={bubble.duration}
          />
        ))}
        <div className="absolute inset-0 bg-[#313273]/30 backdrop-blur-[2px]" />
      </div>
      
      {/* Glow Effects */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-purple-500/20 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row gap-12 items-center relative z-10">
        {/* Left: Image with Animation */}
        <div className="relative w-full md:w-1/2 rounded-xl overflow-hidden shadow-xl shadow-indigo-900/40 h-96">
          <AnimatePresence 
            custom={direction} 
            initial={false}
            onExitComplete={handleAnimationComplete}
          >
            <motion.div
              key={index}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute top-0 left-0 w-full h-full"
            >
              <div className="w-full h-full relative">
                <Image
                  src={currentTestimonial.image}
                  alt={currentTestimonial.name}
                  fill
                  className="object-cover rounded-xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent rounded-xl" />
              </div>
              
              {/* Image Caption */}
              <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-8 bg-indigo-500 rounded-full" />
                  <h3 className="text-xl font-bold text-white">{currentTestimonial.name}</h3>
                </div>
                <p className="text-indigo-200 mt-1">{currentTestimonial.role}</p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right: Testimonial Content */}
        <div className="w-full md:w-1/2">
          <h2 className="text-3xl font-bold text-indigo-300 mb-6">
            What Our Students Say
          </h2>
          
          <div className="relative h-40 mb-8 overflow-hidden">
            <AnimatePresence custom={direction} initial={false}>
              <motion.p
                key={index}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="absolute w-full text-gray-200 text-lg leading-relaxed italic"
              >
                "{currentTestimonial.quote}"
              </motion.p>
            </AnimatePresence>
          </div>

          <hr className="border-indigo-800/40 mb-6" />

          {/* Testimonial Navigation */}
          <div className="flex justify-between items-center">
            {/* Indicator Dots */}
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full cursor-pointer ${index === i ? 'bg-indigo-500' : 'bg-gray-600'}`}
                  onClick={() => {
                    if (isAnimating) return;
                    setDirection(i > index ? 1 : -1);
                    setIndex(i);
                    setAutoplay(false);
                    setTimeout(() => setAutoplay(true), 6000);
                  }}
                />
              ))}
            </div>
            
            {/* Navigation Buttons */}
            <div className="flex gap-3">
              <button
                onClick={prevTestimonial}
                className="w-10 h-10 rounded-full border border-indigo-500/50 flex items-center justify-center text-indigo-300 transition-colors hover:bg-indigo-900 hover:text-white z-20"
                aria-label="Previous testimonial"
              >
                <ArrowLeft size={18} />
              </button>
              <button
                onClick={nextTestimonial}
                className="w-10 h-10 rounded-full border border-indigo-500/50 flex items-center justify-center text-indigo-300 transition-colors hover:bg-indigo-900 hover:text-white z-20"
                aria-label="Next testimonial"
              >
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}