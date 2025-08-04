"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { apolloClient } from "@/lib/apollo-client";
import { gql } from "@apollo/client";
import { toast } from "react-hot-toast";
import CourseVideo from "@/components/myCourses/CourseVideo";
import AnimationCourseCard from "@/components/myCourses/AnimationCourseCard";
import TabComponent from "@/components/myCourses/TabComponent";
import CourseProgressCard from "@/components/myCourses/CourseProgressCard";
import DescriptionComponent from "@/components/myCourses/DescriptionComponent";
import CourseHeader from "@/components/myCourses/CourseHeader";
import CourseList from "@/components/myCourses/CourseList";
import CourseProgressCardMobile from "@/components/myCourses/CourseProgressCardMobile";

// GraphQL query to get course by ID
const GET_COURSE_BY_ID = gql`
  query GetCourseById($courseId: Int!) {
    getCourse(courseId: $courseId) {
      id
      title
      subtitle
      banner
      description
      requirements
      targetAudience
      teachingPoints
      instructor {
        id
        fullName
        thumbnailUrl
      }
      category {
        id
        name
      }
      subCategory {
        id
        name
      }
      topic
      language
      level
      duration
      sections {
        id
        title
        lectures {
          id
          title
          duration
          videoUrl
        }
        assignment {
          id
          title
          description
        }
      }
      createdAt
      updatedAt
    }
  }
`;

interface Course {
  id: string;
  title: string;
  subtitle: string;
  banner: string;
  description: string;
  requirements: string;
  targetAudience: string;
  teachingPoints: string;
  instructor: {
    id: string;
    fullName: string;
    thumbnailUrl: string;
  };
  category: {
    id: string;
    name: string;
  };
  subCategory: {
    id: string;
    name: string;
  };
  topic: string;
  language: string;
  level: string;
  duration: string;
  sections: Array<{
    id: string;
    title: string;
    lectures: Array<{
      id: string;
      title: string;
      duration: string;
      videoUrl: string;
    }>;
    assignment?: {
      id: string;
      title: string;
      description: string;
    };
  }>;
  createdAt: string;
  updatedAt: string;
}

export default function ProgramDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const courseId = params?.id as string;

  useEffect(() => {
    const fetchCourse = async () => {
      if (!courseId) return;

      try {
        setLoading(true);
        setError(null);

        const { data } = await apolloClient.query({
          query: GET_COURSE_BY_ID,
          variables: { courseId: parseInt(courseId, 10) },
          fetchPolicy: "network-only",
        });

        setCourse(data.getCourse);
      } catch (err: any) {
        console.error("Failed to fetch course:", err);
        setError(err.message || "Failed to fetch course");
        toast.error("Failed to load course details");
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  if (loading) {
    return (
      <div className="max-w-[90rem] mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="aspect-video bg-gray-200 rounded"></div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
            <div className="lg:col-span-1">
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  console.log(course);

  if (error || !course) {
    return (
      <div className="max-w-[90rem] mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {error || "Course not found"}
          </h1>
          <button
            onClick={() => router.push("/programmes")}
            className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 transition"
          >
            Back to Programs
          </button>
        </div>
      </div>
    );
  }

  // Calculate total modules and completed modules
  const totalModules = course.sections.length;
  const completedModules = 0; // This would come from user progress in a real app

  // Create modules array for the progress card
  const modules = course.sections.map((section, index) => ({
    title: section.title,
    duration: section.lectures.reduce((total, lecture) => {
      const duration = parseInt(lecture.duration) || 0;
      return total + duration;
    }, 0).toString(),
    completed: index === 0, // First module completed for demo
  }));

  return (
    <div className="max-w-[74rem] space-y-10 mx-auto py-8">
      <CourseHeader title={course.title} />
      
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="col-span-2">
          <CourseVideo
            videoUrl={course.sections[0]?.lectures[0]?.videoUrl || "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"}
            duration={course.duration || "1:53:32"}
            currentTime="47:39"
          />
          
          <div className="px-5 space-y-10 mt-10">
            <AnimationCourseCard />
            
            <TabComponent tabs={["Description", "Requirements", "Target Audience", "What You'll Learn"]}>
              <DescriptionComponent description={course.description} />
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Course Requirements</h3>
                <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: course.requirements }} />
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Target Audience</h3>
                <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: course.targetAudience }} />
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">What You'll Learn</h3>
                <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: course.teachingPoints }} />
              </div>
            </TabComponent>
          </div>
        </div>

        <div className="col-span-1">
          <CourseProgressCard
            card_type="my-courses"
            title={course.title}
            author={course.instructor.fullName}
            rating={4.5}
            avatarUrl={course.instructor.thumbnailUrl || "/mycourse/avatar.png"}
            completedModules={completedModules}
            totalModules={totalModules}
            modules={modules}
          />
        </div>
      </div>
      
      <CourseList
        show_filter={false}
        card_type={"explore"}
        title="Related Programs"
      />
      
      <CourseProgressCardMobile
        card_type="my-courses"
        title={course.title}
        author={course.instructor.fullName}
        rating={4.5}
        avatarUrl={course.instructor.thumbnailUrl}
        completedModules={completedModules}
        totalModules={totalModules}
        modules={modules}
      />
    </div>
  );
} 