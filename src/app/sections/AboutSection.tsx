
import Image from "next/image";
import { motion } from 'framer-motion';

export default function AboutSection() {
  return (
    <section className="py-16 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 flex flex-col lg:flex-row items-center gap-12">
        {/* Left image */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="relative w-full lg:w-1/2"
        >
          <motion.div 
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
            className="rounded-xl overflow-hidden shadow-lg"
          >
            <Image
              src="/education.jpg"
              alt="Educational technology"
              width={600}
              height={500}
              className="object-cover w-full h-full"
            />
          </motion.div>

          {/* Animated overlay caption */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="absolute bottom-4 left-4 text-white bg-black bg-opacity-50 p-3 rounded-lg"
          >
            <p className="font-bold text-lg">Educational technology</p>
            <p className="text-sm">© Jakarta, Indonesia</p>
          </motion.div>
          
          {/* Decorative element */}
          <motion.div 
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="absolute -top-4 -left-4 w-full h-full border-2 border-purple-300 rounded-xl -z-10"
          ></motion.div>
        </motion.div>

        {/* Right content */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="w-full text-[#230F0F] lg:w-1/2"
        >
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-[40px] font-bold text-[#230F0F] leading-snug mb-4"
          >
            Why Voltis Labs<br className="hidden sm:block" />
          </motion.h2>
          
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5, origin: 0 }}
            className="w-24 h-1 bg-purple-600 mb-8"
          ></motion.div>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-[20px] font-medium mb-6"
          >
            Voltis Labs Academy is not just another online course platform. We prepare the next generation of builders through hands-on learning, mentorship, and direct internship opportunities inside real Voltis Labs projects.
            Whether you're a developer, designer, marketer, or future product leader - you'll gain experience that matters.
          </motion.p>
          
          <motion.button 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-[#313273] hover:bg-indigo-900 text-white font-semibold py-3 px-6 rounded-lg transition shadow-lg"
          >
            Apply Now
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
