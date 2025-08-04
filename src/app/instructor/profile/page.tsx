// src/app/instructor/profile/page.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useUserService } from "@/services/userService";
import { toast } from "react-hot-toast";
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  User as UserIcon,
  Mail,
  Edit2,
  Save,
  X,
  Camera,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import { useUpdateUser } from "@/services/updateUserService";
import { uploadFile } from "@/services/fileUploadService";

export default function InstructorProfile() {
  const router = useRouter();
  const { getUserProfile } = useUserService();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageRemoved, setImageRemoved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const data = await getUserProfile();
        if (data) {
          setProfile(data);
          setFormData({
            firstName: data.firstName || "",
            lastName: data.lastName || "",
            bio: data.bio || "",
            displayName: data.displayName || "",
            dob: data.dob || "",
            gender: data.gender || "",
            location: data.location?.locationName || "",
            phone: data.phone?.number || "",
          });
        }
      } catch (error) {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  try {
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      toast.error("Only JPG, PNG, or WEBP images are allowed");
      return;
    }

    setUploadingImage(true);
    toast.loading("Uploading image...", { id: "image-upload" });

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload to server
    const uploadResult = await uploadFile(file, "PROFILE_PICTURE");

    if (!uploadResult || typeof uploadResult !== "string") {
      throw new Error("Upload failed - invalid response");
    }

    console.log("Uploaded image URL:", uploadResult);
    setSelectedImage(uploadResult);
    setImageRemoved(false);
    toast.success("Image uploaded successfully!", { id: "image-upload" });
  } catch (error) {
    console.error("Image upload error:", error);
    toast.error("Failed to upload image", { id: "image-upload" });
    setImagePreview(null);
    setSelectedImage(null);
  } finally {
    setUploadingImage(false);
  }
};


  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setImageRemoved(true);
    // Clear the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const { updateUser, loading: updateLoading, error: updateError } = useUpdateUser();

  const handleSave = async () => {
    try {
      // Validate required fields
      if (!formData.firstName || !formData.lastName) {
        toast.error("First name and last name are required");
        return;
      }

      // Normalize phone number (remove leading zero if present)
      const normalizedPhone = formData.phone?.replace(/^0/, "") || "";
      
      // Prepare variables WITHOUT username to avoid backend error
      const updateVariables = {
        bio: formData.bio || null,
        country: "NG",
        displayName: formData.displayName || `${formData.firstName} ${formData.lastName}`,
        dob: formData.dob || null,
        firstName: formData.firstName,
        gender: formData.gender ? formData.gender.toUpperCase() : null,
        lastName: formData.lastName,
        // Only include phone if provided
        ...(normalizedPhone && {
          phoneNumber: {
            countryCode: "+234",
            number: normalizedPhone,
            completed: `+234${normalizedPhone}`,
          },
        }),
      };

      // Handle profile picture update
      if (selectedImage) {
        // New image uploaded
        updateVariables.profilePicture = {
          profilePictureUrl: selectedImage,
        };
      } else if (imageRemoved) {
        // Image was removed
        updateVariables.profilePicture = null;
      }
      // If neither selectedImage nor imageRemoved, don't update profile picture

      console.log("Sending update variables:", updateVariables);

      const result = await updateUser(updateVariables);
      
      if (result?.user) {
        // Update local state immediately with returned data
        setProfile(result.user);
        
        // Update form data to reflect the saved changes
        setFormData({
          firstName: result.user.firstName || "",
          lastName: result.user.lastName || "",
          bio: result.user.bio || "",
          displayName: result.user.displayName || "",
          dob: result.user.dob || "",
          gender: result.user.gender || "",
          location: result.user.location?.locationName || formData.location,
          phone: result.user.phone?.number || formData.phone,
        });
        
        // Clear image selection states
        setSelectedImage(null);
        setImagePreview(null);
        setImageRemoved(false);
        
        toast.success("Profile updated successfully");
        setEditing(false);
        
        console.log("Profile state updated with:", result.user);
      } else {
        // Fallback: force cache refresh
        toast.success("Profile updated successfully");
        setEditing(false);
        
        // Clear image selection states
        setSelectedImage(null);
        setImagePreview(null);
        setImageRemoved(false);
        
        // Clear cache and refetch
        setTimeout(async () => {
          try {
            const updatedProfile = await getUserProfile();
            if (updatedProfile) {
              setProfile(updatedProfile);
              setFormData({
                firstName: updatedProfile.firstName || "",
                lastName: updatedProfile.lastName || "",
                bio: updatedProfile.bio || "",
                displayName: updatedProfile.displayName || "",
                dob: updatedProfile.dob || "",
                gender: updatedProfile.gender || "",
                location: updatedProfile.location?.locationName || "",
                phone: updatedProfile.phone?.number || "",
              });
            }
          } catch (refetchError) {
            console.error("Failed to refetch profile:", refetchError);
          }
        }, 100);
      }
    } catch (error) {
      console.error("Profile update error:", error);
      
      const errorMessage = updateError?.message || 
                          (error instanceof Error ? error.message : "Failed to update profile");
      
      toast.error(errorMessage);
    }
  };

  const handleCancelEdit = () => {
    setEditing(false);
    setSelectedImage(null);
    setImagePreview(null);
    setImageRemoved(false);
    // Reset form data to original profile data
    setFormData({
      firstName: profile.firstName || "",
      lastName: profile.lastName || "",
      bio: profile.bio || "",
      displayName: profile.displayName || "",
      dob: profile.dob || "",
      gender: profile.gender || "",
      location: profile.location?.locationName || "",
      phone: profile.phone?.number || "",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-10 bg-gray-200 rounded w-1/4"></div>
            <div className="flex gap-6">
              <div className="w-1/4 space-y-4">
                <div className="h-64 bg-gray-200 rounded-lg"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              </div>
              <div className="flex-1 space-y-4">
                <div className="h-12 bg-gray-200 rounded w-full"></div>
                <div className="h-32 bg-gray-200 rounded w-full"></div>
                <div className="grid grid-cols-2 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-20 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-800">
            Profile not found
          </h2>
          <p className="mt-2 text-gray-600">
            Unable to load your profile information
          </p>
        </div>
      </div>
    );
  }

  // Determine which image to show
  const getCurrentImage = () => {
    if (imagePreview) return imagePreview; // Show preview if new image selected
    if (imageRemoved) return null; // Show no image if removed
    return profile.profilePictureUrl; // Show existing image
  };

  const currentProfileImage = getCurrentImage();

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            My Profile
          </h1>
          {editing ? (
            <div className="flex gap-2">
              <button
                onClick={handleCancelEdit}
                className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                <X size={18} /> Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={updateLoading || uploadingImage}
                className="flex items-center gap-2 px-4 py-2 bg-[#4F46E5] text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
              >
                <Save size={18} /> 
                {uploadingImage ? "Uploading..." : updateLoading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#4F46E5] text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Edit2 size={18} /> Edit Profile
            </button>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Side - Profile Card */}
          <div className="w-full md:w-1/3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="relative h-48 bg-gradient-to-r from-purple-600 to-[#4F46E5]">
                <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
                  <div className="relative h-32 w-32 rounded-full border-4 border-white bg-white group cursor-pointer">
                    {currentProfileImage ? (
                      <Image
                        src={currentProfileImage}
                        alt="Profile"
                        fill
                        className="rounded-full object-cover"
                        onError={(e) => {
                          console.error("Image failed to load:", currentProfileImage);
                          // Fallback to default avatar
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center">
                        <UserIcon className="h-16 w-16 text-gray-400" />
                      </div>
                    )}
                    
                    {/* Overlay for editing */}
                    {editing && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="flex gap-2">
                          <button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploadingImage}
                            className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-2 transition-all disabled:opacity-50"
                            title="Change photo"
                          >
                            <Camera className="h-4 w-4 text-white" />
                          </button>
                          {(currentProfileImage || selectedImage) && (
                            <button
                              onClick={handleRemoveImage}
                              disabled={uploadingImage}
                              className="bg-red-500 bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 transition-all disabled:opacity-50"
                              title="Remove photo"
                            >
                              <Trash2 className="h-4 w-4 text-white" />
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {/* Loading indicator */}
                    {uploadingImage && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
              </div>

              <div className="pt-20 pb-6 px-6 text-center">
                <h2 className="text-xl font-bold text-gray-900">
                  {editing ? (
                    <input
                      type="text"
                      name="displayName"
                      value={formData.displayName}
                      onChange={handleInputChange}
                      className="text-center bg-gray-100 rounded px-2 py-1 w-full"
                    />
                  ) : (
                    profile.displayName ||
                    `${profile.firstName} ${profile.lastName}`
                  )}
                </h2>
                <p className="text-[#4F46E5] font-medium mt-1">
                  {profile.isInstructor ? "Instructor" : "Student"} at Voltis
                  Labs Academy
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  Member since{" "}
                  {new Date(profile.dateJoined).toLocaleDateString()}
                </p>

                {editing ? (
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    placeholder="Tell us about yourself..."
                    className="mt-4 w-full bg-gray-100 rounded-lg p-3 text-sm min-h-[100px]"
                  />
                ) : (
                  <p className="mt-4 text-gray-600 text-sm">
                    {profile.bio || "No bio provided"}
                  </p>
                )}
              </div>

              <div className="border-t border-gray-200 px-6 py-4">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Mail className="h-4 w-4 text-indigo-500" />
                  <span>{profile.email}</span>
                </div>
                {profile.phone?.number && (
                  <div className="flex items-center gap-3 text-sm text-gray-600 mt-3">
                    <Phone className="h-4 w-4 text-indigo-500" />
                    {editing ? (
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="bg-gray-100 rounded px-2 py-1 flex-1"
                      />
                    ) : (
                      <span>{profile.phone.number}</span>
                    )}
                  </div>
                )}
                {profile.location?.locationName && (
                  <div className="flex items-center gap-3 text-sm text-gray-600 mt-3">
                    <MapPin className="h-4 w-4 text-indigo-500" />
                    {editing ? (
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        className="bg-gray-100 rounded px-2 py-1 flex-1"
                      />
                    ) : (
                      <span>{profile.location.locationName}</span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Instructor-specific stats */}
            {profile.isInstructor && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 mt-6 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Instructor Stats
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-indigo-50 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-[#4F46E5]">24</p>
                    <p className="text-xs text-gray-500">Courses</p>
                  </div>
                  <div className="bg-indigo-50 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-[#4F46E5]">1.2K</p>
                    <p className="text-xs text-gray-500">Students</p>
                  </div>
                  <div className="bg-indigo-50 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-[#4F46E5]">4.9</p>
                    <p className="text-xs text-gray-500">Rating</p>
                  </div>
                  <div className="bg-indigo-50 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-[#4F46E5]">98%</p>
                    <p className="text-xs text-gray-500">Completion</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Side - Details */}
          <div className="w-full md:w-2/3 space-y-6">
            {/* Personal Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-500 mb-1">
                    First Name
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full bg-gray-100 rounded px-3 py-2"
                    />
                  ) : (
                    <p className="font-medium">{profile.firstName}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">
                    Last Name
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full bg-gray-100 rounded px-3 py-2"
                    />
                  ) : (
                    <p className="font-medium">{profile.lastName}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">
                    Date of Birth
                  </label>
                  {editing ? (
                    <input
                      type="date"
                      name="dob"
                      value={formData.dob}
                      onChange={handleInputChange}
                      className="w-full bg-gray-100 rounded px-3 py-2"
                    />
                  ) : (
                    <p className="font-medium">
                      {profile.dob
                        ? new Date(profile.dob).toLocaleDateString()
                        : "Not provided"}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">
                    Gender
                  </label>
                  {editing ? (
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="w-full bg-gray-100 rounded px-3 py-2"
                    >
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                      <option value="Prefer not to say">
                        Prefer not to say
                      </option>
                    </select>
                  ) : (
                    <p className="font-medium">
                      {profile.gender || "Not provided"}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Account Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">
                Account Information
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-500 mb-1">
                    Username
                  </label>
                  <p className="font-medium">{profile.username}</p>
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">
                    Email
                  </label>
                  <p className="font-medium">{profile.email}</p>
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">
                    Account Status
                  </label>
                  <div className="flex items-center gap-2">
                    <span
                      className={`h-2 w-2 rounded-full ${
                        profile.isVerified ? "bg-green-500" : "bg-yellow-500"
                      }`}
                    ></span>
                    <p className="font-medium">
                      {profile.isVerified ? "Verified" : "Pending Verification"}
                    </p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">
                    Last Login
                  </label>
                  <p className="font-medium">
                    {profile.lastLogin
                      ? new Date(profile.lastLogin).toLocaleString()
                      : "Never"}
                  </p>
                </div>
              </div>
            </div>

            {/* Instructor-specific sections */}
            {profile.isInstructor && (
              <>
                {/* Teaching Preferences */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="font-semibant text-gray-900 mb-4">
                    Teaching Preferences
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-500 mb-1">
                        Timezone
                      </label>
                      <p className="font-medium">
                        {profile.preference?.timezone || "Not set"}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-500 mb-1">
                        Language
                      </label>
                      <p className="font-medium">
                        {profile.preference?.language || "English"}
                      </p>
                    </div>
                    <div>
  <label className="block text-sm text-gray-500 mb-1">
    Date Format
  </label>
  <p className="font-medium">
    {profile.preference?.dateFormat?.replaceAll("_", " ") || "MM/DD/YYYY"}
  </p>
</div>
<div>
  <label className="block text-sm text-gray-500 mb-1">
    Time Format
  </label>
  <p className="font-medium">
    {profile.preference?.timeFormat?.replaceAll("_", " ") || "12-hour"}
  </p>
</div>
                  </div>
                </div>

                {/* Availability */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">
                    Availability
                  </h3>
                  <div className="flex items-center gap-3 text-gray-600">
                    <Clock className="h-5 w-5 text-indigo-500" />
                    <span>Monday - Friday, 9:00 AM - 5:00 PM</span>
                  </div>
                </div>
              </>
            )}

            {/* Student-specific sections */}
            {!profile.isInstructor && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Learning Preferences
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">
                      Timezone
                    </label>
                    <p className="font-medium">
                      {profile.preference?.timezone || "Not set"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">
                      Preferred Language
                    </label>
                    <p className="font-medium">
                      {profile.preference?.language || "English"}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}