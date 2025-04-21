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
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eget magna enim fermentum porttitor.",
    image: "/courses/frontend.png",
    students: 120,
  },
  {
    title: "Back End Developer - Basic",
    date: "1 - 28 July 2022",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eget magna enim fermentum porttitor.",
    image: "/courses/backend.png",
    students: 120,
  },
  {
    title: "UX Design - Branstorming",
    date: "1 - 28 July 2022",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eget magna enim fermentum porttitor.",
    image: "/courses/ux.png",
    students: 120,
  },
  {
    title: "UI Design - Sketch",
    date: "1 - 28 July 2022",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eget magna enim fermentum porttitor.",
    image: "/courses/ui.png",
    students: 120,
  },
  {
    title: "Graphic Design\n - Fundamental Design",
    date: "1 - 28 July 2022",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eget magna enim fermentum porttitor.",
    image: "/courses/graphic.png",
    students: 120,
  },
];

export default function CourseSection() {
  return (
    <section className="py-16  text-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[#1C144F]">
            Discover Course & Bootcamp
          </h2>
          <button className="text-pink-500 border border-pink-500 px-4 py-2 rounded-full hover:bg-pink-600 hover:text-white transition">
            Show All
          </button>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-3 mb-8">
          {[
            "All Programs",
            "UI/UX Design",
            "Product Management",
            "Marketing",
            "Mobile Development",
            "Web Development",
          ].map((cat, i) => (
            <button
              key={i}
              className={`px-4 py-2 rounded-full font-semibold text-sm transition ${
                i === 0
                  ? "bg-pink-600 text-white"
                  : "bg-white text-black hover:bg-pink-100"
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
