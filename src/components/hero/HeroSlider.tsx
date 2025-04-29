"use client"
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Define the slide data
const slides = [
  {
    id: 1,
    image: '/hero/hero1.png',
    title: 'DESIGN',
    description: 'Design isn’t just how it looks - it’s how it works. At Voltis Labs Academy, we champion design that solves problems, inspires users, and shapes the future.',
  },
  {
    id: 2,
    image: '/hero/hero2.png',
    title: 'BUILD',
    description: 'We don’t just learn - we build. At Voltis Labs Academy, you turn ideas into real products, real experiences, and real impact.',
  },
  {
    id: 3,
    image: '/hero/hero3.png',
    title: 'INNOVATE',
    description: 'Innovation is the fuel of the future. At Voltis Labs Academy, you’ll go beyond building - you’ll invent, disrupt, and redefine what’s possible.',
  },
];

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState('right');

  const goToNextSlide = () => {
    if (isAnimating) return;
    setDirection('right');
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    setTimeout(() => setIsAnimating(false), 500);
  };

  const goToPrevSlide = () => {
    if (isAnimating) return;
    setDirection('left');
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    setTimeout(() => setIsAnimating(false), 500);
  };

  useEffect(() => {
    const interval = setInterval(goToNextSlide, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Background images with sliding effect */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-transform duration-500 ease-in-out ${
            index === currentSlide
              ? 'z-10 translate-x-0'
              : index === (currentSlide - 1 + slides.length) % slides.length && direction === 'right'
              ? 'z-0 -translate-x-full'
              : index === (currentSlide + 1) % slides.length && direction === 'left'
              ? 'z-0 translate-x-full'
              : 'z-0 translate-x-full'
          }`}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>
      ))}

      {/* Content overlay */}
      <div className="absolute inset-0 z-20 flex items-center">
        <div className="container mx-auto px-8">
          <div className="max-w-lg text-white space-y-6">
            <h2 className="text-lg uppercase tracking-wider font-medium opacity-80">OUR VISION</h2>
            <h1 className="text-7xl font-bold">
              {slides[currentSlide].title}
            </h1>
            <p className="text-sm opacity-80">
              {slides[currentSlide].description}
            </p>
            <button className="flex items-center space-x-2 border border-white px-4 py-2 rounded-full hover:bg-white/10 transition-colors">
              <span>View Courses</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="absolute bottom-8 left-0 right-0 z-30 flex justify-between items-center px-8">
        <button
          onClick={goToPrevSlide}
          className="p-2 rounded-full text-white hover:bg-white/10 transition-colors"
          aria-label="Previous slide"
        >
          <ChevronLeft size={24} />
        </button>

        {/* Slide indicator */}
        <div className="flex items-center space-x-2">
          <span className="text-white text-sm">0{currentSlide + 1}</span>
          <div className="relative w-32 h-px bg-white/30">
            <div
              className="absolute h-full bg-white transition-all duration-500"
              style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
            ></div>
          </div>
          <span className="text-white text-sm">0{slides.length}</span>
        </div>

        <button
          onClick={goToNextSlide}
          className="p-2 rounded-full text-white hover:bg-white/10 transition-colors"
          aria-label="Next slide"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
}