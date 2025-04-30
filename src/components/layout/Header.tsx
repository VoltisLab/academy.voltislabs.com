"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { FiMenu, FiX } from "react-icons/fi";
import SignupModal from "@/components/modals/SignupModal";
import { getCurrentUser } from "@/api/auth/auth";
import { logout } from "@/api/auth/auth";
import { LoginResponse } from "@/lib/types";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [userExists, setUserExists] = useState<LoginResponse>();

  // Move localStorage access to useEffect
  useEffect(() => {
    const userString = getCurrentUser()
    console.log(userString)
    setUserExists(userString);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleLogout = () =>{
    logout()
    window.location.reload()
  }

  return (
    <div>
      <header className="w-full bg-white fixed top-0 left-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 md:px-12 py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Image
              width={8}
              height={8}
              alt="VL Academy logo"
              src="/logo.svg"
              className="w-8 h-8 bg-[#2F3C8C] rounded-md"
            />
            <span className="text-lg md:text-xl font-semibold text-[#2F3C8C]">
              Voltis Labs Academy
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-[#331C1C] font-semibold hover:text-pink-600 transition"
            >
              Home
            </Link>
            <Link
              href="/bootcamp"
              className="text-[#331C1C] font-semibold hover:text-pink-600 transition"
            >
              Programmes
            </Link>
            <Link
              href="/contact"
              className="text-[#331C1C] font-semibold hover:text-pink-600 transition"
            >
              Contact Us
            </Link>
            <Link
              href="/aboutus"
              className="text-[#331C1C] font-semibold hover:text-pink-600 transition"
            >
              About Us
            </Link>
            {userExists && (
              <Link
              href={userExists?.login?.user?.isInstructor? "/instructor" : "/dashboard"}
              className="text-[#331C1C] font-semibold hover:text-pink-600 transition"
            >
              Dashboard
            </Link>
            )}
          </nav>

          {/* Contact Button (Desktop) */}
          <div className="hidden md:block">
              <button
                className="border-2 border-[#313273] text-[#313273] font-semibold px-5 py-2 rounded-lg hover:bg-[#313273] hover:text-white transition"
                onClick={userExists? handleLogout : openModal}
              >
                {userExists? "Logout" : "Login/Signup"}
              </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button onClick={toggleMenu} aria-label="Toggle menu">
              {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Panel */}
        {isOpen && (
          <div className="md:hidden bg-white shadow-md px-6 pt-4 pb-6 space-y-4 transition-all">
            <Link
              href="/"
              className="block text-[#331C1C] font-semibold hover:text-pink-600"
              onClick={toggleMenu}
            >
              Home
            </Link>
            <Link
              href="/programmes"
              className="block text-[#331C1C] font-semibold hover:text-pink-600"
              onClick={toggleMenu}
            >
              Programmes
            </Link>
            <Link
              href="/aboutus"
              className="block text-[#331C1C] font-semibold hover:text-pink-600"
              onClick={toggleMenu}
            >
              About Us
            </Link>
            {userExists && (
              <Link
              href={userExists?.login?.user?.isInstructor? "/instructor" : "/dashboard"}
              className="text-[#331C1C] font-semibold hover:text-pink-600 transition"
            >
              Dashboard
            </Link>
            )}
            <Link href="/contact">
              <button className="w-full mt-4 border-2 border-[#313273] text-[#313273] font-semibold px-5 py-2 rounded-lg hover:bg-[#313273] hover:text-white transition">
                Contact Us
              </button>
            </Link>
          </div>
        )}
      </header>
      <SignupModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
};

export default Header;