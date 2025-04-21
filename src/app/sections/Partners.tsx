import Image from "next/image";

const partners = [
  { src: "/partners/skillshare.png", alt: "Skillshare" },
  { src: "/partners/udemy.png", alt: "Udemy" },
  { src: "/partners/google.png", alt: "Google" },
  { src: "/partners/coursera.png", alt: "Coursera" },
  { src: "/partners/foundation.png", alt: "Foundation" },
];

export default function Partners() {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-10">
        <div className="text-center md:text-left md:max-w-sm">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-800">
            We Partner With More<br />
            Than <span className="text-primary font-bold">10+ Companies</span>
          </h2>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-6">
          {partners.map((partner, index) => (
            <Image
              key={index}
              src={partner.src}
              alt={partner.alt}
              width={100}
              height={50}
              className="h-8 w-auto object-contain grayscale hover:grayscale-0 transition duration-300"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
