"use client"
import ChatUI from "@/components/messages/ChatUi";
import React from "react";

export default function Message() {
  return (
    <div className="w-full px-4 16 py-8 space-y-10 ">
      <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
      <ChatUI />
    </div>
  );
}
