export default function FormFooterButtons() {
  return (
    <div className="flex items-center justify-between px-4 md:px-6 py-4 border-t border-gray-200 bg-white">
      <button className="text-gray-500 font-medium text-sm px-5 py-2 rounded-md hover:bg-gray-100">
        Cancel
      </button>
      <button className="bg-[#2E2C6F] text-white font-medium text-sm px-6 py-2 rounded-md hover:bg-[#25235a]">
        Save & Next
      </button>
    </div>
  );
}
