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
  status?: 'DRAFT' | 'PUBLISHED' | 'PENDING';
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
      <div className="rounded-xl relative overflow-hidden shadow-md bg-[#F7F7F7] w-[300px]">
        {/* Image */}
        <div className="relative w-full h-40">
          <Image
            src={imageUrl}
            alt="Course Image"
            fill
            className="object-cover"
          />
        </div>

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
          <p className="text-sm text-gray-700 h-[40px] line-clamp-2">{cleanHtmlContent(description)}</p>

          {/* Status and Visibility */}
       <p className={`text-xs ${status === "PUBLISHED"? "text-green-700 bg-green-100" : status === "PENDING"? "text-yellow-700 bg-yellow-100" :"text-red-700 bg-red-100" }  absolute right-2 p-2 rounded-lg`}>
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
      </div>
    )
  }

  // List view
  return (
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
        <p className="text-sm text-black line-clamp-1">{cleanHtmlContent(description)}</p>

        {/* Status and Visibility */}
       <p className={`text-xs ${status === "PUBLISHED"? "text-green-700 bg-green-100" : status === "PENDING"? "text-yellow-700 bg-yellow-100" :"text-red-700 bg-red-100" }  absolute right-2 p-2 rounded-lg`}>
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
      </div>
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
