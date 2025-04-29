// components/GraduateCompanies.tsx
import Image from "next/image";
import { motion } from 'framer-motion';

const companies = [
  { name: "ClickUp", src: "/companies/clickup.png" },
  { name: "Dropbox", src: "/companies/dropbox.png" },
  { name: "Elastic", src: "/companies/elastic.png" },
  { name: "GitHub", src: "/companies/github.png" },
  { name: "FreshBooks", src: "/companies/freshbooks.png" },
  { name: "HelpScout", src: "/companies/helpscout.png" },
  { name: "HubSpot", src: "/companies/hubspot.png" },
  { name: "Intuit", src: "/companies/intuit.png" },
  { name: "Google", src: "/companies/google.png" },
  { name: "Paychex", src: "/companies/paychex.png" },
];

export default function GraduateCompanies() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <section className="py-16 bg-white overflow-hidden">
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
        className="max-w-6xl mx-auto px-4 text-center"
      >
        <motion.h2 
          variants={itemVariants}
          className="text-xl font-semibold text-gray-800 mb-10"
        >
          Our graduates have worked in
        </motion.h2>
        <motion.div 
          variants={containerVariants}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 place-items-center"
        >
          {companies.map((company, idx) => (
            <motion.div 
              key={idx} 
              variants={itemVariants}
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                transition: { duration: 0.3 }
              }}
              className="bg-white p-4 rounded-md w-full h-20 flex items-center justify-center"
            >
              <Image
                src={company.src}
                alt={company.name}
                width={140}
                height={60}
                className="object-contain max-h-full max-w-full"
              />
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}