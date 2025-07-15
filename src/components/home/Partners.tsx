"use client"
import { motion } from "framer-motion";
import Image from "next/image";

const partners = [
  { src: "/partners/skillshare.png", alt: "Skillshare" },
  { src: "/partners/udemy.png", alt: "Udemy" },
  { src: "/partners/google.png", alt: "Google" },
  { src: "/partners/coursera.png", alt: "Coursera" },
  { src: "/partners/foundation.png", alt: "Foundation" },
];

export default function Partners() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  return (
    <div className="py-12 bg-white overflow-hidden">
      <div>
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-10"
        >
          <motion.div 
            variants={itemVariants}
            className="text-center md:text-left md:max-w-sm"
          >
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-800">
              We Partner With More<br />
              Than <motion.span 
                initial={{ color: "#000" }}
                whileInView={{ color: "#E733A1" }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="font-bold"
              >10+ Companies</motion.span>
            </h2>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            className="flex flex-wrap justify-center items-center gap-6"
          >
            {partners.map((partner, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.1, transition: { duration: 0.2 } }}
              >
                <Image
                  src={partner.src}
                  alt={partner.alt}
                  width={100}
                  height={100}
                  className="w-auto object-contain transition duration-300"
                />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}