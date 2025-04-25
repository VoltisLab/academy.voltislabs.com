"use client";
import CourseList from "@/components/myCourses/CourseList";
import { useState } from "react";


export default function CourseDetailScreen() {

  return (
    <div className="max-w-[90rem]  mx-auto px-4 16 py-8">
      <CourseList show_filter card_type={"my-courses"} />
    </div>
  );
}
