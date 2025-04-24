import CourseList from "@/components/myCourses/CourseList";
import React from "react";

export default function ExploreCourses() {
  return (
    <div className="max-w-[90rem]  mx-auto px-4 16 py-8">
      <CourseList card_type={"explore"}  title="Explore Courses"/>
    </div>
  );
}
