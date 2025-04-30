"use client"
import HeroSection from "@/components/home/HeroSection";
import Partners from "@/components/home/Partners";
import AboutSection from "@/components/home/AboutSection";
import CTASection from "@/components/home/CTASection";
import GraduateCompanies from "@/components/home/GraduateCompanies";
import Testimonial from "@/components/home/Testimonial";
import CourseSection from "@/components/home/CourseSection";
import HeroSlider from "@/components/home/HeroSlider";
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
