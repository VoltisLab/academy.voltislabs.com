export default function FormHeader() {
  return (
    <div className="flex items-center justify-between border-b border-gray-200 px-4 md:px-6 py-4 bg-white">
      <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>

      <div className="flex items-center gap-4">
        <button className="bg-indigo-100 text-indigo-700 font-medium text-sm px-4 py-2 rounded-md">
          Save
        </button>
        <button className="text-indigo-800 text-sm font-medium">
          Save & Preview
        </button>
      </div>
    </div>
  );
}
