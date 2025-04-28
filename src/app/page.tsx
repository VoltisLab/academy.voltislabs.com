import HeroSection from "./sections/HeroSection";
import Partners from "./sections/Partners";
import AboutSection from "./sections/AboutSection";
import CTASection from "./sections/CTASection";
import GraduateCompanies from "./sections/GraduateCompanies";
import Footer from "./sections/Footer";
import Testimonial from "./sections/Testimonial";
import CourseSection from "./sections/CourseSection";
import Header from "@/components/Header";
import HeroSlider from "@/components/hero/HeroSlider";
export default function Home() {
  return (
    <main>
      <Header />
      <HeroSlider />
      <HeroSection />
      <Partners />
      <AboutSection />
      <CTASection />
      <CourseSection />
      <GraduateCompanies />
      <Testimonial />
      <Footer />
    </main>
  );
}
