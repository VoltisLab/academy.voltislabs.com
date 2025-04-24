"use client";
import React, { useState } from "react";
import { FiMapPin, FiMail, FiPhone, FiArrowRight } from "react-icons/fi";
import TitleSection from "@/components/UI/TitleSection";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2, duration: 0.6 },
  }),
};

const ContactUs = () => {
  const [formStatus, setFormStatus] = useState<"idle" | "success" | "error">(
    "idle"
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;

    try {
      const formData = new FormData(form);
      const response = await fetch("https://formspree.io/f/mnqezyab", {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      if (response.ok) {
        setFormStatus("success");
        form.reset(); // Clear the form after successful submission
      } else {
        setFormStatus("error");
      }
    } catch (error) {
      setFormStatus("error");
    }
  };

  return (
    <div className="contact-page mt-[3rem] text-[#DC4298] min-h-screen">
      {/* Hero Section */}
      <section id="contact-home" className="">
        <TitleSection
          title="We are Voltis Labs Academy"
          subTitle="Contact Us"
          secondaryText="Have any questions or want to collaborate? We’d love to hear from you."
          containerStyle="mb-4 "
        />
      </section>

      {/* Contact Form Section */}
      <section className="form-section py-16 px-6 md:px-16">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            className="text-3xl font-bold mb-6 text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
          >
            Get in Touch
          </motion.h2>

          {formStatus === "success" && (
            <motion.div
              className="text-center text-[#DC4298] mb-6"
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={0}
            >
              Thank you! Your message has been sent successfully.
            </motion.div>
          )}

          {formStatus === "error" && (
            <motion.div
              className="text-center text-[#DC4298] mb-6"
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={0}
            >
              Oops! Something went wrong. Please try again.
            </motion.div>
          )}

          <motion.form
            onSubmit={handleSubmit}
            className="space-y-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {/* Name */}
            <motion.div variants={fadeUp} custom={1}>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Your Name"
                required
                className="w-full bg-white text-[#DC4298] border border-[#DC4298] font-bold rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#fff]"
              />
            </motion.div>

            {/* Email */}
            <motion.div variants={fadeUp} custom={2}>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Your Email"
                required
                className="w-full bg-white text-[#DC4298] border border-[#DC4298] font-bold rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#fff]"
              />
            </motion.div>

            {/* Message */}
            <motion.div variants={fadeUp} custom={3}>
              <label htmlFor="message" className="block text-sm font-medium mb-2">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                placeholder="Your Message"
                rows={5}
                required
                className="w-full bg-white text-[#DC4298] border border-[#DC4298] font-bold rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#fff]"
              ></textarea>
            </motion.div>

            {/* Submit Button */}
            <motion.div className="text-center" variants={fadeUp} custom={4}>
              <button
                type="submit"
                className="md:text-[.8rem] text-[.6rem] item-container justify-between cursor-pointer flex items-center gap-2 p-1 border-solid border-[#DC4298] border-[1px] px-4 min-w-[9rem] h-[2rem] rounded-[4px] transition-all duration-300 hover:bg-[#DC4298] hover:text-white"
              >
                Send Message
                <FiArrowRight size={18} />
              </button>
            </motion.div>
          </motion.form>
        </div>
      </section>

      {/* Contact Details Section */}
      <section className="contact-details py-16 px-6 md:px-16">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Address */}
          <motion.div
            className="text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={1}
          >
            <FiMapPin size={40} className="mx-auto mb-4 text-[#fff]" />
            <h3 className="text-xl font-bold mb-2">Our Address</h3>
            <p className="text-[#DC4298]">London, UK</p>
          </motion.div>

          {/* Email */}
          <motion.div
            className="text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={2}
          >
            <FiMail size={40} className="mx-auto mb-4 text-[#fff]" />
            <h3 className="text-xl font-bold mb-2">Email Us</h3>
            <a
              href="mailto:contact@voltislabs.com"
              className="text-[#DC4298] hover:underline"
            >
              contact@voltislabs.com
            </a>
          </motion.div>

          {/* Phone */}
          <motion.div
            className="text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={3}
          >
            <FiPhone size={40} className="mx-auto mb-4 text-[#fff]" />
            <h3 className="text-xl font-bold mb-2">Call Us</h3>
            <a
              href="tel:+442039479699"
              className="text-[#DC4298] hover:underline"
            >
              +442039479699
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ContactUs;