import { motion } from "framer-motion";

const statusFilters = [
  { label: "All", value: "ALL", color: "bg-gray-400" },
  { label: "Draft", value: "DRAFT", color: "bg-red-400" },
  { label: "Published", value: "PUBLISHED", color: "bg-green-500" },
  { label: "Pending", value: "PROCESSING", color: "bg-yellow-400" },
];

export function StatusSegmentedControl({ filters, setFilters, setPageNumber }: any) {
  const activeValue = filters?.status ?? "ALL";

  return (
    <div className="
      md:absolute relative flex gap-1.5 rounded-full bg-white/60
      backdrop-blur-md border border-gray-100 shadow-md
      px-2 py-1 w-fit lg:mx-6 mx-0 overflow-x-auto min-w-[220px] 
    ">
      {statusFilters.map((filter) => {
        const active = activeValue === filter.value;
        return (
          <button
            key={filter.value}
            onClick={() => {
              setFilters((prev: any) => ({
                ...prev,
                status: filter.value === "ALL" ? undefined : filter.value,
              }));
              setPageNumber(1);
            }}
            className={`
              relative z-10 flex items-center gap-1 px-3 md:px-4 py-1.5 rounded-full font-medium text-sm
              transition-colors duration-200 select-none
              ${active
                ? "text-purple-700"
                : "text-gray-600 hover:bg-gray-50"
              }
            `}
            style={{
              position: "relative",
            }}
          >
            {active && (
              <motion.div
                layoutId="status-pill"
                className="absolute inset-0 z-[-1] rounded-full bg-gradient-to-tr from-purple-100/80 to-purple-200/80 shadow"
                transition={{
                  type: "spring",
                  stiffness: 550,
                  damping: 38,
                }}
              />
            )}
            <span
              className={`
                w-2 h-2 rounded-full ${filter.color}
                transition ${active ? "scale-110" : "opacity-60"}
              `}
            ></span>
            {filter.label}
          </button>
        );
      })}
    </div>
  );
}
