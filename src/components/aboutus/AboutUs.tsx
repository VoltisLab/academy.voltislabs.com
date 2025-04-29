"use client"
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Rocket, BookOpen, GraduationCap, Globe, Heart, Star, Building, CheckCircle } from 'lucide-react';

export default function AboutPage() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const fadeIn = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-[#313273] text-white">
        {/* Animated background shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-purple-500 opacity-20"></div>
          <div className="absolute top-40 -left-20 w-72 h-72 rounded-full bg-indigo-400 opacity-20"></div>
          <div className="absolute bottom-0 right-20 w-80 h-80 rounded-full bg-purple-600 opacity-10"></div>
          
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
            className="absolute top-1/2 right-1/4 w-6 h-6 rounded-full bg-pink-400"
            animate={{ 
              y: [0, -15, 0],
              opacity: [0.3, 0.8, 0.3]
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
            }}
          />
          
          <motion.div 
            className="absolute bottom-1/4 left-1/4 w-5 h-5 rounded-full bg-blue-300"
            animate={{ 
              y: [0, 12, 0],
              opacity: [0.2, 0.7, 0.2]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
            }}
          />
        </div>
        
        <div className="relative container mx-auto px-6 py-24 max-w-6xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">About Voltis Labs Academy</h1>
            <p className="text-xl md:text-2xl text-indigo-200 max-w-3xl mx-auto">
              Building a future where everyone has a seat at the table
            </p>
          </motion.div>
        </div>
        
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="relative -bottom-10 mx-auto w-full max-w-6xl px-6"
        >
          <div className="bg-white rounded-xl shadow-xl p-8 text-center text-gray-800 xl:mb-5">
            <p className="text-lg md:text-xl font-medium">
              At Voltis Labs Academy (VLA), we are more than just an educational platform — we are a movement.
            </p>
          </div>
        </motion.div>
      </div>
      
      {/* Mission Section */}
      <section className="py-24 px-6 bg-gradient-to-b from-white to-indigo-50">
        <div className="container mx-auto max-w-6xl">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-indigo-900 mb-4">Our Mission</h2>
            <div className="w-24 h-1 bg-purple-600 mx-auto mb-8"></div>
          </motion.div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <p className="text-lg mb-6 text-gray-700">
                We believe talent is universal, but opportunity is not. That's why we're committed to providing world-class education, mentorship, and hands-on experience — for free — to students who need it most.
              </p>
              <p className="text-lg mb-6 text-gray-700">
                Our ambition is bold: train 10,000 students and empower them to transform their lives and communities.
              </p>
              <p className="text-lg text-gray-700">
                <strong>VLA</strong> focuses on real-world, product-driven education. Here, you won't just take courses — you'll design, build, and launch real products before you graduate. We believe that learning is most powerful when it's applied.
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="bg-[#313273] rounded-lg p-8 relative z-10">
                <div className="bg-purple-500 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                  <GraduationCap className="text-white w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Not Just Tech</h3>
                <p className="text-indigo-100">
                  We recognize that building great products and businesses requires a wide range of skills — not just coding. That's why our curriculum spans technology, design, marketing, branding, business development, and more.
                </p>
              </div>
              
              <div className="absolute -top-4 -right-4 w-full h-full border-2 border-purple-300 rounded-lg z-0"></div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* What Makes Us Different */}
      <section className="py-24 px-6 bg-white">
        <div className="container mx-auto max-w-6xl">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-indigo-900 mb-4">What Makes Us Different</h2>
            <div className="w-24 h-1 bg-purple-600 mx-auto mb-8"></div>
          </motion.div>
          
          <motion.div 
            variants={staggerChildren}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {[
              { icon: <Globe className="w-8 h-8 text-purple-600" />, title: "100% Remote", description: "Accessible from anywhere in the world." },
              { icon: <Rocket className="w-8 h-8 text-purple-600" />, title: "Real-world Projects", description: "Build actual products, not just theory." },
              { icon: <Users className="w-8 h-8 text-purple-600" />, title: "Focus on Diversity", description: "Emphasizing underrepresented talent." },
              { icon: <Star className="w-8 h-8 text-purple-600" />, title: "Free Access", description: "To premium courses and resources." }
            ].map((item, index) => (
              <motion.div 
                key={index}
                variants={fadeIn}
                className="bg-indigo-50 rounded-xl p-6 text-center hover:shadow-lg transition-shadow duration-300"
              >
                <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-md">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-indigo-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      
      {/* Our Approach */}
      <section className="py-24 px-6 bg-indigo-900 text-white">
        <div className="container mx-auto max-w-6xl">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Approach</h2>
            <div className="w-24 h-1 bg-purple-400 mx-auto mb-8"></div>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { 
                icon: <Users className="w-12 h-12 text-purple-300" />, 
                title: "Expert Mentorship", 
                description: "Receive guidance from experienced professionals who are invested in your success." 
              },
              { 
                icon: <Building className="w-12 h-12 text-purple-300" />, 
                title: "Real-world Projects", 
                description: "Build actual products that prepare you for the global tech and creative industries." 
              },
              { 
                icon: <Heart className="w-12 h-12 text-purple-300" />, 
                title: "Supportive Community", 
                description: "Join a vibrant, supportive network focused on growth and collaboration." 
              }
            ].map((item, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.8 }}
                className="text-center"
              >
                <div className="mx-auto mb-6">{item.icon}</div>
                <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                <p className="text-indigo-200">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Global Impact */}
      <section className="py-24 px-6 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-indigo-900 mb-6">Global Impact</h2>
              <div className="w-24 h-1 bg-purple-600 mb-8"></div>
              <p className="text-lg mb-6 text-gray-700">
                We welcome everyone — wherever you're from — but we have a special passion for uplifting emerging talent across continents like Africa, where access to high-quality education is still out of reach for many.
              </p>
              <p className="text-lg text-gray-700">
                We are building the next generation of creators, innovators, and leaders - across industries, across borders, and across dreams.
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="relative bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg p-1">
                <div className="bg-white rounded-lg p-8">
                  <h3 className="text-2xl font-bold text-indigo-900 mb-6">Building The Future Together</h3>
                  <ul className="space-y-4">
                    {[
                      "World-class education accessible to all",
                      "Practical skills that translate to real jobs",
                      "A global network of industry mentors",
                      "Focus on underrepresented communities",
                      "Product-driven learning experiences"
                    ].map((item, index) => (
                      <motion.li 
                        key={index}
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                        className="flex items-start"
                      >
                        <CheckCircle className="text-green-500 w-6 h-6 mr-3 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{item}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
                
                {/* Animated dots */}
                <div className="absolute -top-3 -left-3 w-6 h-6 rounded-full bg-purple-500"></div>
                <div className="absolute -bottom-3 -right-3 w-6 h-6 rounded-full bg-indigo-500"></div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-24 px-6 bg-gradient-to-r from-indigo-900 to-purple-900 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Let's Build The Future Together</h2>
            <p className="text-xl mb-8 text-indigo-200">
              Join Voltis Labs Academy today and be part of our mission to democratize education and create opportunity for all.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-indigo-900 font-bold py-3 px-8 rounded-lg shadow-lg"
              >
                View Programmes
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-transparent border-2 border-white text-white font-bold py-3 px-8 rounded-lg"
              >
                Join Our Community
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Partners Section */}
      <section className="py-24 px-6 bg-white">
        <div className="container mx-auto max-w-6xl">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-indigo-900 mb-4">Our Partners</h2>
            <div className="w-24 h-1 bg-purple-600 mx-auto mb-8"></div>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We partner with more than 10+ companies to ensure our curriculum stays current and our students have access to real-world opportunities.
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center"
          >
            {['Skillshare', 'Udemy', 'Google', 'Coursera', 'Foundation'].map((partner, index) => (
              <div key={index} className="flex justify-center">
                <div className="h-12 w-32 bg-gray-100 rounded-md flex items-center justify-center text-gray-500">
                  {partner}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}