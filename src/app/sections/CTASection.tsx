import Image from "next/image";

export default function CTASection() {
  return (
    <section className="bg-[#D63C97] py-16">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-12">
        {/* Left Text Content */}
        <div className="text-white max-w-xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Still Confused About Your <br className="hidden md:block" />
            Career Choice? Consult With <br className="hidden md:block" />
            Our Experts
          </h2>
          <button className="bg-white text-[#D63C97] font-semibold px-6 py-3 rounded-lg shadow hover:bg-gray-100 transition">
            Contact Us
          </button>
        </div>

        {/* Right Image */}
        <div className="relative w-full md:w-1/2 flex justify-center">
          <Image
            src="/student.png" // You need to extract and place this image here
            alt="Consultation"
            width={400}
            height={400}
            className="object-contain"
          />
        </div>
      </div>
    </section>
  );
}
