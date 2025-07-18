"use client"
import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { apolloClient } from "@/lib/apollo-client";
import {
  COURSE_LEVELS,
  CourseLevelEnum,
  DURATION_UNITS,
  DurationUnitEnum,
  LanguageEnum,
  LANGUAGES,
  languageCodeMap,
} from "@/lib/utils";
import {
  CourseCategory,
  GetCategoriesResponse,
  FormData,
  CreateCourseBasicInfoVariables,
} from "@/lib/types";
import Cookies from "js-cookie";
import {
  CREATE_COURSE_BASIC_INFO,
  GET_CATEGORIES,
  UPDATE_COURSE_INFO,
} from "@/api/course/mutation";
import toast from "react-hot-toast";
import FormHeader from "../../layout/FormHeader";
import { useCoursesData } from "@/services/useCourseDataService";
import { useSearchParams } from "next/navigation";

type BasicInformationFormProps = {
  onSaveNext: (id: number) => void;
  courseId?: number;
};

export const BasicInformationForm = ({
  onSaveNext,
  courseId,
}: BasicInformationFormProps) => {
  // Form state
  const [formData, setFormData] = useState<FormData>({
    title: "",
    subtitle: "",
    categoryId: "",
    subCategoryId: "",
    topic: "",
    language: "",
    subtitleLanguage: "",
    courseLevel: "",
    durationValue: "",
    durationUnit: DurationUnitEnum.DAY,
    description: "",
  });

    const searchParams = useSearchParams();

  // Category state
  const [categories, setCategories] = useState<CourseCategory[]>([]);
  const [categoryLoading, setCategoryLoading] = useState<boolean>(true);
  const [categoryError, setCategoryError] = useState<Error | null>(null);

  // Loading and error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Fetch categories when component mounts
  useEffect(() => {
    fetchCategories();
  }, []);
  const {fetchInstructorCourses} = useCoursesData()
  const title = searchParams?.get("edit")
  const [editId, setEditId]  = useState("") ; 

useEffect(() => {
  const fetchCourse = async() => {
    if(title?.trim()){
      const data =await fetchInstructorCourses({searchValue: title })
      const result = data?.instructorCourses[0]
if (result) {
          const parsed = JSON.parse(result.duration);
          setEditId(result?.id ?? ""),

        setFormData({
          title: result.title || "",
          subtitle: result.subtitle || "", // If not in API, remains empty
          categoryId: result.category?.id || "",
          subCategoryId: result.subCategory?.id || "", // If not in API, remains empty
          topic: result.topic || "",
          language: languageCodeMap[result.language] || "", // Map short code to enum
          subtitleLanguage: languageCodeMap[result.subtitleLanguage] || "",
          courseLevel: result.level || "",
          durationValue: parsed.value !== undefined ? String(parsed.value) : "",
          durationUnit: parsed.unit || DurationUnitEnum.DAY,
          description: "",
        });
      }
    }

  }

  fetchCourse()
},[])


  // Fetch categories from the backend
  const fetchCategories = async () => {
    try {
      setCategoryLoading(true);
      setCategoryError(null);

      const { data, errors } = await apolloClient.query<GetCategoriesResponse>({
        query: GET_CATEGORIES,
        context: {
          includeAuth: true,
        },
        fetchPolicy: "network-only",
      });

      if (errors) {
        console.log("GraphQL errors fetching categories:", errors);
        console.log(errors[0]?.message || "Failed to fetch categories");
      }

      if (data && data.categories) {
        setCategories(data.categories);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
      setCategoryError(
        err instanceof Error ? err : new Error("Failed to fetch categories")
      );
    } finally {
      setCategoryLoading(false);
    }
  };

  // Handle input changes
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = e.target;

    // If changing subcategory and it matches the category, show warning
    if (name === "subCategoryId" && value === formData.categoryId) {
      toast.error("Sub-category cannot be the same as Category", {
        id: "category-match-warning", // This prevents duplicate toasts
      });
    }
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    // Reset subcategory when category changes
    if (name === "categoryId") {
      setFormData((prevState) => ({
        ...prevState,
        subCategoryId: "",
      }));
    }
  };

  const createCourseBasicInfo = async (
    variables: CreateCourseBasicInfoVariables
  ) => {
    try {
      setLoading(true);
      setError(null);

      // Get auth token from cookies (for logging purposes only)
      const authToken = Cookies.get("auth_token");

      if (!authToken) {
        throw new Error("Authentication token not found. Please login again.");
      }

      // Make the GraphQL mutation with includeAuth: true
      const { data, errors } = await apolloClient.mutate({
        mutation: CREATE_COURSE_BASIC_INFO,
        variables,
        context: {
          includeAuth: true, // This tells Apollo to include the auth token
        },
        fetchPolicy: "no-cache", // Force network request, bypass cache
      });

      if (errors) {
        console.error("GraphQL errors:", errors);

        // Check if any errors are related to authentication
        const authErrors = errors.filter(
          (err) =>
            err.message.toLowerCase().includes("auth") ||
            err.message.toLowerCase().includes("token") ||
            err.message.toLowerCase().includes("credentials") ||
            err.message.toLowerCase().includes("permission")
        );

        if (authErrors.length > 0) {
          console.error("Authentication errors detected:", authErrors);
          throw new Error(
            "Authentication failed. Please try logging in again."
          );
        }

        throw new Error(
          errors[0]?.message || "An error occurred during course creation"
        );
      }

      return data;
    } catch (err) {
      console.error("Course creation error:", err);

      // Handle specific error types
      if (err instanceof Error) {
        if (err.message.includes("NetworkError")) {
          setError(
            new Error(
              "Network error. Please check your connection and try again."
            )
          );
        } else if (
          err.message.includes("Authentication") ||
          err.message.includes("credentials")
        ) {
          setError(new Error("Authentication failed. Please log in again."));
        } else {
          setError(err);
        }
      } else {
        setError(new Error("An unexpected error occurred"));
      }

      throw err;
    } finally {
      setLoading(false);
    }
  };

const updateCourseInfo = async (
  variables: any // Preferably use your typed UpdateCourseVariables
) => {
  try {
    setLoading(true);
    setError(null);

    const authToken = Cookies.get("auth_token");
    if (!authToken) {
      throw new Error("Authentication token not found. Please login again.");
    }

    const { data, errors } = await apolloClient.mutate({
      mutation: UPDATE_COURSE_INFO,
      variables,
      context: {
        includeAuth: true,
      },
      fetchPolicy: "no-cache",
    });

    if (errors) {
      console.error("GraphQL errors:", errors);

      const authErrors = errors.filter(
        (err) =>
          err.message.toLowerCase().includes("auth") ||
          err.message.toLowerCase().includes("token") ||
          err.message.toLowerCase().includes("credentials") ||
          err.message.toLowerCase().includes("permission")
      );

      if (authErrors.length > 0) {
        console.error("Authentication errors detected:", authErrors);
        throw new Error("Authentication failed. Please try logging in again.");
      }

      throw new Error(
        errors[0]?.message || "An error occurred during course update"
      );
    }

    return data;
  } catch (err) {
    console.error("Course update error:", err);

    if (err instanceof Error) {
      if (err.message.includes("NetworkError")) {
        setError(
          new Error("Network error. Please check your connection and try again.")
        );
      } else if (
        err.message.includes("Authentication") ||
        err.message.includes("credentials")
      ) {
        setError(new Error("Authentication failed. Please log in again."));
      } else {
        setError(err);
      }
    } else {
      setError(new Error("An unexpected error occurred"));
    }

    throw err;
  } finally {
    setLoading(false);
  }
};
  // Handle course creation submission
  const handleCourseCreation = async (
    e: FormEvent,
    saveAndPreview: boolean = false
  ): Promise<void> => {
    e.preventDefault();

    try {
      // Form validation
      if (
        !formData.title ||
        !formData.categoryId ||
        !formData.subCategoryId ||
        !formData.topic ||
        !formData.language ||
        !formData.courseLevel ||
        !formData.durationValue
      ) {
        console.log("Please fill in all required fields");
        toast.error("Please fill in all required fields");
        return;
      }

      if (
        formData.categoryId &&
        formData.categoryId === formData.subCategoryId
      ) {
        toast.error(
          "Category and Sub-category cannot be the same. Please select different values."
        );
        return;
      }

      const response = title?.trim() ?
      
       await updateCourseInfo({
        courseId: parseInt(editId?? ""),
        title: formData.title,
        subtitle:  (formData.subtitleLanguage as LanguageEnum) ||
                (formData.language as LanguageEnum),
        // description: formData.description,
        categoryId: parseInt(formData.categoryId),
        subCategoryId: parseInt(formData.subCategoryId),
        language: formData.language as LanguageEnum,
        // targetAudience: ["Developers", "Designers"],
        // teachingPoints: ["React Basics", "Hooks"],
        // trailer: "https://youtube.com/mytrailer",
        // banner: { thumbnail: "thumb.png", url: "banner.png" }
      })

      :await createCourseBasicInfo({
        title: formData.title,
        subtitle: formData.subtitle || "",
        categoryId: parseInt(formData.categoryId),
        subCategoryId: parseInt(formData.subCategoryId),
        topic: formData.topic,
        language: formData.language as LanguageEnum,
        subtitleLanguage:
          (formData.subtitleLanguage as LanguageEnum) ||
          (formData.language as LanguageEnum),
        courseLevel: formData.courseLevel as CourseLevelEnum,
        description: formData.description || "",
        duration: {
          value: parseInt(formData.durationValue),
          unit: formData.durationUnit,
        },
      });

      

      if (title?.trim() ? response?.updateCourse?.success : response?.createCourse?.success) {
        toast.success(
          title?.trim()? response.updateCourse.message :
          response.createCourse.message ||
            "Course information saved successfully!"
        );
        // Extract course ID and pass it to the parent component
        const courseId = title?.trim() ?editId : response.createCourse?.course?.id;
        if (courseId) {
          onSaveNext(courseId); // Always call onSaveNext with courseId
        } else {
          console.error("Course ID not found in response");
          toast.error(
            "Course created but ID not found. Please refresh and try again."
          );
        }
      }
    } catch (err) {
      console.error("Error creating course:", err);
      setError(
        err instanceof Error ? err : new Error("An unexpected error occurred")
      );
      toast.error(
        err instanceof Error
          ? err.message
          : "Failed to save course information. Please try again."
      );
    }
  };

  return (
    <section className="space-y-10">
      <FormHeader
        loading={loading}
        handleCourseCreation={handleCourseCreation}
        title={"Basic Information"}
      />

      <form className="space-y-6 text-sm text-gray-800">
        {/* Title */}
        <div>
          <label className="block font-medium mb-1">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Your course title"
            maxLength={80}
            className="w-full p-3 border border-gray-300 rounded-md"
          />
          <p className="text-right text-xs text-gray-400 mt-1">
            {formData.title.length}/80
          </p>
        </div>

        {/* Subtitle */}
        <div>
          <label className="block font-medium mb-1">Subtitle</label>
          <input
            type="text"
            name="subtitle"
            value={formData.subtitle}
            onChange={handleChange}
            placeholder="Your course subtitle"
            maxLength={120}
            className="w-full p-3 border border-gray-300 rounded-md"
          />
          <p className="text-right text-xs text-gray-400 mt-1">
            {formData.subtitle.length}/120
          </p>
        </div>

        {/* Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1">Course Category</label>
            {categoryLoading ? (
              <div className="w-full p-3 border border-gray-300 rounded-md bg-gray-50">
                Loading categories...
              </div>
            ) : (
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md"
              >
                <option value="">Select...</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            )}
            {categoryError && (
              <p className="text-xs text-red-500 mt-1">
                Error loading categories. Please refresh the page.
              </p>
            )}
          </div>
          <div>
            <label className="block font-medium mb-1">
              Course Sub-category
            </label>
            <select
              name="subCategoryId"
              value={formData.subCategoryId}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md"
              disabled={!formData.categoryId}
            >
              <option value="">Select...</option>
              {/* For now, we'll use hardcoded sub-categories as they're not available from the API */}
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
              {/* Add more subcategories for other categories if needed */}
            </select>
            {formData.categoryId && !formData.subCategoryId && (
              <p className="text-xs text-gray-500 mt-1">
                Please select a subcategory
              </p>
            )}
          </div>
        </div>

        {/* Topic */}
        <div>
          <label className="block font-medium mb-1">Course Topic</label>
          <input
            type="text"
            name="topic"
            value={formData.topic}
            onChange={handleChange}
            placeholder="What is primarily taught in your course?"
            className="w-full p-3 border border-gray-300 rounded-md"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block font-medium mb-1">
            Description (Optional)
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Brief description of your course"
            className="w-full p-3 border border-gray-300 rounded-md"
            rows={3}
          />
        </div>

        {/* Languages and Level */}
        <div className="w-full overflow-hidden">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <div>
              <label className="block font-medium mb-1">Course Language</label>
              <select
                name="language"
                value={formData.language}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md"
              >
                <option value="">Select...</option>
                {LANGUAGES.map((language) => (
                  <option key={language.value} value={language.value}>
                    {language.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-medium mb-1">
                Subtitle Language (Optional)
              </label>
              <select
                name="subtitleLanguage"
                value={formData.subtitleLanguage}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md"
              >
                <option value="">Select...</option>
                {LANGUAGES.map((language) => (
                  <option key={language.value} value={language.value}>
                    {language.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-medium mb-1">Course Level</label>
              <select
                name="courseLevel"
                value={formData.courseLevel}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md"
              >
                <option value="">Select...</option>
                {COURSE_LEVELS.map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="min-w-0">
              <label className="block font-medium mb-1">Duration</label>
              <div className="flex gap-2 xl:flex-row">
                <input
                  type="number"
                  name="durationValue"
                  value={formData.durationValue}
                  onChange={handleChange}
                  placeholder="Duration"
                  min="1"
                  className="p-3 border border-gray-300 rounded-md w-full"
                />
                <select
                  name="durationUnit"
                  value={formData.durationUnit}
                  onChange={handleChange}
                  className="p-3 border border-gray-300 rounded-md w-full"
                >
                  {DURATION_UNITS.map((unit) => (
                    <option key={unit.value} value={unit.value}>
<<<<<<< HEAD
                      {unit.label}
=======
                      {unit.label} (s)
>>>>>>> 833a8175e45998681bd349dd004991dfdb94e00e
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </form>

      <div className="flex items-center justify-between px-4 md:px-6 py-4 border-t border-gray-200 bg-white mb-3.5">
        <button className="text-gray-500 font-medium text-sm px-5 py-2 rounded-md hover:bg-gray-100">
          Cancel
        </button>
        <button
          className="bg-[#2E2C6F] text-white font-medium text-sm px-6 py-2 rounded-md hover:bg-[#25235a]"
          onClick={(e) => handleCourseCreation(e)}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save & Next"}
        </button>
      </div>
    </section>
  );
};
