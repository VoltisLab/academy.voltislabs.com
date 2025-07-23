"use client"
import React, { useState } from 'react';
import { Play, Clock, Users, Award, Star, ChevronDown, ChevronUp, Edit, BarChart3, Eye, MessageCircle, TrendingUp, Calendar, Globe, Loader2 } from 'lucide-react';
import { useCoursesData } from '@/services/useCourseDataService';
import { useParams } from 'next/navigation';
import { languageCodeMap } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import CourseAnalyticsChart from '@/components/instructor/my-courses/CourseAnalyticsChart';

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

// Utility to format duration
function formatDuration(duration: any) {
  if (!duration) return '';
  let parsed = duration;
  if (typeof duration === 'string') {
    try {
      parsed = JSON.parse(duration);
    } catch {
      return duration; // fallback to raw string if not JSON
    }
  }
  if (!parsed.value || !parsed.unit) return '';
  const value = parsed.value;
  let unit = parsed.unit.toLowerCase();
  if (value > 1 && !unit.endsWith('s')) unit += 's';
  console.log(value, unit);
  return `${value} ${unit}`;


}

function truncateText(text: string, maxLength: number) {
  if (!text) return '';
  return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
}

// Clean HTML utility (copied from CourseCard)
function cleanHtmlContent(htmlString: string): string {
  if (!htmlString || htmlString.trim() === '') return '';
  // Remove empty <p> tags (with or without spaces/br/&nbsp;)
  let cleaned = htmlString.replace(/<p>(\s|&nbsp;|<br\s*\/?>)*<\/p>/gi, '').trim();
  // Browser: Use DOM for parsing
  if (typeof window !== "undefined" && typeof document !== "undefined") {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = cleaned;
    // Remove nodes that are just whitespace text
    let realChildren = Array.from(wrapper.childNodes).filter(
      (node) => !(node.nodeType === 3 && !/\S/.test(node.textContent || ""))
    );
    // If only one element and it's a <p>
    if (
      realChildren.length === 1 &&
      realChildren[0].nodeType === 1 &&
      (realChildren[0] as HTMLElement).tagName === "P"
    ) {
      return (realChildren[0] as HTMLElement).innerHTML.trim();
    }
    // Otherwise, return cleaned (could be multiple <p>s)
    return cleaned;
  } else {
    // Server: Use regex (best effort)
    // Check if there's only one <p> (with possible whitespace around)
    const match = cleaned.match(/^\s*<p[^>]*>([\s\S]*)<\/p>\s*$/i);
    // Ensure not multiple paragraphs
    const multipleP = cleaned.match(/<\/p>\s*<p[^>]*>/i);
    if (match && !multipleP) {
      return match[1].trim();
    }
    return cleaned;
  }
}

const InstructorCourseDetailPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedSections, setExpandedSections] = useState<number[]>([0]);
  const { instructorCourses } = useCoursesData();
  const params = useParams();
  const courseId = params?.courseId;
  const myCourse: any = instructorCourses.find(course => course.id === courseId);

  console.log(myCourse);
  // Mock stats for demonstration
  const stats = [
    { label: 'Students', value: myCourse?.students ?? 0, icon: <Users className="w-5 h-5 text-blue-600" /> },
    { label: 'Modules', value: myCourse?.sections?.length ?? 0, icon: <BarChart3 className="w-5 h-5 text-purple-600" /> },
    { label: 'Duration', value: formatDuration(myCourse?.duration), icon: <Clock className="w-5 h-5 text-green-600" /> },
    { label: 'Rating', value: myCourse?.rating ?? 0, icon: <Star className="w-5 h-5 text-yellow-500 fill-yellow-400" /> },
  ];

  const renderStars = (rating: number) => Array.from({ length: 5 }, (_, i) => (
    <Star key={i} className={`w-4 h-4 ${i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
  ));

  const toggleSection = (index: number) => {
    setExpandedSections(prev => prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]);
  };

  // Mock reviews for demonstration
  const reviews = [
    {
      student: "Alex Chen",
      avatar: "/user1.png",
      rating: 5,
      comment: "Excellent course! Sarah explains everything clearly and the projects are very practical.",
      date: "2024-06-01T10:30:00Z"
    },
    {
      student: "Maria Garcia",
      avatar: "/user2.png",
      rating: 4,
      comment: "Great content, learned a lot about TypeScript. Would recommend to anyone starting with React.",
      date: "2024-05-28T14:15:00Z"
    },
    {
      student: "John Smith",
      avatar: "/user3.png",
      rating: 5,
      comment: "Best React course I've taken. The instructor is knowledgeable and engaging.",
      date: "2024-05-20T09:00:00Z"
    }
  ];

  function formatReviewDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
  }

  if (!myCourse) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading course details...</p>
        </div>
      </div>
    );
  }

  // Status badge style
  const isDraft = myCourse?.status?.toLowerCase() === 'draft';
  const statusBadge = (
    <span className={`absolute top-0 left-0 z-40 px-3 py-1 rounded-b text-xs font-semibold shadow-lg ${isDraft ? 'bg-white text-purple-700 border border-purple-200' : 'bg-green-500 text-white'}`}>{myCourse?.status?.toUpperCase()}</span>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <div className="relative w-full h-[200px] flex items-end justify-center overflow-hidden rounded-b-3xl shadow-lg">
        <Image
          src={myCourse?.banner?.thumbnail || myCourse?.banner?.url}
          alt={myCourse?.title}
          fill
          className="object-cover w-full h-full"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent z-10" />
        {/* Status badge top left */}
        {statusBadge}
        {/* Hero Overlay */}
        <div className="absolute z-20 top-5 left-0 right-0 bottom-0 px-2 pb-8 flex flex-col items-start gap-2">
          <h1 className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg mb-1 ">{myCourse?.title}</h1>
          <div className="w-xs mb-1" style={{height: '1px', background: 'linear-gradient(90deg, transparent 0%, #fff 30%, #fff 70%, transparent 100%)'}} />
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <div className='flex flex-col text-xs text-white gap-1 font-bold'>
              <p>Category:</p>
            <span className="bg-[#313273] text-white text-xs px-3 py-1 rounded-lg font-semibold">{myCourse?.category?.name}</span>
            </div>
            <div className='flex flex-col text-xs text-white gap-1 font-bold'>
              <p>Sub-Category:</p>
              {myCourse?.subCategory?.name && <span className="bg-white text-[#313273] text-xs px-3 py-1 rounded-lg font-semibold">{myCourse?.subCategory?.name}</span>}
            </div>
          </div>
          <div className="w-xs mb-1" style={{height: '1px', background: 'linear-gradient(90deg, transparent 0%, #fff 30%, #fff 70%, transparent 100%)'}} />
          <div className='flex flex-col text-xs text-white gap-1 font-bold'>
            <p>Description</p>
            <div className="text-white/90 text-xs md:text-sm max-w-xl truncate" title={cleanHtmlContent(myCourse?.description)}>{truncateText(cleanHtmlContent(myCourse?.description), 120)}</div>
          </div>
        </div>
        {/* Floating Stats Card - top right remains */}
        <div className="absolute top-0 right-0 z-30 max-w-[90vw] w-auto">
          <div className="backdrop-blur-md bg-white/80 rounded-b-2xl shadow-lg flex flex-wrap justify-between items-center px-3 py-2 gap-0 min-h-[56px]">
            {stats.map((stat, idx) => (
              <React.Fragment key={stat.label}>
                <div className="flex-1 min-w-[60px] text-center flex flex-col items-center justify-center px-2">
                  <div className="mb-0.5">{stat.icon}</div>
                  <div className="text-sm font-semibold text-gray-900 leading-tight">{stat.value}</div>
                  <div className="text-[10px] text-gray-600 leading-tight">{stat.label}</div>
                  {stat.label === 'Rating' && <div className="flex justify-center mt-0.5">{renderStars(myCourse?.rating ?? 0)}</div>}
                </div>
                {idx < stats.length - 1 && (
                  <div className="h-8 w-px bg-gray-300 mx-1" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Layout: Tabs 2/3, Performance 1/3 */}
      <div className="mt-5 flex flex-col lg:flex-row gap-5 items-stretch">
  {/* Tabs Section (2/3) */}
  <div className="w-full lg:w-2/3 flex flex-col">
    <div className="bg-white rounded-2xl shadow flex flex-col h-full">
      <div className="border-b border-gray-200 flex-shrink-0">
        <div className="flex">
          {['overview', 'curriculum', 'reviews', 'analytics'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 font-medium capitalize transition-all ${
                activeTab === tab
                  ? 'text-[#313273] border-b-2 border-[#313273] bg-blue-50'
                  : 'text-gray-500 hover:text-[#313273] hover:bg-gray-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-auto p-5">
        {activeTab === 'overview' && (
          <div className="space-y-6 lg:space-y-8 h-full">
            <div>
              <h3 className="text-lg font-bold text-[#313273] mb-4">Learning Objectives</h3>
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
              <h3 className="text-lg font-bold text-[#313273] mb-4">Prerequisites</h3>
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
          <div className="space-y-4  h-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h3 className="text-lg font-bold text-[#313273]">Course Content</h3>
              <div className="text-gray-600 text-xs">
                {myCourse?.sections?.length} lessons • {formatDuration(myCourse?.duration)}
              </div>
            </div>
            {myCourse?.sections?.map((section: any, sectionIndex: number) => (
              <div key={sectionIndex} className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleSection(sectionIndex)}
                  className="w-full px-4 sm:px-6 py-2 bg-[#313273] flex items-center justify-between hover:bg-[#313273]/95 transition-colors"
                >
                  <span className="font-semibold text-white text-sm text-left">{section?.title}</span>
                  {expandedSections.includes(sectionIndex) ? (
                    <ChevronUp className="w-5 h-5 text-white flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-white flex-shrink-0" />
                  )}
                </button>
                {expandedSections.includes(sectionIndex) && (
                  <div className="bg-white">
                    {section?.lectures?.map((lecture: any, lessonIndex: any) => (
                      <div key={lessonIndex} className="px-4 py-2 border-t border-gray-100 flex items-center justify-between hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <Play className="w-4 h-4 text-[#313273] flex-shrink-0" />
                          <span className="text-gray-900 text-xs sm:text-base truncate">{lecture?.title}</span>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-4 text-xs text-gray-600 flex-shrink-0">
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
          <div className="space-y-4 sm:space-y-6 h-full">
            <h3 className="text-lg font-bold text-[#313273]">Recent Reviews</h3>
            <div className="space-y-4">
              {reviews.map((review, index) => (
                <div key={index} className="shadow rounded-lg p-4 sm:p-6 flex gap-4 items-start bg-white/90">
                  <img src={review.avatar} alt={review.student} className="w-12 h-12 rounded-full object-cover border-2 border-white shadow" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-[#313273]">{review.student}</span>
                      <span className="text-xs text-gray-500">{formatReviewDate(review.date)}</span>
                      <span className="flex items-center gap-0.5 ml-2">
                        {renderStars(review.rating)}
                      </span>
                    </div>
                    <p className="text-gray-700 text-sm sm:text-base mt-1">{review.comment}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {activeTab === 'analytics' && (
          <div className="h-full">
            <CourseAnalyticsChart />
          </div>
        )}
      </div>
    </div>
  </div>
  
  {/* Course Performance (1/3) */}
  <div className="w-full lg:w-1/3 flex flex-col">
    <div className="bg-white rounded-2xl shadow p-6 flex flex-col h-full">
      <h4 className="text-lg font-semibold text-[#313273] mb-4 flex-shrink-0">Course Performance</h4>
      <div className="space-y-4 flex-1">
        <div className="flex justify-between items-center">
          <span className="text-gray-600 text-xs">Average Rating</span>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">{myCourse?.rating ?? 0}</span>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600 text-xs ">Total Students</span>
          <span className="font-medium">{myCourse?.students?.toLocaleString() ?? 0}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600 text-xs ">Completion Rate</span>
          <span className="font-medium">{myCourse?.completionRate ?? 0}%</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600 text-xs">Monthly Revenue</span>
          <span className="font-medium text-green-600">${myCourse?.monthlyEarnings?.toLocaleString() ?? 0}</span>
        </div>
      </div>
    </div>
  </div>
</div>
    </div>
  );
};

export default InstructorCourseDetailPage;