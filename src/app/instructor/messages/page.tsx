"use client"
import ChatUI from "@/components/messages/ChatUi";
import React from "react";

export default function Message() {
  return (
    <div className="w-full p-4 space-y-2 ">
      <h1 className="text-lg font-bold text-gray-900">Messages</h1>
      <ChatUI />
    </div>
  );
}
