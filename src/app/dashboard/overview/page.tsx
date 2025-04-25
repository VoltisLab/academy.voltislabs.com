"use client";

import React from "react";
import { CgMoreVertical } from "react-icons/cg";
import {
  IoChevronBack,
  IoChevronForward,
  IoNotificationsOutline,
  IoPlayOutline,
} from "react-icons/io5";
import { MdOutlineDirectionsTransitFilled, MdStar } from "react-icons/md";
import { PiMagnifyingGlassLight, PiVideoBold } from "react-icons/pi";
import ContinueWatching from "./carousel/ContinueWatching";
import Link from "next/link";
import Image from "next/image";
import { CiUser } from "react-icons/ci";
import { TiDocumentText } from "react-icons/ti";
import { FaRegClock } from "react-icons/fa6";
import { useAside } from "@/context/showAsideContext";
import { FaHamburger } from "react-icons/fa";

const videos = [
  {
    name: "Introduction to React Components",
    watched: 2,
    total: 8,
  },
  {
    name: "Understanding React Hooks",
    watched: 5,
    total: 10,
  },
  {
    name: "Advanced State Management with Redux",
    watched: 7,
    total: 12,
  },
];

const TABLE_HEADINGS = [
  "Instructor Name & Date",
  "Course Type",
  "Course Title",
  "Actions",
];

const TABLE_DATA = [
  {
    instructor: "Prashant Kumar Singh",
    date: "25/2/2023",
    courseType: "Frontend",
    courseTitle: "Understanding Concept of React",
    action: "SHOW DETAILS",
  },
  {
    instructor: "Ravi Kumar",
    date: "25/2/2023",
    courseType: "Frontend",
    courseTitle: "Understanding Concept of React",
    action: "SHOW DETAILS",
  },
  {
    instructor: "Fatima Ali",
    date: "13/3/2023",
    courseType: "Backend",
    courseTitle: "Node.js Deep Dive",
    action: "SHOW DETAILS",
  },
  {
    instructor: "Chinedu Eze",
    date: "30/4/2023",
    courseType: "DevOps",
    courseTitle: "CI/CD Pipeline Setup",
    action: "SHOW DETAILS",
  },
];

export default function Overview() {
  const { showAside, toggleAside } = useAside();
  return (
    <div className="flex min-h-screen overflow-hidden relative">
      {/* Main */}
      <div className="flex-1 min-w-0 md:flex-4/6 px-8 py-5 bg-[#EFEFF2] space-y-6">
        {/* Search bar */}
        <div className="bg-[#FDFDFD] px-4 gap-2 py-3.5 rounded-xl border border-[#EFEFF2] flex items-center w-3/5">
          <input
            type="text"
            placeholder="Search your course here...."
            className="w-full outline-none"
          />
          <PiMagnifyingGlassLight className="text-2xl cursor-pointer " />
        </div>

        <div className="bg-[#313273] text-white rounded-[20px] px-6 py-5 space-y-4 relative">
          <p className="uppercase text-xs">Online Course</p>
          <p className="font-semibold text-2xl lg:w-2/3 xl:w-1/2">
            Sharpen Your Skills With Professional Online Courses
          </p>
          <button className="bg-[#202020] flex items-center gap-2 py-2 px-4 rounded-[40px] transition cursor-pointer hover:bg-black">
            <span className="text-xs">Join Now</span>
            <span className="bg-white flex justify-center items-center rounded-full size-5">
              <IoPlayOutline className="size-2 text-black" />
            </span>
          </button>

          {/* Stars  */}
          <MdStar className="absolute text-white/10 size-14.5 top-5 right-[157px]" />
          <MdStar className="absolute text-white/10 h-29.5 w-20 top-28 right-[148px]" />
          <MdStar className="absolute text-white/25 w-[80px] h-[80px] top-[45px] right-[77px]" />
          <MdStar className="absolute text-white/10 w-[61px] h-[118px] -top-[59px] right-[26px]" />
          <MdStar className="absolute text-white/10 w-[80px] h-[80px] top-[93px] right-[7px]" />
        </div>

        {/* Watched */}
        <div className="grid gap-4 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
          {videos.map((video) => (
            <div
              key={video.name}
              className="p-3 bg-white rounded-xl gap-4 flex items-center justify-between"
            >
              <div className="bg-[#ECEBFF] rounded-full p-3 flex justify-center items-center">
                <PiVideoBold />
              </div>

              <div className="text-xs gap-2 mr-auto md:mr-0">
                <p>
                  {video.watched}/{video.total} watched
                </p>
                <p className="font-semibold">{video.name}</p>
              </div>

              <CgMoreVertical />
            </div>
          ))}
        </div>

        {/* Continue Watching */}
        <ContinueWatching />

        {/* Your mentor */}
        <div>
          <div className="mb-2 flex justify-between items-center ">
            <h2 className="text-[#202020] font-semibold">Your Mentor</h2>{" "}
            {/* Carousel buttons */}
            <Link href={"#"} className="underline text-xs text-blue-500">
              See All
            </Link>
          </div>

          <div className="px-6 py-2 bg-white rounded">
            {/* table */}
            <table className="w-full table-auto">
              <thead>
                <tr>
                  {TABLE_HEADINGS.map((heading, index) => (
                    <th
                      key={index}
                      className="text-[10px] font-semibold text-[#202020] text-left py-2"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="">
                {TABLE_DATA.map((item, index) => (
                  <tr key={index} className="">
                    {/* Instructor & Date */}
                    <td className="py-3 flex items-center gap-2">
                      <div className="size-6 relative">
                        <Image
                          src={"/logo.svg"}
                          alt="Logo"
                          fill
                          sizes="(max-width: 768px) 100vw, 128px"
                          className="object-contain rounded-full"
                        />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-[#202020]">
                          {item.instructor}
                        </div>
                        <div className="text-[12px] text-[#5F5F5F]">
                          {item.date}
                        </div>
                      </div>
                    </td>

                    {/* Course Type */}
                    <td className="py-3">
                      <button className="inline-block text-[10px] bg-[#ECEBFF] text-[#313273] rounded-[8px] px-3 py-1">
                        {item.courseType}
                      </button>
                    </td>

                    {/* Course Title */}
                    <td className="py-3 text-[12px] text-[#202020]">
                      {item.courseTitle}
                    </td>

                    {/* Actions */}
                    <td className="py-3">
                      <button className="text-[10px] bg-[#3366CC33] rounded-[8px] px-3 py-1 text-[#3366CC]">
                        {item.action}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Aside  */}
      <div
        className={`bg-white min-h-screen md:flex-2/6 fixed md:static top-0 right-0 w-full md:w-auto transform overflow-y-auto transition-transform duration-300 z-50 px-6 py-8 ${
          showAside ? "translate-x-0" : "translate-x-full"
        } md:translate-x-0`}
      >
        {/* User image  */}
        <div className="bg-[#CCCCCC]/30 size-[100px] rounded-full flex justify-center items-center relative overflow-hidden mx-auto shadow">
          <div className="size-[100px] rounded-[100px] absolute -top-[20%] -right-[20%] z-10 bg-[#313273]"></div>

          <div className="bg-white flex justify-center items-center rounded-full size-22 relative z-20 ">
            <div className="size-[72px] relative">
              <Image
                src={"/logo.svg"}
                alt="Logo"
                fill
                sizes="(max-width: 768px) 100vw, 128px"
                className="object-contain rounded-full"
              />
            </div>
          </div>
        </div>

        <FaHamburger
          className="absolute top-6 right-6 block md:hidden"
          onClick={() => toggleAside()}
        />

        {/* name  */}
        <div className="space-y-1.5 text-center font-medium my-4">
          <h1 className="text-[#202020]  text-base">Good Morning Prashant</h1>
          <p className="text-[#7E7E7E]">
            continue your journey and achieve Your Target
          </p>
        </div>

        {/* Icons  */}
        <div className="flex gap-4 mx-auto">
          <div className="ml-auto size-10 flex justify-center items-center  border border-[#7E7E7E] rounded-full">
            <IoNotificationsOutline />{" "}
          </div>
          <div className="mr-auto size-10 flex justify-center items-center  border border-[#7E7E7E] rounded-full">
            <MdOutlineDirectionsTransitFilled />{" "}
          </div>
        </div>

        {/* Video */}
        <div className="space-y-5 mt-9">
          {/* head  */}
          <div className="flex items-center justify-between">
            <h2 className="text-sm text-[#9C9CA4] font-medium">Today</h2>

            <div className="flex items-center gap-2.5">
              <IoChevronBack className="text-[#9C9CA4]" />
              <IoChevronForward className="text-black" />
            </div>
          </div>

          {/* video  */}
          <div className="h-[150px] w-full relative">
            <Image
              src={"/logo.svg"}
              alt="Logo"
              fill
              sizes="(max-width: 768px) 100vw, 128px"
              className="object-cover rounded-lg"
            />

            <div className="px-2.5 py-1.5 bg-white shadow rounded-lg absolute bottom-5 left-4 flex items-center gap-2">
              <span>Beginner</span>{" "}
              <div className="flex items-end gap-1">
                <p className="bg-green-500 h-[5px] w-[3px] rounded-lg"></p>{" "}
                <p className="bg-[#DFDFDF] h-2 w-[3px] rounded-lg"></p>
                <p className="bg-[#DFDFDF] h-2.5 w-[3px] rounded-lg"></p>
              </div>
            </div>
          </div>

          {/* Tutorial video DETAILS  */}
          <div className="space-y-2.5">
            <h1 className="text-lg font-bold">
              UX Design : How To Implement Usability Testing
            </h1>
            {/* Tutor name  */}
            <div className="flex justify-between items-center">
              <p className="text-sm text-[#9C9CA4]">Alfredo Rhiel Madsen</p>
              <div className="size-7.5 relative">
                <Image
                  src={"/logo.svg"}
                  alt="Logo"
                  fill
                  sizes="(max-width: 768px) 100vw, 128px"
                  className="object-cover rounded-full"
                />
              </div>
            </div>

            {/* icons  */}
            <div className="flex justify-between items-center">
              {" "}
              <div className="flex gap-2 items-center">
                <CiUser className="text-[#9C9CA4]" /> <p>500 Student</p>
              </div>
              <div className="flex gap-2 items-center">
                <TiDocumentText className="text-[#9C9CA4]" /> <p>3 modules</p>
              </div>
              <div className="flex gap-2 items-center">
                <FaRegClock className="text-[#9C9CA4]" /> <p>1hr 30min</p>
              </div>
            </div>

            {/* Modules */}
          </div>
        </div>
      </div>
    </div>
  );
}
