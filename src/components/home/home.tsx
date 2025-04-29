"use client"
import HeroSection from "@/app/sections/HeroSection";
import Partners from "@/app/sections/Partners";
import AboutSection from "@/app/sections/AboutSection";
import CTASection from "@/app/sections/CTASection";
import GraduateCompanies from "@/app/sections/GraduateCompanies";
import Testimonial from "@/app/sections/Testimonial";
import CourseSection from "@/app/sections/CourseSection";
import HeroSlider from "@/components/hero/HeroSlider";
export default function HomePage() {
  return (
    <div>
      <HeroSlider />
      <HeroSection />
      <Partners />
      <AboutSection />
      <CTASection />
      <CourseSection />
      <GraduateCompanies />
      <Testimonial />
    </div>
  );
}
