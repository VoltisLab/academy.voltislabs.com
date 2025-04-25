export default function CourseBasicInfoForm() {
  return (
    <form className="space-y-6 text-sm text-gray-800">
      {/* Title */}
      <div>
        <label className="block font-medium mb-1">Title</label>
        <input
          type="text"
          placeholder="You course title"
          maxLength={80}
          className="w-full p-3 border border-gray-300 rounded-md"
        />
        <p className="text-right text-xs text-gray-400 mt-1">0/80</p>
      </div>

      {/* Subtitle */}
      <div>
        <label className="block font-medium mb-1">Subtitle</label>
        <input
          type="text"
          placeholder="You course subtitle"
          maxLength={120}
          className="w-full p-3 border border-gray-300 rounded-md"
        />
        <p className="text-right text-xs text-gray-400 mt-1">0/120</p>
      </div>

      {/* Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block font-medium mb-1">Course Category</label>
          <select className="w-full p-3 border border-gray-300 rounded-md">
            <option>Select...</option>
          </select>
        </div>
        <div>
          <label className="block font-medium mb-1">Course Sub-category</label>
          <select className="w-full p-3 border border-gray-300 rounded-md">
            <option>Select...</option>
          </select>
        </div>
      </div>

      {/* Topic */}
      <div>
        <label className="block font-medium mb-1">Course Topic</label>
        <input
          type="text"
          placeholder="What is primarily taught in your course?"
          className="w-full p-3 border border-gray-300 rounded-md"
        />
      </div>

      {/* Languages and Level */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block font-medium mb-1">Course Language</label>
          <select className="w-full p-3 border border-gray-300 rounded-md">
            <option>Select...</option>
          </select>
        </div>
        <div>
          <label className="block font-medium mb-1">Subtitle Language (Optional)</label>
          <select className="w-full p-3 border border-gray-300 rounded-md">
            <option>Select...</option>
          </select>
        </div>
        <div>
          <label className="block font-medium mb-1">Course Level</label>
          <select className="w-full p-3 border border-gray-300 rounded-md">
            <option>Select...</option>
          </select>
        </div>
        <div>
          <label className="block font-medium mb-1">Durations</label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Course durations"
              className="flex-1 p-3 border border-gray-300 rounded-md"
            />
            <select className="w-24 p-3 border border-gray-300 rounded-md">
              <option>Day</option>
              <option>Week</option>
              <option>Month</option>
            </select>
          </div>
        </div>
      </div>
    </form>
  );
}
