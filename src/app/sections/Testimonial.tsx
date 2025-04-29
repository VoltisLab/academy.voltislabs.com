"use client";

import Image from "next/image";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from 'framer-motion';

const testimonials = [
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

export default function Testimonial() {
  const [index, setIndex] = useState(0);
  const [[page, direction], setPage] = useState([0, 0]);
  const [isAnimating, setIsAnimating] = useState(false);

  // Auto-rotation for testimonials
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isAnimating) {
        nextTestimonial();
      }
    }, 6000);
    
    return () => clearTimeout(timer);
  }, [index, isAnimating]);

  const nextTestimonial = () => {
    setIsAnimating(true);
    setPage([page + 1, 1]);
    setIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setIsAnimating(true);
    setPage([page - 1, -1]);
    setIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.4 }
      }
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 100 : -100,
      opacity: 0,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.4 }
      }
    })
  };

  const imageVariants = {
    hover: {
      scale: 1.05,
      transition: { duration: 0.3 }
    }
  };

  const buttonVariants = {
    hover: {
      scale: 1.1,
      backgroundColor: "#301111",
      color: "#ffffff",
      transition: { duration: 0.2 }
    },
    tap: {
      scale: 0.95,
      transition: { duration: 0.1 }
    }
  };

  const { image, name, role, quote } = testimonials[index];

  return (
    <section className="py-16 bg-gradient-to-b from-[#313273] to-indigo-900 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row gap-12 items-center">
        {/* Left: Image with Animation */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }} 
          whileInView={{ opacity: 1, x: 0 }} 
          viewport={{ once: true }} 
          transition={{ duration: 0.8 }}
          className="relative w-full md:w-1/2 rounded-xl overflow-hidden shadow-xl shadow-indigo-900/40"
        >
          <AnimatePresence custom={direction} initial={false} onExitComplete={() => setIsAnimating(false)}>
            <motion.div
              key={page}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              className="relative w-full h-96"
            >
              <motion.div 
                whileHover="hover" 
                variants={imageVariants} 
                className="w-full h-full relative"
              >
                <Image
                  src={image}
                  alt={name}
                  fill
                  className="object-cover rounded-xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent rounded-xl" />
              </motion.div>
            </motion.div>
          </AnimatePresence>
          
          {/* Image Caption */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="absolute bottom-0 left-0 right-0 p-6 z-10"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-8 bg-indigo-500 rounded-full" />
              <h3 className="text-xl font-bold text-white">{name}</h3>
            </div>
            <p className="text-indigo-200 mt-1">{role}</p>
          </motion.div>
        </motion.div>

        {/* Right: Testimonial Content */}
        <div className="w-full md:w-1/2">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-bold text-indigo-300 mb-6"
          >
            What Our Students Say
          </motion.h2>
          
          <div className="relative h-40 mb-8">
            <AnimatePresence custom={direction} initial={false}>
              <motion.p
                key={page}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                className="text-gray-200 text-lg leading-relaxed italic"
              >
                "{quote}"
              </motion.p>
            </AnimatePresence>
          </div>

          <motion.hr 
            initial={{ width: "0%" }}
            whileInView={{ width: "100%" }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="border-indigo-800/40 mb-6" 
          />

          {/* Testimonial Navigation */}
          <div className="flex justify-between items-center">
            {/* Indicator Dots */}
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <motion.div
                  key={i}
                  className={`w-2 h-2 rounded-full cursor-pointer ${index === i ? 'bg-indigo-500' : 'bg-gray-600'}`}
                  onClick={() => {
                    setPage([i > index ? page + 1 : page - 1, i > index ? 1 : -1]);
                    setIndex(i);
                  }}
                  whileHover={{ scale: 1.5 }}
                  transition={{ duration: 0.2 }}
                />
              ))}
            </div>
            
            {/* Navigation Buttons */}
            <div className="flex gap-3">
              <motion.button
                onClick={prevTestimonial}
                disabled={isAnimating}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                className="w-10 h-10 rounded-full border border-indigo-500/50 flex items-center justify-center text-indigo-300 transition-colors"
              >
                <ArrowLeft size={18} />
              </motion.button>
              <motion.button
                onClick={nextTestimonial}
                disabled={isAnimating}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                className="w-10 h-10 rounded-full border border-indigo-500/50 flex items-center justify-center text-indigo-300 transition-colors"
              >
                <ArrowRight size={18} />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}