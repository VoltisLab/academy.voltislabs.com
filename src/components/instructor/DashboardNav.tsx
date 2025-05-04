import Image from "next/image";
import { Bell, Search } from "lucide-react";

export default function DashboardNavbar() {
  return (
    <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
      {/* Greeting */}
      <div>
        <p className="text-sm text-gray-500">Good Morning</p>
        <h1 className="text-lg font-semibold text-gray-900">
          Create a new course
        </h1>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="flex items-center bg-gray-100 px-3 py-2 rounded-lg">
          <Search className="w-4 h-4 text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search"
            className="bg-transparent text-sm outline-none text-gray-700 placeholder:text-gray-400"
          />
        </div>

        {/* Notification */}
        <button className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
          <Bell className="w-5 h-5 text-gray-800" />
        </button>

        {/* Profile */}
        <Image
          src="/mycourse/avatar.png"
          alt="User Avatar"
          width={40}
          height={40}
          className="rounded-full"
        />
      </div>
    </div>
  );
}