import React from "react";

const AnalyticsGraphPlaceholder: React.FC<{ mini?: boolean }> = ({ mini }) => (
  <div
    className={`flex items-center justify-center bg-gray-100 rounded-lg border border-dashed border-gray-300 text-gray-400 ${mini ? "h-24" : "h-48"}`}
  >
    {mini ? "Mini Graph" : "Analytics Graph Placeholder"}
  </div>
);

export default AnalyticsGraphPlaceholder; 