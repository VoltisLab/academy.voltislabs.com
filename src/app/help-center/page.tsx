"use client";

import { useState } from "react";
import {
  Mail,
  MessageSquare,
  Phone,
  Clock,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

export default function HelpCenter() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeQuestion, setActiveQuestion] = useState<string | null>(null);

  const faqs = [
    {
      category: "Getting Started",
      questions: [
        {
          id: "gs1",
          question: "How do I create an account?",
          answer:
            "To create an account, click on the 'Sign Up' button at the top right corner of the page. Fill in your details and follow the instructions to complete your registration.",
        },
        {
          id: "gs2",
          question: "How do I enroll in a course?",
          answer:
            "Browse our course catalog and click on any course you're interested in. On the course page, click the 'Enroll Now' button to start learning.",
        },
      ],
    },
    {
      category: "Account Settings",
      questions: [
        {
          id: "as1",
          question: "How do I change my password?",
          answer:
            "You can change your password by going to Settings > Account > Change Password. Enter your current password and your new password twice to confirm.",
        },
        {
          id: "as2",
          question: "How do I update my profile information?",
          answer:
            "Navigate to your profile page and click the 'Edit Profile' button. Make your changes and click 'Save' to update your information.",
        },
      ],
    },
    {
      category: "Technical Issues",
      questions: [
        {
          id: "ti1",
          question: "What should I do if a video won't play?",
          answer:
            "First, check your internet connection. If that's fine, try clearing your browser cache or using a different browser. If the issue persists, contact our support team.",
        },
        {
          id: "ti2",
          question: "Why can't I access my purchased courses?",
          answer:
            "Make sure you're logged in with the correct account. If you still can't access your courses, please contact support with your purchase details.",
        },
      ],
    },
    {
      category: "Instructor Resources",
      questions: [
        {
          id: "ir1",
          question: "How do I create a new course?",
          answer:
            "Instructors can create courses by navigating to the Instructor Dashboard and clicking 'Create New Course'. Follow the step-by-step process to build your course.",
        },
        {
          id: "ir2",
          question: "How do I get paid for my courses?",
          answer:
            "Earnings are processed monthly. Set up your payment method in the Instructor Dashboard under 'Earnings'. Payments are typically processed by the 15th of each month.",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-25 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Help Center</h1>
          <p className="text-lg text-gray-600">
            Find answers to common questions or contact our support team
          </p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-xl mx-auto">
            <input
              type="text"
              placeholder="Search help articles..."
              className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <div className="absolute left-3 top-3.5 text-gray-400">
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* FAQ Sections */}
        <div className="space-y-6">
          {faqs.map((section) => (
            <div
              key={section.category}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
            >
              <button
                onClick={() =>
                  setActiveCategory(
                    activeCategory === section.category
                      ? null
                      : section.category
                  )
                }
                className="w-full px-6 py-4 text-left font-semibold text-gray-900 flex justify-between items-center hover:bg-gray-50 transition-colors"
              >
                <span>{section.category}</span>
                {activeCategory === section.category ? (
                  <ChevronDown className="h-5 w-5 text-[#4F46E5]" />
                ) : (
                  <ChevronRight className="h-5 w-5 text-gray-500" />
                )}
              </button>

              {activeCategory === section.category && (
                <div className="px-6 pb-4 space-y-4">
                  {section.questions.map((item) => (
                    <div
                      key={item.id}
                      className="border-b border-gray-100 last:border-0 pb-4 last:pb-0"
                    >
                      <button
                        onClick={() =>
                          setActiveQuestion(
                            activeQuestion === item.id ? null : item.id
                          )
                        }
                        className="w-full text-left flex justify-between items-start"
                      >
                        <h3 className="font-medium text-gray-900">
                          {item.question}
                        </h3>
                        {activeQuestion === item.id ? (
                          <ChevronDown className="h-5 w-5 text-[#4F46E5] ml-4 flex-shrink-0" />
                        ) : (
                          <ChevronRight className="h-5 w-5 text-gray-500 ml-4 flex-shrink-0" />
                        )}
                      </button>
                      {activeQuestion === item.id && (
                        <p className="mt-2 text-gray-600">{item.answer}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact Support */}
        <div className="mt-12 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Still need help?
          </h2>
          <p className="text-gray-600 mb-6">
            Our support team is here to help you with any questions or issues
            you may have.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-indigo-50 rounded-lg p-5">
              <div className="flex items-center gap-3 mb-3">
                <Mail className="h-5 w-5 text-[#4F46E5]" />
                <h3 className="font-semibold text-gray-900">Email Us</h3>
              </div>
              <p className="text-gray-600 text-sm mb-3">
                Send us an email and we'll get back to you within 24 hours.
              </p>
              <a
                href="mailto:support@voltislabs.academy"
                className="text-[#4F46E5] text-sm font-medium hover:underline"
              >
                support@voltislabs.academy
              </a>
            </div>
            <div className="bg-indigo-50 rounded-lg p-5">
              <div className="flex items-center gap-3 mb-3">
                <MessageSquare className="h-5 w-5 text-[#4F46E5]" />
                <h3 className="font-semibold text-gray-900">Live Chat</h3>
              </div>
              <p className="text-gray-600 text-sm mb-3">
                Chat with our support team in real-time during business hours.
              </p>
              <button className="text-[#4F46E5] text-sm font-medium hover:underline">
                Start Live Chat
              </button>
            </div>
            <div className="bg-indigo-50 rounded-lg p-5">
              <div className="flex items-center gap-3 mb-3">
                <Phone className="h-5 w-5 text-[#4F46E5]" />
                <h3 className="font-semibold text-gray-900">Call Us</h3>
              </div>
              <p className="text-gray-600 text-sm mb-3">
                Available Monday to Friday, 9AM to 5PM EST.
              </p>
              <a
                href="tel:+18005551234"
                className="text-[#4F46E5] text-sm font-medium hover:underline"
              >
                +1 (800) 555-1234
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
