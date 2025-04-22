import CourseCard from "@/components/CourseCard";

const courses = [
  {
    title: "Product Management Basic - Course",
    date: "1 - 28 July 2022",
    description:
      "Product Management Masterclass, you will learn with Sarah Johnson – Head of Product Customer Platform Gojek Indonesia.",
    image: "/courses/pm.png",
    students: 120,
  },
  {
    title: "Front End Developer - Basic",
    date: "1 - 28 July 2022",
    description: "Learn the foundational skills for building websites and apps using HTML, CSS, and JavaScript.",
    image: "/courses/frontend.png",
    students: 120,
  },
  {
    title: "Back End Developer - Basic",
    date: "1 - 28 July 2022",
    description: "Learn how servers, databases, and APIs work together to power the modern web.",
    image: "/courses/backend.png",
    students: 120,
  },
  {
    title: "UX Design - Brainstorming",
    date: "1 - 28 July 2022",
    description: "Master user flows, wireframing, and ideation techniques for better UX outcomes.",
    image: "/courses/ux.png",
    students: 120,
  },
  {
    title: "UI Design - Sketch",
    date: "1 - 28 July 2022",
    description: "Design visually stunning and intuitive interfaces with Sketch and modern design systems.",
    image: "/courses/ui.jpg",
    students: 120,
  },
  {
    title: "Graphic Design - Fundamentals",
    date: "1 - 28 July 2022",
    description: "Explore the basics of composition, typography, and visual storytelling.",
    image: "/courses/graphic.png",
    students: 120,
  },
];

export default function CourseSection() {
  const categories = [
    "All Programs",
    "UI/UX Design",
    "Product Management",
    "Marketing",
    "Mobile Development",
    "Web Development",
    "Backend Development",
  ];

  return (
    <section className="py-16 text-white bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <h2 className="text-3xl md:text-[40px] font-bold text-[#090D2C] leading-snug">
            Discover Courses & Bootcamps
          </h2>
          <button className="text-pink-500 border border-pink-500 px-5 py-2 rounded-full hover:bg-pink-600 hover:text-white transition text-sm">
            Show All
          </button>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-3 mb-10">
          {categories.map((cat, i) => (
            <button
              key={i}
              className={`px-4 py-2 rounded-full font-medium text-sm transition ${
                i === 0
                  ? "bg-pink-600 text-white"
                  : "bg-white border border-[#ccc] text-black hover:bg-pink-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course, i) => (
            <CourseCard key={i} {...course} />
          ))}
        </div>
      </div>
    </section>
  );
}
