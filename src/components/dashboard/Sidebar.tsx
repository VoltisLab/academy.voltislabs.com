"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IoSettingsOutline } from "react-icons/io5";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import {
  PiChatCircleTextLight,
  PiGridFourLight,
  PiMagnifyingGlassLight,
  PiSignOutLight,
  PiVideoLight,
  PiNotification,
  PiCaretDown,
  PiCaretUp,
} from "react-icons/pi";
import { BsCameraVideo, BsBoxSeam, BsCamera, BsHeadphones, BsHeart } from "react-icons/bs";
import { FaLaptopCode } from "react-icons/fa";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import { AiOutlineDesktop, AiOutlineUser } from "react-icons/ai";
import { LuGraduationCap, LuPencil } from "react-icons/lu";
import { MdOutlineWorkOutline } from "react-icons/md";
import LogoutModal from "../modals/LogoutModal";
import { Category, CategoryItem, UserData } from "@/lib/types";

// Add this to your global CSS or as a style tag in the component
const customStyles = `
  .custom-checkbox:checked {
    background-color: #313273 !important;
    border-color: #313273 !important;
  }
  
  .custom-checkbox:focus {
    box-shadow: 0 0 0 2px rgba(49, 50, 115, 0.2);
  }
`;

const links = [
  { href: "/dashboard/overview", label: "Overview", icon: PiGridFourLight },
  {
    href: "/dashboard/explore",
    label: "Explore Courses",
    icon: PiMagnifyingGlassLight,
  },
  { href: "/dashboard/my-courses", label: "My Courses", icon: PiVideoLight },
  {
    href: "/dashboard/messages",
    label: "Message",
    icon: PiChatCircleTextLight,
  },
  {
    href: "/dashboard/notifications",
    label: "Notification",
    icon: PiNotification,
  },
];

export default function Sidebar() {
  const pathname = usePathname() || "/";
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const { logout } = useAuth();
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  
  // State for categories
  const [categories, setCategories] = useState<Category[]>([
    {
      id: "courses",
      title: "Courses",
      isCollapsible: true,
      isOpen: true,
      items: [
        {
          id: "development",
          title: "Development",
          icon: FaLaptopCode,
          isCollapsible: true,
          isOpen: true,
          items: [
            { id: "web", label: "Web development", count: 574, checked: false },
            { id: "data", label: "Data Science", count: 568, checked: false },
            { id: "mobile", label: "Mobile Development", count: 1345, checked: true },
            { id: "testing", label: "Software Testing", count: 317, checked: false },
            { id: "engineering", label: "Software Engineering", count: 31, checked: false },
            { id: "tools", label: "Software Development Tools", count: 558, checked: false },
            { id: "nocode", label: "No-Code Development", count: 37, checked: false },
          ],
        },
        {
          id: "business",
          title: "Business",
          icon: RiMoneyDollarCircleLine,
          isCollapsible: true,
          isOpen: false,
          items: [],
        },
        {
          id: "finance",
          title: "Finance & Accounting",
          icon: RiMoneyDollarCircleLine,
          isCollapsible: true,
          isOpen: false,
          items: [],
        },
        {
          id: "it",
          title: "IT & Software",
          icon: AiOutlineDesktop,
          isCollapsible: true,
          isOpen: false,
          items: [],
        },
        {
          id: "office",
          title: "Office Productivity",
          icon: MdOutlineWorkOutline,
          isCollapsible: true,
          isOpen: false,
          items: [],
        },
        {
          id: "personal",
          title: "Personal Development",
          icon: AiOutlineUser,
          isCollapsible: true,
          isOpen: false,
          items: [],
        },
        {
          id: "design",
          title: "Design",
          icon: LuPencil,
          isCollapsible: true,
          isOpen: false,
          items: [],
        },
        {
          id: "marketing",
          title: "Marketing",
          icon: LuGraduationCap,
          isCollapsible: true,
          isOpen: false,
          items: [],
        },
        {
          id: "lifestyle",
          title: "Lifestyle",
          icon: BsBoxSeam,
          isCollapsible: true,
          isOpen: false,
          items: [],
        },
        {
          id: "photography",
          title: "Photography & Video",
          icon: BsCamera,
          isCollapsible: true,
          isOpen: false,
          items: [],
        },
        {
          id: "music",
          title: "Music",
          icon: BsHeadphones,
          isCollapsible: true,
          isOpen: false,
          items: [],
        },
        {
          id: "health",
          title: "Health & Fitness",
          icon: BsHeart,
          isCollapsible: true,
          isOpen: false,
          items: [],
        },
      ]
    },
    {
      id: "advancedFilters",
      title: "Advanced Filters",
      isCollapsible: true,
      isOpen: true,
      items: [
        { id: "html", label: "HTML 5", count: 1345, checked: false },
        { id: "css", label: "CSS 3", count: 12736, checked: false },
        { id: "react", label: "React", count: 1345, checked: false },
        { id: "webflow", label: "Webflow", count: 1345, checked: true },
        { id: "nodejs", label: "Node.js", count: 1345, checked: false },
        { id: "laravel", label: "Laravel", count: 1345, checked: false },
        { id: "saas", label: "Saas", count: 1345, checked: false },
        { id: "wordpress", label: "Wordpress", count: 1345, checked: false },
      ],
    },
    {
      id: "courseRating",
      title: "Course Rating",
      isCollapsible: true,
      isOpen: true,
      items: [
        { id: "5star", label: "5 Star", count: 1345, checked: false },
        { id: "4star", label: "4 Star & up", count: 1345, checked: false },
        { id: "3star", label: "3 Star & up", count: 1345, checked: true },
        { id: "2star", label: "2 Star & up", count: 1345, checked: false },
        { id: "1star", label: "1 Star & up", count: 1345, checked: false },
      ],
    },
    {
      id: "courseLevel",
      title: "Course Level",
      isCollapsible: true,
      isOpen: true,
      items: [
        { id: "all", label: "All Level", count: 1345, checked: false },
        { id: "beginner", label: "Beginner", count: 1345, checked: false },
        { id: "intermediate", label: "Intermediate", count: 1345, checked: false },
        { id: "expert", label: "Expert", count: 1345, checked: false },
      ],
    },
    {
      id: "courseDuration",
      title: "Course Duration",
      isCollapsible: true,
      isOpen: true,
      items: [
        { id: "days", label: "1 - 7 Days", count: 1345, checked: false },
        { id: "weeks", label: "1 - 4 Weeks", count: 1345, checked: false },
        { id: "months3", label: "1 - 3 Months", count: 1345, checked: true },
        { id: "months6", label: "3 - 6 Months", count: 1345, checked: false },
        { id: "months12", label: "6 - 12 Months", count: 1345, checked: false },
      ],
    },
  ]);

  useEffect(() => {
    // Client-side only code
    const userString = localStorage.getItem("user");
    if (userString) {
      const userData = JSON.parse(userString);
      setUser(userData);
    }
  }, []);

  const handleLogout = () => {
    logout();
    console.log("User logged out");
    setIsLogoutModalOpen(false);
    router.push("/");
  };

  // Toggle category function
  const toggleCategory = (categoryId: string, parentId?: string) => {
    setCategories(prevCategories => {
      return prevCategories.map(category => {
        // Handle top-level category
        if (category.id === categoryId) {
          return { ...category, isOpen: !category.isOpen };
        }
        
        // Handle nested categories
        if (category.items && parentId === undefined) {
          return {
            ...category,
            items: category.items.map(item => {
              if ('title' in item && item.id === categoryId) {
                return { ...item, isOpen: !item.isOpen };
              }
              return item;
            })
          };
        }
        
        // Handle sub-subcategories (when parentId is specified)
        if (category.id === parentId && category.items) {
          return {
            ...category,
            items: category.items.map(subItem => {
              if ('title' in subItem && subItem.id === categoryId) {
                return { ...subItem, isOpen: !subItem.isOpen };
              }
              return subItem;
            })
          };
        }
        
        return category;
      });
    });
  };

  // Toggle checkbox function
  const toggleCheckbox = (categoryId: string, itemId: string, parentId?: string) => {
    setCategories(prevCategories => {
      return prevCategories.map(category => {
        // For direct items under top-level category
        if (category.id === categoryId && category.items) {
          return {
            ...category,
            items: category.items.map(item => {
              if ('label' in item && item.id === itemId) {
                return { ...item, checked: !item.checked };
              }
              return item;
            })
          };
        }
        
        // For items nested under subcategories
        if (category.id === parentId && category.items) {
          return {
            ...category,
            items: category.items.map(subCategory => {
              if ('title' in subCategory && subCategory.id === categoryId && subCategory.items) {
                return {
                  ...subCategory,
                  items: subCategory.items.map(item => {
                    if ('label' in item && item.id === itemId) {
                      return { ...item, checked: !item.checked };
                    }
                    return item;
                  })
                };
              }
              return subCategory;
            })
          };
        }
        
        return category;
      });
    });
  };

  // Render checkbox items with proper styling
  const renderItems = (items: (CategoryItem | Category)[], categoryId: string, parentId?: string) => {
    return items.map(item => {
      // Only render items that have 'label' property (CategoryItems)
      if ('label' in item) {
        return (
          <div key={item.id} className="flex items-center justify-between py-2 px-2">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id={`${categoryId}-${item.id}`}
                checked={item.checked}
                onChange={() => toggleCheckbox(categoryId, item.id, parentId)}
                className="custom-checkbox w-4 h-4 rounded border-gray-300 text-[#313273] focus:ring-[#313273]"
                style={{ accentColor: '#313273' }}
              />
              <label htmlFor={`${categoryId}-${item.id}`} className="text-sm text-gray-700">
                {item.label}
              </label>
            </div>
            <span className="text-xs text-gray-400">{item.count}</span>
          </div>
        );
      }
      return null;
    }).filter(Boolean); // Filter out null elements
  };

  // Render category with better styling matching the image
  const renderCategory = (category: Category, isTopLevel: boolean = true, parentId?: string) => {
    const Icon = category.icon;
    const hasItems = category.items && category.items.length > 0;
    
    return (
      <div key={category.id} className="mb-1">
        <button
          onClick={() => toggleCategory(category.id, parentId)}
          className={`w-full flex items-center justify-between py-3 px-4 ${
            isTopLevel ? (category.isOpen ? "bg-white" : "bg-white") : "hover:bg-gray-50"
          } ${
            category.id === "courses" ? "border border-gray-100 rounded-xl" : "border border-gray-100 rounded-xl"
          }`}
        >
          <div className="flex items-center gap-2">
            {Icon && <Icon className={`size-5 ${category.isOpen ? "text-[#313273]" : "text-[#1D2026]"}`} />}
            <span className={`text-sm font-medium ${category.isOpen ? "text-[#313273]" : "text-[#1D2026]"}`}>
              {category.title}
            </span>
          </div>
          {category.isCollapsible && (
            <span>
              {category.isOpen ? (
                <PiCaretUp className={`${category.isOpen ? "text-[#313273]" : "text-gray-500"}`} />
              ) : (
                <PiCaretDown className="text-gray-500" />
              )}
            </span>
          )}
        </button>
        
        {category.isOpen && hasItems && (
          <div className="mt-2">
            {category.items?.map(item => {
              // Check if this item is a subcategory (has a 'title' property)
              if ('title' in item) {
                return (
                  <div key={item.id}>
                    <button
                      onClick={() => toggleCategory(item.id, category.id)}
                      className="w-full flex items-center justify-between py-3 px-4 border-b border-gray-100 transition hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-2">
                        {item.icon && <item.icon className={`size-5 ${item.isOpen ? "text-[#313273]" : "text-[#1D2026]"}`} />}
                        <span className={`text-sm font-medium ${item.isOpen ? "text-[#313273]" : "text-[#1D2026]"}`}>
                          {item.title}
                        </span>
                      </div>
                      {item.isCollapsible && (
                        <span>
                          {item.isOpen ? (
                            <PiCaretUp className={`${item.isOpen ? "text-[#313273]" : "text-gray-500"}`} />
                          ) : (
                            <PiCaretDown className="text-gray-500" />
                          )}
                        </span>
                      )}
                    </button>
                    
                    {item.isOpen && item.items && (
                      <div className="px-2">
                        {renderItems(item.items, item.id, category.id)}
                      </div>
                    )}
                  </div>
                );
              } else if ('label' in item) {
                // For direct checkbox items
                return (
                  <div key={item.id} className="flex items-center justify-between py-2 px-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`${category.id}-${item.id}`}
                        checked={item.checked}
                        onChange={() => toggleCheckbox(category.id, item.id, parentId)}
                        className="custom-checkbox w-4 h-4 rounded border-gray-300 text-[#313273] focus:ring-[#313273]"
                        style={{ accentColor: '#313273' }}
                      />
                      <label htmlFor={`${category.id}-${item.id}`} className="text-sm text-gray-700">
                        {item.label}
                      </label>
                    </div>
                    <span className="text-xs text-gray-400">{item.count}</span>
                  </div>
                );
              }
              return null;
            })}
          </div>
        )}
        
        {/* For top-level category with subcategories that have their own items */}
        {category.isOpen && category.id === "courses" && category.items && (
          <div>
            {category.items
              .filter(subCategory => 'title' in subCategory && subCategory.isOpen && subCategory.items && subCategory.items.length > 0)
              .map(subCategory => {
                if ('title' in subCategory && subCategory.items) {
                  return (
                    <div key={subCategory.id} className="mt-1">
                      {renderItems(subCategory.items, subCategory.id, category.id)}
                    </div>
                  );
                }
                return null;
              })}
          </div>
        )}
      </div>
    );
  };

  // Determine if we need to render the full sidebar or the filtered view
  const isFilterView = pathname === "/dashboard/explore" || pathname.includes("/dashboard/my-courses");

  return (
    <>
      {/* Add the custom style tag */}
      <style jsx global>{customStyles}</style>
      
      <div className="h-screen">
        <aside className="fixed h-full p-6 overflow-y-auto flex flex-col w-[280px] bg-white">
          {/* Logo */}
          <Link href={"/"} className="items-center flex gap-2 mb-12">
            <div className="size-10 relative">
              <Image
                src={"/logo.svg"}
                alt="Logo"
                fill
                sizes="(max-width: 768px) 100vw, 128px"
                className="object-contain"
                priority
              />
            </div>
            <p className="font-medium leading-[92%] text-[#313273] text-[23px]">
              Voltis Labs
              <br />
              Academy
            </p>
          </Link>

          {/* If in filter view, show categories instead of navigation */}
          {isFilterView ? (
            <div className="flex flex-col gap-2 overflow-y-auto pb-16">
              {/* Main navigation for filter view */}
              <Link
                href={"/dashboard/overview"}
                className="px-3 py-2.5 rounded-md hover:bg-[#ECEBFF] transition group"
              >
                <div className="flex items-center gap-2 transition group-hover:text-[#313273]">
                  <PiGridFourLight className="size-5" />
                  <span className="text-sm">Overview</span>
                </div>
              </Link>
              
              <Link
                href={"/dashboard/explore"}
                className={`px-3 py-2.5 rounded-md ${
                  pathname === "/dashboard/explore" ? "bg-[#ECEBFF] text-[#313273] font-semibold" : ""
                } hover:bg-[#ECEBFF] transition group`}
              >
                <div className="flex items-center gap-2 transition group-hover:text-[#313273]">
                  <PiMagnifyingGlassLight className="size-5" />
                  <span className="text-sm">Explore Courses</span>
                </div>
              </Link>
              
              {/* Categories */}
              <div className="mt-4 space-y-3">
                {categories.map(category => renderCategory(category))}
              </div>
            </div>
          ) : (
            <nav className="flex flex-col gap-2.5">
              {links.map(({ href, label, icon: Icon }) => {
                const isActive =
                  pathname === href ||
                  (pathname === "/dashboard" && href === "/dashboard/overview");

                return (
                  <Link
                    key={href}
                    href={href}
                    className={`px-3 py-2.5 rounded-md hover:bg-[#ECEBFF] transition group ${
                      isActive
                        ? "bg-[#ECEBFF] text-[#313273] font-semibold"
                        : "font-medium"
                    }`}
                  >
                    <div className="flex items-center gap-2 transition group-hover:text-[#313273]">
                      <Icon className="size-5" />
                      <span className="text-sm">{label}</span>
                    </div>
                  </Link>
                );
              })}
            </nav>
          )}

          {/* Settings logout - This will stick to the bottom with mt-auto */}
          <div className="mt-auto pt-6 space-y-2.5">
            <h3 className="text-[#A7A7AA] text-[14px]">SETTINGS</h3>

            <Link
              href={"/dashboard/settings"}
              className="gap-2.5 flex items-center py-2.5 pl-3.5 text-[#525255] "
            >
              <IoSettingsOutline />
              <span>Settings</span>
            </Link>
            <button
              className="gap-2.5 flex items-center py-2.5 pl-3.5 text-[#F43F5E] cursor-pointer"
              onClick={() => setIsLogoutModalOpen(true)}
            >
              <PiSignOutLight />
              <span>Logout</span>
            </button>
          </div>
        </aside>
        <LogoutModal
          isOpen={isLogoutModalOpen}
          onClose={() => setIsLogoutModalOpen(false)}
          onLogout={handleLogout}
          userName={`${user?.firstName || ""} ${user?.lastName || ""}`}
        />
      </div>
    </>
  );
}