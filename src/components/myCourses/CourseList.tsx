import Image from "next/image";
import CourseFilterBar from "./CourseFilterBar";
import CourseCard from "../CourseCard";
import { Card_type, Course } from "./types";
import { Import } from "lucide-react";
import CourseCardDash from "./CourseCardDash";

const courses: Course[] = [
  {
    id: 1,
    image: "/courses/backend.png",
    tag: "Frontend",
    title: "Beginner's Guide To Becoming A Professional Frontend Developer",
    modules: "3/5 Module",
    progress: 60,
    slug: "backend",
  },
  {
    id: 2,
    image: "/courses/frontend.png",
    tag: "Frontend",
    title: "Beginner's Guide To Becoming A Professional Frontend Developer",
    modules: "1/5 Module",
    progress: 20,
    slug: "frontend",
  },
  {
    id: 3,
    image: "/courses/graphic.png",
    tag: "Frontend",
    title: "Beginner's Guide To Becoming A Professional Frontend Developer",
    modules: "3/5 Module",
    progress: 60,
    slug: "graphic",
  },
  {
    id: 4,
    image: "/courses/pm.png",
    tag: "Frontend",
    title: "Beginner's Guide To Becoming A Professional Frontend Developer",
    modules: "1/5 Module",
    progress: 20,
    slug: "pm",
  },
];

export default function CourseList({ title = "My Courses", card_type = "my-courses" }: { title?: string; card_type: Card_type }) {
  return (
    <section className="space-y-10">
      <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
      <CourseFilterBar />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {courses.map((course) => (
          <CourseCardDash
            key={course.id}
            course={course}
            card_type={card_type}
          />
        ))}
      </div>
    </section>
  );
}
