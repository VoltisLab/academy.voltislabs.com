'use client'
import Image, { StaticImageData } from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import DeleteModal from './DeleteCourseModal'
import { apolloClient } from '@/lib/apollo-client'
import { DELETE_COURSE } from '@/api/course/mutation'
import toast from 'react-hot-toast'
import { useCoursesData } from '@/services/useCourseDataService'


interface CourseCardProps {
  title: string;
  id:number;
  description: string;
  imageUrl?: string | StaticImageData;
  isGrid?: boolean;
  category?: string;
  progressPercent?: number;
<<<<<<< HEAD
  status?: 'DRAFT' | 'PUBLISHED';
=======
  status?: 'DRAFT' | 'PUBLISHED' | 'PENDING';
>>>>>>> 833a8175e45998681bd349dd004991dfdb94e00e
  isPublic?: boolean;
  editUrl?: string;
}

const cleanHtmlContent = (htmlString: string): string => {
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
  };

  const deleteCourse = async (courseId: number) => {
  try {
    // setLoading(true);
    // setError(null);

    const { data, errors } = await apolloClient.mutate({
      mutation: DELETE_COURSE,
      variables: { courseId },
      context: {
        includeAuth: true, // if you use auth
      },
      fetchPolicy: "no-cache",
    });

    if (errors) {
      console.error("GraphQL errors deleting course:", errors);
      throw new Error(errors[0]?.message || "Failed to delete course");
    }

    if (data?.deleteCourse?.success) {
      // Optionally show a toast or update UI
      toast.success(data.deleteCourse.message || "Course deleted!");
      // Optionally: remove from state if you list courses
    } else {
      toast.error(data?.deleteCourse?.message || "Delete failed");
    }
    return data?.deleteCourse;
  } catch (err) {
    console.error("Error deleting course:", err);
    // setError(err instanceof Error ? err : new Error("Failed to delete course"));
    toast.error(
      err instanceof Error
        ? err.message
        : "Failed to delete course. Please try again."
    );
    return null;
  } finally {
    // setLoading(false);
  }
};
  

export default function MyCourseCard({
  title,
  description,
  imageUrl = '/placeholder-icon.png',
  isGrid = false,
  category = 'FRONTEND',
  progressPercent = 50,
  status = 'DRAFT',
  isPublic = false,
  editUrl = '#',
  id
}: CourseCardProps) {

const [showDeleteModal, setShowDeleteModal] = useState(false);
// const {fetchInstructorCourses, pageNumber,setPageNumber,} = useCoursesData()
// console.log("DD",pageNumber);

const handleDeleteConfirm = async () => {
  // setPageNumber((prev) => prev)  
  const response = await deleteCourse(id);
  if (response?.success) { // NOT response?.deleteCourse?.success
    // await fetchInstructorCourses()

    setShowDeleteModal(false);
    console.log(`Deleting course: ${title}`);
    window.location.reload()
    // Additional logic...
  }
};



  if (isGrid) {
 return (
  <div className="md:w-[380px] w-[100%] max-w-full rounded-2xl shadow-2xl bg-gradient-to-br from-[#f5f7fa] to-[#c3cfe2] overflow-hidden group transition-transform hover:-translate-y-2 hover:shadow-3xl duration-300 relative">
    {/* Cover Image */}
    <div className="relative w-full h-66">
      <Image
        src={imageUrl}
        alt="Course Cover"
        fill
        className="object-cover group-hover:scale-105 transition-transform duration-500"
        priority
      />
      {/* Status Badge */}
      <span className={`
        absolute top-3 left-3 px-3 py-1 text-xs font-bold rounded-full shadow-lg backdrop-blur-sm
        ${status === "PUBLISHED"
          ? "bg-green-100 text-green-700"
          : status === "PENDING"
          ? "bg-yellow-100 text-yellow-700"
          : "bg-red-100 text-red-700"
        }
      `}>
        {status}
      </span>
      {/* Gradient overlay for legibility */}
      <div className="absolute bottom-0 w-full h-1/3 bg-gradient-to-t from-[#23253a88] to-transparent pointer-events-none" />
    </div>

<<<<<<< HEAD
        {/* Content */}
        <div className="p-4 flex flex-col gap-2">
          <div className='flex items-center justify-between'>
            <span className="text-[10px] font-semibold text-[#A99EF6] uppercase tracking-wide">
              {category}
            </span>
            {/* Edit Icon */}
            {/* <div className="flex justify-center text-purple-700 mt-3">
              <Link href={editUrl}>
                <p className="text-[#A99EF6] transition-colors font-semibold">Edit</p>

              </Link>
              <button className='text-red-500'>Delete</button>
            </div> */}

          </div>

          <h2 className="text-base font-semibold text-gray-900">{title}</h2>
          <p className="text-sm text-gray-700">{cleanHtmlContent(description)}</p>

          {/* Status and Visibility */}
           <p className="text-xs text-red-700 bg-red-100 absolute top-2 right-2 p-2 rounded-lg">
              <span className="font-bold">{status}</span>
            </p>

          {/* Progress Text */}
          <div className="flex items-center justify-between text-[10px] text-gray-500">
            {/* <span>{progressText}</span> */}
            <span>Your Course is {progressPercent}% completed</span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-300 h-2 rounded-full overflow-hidden">
            <div
              className="bg-[#A99EF6] h-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex justify-center text-purple-700 mt-3 gap-3">
              <Link href={editUrl} className='w-full'>
                {/* <FiEdit size={18} className="hover:text-purple-800 transition-colors" /> */}
                <button className="text-white transition-colors text-sm font-semibold w-full py-1 rounded-xl border bg-[#A99EF6]">Edit</button>

              </Link>
              <button onClick={() => setShowDeleteModal(true)} className='text-[#A99EF6] w-full border border-[#A99EF6] py-1 rounded-xl text-sm'>Delete</button>
            </div>
          
        </div>

        <DeleteModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDeleteConfirm}
          courseTitle={title}
          id={id}
        />
=======
    {/* Card Content */}
    <div className="px-6 py-5 flex flex-col gap-3 bg-white/80 backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-[#786AED] uppercase tracking-widest bg-[#eceaff] px-3 py-1 rounded-full shadow-sm">{category}</span>
        {isPublic && (
          <span className="text-[10px] px-2 py-0.5 rounded bg-gray-100 text-gray-700">Public</span>
        )}
>>>>>>> 833a8175e45998681bd349dd004991dfdb94e00e
      </div>

      <h2 className="text-xl font-extrabold text-gray-900 line-clamp-1">{title}</h2>
      <p className="text-sm text-gray-600 font-medium line-clamp-2 min-h-[40px]">{cleanHtmlContent(description)}</p>
      
      {/* Progress */}
      <div className="flex items-center justify-between mt-1">
        <span className="text-[11px] text-gray-500 font-medium">Progress</span>
        <span className="font-semibold text-[#786AED] text-xs">{progressPercent === 100 ? "Completed" : progressPercent+"%"}</span>
      </div>
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#A99EF6] to-[#786AED] transition-all duration-500"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 mt-4">
        <Link href={editUrl} className="flex-1">
          <button
            className="w-full py-2 rounded-xl bg-[#786AED] text-white font-bold shadow-md hover:bg-[#5743c2] transition-all text-sm"
            type="button"
          >
            Edit
          </button>
        </Link>
        <button
          onClick={() => setShowDeleteModal(true)}
          className="flex-1 w-full py-2 rounded-xl border border-red-200 bg-red-50 text-red-600 font-bold shadow-md hover:bg-red-100 transition-all text-sm"
          type="button"
        >
          Delete
        </button>
      </div>
    </div>

    {/* Delete Modal */}
    <DeleteModal
      isOpen={showDeleteModal}
      onClose={() => setShowDeleteModal(false)}
      onConfirm={handleDeleteConfirm}
      courseTitle={title}
      id={id}
    />
  </div>
)

  }

  // List view
  return (
<<<<<<< HEAD
    <div className="group relative flex items-center gap-4  pr-4 w-full max-w-6xl rounded-md shadow-md transition-colors duration-200 hover:bg-gray-50">
      {/* Image */}
      <div className="relative w-36 h-28 shrink-0">
        <Image
          src={imageUrl}
          alt="Course Icon"
          fill
          className="object-cover rounded-md"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col gap-1 flex-1  h-24 " >
        <span className="text-[10px] font-semibold text-[#A99EF6] uppercase tracking-wide">
          {category}
        </span>

        <h2 className="font-semibold text-base text-black">{title}</h2>
        <p className="text-sm text-black">{cleanHtmlContent(description)}</p>

        {/* Status and Visibility */}
       <p className="text-xs text-red-700 bg-red-100 absolute right-2 p-2 rounded-lg">
          <span className="font-bold">{status}</span>
        </p>

        {/* Progress Text */}
        <div className="flex items-center justify-between text-[10px]  text-gray-500">
          {/* <span>{progressText}</span> */}
          <span>Your course is {progressPercent}% completed</span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-300 h-2 rounded-full overflow-hidden">
          <div
            className="bg-[#A99EF6] h-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Edit Icon */}
      <div className="text-purple-700  mt-auto ml-auto flex items-center gap-2">
        <Link href={editUrl}>
          {/* <FiEdit size={18} className="hover:text-purple-800 transition-colors" /> */}
          <p className="text-[#A99EF6] transition-colors font-semibold">Edit</p>
        </Link>
        <button onClick={() => setShowDeleteModal(true)} className='text-red-500'>Delete</button>
=======
  <div className="relative flex w-full max-w-full bg-white rounded-2xl shadow-md hover:shadow-xl transition-all border border-gray-100 overflow-hidden group">
    {/* Left: Big Image (1/3 width) */}
    <div className="relative w-[240px] rounded-2xl min-w-[180px] h-48 sm:h-56 md:h-60 bg-gray-100">
      <Image
        src={imageUrl}
        alt="Course Cover"
        fill
        className="object-cover rounded-2xl"
        priority
      />
      {/* Status Badge */}
    </div>
      <span className={`
        absolute top-3 right-3 px-3 py-1 text-xs font-bold rounded-full shadow
        ${status === "PUBLISHED"
          ? "bg-green-100 text-green-700"
          : status === "PENDING"
          ? "bg-yellow-100 text-yellow-700"
          : "bg-red-100 text-red-700"
        }
      `}>
        {status}
      </span>

    {/* Right: Content */}
    <div className="flex-1 flex flex-col justify-between px-6 py-5 min-h-[192px]">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-bold text-[#786AED] uppercase tracking-wide bg-[#F3F0FF] px-2 py-0.5 rounded-full">{category}</span>
          {isPublic && (
            <span className="text-[11px] px-2 py-0.5 rounded bg-gray-200 text-gray-700">Public</span>
          )}
        </div>
        <h2 className="text-xl font-extrabold text-gray-900 leading-snug line-clamp-1">{title}</h2>
        <p className="text-[15px] text-gray-600 font-medium mt-1 line-clamp-2">{cleanHtmlContent(description)}</p>
      </div>
      <div className="flex items-center gap-2 mt-2">
        <span className="text-xs text-gray-500">
          Progress:
        </span>
        <span className="font-semibold text-[#A99EF6] text-xs">
          {progressPercent === 100 ? "Completed" : progressPercent+"%"}
        </span>
      </div>
      {/* Progress Bar */}
      <div className="w-full h-2 bg-gray-200 rounded-full mt-2 mb-2 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#A99EF6] to-[#786AED] transition-all duration-500"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
      <div className="flex gap-2 lg:gap-6 mt-2">
        <Link href={editUrl} className="flex-1">
          <button className="w-full py-2 rounded-lg bg-[#786AED] text-white font-semibold shadow-sm hover:bg-[#5f56d7] transition-colors text-sm">
            Edit
          </button>
        </Link>
        <button
          onClick={() => setShowDeleteModal(true)}
          className="flex-1 py-2 rounded-lg border border-red-300 bg-red-50 text-red-600 font-semibold hover:bg-red-100 transition-colors text-sm"
        >
          Delete
        </button>
>>>>>>> 833a8175e45998681bd349dd004991dfdb94e00e
      </div>
      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        courseTitle={title}
        id={id}
      />
    </div>
<<<<<<< HEAD


  )
=======
    <DeleteModal
      isOpen={showDeleteModal}
      onClose={() => setShowDeleteModal(false)}
      onConfirm={handleDeleteConfirm}
      courseTitle={title}
      id={id}
    />
  </div>
)

>>>>>>> 833a8175e45998681bd349dd004991dfdb94e00e
}
