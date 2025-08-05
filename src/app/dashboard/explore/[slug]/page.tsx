"use client";
// import { useState } from "react";
import CourseVideo from "@/components/myCourses/CourseVideo";
import AnimationCourseCard from "@/components/myCourses/AnimationCourseCard";
import TabComponent from "@/components/myCourses/TabComponent";
import CourseProgressCard from "@/components/myCourses/CourseProgressCard";
import DescriptionComponent from "@/components/myCourses/DescriptionComponent";
import CourseHeader from "@/components/myCourses/CourseHeader";
import CourseList from "@/components/myCourses/CourseList";
import { usePublishedCoursesData } from "@/services/useCourseDataService";
import { useParams } from "next/navigation";

export default function CourseDetailScreen() {
  const params = useParams();
  const slug = params?.slug?.toString(); 
  const {publishedCourses} = usePublishedCoursesData()
  const course = publishedCourses.find(course => course.id === slug);

  console.log("detauiii", course);
  


  return (
    <div className="max-w-[90rem] space-y-10  mx-auto px-4 16 py-8">
      <CourseHeader title={course?.title ?? ""} />
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="col-span-2">
          <CourseVideo
            videoUrl={course?.sections[0]?.lectures[0]?.videoUrl ?? "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"}
            duration="1:53:32"
            currentTime="47:39"
          />
          <div className="px-5 space-y-10 mt-10">
            <AnimationCourseCard data={course}/>
            <TabComponent
              tabs={["Description", "Assignment", "Tools", "Review"]}
            >
              <DescriptionComponent description={course?.description ?? ""} keyPoints={course?.teachingPoints}/>
              <div>Assignment content goes here...</div>
              <div>Tools content goes here...</div>
              <div>Review content goes here...</div>
            </TabComponent>{" "}
          </div>
        </div>

        <div className="col-span-1">
          <CourseProgressCard
            card_type="explore"
            title={course?.title ?? ""}
            author={course?.instructor?.fullName ?? ""}
            rating={4.5}
            avatarUrl={course?.banner?.url ?? "/mycourse/avatar.png"}
            completedModules={0}
            totalModules={course?.sections?.length}
            modules = {course?.sections}
            // modules={[
            //   { title: "Introduction", duration: "10:00", completed: true },
            //   {
            //     title: "What is UX Design",
            //     duration: "10:00",
            //     completed: false,
            //   },
            //   {
            //     title: "Usability Testing",
            //     duration: "10:00",
            //     completed: false,
            //   },
            //   {
            //     title: "Create Usability Test",
            //     duration: "30:00",
            //     completed: false,
            //   },
            //   {
            //     title: "How to Implement",
            //     duration: "30:00",
            //     completed: false,
            //   },
            // ]}
          />
        </div>
      </div>
      <CourseList show_filter={false} card_type={"explore"} title="Related Course" />
    </div>
  );
}
