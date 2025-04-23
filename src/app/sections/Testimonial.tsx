"use client";

import Image from "next/image";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { useState } from "react";

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

  const nextTestimonial = () => {
    setIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const { image, name, role, quote } = testimonials[index];

  return (
    <section className="py-16 text-white transition-all duration-500 ease-in-out">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row gap-12 items-center">
        {/* Left: Image */}
        <div className="relative rounded-xl overflow-hidden shadow-xl shadow-gray-900/40 transition-all duration-500">
          <Image
            src={image}
            alt={name}
           
            width={500}
            height={400}
            className="object-contain rounded-xl"
          />
        </div>

        {/* Right: Testimonial */}
        <div className="max-w-xl transition-opacity duration-500 ease-in-out">
          <h2 className="text-3xl font-bold text-[#301111] mb-6">What did they say</h2>
          <p className="text-[#4D4D4D] h-[120px] mb-6 leading-relaxed">{quote}</p>

          <hr className="border-[#DCDCE5] mb-4" />

          <div>
            <p className="text-lg font-semibold text-indigo-300">{name}</p>
            <p className="text-sm text-gray-500">{role}</p>
          </div>

          <div className="mt-6 flex flex-row gap-5 items-center">
          <button
              onClick={prevTestimonial}
              className="w-12 h-12 cursor-pointer rounded-full border hover:text-white border-[#301111] flex items-center justify-center hover:bg-[gray] transition"
            >
              <ArrowLeft className="text-[#301111] hover:text-white " size={20} />
            </button>
            <button
              onClick={nextTestimonial}
              className="w-12 h-12 cursor-pointer rounded-full border hover:text-white border-[#301111] flex items-center justify-center hover:bg-[gray] transition"
            >
              <ArrowRight className="text-[#301111] hover:text-white " size={20} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
