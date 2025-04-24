import ChatUI from "@/components/messages/ChatUi";
import React from "react";

export default function Message() {
  return (
    <div className="max-w-[90rem] px-4 16 py-8 mt-10  mx-auto ">
      <h1 className="text-3xl  font-bold mb-5">Messages</h1>
      <ChatUI />
    </div>
  );
}
