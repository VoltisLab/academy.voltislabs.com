import CourseList from "@/components/myCourses/CourseList";
import React from "react";

export default function InstructorDashboard() {
  return (
    <div className="xl:max-w-[90rem] xl:mx-auto xl:px-4 py-8">
      <CourseList show_filter card_type={"explore"}  title="Explore Courses"/>
    </div>
  );
}
