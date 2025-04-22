import Image from "next/image";

export default function AboutSection() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 flex flex-col lg:flex-row items-center gap-12">
        {/* Left image */}
        <div className="relative w-full lg:w-1/2">
          <div className="rounded-xl overflow-hidden shadow-lg">
            <Image
              src="/education.jpg" // Make sure this image is in `public/about/`
              alt="Educational technology"
              width={600}
              height={500}
              className="object-cover w-full h-full"
            />
          </div>

          {/* Overlay caption */}
          <div className="absolute bottom-4 left-4 text-white">
            <p className="font-bold text-lg">Educational technology</p>
            <p className="text-sm">© Jakarta, Indonesia</p>
          </div>
        </div>

        {/* Right content */}
        <div className="w-full text-[#230F0F]  lg:w-1/2">
          <h2 className="text-[40px] font-bold text-[#230F0F] leading-snug mb-4">
            Voltis Labs help you Become <br className="hidden sm:block" />
            Experienced
          </h2>
          <p className="text-[20px] font-medium mb-6">
            Voltis Labs Academy provides internship opportunities for students, graduates,
            universities and individual professionals. It allows users to create courses,
            and provides an integrated learning management system. Its offerings include
            digital course tools, study materials, IT infrastructure and other operations.
          </p>
          <button className="bg-[#E733A1] hover:bg-[#c92789] text-white font-semibold py-3 px-6 rounded-lg transition">
            Apply Now
          </button>
        </div>
      </div>
    </section>
  );
}
