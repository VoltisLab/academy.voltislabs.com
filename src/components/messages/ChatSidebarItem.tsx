import Image from "next/image";

export default function ChatSidebarItem({
  setSelectedIndex,
  item,
  setSelectedItem,
  index,
  selectedIndex,
}: {
  setSelectedIndex: (id:number) => void;
  index: number;
  item: any;
  setSelectedItem: (item: any) => void;
  selectedIndex: number;
}) {
    const setItem = ()=>{
        setSelectedIndex(index);
        setSelectedItem(item);
    }
  const selected = index === selectedIndex;
  return (
    <div
      onClick={setItem}
      className={`flex items-center gap-3 p-3 border-b border-gray-200 transition cursor-pointer ${
        selected ? "bg-[#E5E7F9] text-black" : ""
      }`}
    >
      <Image
        src="/mycourse/avatar.png"
        alt="avatar"
        width={40}
        height={40}
        className="rounded-full"
      />
      <div className="flex-1">
        <div className="flex justify-between items-center">
          <p className="font-semibold text-sm truncate w-[140px]">
            Name {index + 1}
          </p>
          <span className="text-xs text-gray-500">12:25</span>
        </div>
        <p className="text-xs text-gray-500 truncate">
          Enter your message description here...
        </p>
      </div>
      {/* {index === 2 && (
        <div className="text-xs bg-[#6A5AE0] p-2 text-white rounded-full w-5 h-5 flex items-center justify-center">
          8
        </div>
      )} */}
    </div>
  );
}
