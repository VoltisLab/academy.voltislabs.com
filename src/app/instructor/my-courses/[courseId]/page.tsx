"use client"
import React, { useState } from 'react';
import { Play, Clock, Users, Award, Star, ChevronDown, ChevronUp, Edit, BarChart3, Eye, MessageCircle, TrendingUp, Calendar, Globe, Loader2 } from 'lucide-react';
import { useCoursesData } from '@/services/useCourseDataService';
import { useParams } from 'next/navigation';
import { languageCodeMap } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';

interface CourseData {
  title: string;
  instructor: string;
  rating: number;
  totalRatings: number;
  students: number;
  duration: string;
  lessons: number;
  price: number;
  originalPrice: number;
  category: string;
  level: string;
  language: string;
  lastUpdated: string;
  description: string;
  status: 'published' | 'draft' | 'pending';
  totalEarnings: number;
  monthlyEarnings: number;
  completionRate: number;
  whatYouLearn: string[];
  requirements: string[];
  curriculum: {
    section: string;
    lessons: { title: string; duration: string; views: number }[];
  }[];
  recentReviews: {
    student: string;
    rating: number;
    comment: string;
    date: string;
  }[];
}

const InstructorCourseDetailPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedSections, setExpandedSections] = useState<number[]>([0]);
  const { instructorCourses } = useCoursesData();
  const params = useParams();
  const courseId = params?.courseId;

  const myCourse: any = instructorCourses.find(course => course.id === courseId);

  const courseData: CourseData = {
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
    description: "Master React and TypeScript from scratch with hands-on projects, real-world applications, and industry best practices. Build modern web applications with confidence.",
    status: 'published',
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

  const toggleSection = (index: number) => {
    setExpandedSections(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-red-100 text-red-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatToMonthYear = (dateString: string): string => {
    if (!dateString) return '';
    const cleaned = dateString.split(".")[0] + "Z";
    const date = new Date(cleaned);
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  const getDurationText = () => {
    if (!myCourse?.duration) return '';
    const parsedDuration = typeof myCourse.duration === 'string' ? JSON.parse(myCourse.duration) : myCourse.duration;
    return `${parsedDuration?.value} ${parsedDuration?.unit}`;
  };

  // Show loading spinner if course data is not ready
  if (!myCourse) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading course details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Course Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 lg:p-8 mb-6 lg:mb-8">
          <div className="flex flex-col-reverse lg:flex-row lg:items-start justify-between gap-6 mb-6">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4">
                <span className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${getStatusColor(myCourse?.status ?? "")}`}>
                  {myCourse?.status?.charAt(0)?.toUpperCase() + myCourse?.status?.slice(1)}
                </span>
                <span className="px-2 sm:px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs sm:text-sm font-medium">
                  {myCourse?.category?.name}
                </span>
                <span className="px-2 sm:px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs sm:text-sm font-medium">
                  {myCourse.level}
                </span>
              </div>
              
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                {myCourse?.title}
              </h1>
              
              <p className="text-lg sm:text-xl text-gray-600 mb-6 leading-relaxed">
                {myCourse?.description}
              </p>
              
              <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm sm:text-base">
                <div className="flex items-center gap-2">
                  {renderStars(courseData.rating)}
                  <span className="text-yellow-600 font-semibold">{courseData.rating}</span>
                  <span className="text-gray-500">({courseData.totalRatings.toLocaleString()} ratings)</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Users className="w-4 sm:w-5 h-4 sm:h-5" />
                  <span>{courseData.students.toLocaleString()} students</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="w-4 sm:w-5 h-4 sm:h-5" />
                  <span>{getDurationText()}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Globe className="w-4 sm:w-5 h-4 sm:h-5" />
                  <span>{languageCodeMap[myCourse?.language]}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-4 sm:p-6 w-full lg:w-72 flex-shrink-0">
              <div className="aspect-video bg-white rounded-lg mb-4 relative overflow-hidden group cursor-pointer">
                <Image 
                  src={myCourse?.banner?.url} 
                  alt='course image' 
                  fill 
                  className='object-cover' 
                />
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-gray-900">${courseData.price}</div>
                <div className="text-gray-500 line-through">${courseData.originalPrice}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 lg:mb-8">
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Total Earnings</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">${courseData.totalEarnings.toLocaleString()}</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">This Month</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">${courseData.monthlyEarnings.toLocaleString()}</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Completion Rate</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">{courseData.completionRate}%</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Award className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Last Updated</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">{formatToMonthYear(myCourse?.updatedAt ?? "")}</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              {/* Tabs */}
              <div className="border-b border-gray-200">
                {/* Mobile dropdown */}
                <div className="sm:hidden">
                  <select
                    value={activeTab}
                    onChange={(e) => setActiveTab(e.target.value)}
                    className="block w-full px-3 py-2 border-gray-300 rounded-none border-0 border-b-2 border-transparent focus:ring-0 focus:border-blue-600 bg-transparent text-gray-900 font-medium capitalize"
                  >
                    {['overview', 'curriculum', 'reviews', 'analytics'].map((tab) => (
                      <option key={tab} value={tab} className="capitalize">
                        {tab}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Desktop tabs */}
                <div className="hidden sm:flex">
                  {['overview', 'curriculum', 'reviews', 'analytics'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-6 py-4 font-medium capitalize transition-all ${
                        activeTab === tab
                          ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="p-4 sm:p-6 lg:p-8">
                {activeTab === 'overview' && (
                  <div className="space-y-6 lg:space-y-8">
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Learning Objectives</h3>
                      <div className="grid gap-3 sm:gap-4">
                        {myCourse?.teachingPoints?.map((item: string, index: number) => (
                          <div key={index} className="flex items-start gap-3 p-3 sm:p-4 bg-gray-50 rounded-lg">
                            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                            </div>
                            <span className="text-gray-700 leading-relaxed text-sm sm:text-base">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Prerequisites</h3>
                      <div className="space-y-3">
                        {myCourse?.requirements?.map((req: string, index: number) => (
                          <div key={index} className="flex items-start gap-3 p-3 sm:p-4 bg-yellow-50 rounded-lg">
                            <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <div className="w-2 h-2 bg-yellow-600 rounded-full"></div>
                            </div>
                            <span className="text-gray-700 leading-relaxed text-sm sm:text-base">{req}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                
                {activeTab === 'curriculum' && (
                  <div className="space-y-4 sm:space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Course Content</h3>
                      <div className="text-gray-600 text-sm sm:text-base">
                        {myCourse?.sections?.length} lessons • {getDurationText()}
                      </div>
                    </div>
                    
                    {myCourse?.sections?.map((section: any, sectionIndex: number) => (
                      <div key={sectionIndex} className="border border-gray-200 rounded-lg overflow-hidden">
                        <button
                          onClick={() => toggleSection(sectionIndex)}
                          className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 flex items-center justify-between hover:bg-gray-100 transition-colors"
                        >
                          <span className="font-semibold text-gray-900 text-sm sm:text-base text-left">{section?.title}</span>
                          {expandedSections.includes(sectionIndex) ? (
                            <ChevronUp className="w-5 h-5 text-gray-600 flex-shrink-0" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-600 flex-shrink-0" />
                          )}
                        </button>
                        
                        {expandedSections.includes(sectionIndex) && (
                          <div className="bg-white">
                            {section?.lectures?.map((lecture: any, lessonIndex: any) => (
                              <div key={lessonIndex} className="px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-100 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                  <Play className="w-4 h-4 text-blue-600 flex-shrink-0" />
                                  <span className="text-gray-900 text-sm sm:text-base truncate">{lecture?.title}</span>
                                </div>
                                <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600 flex-shrink-0">
                                  <div className="flex items-center gap-1">
                                    <Eye className="w-3 sm:w-4 h-3 sm:h-4" />
                                    <span className="hidden sm:inline">20k</span>
                                  </div>
                                  <span>{lecture?.duration ?? "0:00"}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                
                {activeTab === 'reviews' && (
                  <div className="space-y-4 sm:space-y-6">
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Recent Reviews</h3>
                    <div className="space-y-4">
                      {courseData.recentReviews.map((review, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4 sm:p-6">
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                {renderStars(review.rating)}
                                <span className="font-medium text-gray-900">{review.student}</span>
                              </div>
                              <p className="text-gray-700 text-sm sm:text-base">{review.comment}</p>
                            </div>
                            <span className="text-xs sm:text-sm text-gray-500 flex-shrink-0">{review.date}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {activeTab === 'analytics' && (
                  <div className="space-y-4 sm:space-y-6">
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Course Analytics</h3>
                    <div className="text-gray-600">Detailed analytics coming soon...</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar - Quick Actions */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h4>
                <div className="space-y-3">
                  <Link prefetch href={`/instructor/create-new-course/basic?edit=${myCourse?.title}&id=${myCourse?.id}`}>
                    <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2">
                      <Edit className="w-4 h-4" />
                      Edit Course Content
                    </button>
                  </Link>
                  
                  <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2">
                    <BarChart3 className="w-4 h-4" />
                    View Analytics
                  </button>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Course Performance</h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm sm:text-base">Average Rating</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{courseData.rating}</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm sm:text-base">Total Students</span>
                    <span className="font-medium">{courseData.students.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm sm:text-base">Completion Rate</span>
                    <span className="font-medium">{courseData.completionRate}%</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm sm:text-base">Monthly Revenue</span>
                    <span className="font-medium text-green-600">${courseData.monthlyEarnings.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorCourseDetailPage;