import React, { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from "recharts";
import { Star, Users, CheckCircle, DollarSign } from "lucide-react";

const data = [
  { month: "Jan", enrollments: 40, completions: 20, revenue: 400, rating: 4.5 },
  { month: "Feb", enrollments: 60, completions: 35, revenue: 600, rating: 4.6 },
  { month: "Mar", enrollments: 100, completions: 80, revenue: 1200, rating: 4.7 },
  { month: "Apr", enrollments: 30, completions: 15, revenue: 300, rating: 4.4 },
  { month: "May", enrollments: 120, completions: 90, revenue: 1500, rating: 4.8 },
  { month: "Jun", enrollments: 90, completions: 70, revenue: 1100, rating: 4.6 },
  { month: "Jul", enrollments: 80, completions: 60, revenue: 1000, rating: 4.7 },
  { month: "Aug", enrollments: 70, completions: 50, revenue: 900, rating: 4.5 },
  { month: "Sep", enrollments: 100, completions: 80, revenue: 1300, rating: 4.8 },
  { month: "Oct", enrollments: 50, completions: 30, revenue: 500, rating: 4.3 },
  { month: "Nov", enrollments: 60, completions: 40, revenue: 700, rating: 4.4 },
  { month: "Dec", enrollments: 80, completions: 60, revenue: 900, rating: 4.6 },
];

const brandBlue = "#313273";
const brandPurple = "#786AED";

export default function CourseAnalyticsChart() {
  const [activeIndex, setActiveIndex] = useState(data.length - 1);
  const activeData = data[activeIndex];

  return (
    <div className="bg-white w-full">
           <h3 className="text-lg font-bold text-[#313273]">Course Analytics</h3>
      <div className="flex flex-col items-end mb-6 gap-2">
          <div className="grid grid-cols-2 gap-x-2 gap-y-2 w-full max-w-xs">
            <div className="flex items-center gap-1 justify-end">
              <Users className="w-3 h-3 text-[#313273]" />
              <span className="text-xs text-gray-500">Total Enrollments:</span>
              <span className="font-bold ml-1 text-xs" style={{ color: '#313273' }}>{data.reduce((a, b) => a + b.enrollments, 0)}</span>
            </div>
            <div className="flex items-center gap-1 justify-end col-span-3 sm:col-span-1">
              <DollarSign className="w-3 h-3 text-[#313273]" />
              <span className="text-xs text-gray-500">Revenue:</span>
              <span className="font-bold ml-1 text-xs" style={{ color: '#313273' }}>${data.reduce((a, b) => a + b.revenue, 0)}</span>
            </div>
            <div className="flex items-center gap-1 justify-end">
              <CheckCircle className="w-3 h-3 text-[#313273]" />
              <span className="text-xs text-gray-500">Total Completions:</span>
              <span className="font-bold ml-1 text-xs" style={{ color: '#313273' }}>{data.reduce((a, b) => a + b.completions, 0)}</span>
            </div>
            <div className="flex items-center gap-1 justify-end">
              <Star className="w-3 h-3 text-yellow-500 fill-yellow-400" />
              <span className="text-xs text-gray-500">Avg. Rating:</span>
              <span className="font-bold ml-1 text-xs" style={{ color: '#313273' }}>{(data.reduce((a, b) => a + b.rating, 0) / data.length).toFixed(2)}</span>
            </div>          
          </div>
        </div>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          onMouseMove={state => {
            if (
              state &&
              typeof state.activeTooltipIndex === 'number' &&
              data[state.activeTooltipIndex]
            ) {
              setActiveIndex(state.activeTooltipIndex);
            }
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748b' }} />
          <YAxis tick={{ fontSize: 12, fill: '#64748b' }} />
          <Tooltip
            contentStyle={{ borderRadius: 12, background: '#fff', border: '1px solid #e5e7eb', fontSize: 13 }}
            labelStyle={{ fontWeight: 'bold', color: brandBlue }}
          />
          <Legend verticalAlign="top" height={30} iconType="circle" wrapperStyle={{ fontSize: 13 }} />
          <Bar dataKey="enrollments" name="Enrollments" fill={brandBlue} radius={[6, 6, 0, 0]} barSize={24} />
          <Bar dataKey="completions" name="Completions" fill={brandPurple} radius={[6, 6, 0, 0]} barSize={24} />
        </BarChart>
      </ResponsiveContainer>
      <div className="mt-6 text-xs text-gray-700 flex flex-wrap gap-4 items-center">
        {activeData ? (
          <>
            <span className="font-bold text-[#313273]">{activeData.month} Summary:</span>
            <span>Enrollments: <span className="font-bold text-blue-700">{activeData.enrollments}</span></span>
            <span>Completions: <span className="font-bold text-purple-700">{activeData.completions}</span></span>
            <span>Revenue: <span className="font-bold text-green-700">${activeData.revenue}</span></span>
            <span>Avg. Rating: <span className="font-bold text-yellow-600">{activeData.rating}</span></span>
          </>
        ) : (
          <span className="text-gray-400">No data available for this month.</span>
        )}
      </div>
    </div>
  );
} 