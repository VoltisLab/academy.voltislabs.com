"use client";
import React, { useState, useEffect } from "react";
import { 
  FiMapPin, 
  FiMail, 
  FiPhone, 
  FiSend, 
  FiCheckCircle, 
  FiAlertCircle 
} from "react-icons/fi";
import TitleSection from "@/components/UI/TitleSection";
import { motion, AnimatePresence } from "framer-motion";

// Enhanced animations
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { 
      delay: i * 0.15, 
      duration: 0.6,
      ease: [0.6, 0.05, 0.01, 0.9]
    },
  }),
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const formItemAnim = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5 }
  }
};

// Input field status animation
const inputStatus = {
  idle: {},
  focus: { scale: 0.98, boxShadow: "0 0 0 3px rgba(49, 50, 115, 0.2)" },
  filled: { borderColor: "#313273" }
};

const ContactUs = () => {
  const [formStatus, setFormStatus] = useState("idle");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [inputStates, setInputStates] = useState({
    name: "idle",
    email: "idle",
    subject: "idle",
    message: "idle"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form status after a delay
  useEffect(() => {
    if (formStatus === "success" || formStatus === "error") {
      const timer = setTimeout(() => {
        setFormStatus("idle");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [formStatus]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleInputFocus = (name) => {
    setInputStates({ ...inputStates, [name]: "focus" });
  };

  const handleInputBlur = (name) => {
    setInputStates({ ...inputStates, [name]: formData[name] ? "filled" : "idle" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const form = e.target;
      const formData = new FormData(form);
      
      // Simulated delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const response = await fetch("https://formspree.io/f/mnqezyab", {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      if (response.ok) {
        setFormStatus("success");
        form.reset();
        setFormData({ name: "", email: "", subject: "", message: "" });
        Object.keys(inputStates).forEach(key => {
          setInputStates(prev => ({ ...prev, [key]: "idle" }));
        });
      } else {
        setFormStatus("error");
      }
    } catch (error) {
      setFormStatus("error");
      console.log("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-page mt-12 text-[#313273] min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Hero Section */}
      <section id="contact-home" className="pt-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <TitleSection
            title="We are Voltis Labs Academy"
            subTitle="Contact Us"
            secondaryText="Have any questions or want to collaborate? We'd love to hear from you."
            containerStyle="mb-8"
          />
        </motion.div>
      </section>

      {/* Contact Form Section */}
      <section className="form-section py-16 px-6 md:px-16">
        <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <motion.h2
            className="text-3xl font-bold mb-8 text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
          >
            Get in Touch
          </motion.h2>

          <AnimatePresence>
            {formStatus === "success" && (
              <motion.div
                className="flex items-center justify-center p-4 mb-8 bg-green-50 text-green-700 rounded-lg"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <FiCheckCircle className="mr-2 text-green-500" size={20} />
                <span>Thank you! Your message has been sent successfully.</span>
              </motion.div>
            )}

            {formStatus === "error" && (
              <motion.div
                className="flex items-center justify-center p-4 mb-8 bg-red-50 text-red-700 rounded-lg"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <FiAlertCircle className="mr-2 text-red-500" size={20} />
                <span>Oops! Something went wrong. Please try again.</span>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.form
            onSubmit={handleSubmit}
            className="space-y-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6" variants={formItemAnim}>
              {/* Name */}
              <motion.div variants={formItemAnim}>
                <label htmlFor="name" className="block text-sm font-medium mb-2 text-gray-700">
                  Name
                </label>
                <motion.div
                  variants={inputStatus}
                  animate={inputStates.name}
                >
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Your Full Name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    onFocus={() => handleInputFocus("name")}
                    onBlur={() => handleInputBlur("name")}
                    className="w-full bg-white text-gray-800 border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#313273] focus:border-transparent transition-all duration-200"
                  />
                </motion.div>
              </motion.div>

              {/* Email */}
              <motion.div variants={formItemAnim}>
                <label htmlFor="email" className="block text-sm font-medium mb-2 text-gray-700">
                  Email
                </label>
                <motion.div
                  variants={inputStatus}
                  animate={inputStates.email}
                >
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="your.email@example.com"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    onFocus={() => handleInputFocus("email")}
                    onBlur={() => handleInputBlur("email")}
                    className="w-full bg-white text-gray-800 border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#313273] focus:border-transparent transition-all duration-200"
                  />
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Subject */}
            <motion.div variants={formItemAnim}>
              <label htmlFor="subject" className="block text-sm font-medium mb-2 text-gray-700">
                Subject
              </label>
              <motion.div
                variants={inputStatus}
                animate={inputStates.subject}
              >
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  placeholder="What is this regarding?"
                  value={formData.subject}
                  onChange={handleInputChange}
                  onFocus={() => handleInputFocus("subject")}
                  onBlur={() => handleInputBlur("subject")}
                  className="w-full bg-white text-gray-800 border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#313273] focus:border-transparent transition-all duration-200"
                />
              </motion.div>
            </motion.div>

            {/* Message */}
            <motion.div variants={formItemAnim}>
              <label htmlFor="message" className="block text-sm font-medium mb-2 text-gray-700">
                Message
              </label>
              <motion.div
                variants={inputStatus}
                animate={inputStates.message}
              >
                <textarea
                  id="message"
                  name="message"
                  placeholder="Tell us how we can help you..."
                  rows={5}
                  required
                  value={formData.message}
                  onChange={handleInputChange}
                  onFocus={() => handleInputFocus("message")}
                  onBlur={() => handleInputBlur("message")}
                  className="w-full bg-white text-gray-800 border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#313273] focus:border-transparent transition-all duration-200 resize-none"
                ></textarea>
              </motion.div>
            </motion.div>

            {/* Submit Button */}
            <motion.div className="flex justify-center" variants={formItemAnim}>
              <motion.button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#313273] text-white font-medium transition-all duration-300 hover:bg-opacity-90 hover:scale-105 shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 min-w-[12rem]"
                whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
              >
                {isSubmitting ? (
                  <motion.div
                    className="h-5 w-5 rounded-full border-2 border-white border-t-transparent"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                ) : (
                  <>
                    <span>Send Message</span>
                    <FiSend size={18} />
                  </>
                )}
              </motion.button>
            </motion.div>
          </motion.form>
        </div>
      </section>

      {/* Contact Details Section */}
      <section className="contact-details py-16 px-6 md:px-16 bg-[#313273] text-white rounded-t-3xl mt-16">
        <div className="max-w-5xl mx-auto">
          <motion.h3
            className="text-2xl font-bold mb-12 text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
          >
            Reach Out to Us
          </motion.h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Address */}
            <motion.div
              className="bg-white bg-opacity-10 p-8 rounded-xl backdrop-blur-sm text-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={1}
              whileHover={{ y: -5, boxShadow: "0 10px 30px rgba(0,0,0,0.15)" }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-white text-[#313273] rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <FiMapPin size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">Our Address</h3>
              <p className="text-white text-opacity-80">London, UK</p>
            </motion.div>

            {/* Email */}
            <motion.div
              className="bg-white bg-opacity-10 p-8 rounded-xl backdrop-blur-sm text-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={2}
              whileHover={{ y: -5, boxShadow: "0 10px 30px rgba(0,0,0,0.15)" }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-white text-[#313273] rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <FiMail size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">Email Us</h3>
              <a
                href="mailto:contact@voltislabs.com"
                className="text-white text-opacity-80 hover:text-opacity-100 transition-colors"
              >
                contact@voltislabs.com
              </a>
            </motion.div>

            {/* Phone */}
            <motion.div
              className="bg-white bg-opacity-10 p-8 rounded-xl backdrop-blur-sm text-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={3}
              whileHover={{ y: -5, boxShadow: "0 10px 30px rgba(0,0,0,0.15)" }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-white text-[#313273] rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <FiPhone size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">Call Us</h3>
              <a
                href="tel:+442039479699"
                className="text-white text-opacity-80 hover:text-opacity-100 transition-colors"
              >
                +44 203 947 9699
              </a>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactUs;