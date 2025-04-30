import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { apolloClient } from "@/lib/apollo-client";
import { COURSE_LEVELS, CourseLevelEnum, DURATION_UNITS, DurationUnitEnum, LanguageEnum, LANGUAGES } from "@/lib/utils";
import { CourseCategory, GetCategoriesResponse, FormData, CreateCourseBasicInfoVariables } from "@/lib/types";
import Cookies from "js-cookie";
import { CREATE_COURSE_BASIC_INFO, GET_CATEGORIES } from "@/api/course/mutation";
import toast from "react-hot-toast";
interface BasicInformationFormProps {
  onSaveNext: () => void;
}

export const BasicInformationForm = ({ onSaveNext }: BasicInformationFormProps) => {
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
    description: ""
  });
  
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

  // Fetch categories from the backend
  const fetchCategories = async () => {
    try {
      setCategoryLoading(true);
      setCategoryError(null);
      
      const { data, errors } = await apolloClient.query<GetCategoriesResponse>({
        query: GET_CATEGORIES,
        context: {
          includeAuth: true
        },
        fetchPolicy: 'network-only'
      });
      
      if (errors) {
        console.error("GraphQL errors fetching categories:", errors);
        throw new Error(errors[0]?.message || "Failed to fetch categories");
      }
      
      if (data && data.categories) {
        setCategories(data.categories);
        console.log("Categories loaded:", data.categories);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
      setCategoryError(err instanceof Error ? err : new Error("Failed to fetch categories"));
    } finally {
      setCategoryLoading(false);
    }
  };

  // Handle input changes
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));

    // Reset subcategory when category changes
    if (name === "categoryId") {
      setFormData(prevState => ({
        ...prevState,
        subCategoryId: ""
      }));
    }
  };

  const createCourseBasicInfo = async (variables: CreateCourseBasicInfoVariables) => {
    try {
      setLoading(true);
      setError(null);
      
      // Get auth token from cookies (for logging purposes only)
      const authToken = Cookies.get('auth_token');
      console.log("Using auth token:", authToken ? "Present" : "Missing");
      
      if (!authToken) {
        throw new Error("Authentication token not found. Please login again.");
      }
      
      // Make the GraphQL mutation with includeAuth: true
      const { data, errors } = await apolloClient.mutate({
        mutation: CREATE_COURSE_BASIC_INFO,
        variables,
        context: {
          includeAuth: true // This tells Apollo to include the auth token
        },
        fetchPolicy: 'no-cache' // Force network request, bypass cache
      });
      
      if (errors) {
        console.error("GraphQL errors:", errors);
        
        // Check if any errors are related to authentication
        const authErrors = errors.filter(err => 
          err.message.toLowerCase().includes('auth') || 
          err.message.toLowerCase().includes('token') ||
          err.message.toLowerCase().includes('credentials') ||
          err.message.toLowerCase().includes('permission')
        );
        
        if (authErrors.length > 0) {
          console.error("Authentication errors detected:", authErrors);
          throw new Error("Authentication failed. Please try logging in again.");
        }
        
        throw new Error(errors[0]?.message || "An error occurred during course creation");
      }
      
      return data;
    } catch (err) {
      console.error("Course creation error:", err);
      
      // Handle specific error types
      if (err instanceof Error) {
        if (err.message.includes('NetworkError')) {
          setError(new Error("Network error. Please check your connection and try again."));
        } else if (err.message.includes('Authentication') || err.message.includes('credentials')) {
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
  const handleCourseCreation = async (e: FormEvent, saveAndPreview: boolean = false): Promise<void> => {
    e.preventDefault();
    
    try {
      // Form validation
      if (!formData.title || !formData.categoryId || !formData.subCategoryId || 
          !formData.topic || !formData.language || !formData.courseLevel || 
          !formData.durationValue) {
        throw new Error("Please fill in all required fields");
      }
      
      // Log authentication status before making the request
      console.log("Auth token present:", !!Cookies.get('auth_token'));
      
      const response = await createCourseBasicInfo({
        title: formData.title,
        subtitle: formData.subtitle || "",
        categoryId: parseInt(formData.categoryId),
        subCategoryId: parseInt(formData.subCategoryId),
        topic: formData.topic,
        language: formData.language as LanguageEnum,
        subtitleLanguage: formData.subtitleLanguage as LanguageEnum || formData.language as LanguageEnum,
        courseLevel: formData.courseLevel as CourseLevelEnum,
        description: formData.description || "",
        duration: {
          value: parseInt(formData.durationValue),
          unit: formData.durationUnit
        }
      });
  
      if (response?.createCourseBasicInfo?.success) {
        toast.success(response.createCourseBasicInfo.message || "Course information saved successfully!");
        
        onSaveNext()
      }
    } catch (err) {
      console.error("Error creating course:", err);
      setError(err instanceof Error ? err : new Error("An unexpected error occurred"));
      toast.error(err instanceof Error ? err.message : "Failed to save course information. Please try again.");
    }
  };

  return (
    <section className="space-y-10">
      <div className="flex items-center justify-between border-b border-gray-200 px-4 md:px-6 py-4 bg-white">
        <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>

        <div className="flex items-center gap-4">
          <button 
            className="bg-indigo-100 text-indigo-700 font-medium text-sm px-4 py-2 rounded-md"
            onClick={(e) => handleCourseCreation(e)}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </button>
          <button 
            className="text-indigo-800 text-sm font-medium"
            onClick={(e) => handleCourseCreation(e, true)}
            disabled={loading}
          >
            Save & Preview
          </button>
        </div>
      </div>

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
          <p className="text-right text-xs text-gray-400 mt-1">{formData.title.length}/80</p>
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
          <p className="text-right text-xs text-gray-400 mt-1">{formData.subtitle.length}/120</p>
        </div>

        {/* Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1">Course Category</label>
            {categoryLoading ? (
              <div className="w-full p-3 border border-gray-300 rounded-md bg-gray-50">Loading categories...</div>
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
              <p className="text-xs text-red-500 mt-1">Error loading categories. Please refresh the page.</p>
            )}
          </div>
          <div>
            <label className="block font-medium mb-1">Course Sub-category</label>
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
              <p className="text-xs text-gray-500 mt-1">Please select a subcategory</p>
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
          <label className="block font-medium mb-1">Description (Optional)</label>
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
            <label className="block font-medium mb-1">Subtitle Language (Optional)</label>
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
          <div>
            <label className="block font-medium mb-1">Duration</label>
            <div className="flex gap-2">
              <input
                type="number"
                name="durationValue"
                value={formData.durationValue}
                onChange={handleChange}
                placeholder="Duration"
                min="1"
                className="flex-1 p-3 border border-gray-300 rounded-md"
              />
              <select 
                name="durationUnit" 
                value={formData.durationUnit}
                onChange={handleChange}
                className="w-24 p-3 border border-gray-300 rounded-md"
              >
                {DURATION_UNITS.map((unit) => (
                  <option key={unit.value} value={unit.value}>
                    {unit.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </form>

      <div className="flex items-center justify-between px-4 md:px-6 py-4 border-t border-gray-200 bg-white">
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
}