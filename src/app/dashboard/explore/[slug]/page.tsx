"use client";
import { useState } from "react";
import CourseVideo from "@/components/myCourses/CourseVideo";
import AnimationCourseCard from "@/components/myCourses/AnimationCourseCard";
import TabComponent from "@/components/myCourses/TabComponent";
import CourseProgressCard from "@/components/myCourses/CourseProgressCard";
import DescriptionComponent from "@/components/myCourses/DescriptionComponent";
import CourseHeader from "@/components/myCourses/CourseHeader";
import CourseList from "@/components/myCourses/CourseList";

export default function CourseDetailScreen() {
  return (
    <div className="max-w-[90rem] space-y-10  mx-auto px-4 16 py-8">
      <CourseHeader title="Animation Is the Key of Successful UI/UX Design" />
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="col-span-2">
          <CourseVideo
            videoUrl="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
            duration="1:53:32"
            currentTime="47:39"
          />
          <div className="px-5 space-y-10 mt-10">
            <AnimationCourseCard />
            <TabComponent
              tabs={["Description", "Assignment", "Tools", "Review"]}
            >
              <DescriptionComponent />
              <div>Assignment content goes here...</div>
              <div>Tools content goes here...</div>
              <div>Review content goes here...</div>
            </TabComponent>{" "}
          </div>
        </div>

        <div className="col-span-1">
          <CourseProgressCard
            card_type="explore"
            title="Animation is the Key of Successful UI/UX Design"
            author="Emerson Siphron"
            rating={4.5}
            avatarUrl="/mycourse/avatar.png"
            completedModules={1}
            totalModules={5}
            modules={[
              { title: "Introduction", duration: "10:00", completed: true },
              {
                title: "What is UX Design",
                duration: "10:00",
                completed: false,
              },
              {
                title: "Usability Testing",
                duration: "10:00",
                completed: false,
              },
              {
                title: "Create Usability Test",
                duration: "30:00",
                completed: false,
              },
              {
                title: "How to Implement",
                duration: "30:00",
                completed: false,
              },
            ]}
          />
        </div>
      </div>
      <CourseList show_filter={false} card_type={"explore"} title="Related Course" />
    </div>
  );
}
