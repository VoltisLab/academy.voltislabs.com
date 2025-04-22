import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function Testimonial() {
  return (
    <section className="py-16  text-white">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row gap-12 items-center">
        {/* Left: Image */}
        <div className="relative rounded-xl overflow-hidden shadow-xl shadow-gray-900/40">
          <Image
            src="/testi.jpg"
            alt="Student Testimonial"
            width={500}
            height={400}
            className="object-cover rounded-xl"
          />
        </div>

        {/* Right: Testimonial */}
        <div className="max-w-xl">
          <h2 className="text-3xl font-bold text-[#301111] mb-6">What did they say</h2>
          <p className="text-[#4D4D4D] mb-6 leading-relaxed">
            Higher education in the era of the industrial revolution 4.0 requires breakthrough
            learning using digital platforms that answer the challenges of millennial students
            to study anywhere, anytime and with leading-edge ICT technology. From student
            recruitment to teaching and learning administration processes,
          </p>

          <hr className="border-[#DCDCE5] mb-4" />

          <div>
            <p className="text-lg font-semibold text-indigo-300">Briana Patton</p>
            <p className="text-sm text-gray-500">Designer at Salesforce</p>
          </div>

          <div className="mt-6">
            <button className="w-12 h-12 rounded-full border border-[#301111] flex items-center justify-center hover:bg-[#301111] transition">
              <ArrowRight className="text-[#301111] group-hover:text-white" size={20} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
