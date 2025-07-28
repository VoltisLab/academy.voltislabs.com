"use client";
import { useState } from "react";
import { Send, Mic, Plus } from "lucide-react";
import Image from "next/image";
import TabComponent from "../myCourses/TabComponent";
import ChatSidebarItem from "./ChatSidebarItem";

export default function ChatUI() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [selectedItem, setSelectedItem] = useState<any>({
    room: "Rich",
  });
  const handleSend = () => {
    if (!message.trim()) return;
    setMessages((prev) => [...prev, message]);
    setMessage("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  const chatRooms = [
    {
      room: "Rich",
    },
    {
      room: "Mike",
    },
    {
      room: "Vm",
    },
    {
      room: "Yellow",
    },
    {
      room: "Violet",
    },
    {
      room: "Jenny",
    },
  ];

  return (
    <>

      <div className="min-h-[80vh] block md:flex bg-white text-black shadow-md">
        <aside className="max-w-[330px] bg-gray-100 border-r border-gray-200 text-black flex flex-col">
          <input
            type="text"
            placeholder="Search"
            className="m-4 p-2 w-[90%] rounded-md bg-white text-black placeholder:text-gray-400 border border-gray-300"
          />
          <div className="flex items-center justify-between px-4 py-2">
            <TabComponent tabs={["All", "Unread", "Starred"]}>
              {chatRooms.map((item, i) => (
                <ChatSidebarItem
                  item={item}
                  setSelectedItem={setSelectedItem}
                  setSelectedIndex={setSelectedIndex}
                  selectedIndex={selectedIndex}
                  key={i}
                  index={i}
                />
              ))}
              {chatRooms.map((item, i) => (
                <ChatSidebarItem
                  item={item}
                  setSelectedItem={setSelectedItem}
                  setSelectedIndex={setSelectedIndex}
                  selectedIndex={selectedIndex}
                  key={i}
                  index={i}
                />
              ))}
              {chatRooms.map((item, i) => (
                <ChatSidebarItem
                  item={item}
                  setSelectedItem={setSelectedItem}
                  setSelectedIndex={setSelectedIndex}
                  selectedIndex={selectedIndex}
                  key={i}
                  index={i}
                />
              ))}
            </TabComponent>
          </div>
        </aside>

        {/* Chat Panel */}
        <main className="flex-1 flex flex-col">
          <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-200 bg-white">
            <Image
              src="/mycourse/avatar.png"
              alt="X_AE_A-13b"
              width={40}
              height={40}
              className="rounded-full"
            />
            <div>
              <p className="font-semibold">{selectedItem?.room}</p>
              <p className="text-xs text-gray-500">Last seen 7h ago</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 px-6 py-4 overflow-y-auto bg-white">
            <div className="text-center text-gray-400 text-xs mb-4">
              25 April
            </div>

            {messages.map((msg, index) => (
              <div key={index} className="flex justify-end mb-2">
                <div className="bg-[#2E2C6F] text-white px-4 py-2 rounded-2xl text-sm max-w-xs">
                  {msg}
                  <div className="text-right text-[10px] mt-1 opacity-70">
                    11:25 ✓✓
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="flex items-center px-4 py-3 border-t border-gray-200 bg-white">
            <button className="mr-3">
              <Plus className="w-5 h-5 text-gray-500" />
            </button>
            <input
              type="text"
              placeholder="Write your message..."
              className="flex-1 rounded-full border border-gray-300 px-4 py-2 text-sm outline-none"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button className="ml-3">
              <Mic className="w-5 h-5 text-gray-500" />
            </button>
            <button className="ml-2" onClick={handleSend}>
              <Send className="w-5 h-5 text-[#6A5AE0]" />
            </button>
          </div>
        </main>
      </div>
    </>
  );
}
