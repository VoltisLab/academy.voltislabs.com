import { motion } from "framer-motion";

export function Loader() {
  return (
    <motion.div
      className="flex flex-col items-center justify-center py-24"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <svg className="animate-spin h-10 w-10 text-purple-400 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-30" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
        <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
      </svg>
      <div className="text-sm text-gray-500">Loading courses...</div>
    </motion.div>
  );
}
