// components/CTASection.tsx
import Image from "next/image";
import { motion } from 'framer-motion';

export default function CTASection() {
  return (
    <section className="bg-[#313273] py-16 overflow-hidden relative">
      {/* Animated background shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-purple-500 opacity-20"></div>
        <div className="absolute top-40 -left-20 w-72 h-72 rounded-full bg-indigo-400 opacity-20"></div>
        
        <motion.div 
          className="absolute top-1/4 left-1/3 w-4 h-4 rounded-full bg-yellow-300"
          animate={{ 
            y: [0, 10, 0],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
          }}
        />
        
        <motion.div 
          className="absolute bottom-1/4 right-1/4 w-6 h-6 rounded-full bg-pink-400"
          animate={{ 
            y: [0, -15, 0],
            opacity: [0.3, 0.8, 0.3]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
          }}
        />
      </div>
    
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
        {/* Left Text Content */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-white max-w-xl"
        >
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold mb-6"
          >
            Still Confused About Your <br className="hidden md:block" />
            Career Choice? Consult With <br className="hidden md:block" />
            Our Experts
          </motion.h2>
          
          <motion.button 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-[#313273] font-semibold px-6 py-3 rounded-lg shadow-lg hover:bg-gray-100 transition"
          >
            Contact Us
          </motion.button>
        </motion.div>

        {/* Right Image */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="relative w-full md:w-1/2 flex justify-center"
        >
          <motion.div
            animate={{ 
              y: [0, -10, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Image
              src="/student.jpg"
              alt="Consultation"
              width={500}
              height={500}
              className="object-contain rounded-xl shadow-xl"
            />
          </motion.div>
          
          {/* Decorative element */}
          <motion.div 
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="absolute -top-4 -right-4 w-full h-full border-2 border-purple-200 rounded-xl -z-10"
          ></motion.div>
        </motion.div>
      </div>
    </section>
  );
}