"use client"
import React, { useState } from "react";
import {
  Play, Clock, Users, Award, Star, ChevronDown, ChevronUp, Edit,
  BarChart3, Eye, MessageCircle, TrendingUp, Calendar, Globe, Loader2
} from "lucide-react";
import { useCoursesData } from "@/services/useCourseDataService";
import { useParams } from "next/navigation";
import { languageCodeMap } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

const TABS = [
  { key: "overview", label: "Overview" },
  { key: "curriculum", label: "Curriculum" },
  { key: "reviews", label: "Reviews" },
  { key: "analytics", label: "Analytics" },
];

function renderStars(rating: number) {
  return Array.from({ length: 5 }, (_, i) => (
    <Star
      key={i}
      className={`w-4 h-4 ${i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
    />
  ));
}

function getStatusColor(status: string) {
  switch (status?.toLowerCase()) {
    case "published": return "bg-green-100 text-green-700";
    case "draft": return "bg-red-100 text-red-700";
    case "pending": return "bg-yellow-100 text-yellow-700";
    default: return "bg-gray-100 text-gray-700";
  }
}

export default function InstructorCourseDetailPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [expandedSections, setExpandedSections] = useState<number[]>([0]);
  const { instructorCourses } = useCoursesData();
  const params = useParams();
  const courseId = params?.courseId;

  const myCourse: any = instructorCourses.find(course => course.id === courseId);
  const courseData = {
    title: "Complete React & TypeScript Developer Course 2024",
    instructor: "Sarah Johnson",
    rating: 4.8,
    totalRatings: 15420,
    students: 89234,
    duration: "42.5 hours",
    lessons: 267,
    price: 49.99,
    originalPrice: 199.99,
    category: "Development",
    level: "All Levels",
    language: "English",
    lastUpdated: "December 2024",
    description:
      "Master React and TypeScript from scratch with hands-on projects, real-world applications, and industry best practices. Build modern web applications with confidence.",
    status: "published",
    totalEarnings: 142580,
    monthlyEarnings: 8920,
    completionRate: 76,
    whatYouLearn: [
      "Build modern React applications with TypeScript",
      "Master React Hooks and Context API",
      "Create responsive UIs with Tailwind CSS",
      "Implement state management with Redux Toolkit",
      "Work with REST APIs and GraphQL",
      "Deploy applications to production"
    ],
    requirements: [
      "Basic HTML, CSS, and JavaScript knowledge",
      "A computer with internet connection",
      "No prior React or TypeScript experience needed"
    ],
    curriculum: [
      {
        section: "Getting Started with React & TypeScript",
        lessons: [
          { title: "Course Introduction", duration: "3:42", views: 12450 },
          { title: "Setting up Development Environment", duration: "12:15", views: 9870 },
          { title: "Your First React Component", duration: "8:30", views: 8920 },
          { title: "TypeScript Fundamentals", duration: "15:20", views: 7650 }
        ]
      },
      {
        section: "Advanced React Patterns",
        lessons: [
          { title: "Custom Hooks Deep Dive", duration: "18:45", views: 6780 },
          { title: "Context API Mastery", duration: "22:10", views: 5890 },
          { title: "Performance Optimization", duration: "16:30", views: 5340 }
        ]
      }
    ],
    recentReviews: [
      {
        student: "Alex Chen",
        rating: 5,
        comment: "Excellent course! Sarah explains everything clearly and the projects are very practical.",
        date: "2 days ago"
      },
      {
        student: "Maria Garcia",
        rating: 4,
        comment: "Great content, learned a lot about TypeScript. Would recommend to anyone starting with React.",
        date: "5 days ago"
      },
      {
        student: "John Smith",
        rating: 5,
        comment: "Best React course I've taken. The instructor is knowledgeable and engaging.",
        date: "1 week ago"
      }
    ]
  };

  const toggleSection = (idx: number) => {
    setExpandedSections(prev =>
      prev.includes(idx)
        ? prev.filter(i => i !== idx)
        : [...prev, idx]
    );
  };

  // Show loading spinner if course data is not ready
  if (!myCourse) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-purple-50 to-blue-50 flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-purple-600" />
        <span className="ml-4 text-lg font-medium text-gray-700">Loading course details...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-purple-50 to-blue-50 pb-12">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col-reverse lg:flex-row gap-8">
          {/* Info Left */}
          <div className="flex-1">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(myCourse?.status)}`}>{myCourse?.status?.toUpperCase()}</span>
              <span className="px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-700 font-semibold">{myCourse?.category?.name}</span>
              <span className="px-3 py-1 rounded-full text-xs bg-purple-100 text-purple-700 font-semibold">{myCourse.level}</span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-gray-900 mb-3 leading-tight">
              {myCourse?.title}
            </h1>
            <p className="text-gray-600 text-lg mb-6 max-w-2xl">{myCourse?.description}</p>
            <div className="flex flex-wrap items-center gap-x-8 gap-y-2 text-sm">
              <span className="flex items-center gap-1">
                {renderStars(courseData.rating)}
                <span className="font-bold text-yellow-600">{courseData.rating}</span>
                <span className="text-gray-500">({courseData.totalRatings.toLocaleString()} ratings)</span>
              </span>
              <span className="flex items-center gap-2 text-gray-700">
                <Users className="w-4 h-4" /> {courseData.students.toLocaleString()} students
              </span>
              <span className="flex items-center gap-2 text-gray-700">
                <Clock className="w-4 h-4" /> {myCourse.duration?.value} {myCourse.duration?.unit}
              </span>
              <span className="flex items-center gap-2 text-gray-700">
                <Globe className="w-4 h-4" /> {languageCodeMap[myCourse.language]}
              </span>
            </div>
          </div>
          {/* Cover Image & Price */}
          <div className="lg:w-96 w-full flex-shrink-0">
            <div className="bg-white bg-opacity-60 backdrop-blur rounded-2xl shadow-xl border border-gray-200 p-4 flex flex-col gap-4">
              <div className="relative w-full aspect-video overflow-hidden rounded-xl bg-gradient-to-tr from-purple-100 via-blue-100 to-white border">
                <Image
                  src={myCourse?.banner?.url}
                  alt="course image"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div className="text-center">
                <span className="text-2xl font-extrabold text-gray-900">${courseData.price}</span>
                <span className="ml-2 text-gray-400 line-through text-lg">${courseData.originalPrice}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Stats */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            {
              label: "Total Earnings",
              value: `$${courseData.totalEarnings.toLocaleString()}`,
              icon: <TrendingUp className="w-6 h-6 text-green-500" />,
              bg: "bg-green-50"
            },
            {
              label: "This Month",
              value: `$${courseData.monthlyEarnings.toLocaleString()}`,
              icon: <BarChart3 className="w-6 h-6 text-blue-500" />,
              bg: "bg-blue-50"
            },
            {
              label: "Completion Rate",
              value: `${courseData.completionRate}%`,
              icon: <Award className="w-6 h-6 text-purple-500" />,
              bg: "bg-purple-50"
            },
            {
              label: "Last Updated",
              value: courseData.lastUpdated,
              icon: <Calendar className="w-6 h-6 text-orange-500" />,
              bg: "bg-orange-50"
            }
          ].map((stat, i) => (
            <div key={i} className={`rounded-2xl shadow backdrop-blur ${stat.bg} border border-gray-200 p-4 flex flex-col items-start gap-2`}>
              <div className="flex items-center justify-between w-full">
                <div>
                  <div className="text-gray-500 text-xs mb-1">{stat.label}</div>
                  <div className="text-xl font-bold text-gray-800">{stat.value}</div>
                </div>
                <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-white shadow-inner">{stat.icon}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main + Sidebar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="bg-white bg-opacity-80 rounded-2xl shadow-xl border border-gray-200">
            {/* Tabs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center border-b border-gray-200">
              <select
                value={activeTab}
                onChange={e => setActiveTab(e.target.value)}
                className="sm:hidden p-3 border-b bg-gray-50 font-bold rounded-t-2xl text-gray-800"
              >
                {TABS.map(tab => <option value={tab.key} key={tab.key}>{tab.label}</option>)}
              </select>
              <div className="hidden sm:flex w-full">
                {TABS.map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex-1 px-6 py-4 font-bold capitalize border-b-2 transition
                      ${activeTab === tab.key
                        ? "border-blue-600 text-blue-700 bg-blue-50"
                        : "border-transparent text-gray-500 hover:text-blue-700 hover:bg-blue-50"
                      }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
            {/* Tab content */}
            <div className="p-4 sm:p-8">
              {/* OVERVIEW */}
              {activeTab === "overview" && (
                <div className="grid sm:grid-cols-2 gap-8">
                  {/* Learning Objectives */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3">Learning Objectives</h3>
                    <ul className="space-y-2">
                      {(myCourse.teachingPoints || courseData.whatYouLearn).map((item: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-3 bg-blue-50 rounded-lg p-3">
                          <div className="w-4 h-4 mt-1 bg-blue-500 rounded-full"></div>
                          <span className="text-gray-700 text-sm">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  {/* Prerequisites */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3">Prerequisites</h3>
                    <ul className="space-y-2">
                      {(myCourse.requirements || courseData.requirements).map((item: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-3 bg-yellow-50 rounded-lg p-3">
                          <div className="w-4 h-4 mt-1 bg-yellow-500 rounded-full"></div>
                          <span className="text-gray-700 text-sm">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* CURRICULUM */}
              {activeTab === "curriculum" && (
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900">Course Content</h3>
                    <div className="text-gray-600 text-sm">
                      {(myCourse.sections?.length || courseData.curriculum.length)} sections
                    </div>
                  </div>
                  <div className="space-y-4">
                    {(myCourse.sections || courseData.curriculum).map((section: any, sectionIndex: number) => (
                      <div key={sectionIndex} className="rounded-lg border border-gray-200 bg-gray-50">
                        <button
                          className="w-full flex justify-between items-center px-6 py-4 text-left font-semibold text-gray-800 bg-gray-100 hover:bg-blue-50 transition rounded-t-lg"
                          onClick={() => toggleSection(sectionIndex)}
                        >
                          <span>{section.section || section.title}</span>
                          {expandedSections.includes(sectionIndex)
                            ? <ChevronUp className="w-5 h-5" />
                            : <ChevronDown className="w-5 h-5" />}
                        </button>
                        {expandedSections.includes(sectionIndex) && (
                          <div>
                            {(section.lessons || section.lectures).map((lesson: any, idx: number) => (
                              <div key={idx} className="flex items-center justify-between px-6 py-3 border-t border-gray-100 hover:bg-white transition">
                                <div className="flex items-center gap-3 min-w-0">
                                  <Play className="w-4 h-4 text-blue-500" />
                                  <span className="truncate text-gray-800 font-medium">{lesson.title}</span>
                                </div>
                                <div className="flex items-center gap-4 text-xs text-gray-500 flex-shrink-0">
                                  <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{lesson.views?.toLocaleString() || "20k"}</span>
                                  <span>{lesson.duration || "0:00"}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* REVIEWS */}
              {activeTab === "reviews" && (
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Reviews</h3>
                  <div className="space-y-4">
                    {(courseData.recentReviews).map((review, idx) => (
                      <div key={idx} className="rounded-lg border border-gray-200 bg-white shadow p-6 flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          {renderStars(review.rating)}
                          <span className="text-gray-900 font-medium">{review.student}</span>
                          <span className="ml-auto text-xs text-gray-500">{review.date}</span>
                        </div>
                        <p className="text-gray-700 text-sm">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ANALYTICS */}
              {activeTab === "analytics" && (
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Course Analytics</h3>
                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-8 text-gray-600 flex items-center justify-center">
                    <BarChart3 className="w-8 h-8 mr-3 text-blue-400" />
                    <span>Detailed analytics coming soon…</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* SIDEBAR */}
        <div className="lg:sticky lg:top-10 flex flex-col gap-6">
          {/* Quick Actions */}
          <div className="bg-white bg-opacity-90 rounded-2xl shadow-xl border border-gray-200 p-6">
            <h4 className="font-bold text-gray-900 mb-4">Quick Actions</h4>
            <div className="space-y-3">
              <Link href={`/instructor/create-new-course/basic?edit=${myCourse?.title}&id=${myCourse?.id}`} prefetch>
                <button className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:to-purple-800 text-white font-bold shadow transition">
                  <Edit className="w-4 h-4" /> Edit Course Content
                </button>
              </Link>
              <button className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold shadow transition">
                <BarChart3 className="w-4 h-4" /> View Analytics
              </button>
            </div>
          </div>
          {/* Performance */}
          <div className="bg-white bg-opacity-90 rounded-2xl shadow-xl border border-gray-200 p-6">
            <h4 className="font-bold text-gray-900 mb-4">Course Performance</h4>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Average Rating</span>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{courseData.rating}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Students</span>
                <span className="font-semibold">{courseData.students.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Completion Rate</span>
                <span className="font-semibold">{courseData.completionRate}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Monthly Revenue</span>
                <span className="font-semibold text-green-700">${courseData.monthlyEarnings.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
