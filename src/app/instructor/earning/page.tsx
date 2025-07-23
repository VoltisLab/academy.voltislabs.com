"use client";

import { useState, useEffect, useRef } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts";
import { Calendar, DollarSign, Download, Filter, Loader2 } from "lucide-react";
import { DateRange, Range } from "react-date-range";
import { format, subMonths } from "date-fns";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { toast } from "react-hot-toast";

// Mock data
const earningsData = [
  { month: "Jan", earnings: 1250, students: 45, courses: 3 },
  { month: "Feb", earnings: 1890, students: 62, courses: 4 },
  { month: "Mar", earnings: 2100, students: 78, courses: 5 },
  { month: "Apr", earnings: 1780, students: 65, courses: 4 },
  { month: "May", earnings: 2450, students: 92, courses: 6 },
  { month: "Jun", earnings: 3120, students: 115, courses: 7 },
  { month: "Jul", earnings: 2870, students: 104, courses: 6 },
];

const transactions = [
  {
    id: "TXN-001",
    date: "2023-07-15",
    course: "Advanced React",
    amount: 420,
    status: "Paid",
    method: "Bank Transfer",
  },
  {
    id: "TXN-002",
    date: "2023-07-10",
    course: "Node.js Fundamentals",
    amount: 380,
    status: "Paid",
    method: "Bank Transfer",
  },
  {
    id: "TXN-003",
    date: "2023-07-05",
    course: "UI/UX Design",
    amount: 290,
    status: "Pending",
    method: "PayPal",
  },
  {
    id: "TXN-004",
    date: "2023-06-28",
    course: "Advanced React",
    amount: 420,
    status: "Paid",
    method: "Bank Transfer",
  },
  {
    id: "TXN-005",
    date: "2023-06-20",
    course: "JavaScript Basics",
    amount: 180,
    status: "Paid",
    method: "PayPal",
  },
  {
    id: "TXN-006",
    date: "2023-06-15",
    course: "Node.js Fundamentals",
    amount: 380,
    status: "Paid",
    method: "Bank Transfer",
  },
  {
    id: "TXN-007",
    date: "2023-06-05",
    course: "UI/UX Design",
    amount: 290,
    status: "Paid",
    method: "PayPal",
  },
];

const payoutMethods = [
  { id: "bank", name: "Bank Transfer", details: "**** **** **** 1234" },
  { id: "paypal", name: "PayPal", details: "instructor@example.com" },
];

const currencies = ["USD", "NGN", "EUR", "GBP", "CAD"];
const payoutSchedules = ["Weekly", "Bi-weekly", "Monthly", "Quarterly"];

export default function EarningsPage() {
  const [dateRange, setDateRange] = useState<Range[]>([
    {
      startDate: subMonths(new Date(), 3),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingSched, setLoadingSched] = useState(false);
  // const [loadingApply, setLoadingApply] = useState(false);
  // const [loading, setLoading] = useState(false);

  const [activeChart, setActiveChart] = useState("bar");
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilterSelect, setShowFilterSelect] = useState(false);
  const [showCurrencySelect, setShowCurrencySelect] = useState(false);
  const [showScheduleSelect, setShowScheduleSelect] = useState(false);
  const [editingMethod, setEditingMethod] = useState<string | null>(null);
  const [currency, setCurrency] = useState("USD");
  const [payoutThreshold, setPayoutThreshold] = useState(100);
  const [schedule, setSchedule] = useState("Monthly");
  const [showPayoutMethods, setShowPayoutMethods] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState(payoutMethods[0]);

  // Refs for click outside detection
  const datePickerRef = useRef<HTMLDivElement>(null);
  const filterSelectRef = useRef<HTMLDivElement>(null);
  const currencySelectRef = useRef<HTMLDivElement>(null);
  const scheduleSelectRef = useRef<HTMLDivElement>(null);
  const payoutMethodsRef = useRef<HTMLDivElement>(null);

  // Calculate summary metrics
  const totalEarnings = earningsData.reduce(
    (sum, month) => sum + month.earnings,
    0
  );
  const avgMonthlyEarnings = Math.round(totalEarnings / earningsData.length);
  const totalStudents = earningsData.reduce(
    (sum, month) => sum + month.students,
    0
  );
  const totalCourses = earningsData.reduce(
    (sum, month) => sum + month.courses,
    0
  );

  // Filter transactions
  const filteredTransactions = transactions.filter((txn) => {
    const matchesStatus =
      filter === "all" || txn.status.toLowerCase() === filter;
    const matchesSearch =
      txn.course.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Handle click outside for dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        datePickerRef.current &&
        !datePickerRef.current.contains(event.target as Node)
      ) {
        setShowDatePicker(false);
      }
      if (
        filterSelectRef.current &&
        !filterSelectRef.current.contains(event.target as Node)
      ) {
        setShowFilterSelect(false);
      }
      if (
        currencySelectRef.current &&
        !currencySelectRef.current.contains(event.target as Node)
      ) {
        setShowCurrencySelect(false);
      }
      if (
        scheduleSelectRef.current &&
        !scheduleSelectRef.current.contains(event.target as Node)
      ) {
        setShowScheduleSelect(false);
      }

      if (
        payoutMethodsRef.current &&
        !payoutMethodsRef.current.contains(event.target as Node)
      ) {
        setShowPayoutMethods(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleDateApply = () => {
    setLoading(true);
    setShowDatePicker(false);
    setTimeout(() => {
      setLoading(false);
      toast.success("Date range updated");
    }, 1000);
  };

  const handleExport = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Export completed");
    }, 1500);
  };

  const handleEditMethod = (methodId: string) => {
    setEditingMethod(methodId === editingMethod ? null : methodId);
  };

  const handleSavePayoutThreshold = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Payout threshold updated");
    }, 1000);
  };

  const handleSavePayoutSchedule = () => {
    setLoadingSched(true);
    setTimeout(() => {
      setLoadingSched(false);
      toast.success("Payout schedule updated");
    }, 1000);
  };

  return (
    <div className="space-y-8 p-4">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Earnings</h1>
          <p className="text-gray-600">Track your earnings and transactions</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div ref={datePickerRef}>
            <button
              onClick={() => setShowDatePicker(!showDatePicker)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-sm font-medium"
            >
              <Calendar className="h-4 w-4" />
              {dateRange[0].startDate && dateRange[0].endDate ? (
                <>
                  {format(dateRange[0].startDate, "MMM d, yyyy")} -{" "}
                  {format(dateRange[0].endDate, "MMM d, yyyy")}
                </>
              ) : (
                "Select a date range"
              )}
            </button>

            {showDatePicker && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0 bg-black bg-opacity-50 lg:absolute lg:inset-auto lg:mt-2 lg:bg-transparent">
                <div
                  ref={datePickerRef}
                  className="w-full max-w-md bg-white p-4 rounded-lg shadow-lg overflow-auto"
                >
                  <DateRange
                    editableDateInputs={true}
                    onChange={(item) => setDateRange([item.selection])}
                    moveRangeOnFirstSelection={false}
                    ranges={dateRange}
                    rangeColors={["#4F46E5"]}
                    maxDate={new Date()}
                    className="w-full" // Ensure DateRange fills its container
                  />
                  <div className="flex justify-end gap-2 mt-2">
                    <button
                      onClick={() => setShowDatePicker(false)}
                      className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDateApply}
                      className="px-3 py-1 bg-[#4F46E5] text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* {showDatePicker && (
              <div className="absolute z-10 mt-2 bg-white p-4 border rounded-lg shadow-lg">
                <DateRange
                  editableDateInputs={true}
                  onChange={(item) => setDateRange([item.selection])}
                  moveRangeOnFirstSelection={false}
                  ranges={dateRange}
                  rangeColors={["#4F46E5"]}
                  maxDate={new Date()}
                />
                <div className="flex justify-end gap-2 mt-2">
                  <button
                    onClick={() => setShowDatePicker(false)}
                    className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDateApply}
                    className="px-3 py-1 bg-[#4F46E5] text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                  >
                    Apply
                  </button>
                </div>
              </div>
            )} */}
          </div>
          <button
            onClick={handleExport}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-[#4F46E5] text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium disabled:opacity-70"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            Export
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            title: "Total Earnings",
            value: `${
              currency === "USD"
                ? "$"
                : currency === "NGN"
                ? "₦"
                : currency === "EUR"
                ? "€"
                : currency === "GBP"
                ? "£"
                : "CA$"
            }${totalEarnings.toLocaleString()}`,
            icon: <DollarSign className="h-6 w-6 text-green-600" />,
            bg: "bg-green-100",
            change: "+12% from last period",
          },
          {
            title: "Avg Monthly",
            value: `${
              currency === "USD"
                ? "$"
                : currency === "NGN"
                ? "₦"
                : currency === "EUR"
                ? "€"
                : currency === "GBP"
                ? "£"
                : "CA$"
            }${avgMonthlyEarnings.toLocaleString()}`,
            icon: <DollarSign className="h-6 w-6 text-[#4F46E5]" />,
            bg: "bg-blue-100",
            change: "+8% from last period",
          },
          {
            title: "Total Students",
            value: totalStudents,
            icon: (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-purple-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            ),
            bg: "bg-purple-100",
            change: "+15% from last period",
          },
          {
            title: "Courses Enrolled",
            value: totalCourses,
            icon: (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-orange-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            ),
            bg: "bg-orange-100",
            change: "+5% from last period",
          },
        ].map((card, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  {card.title}
                </p>
                <p className="text-2xl font-bold mt-1">{card.value}</p>
              </div>
              <div className={`${card.bg} p-3 rounded-full`}>{card.icon}</div>
            </div>
            <p className="text-sm text-gray-500 mt-2">{card.change}</p>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h2 className="text-lg font-semibold">Earnings Overview</h2>
          <div className="flex gap-2 mt-3 md:mt-0">
            {["bar", "line", "area"].map((type) => (
              <button
                key={type}
                onClick={() => setActiveChart(type)}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  activeChart === type
                    ? "bg-[#4F46E5] text-white"
                    : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            {activeChart === "bar" ? (
              <BarChart data={earningsData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="earnings" fill="#8884d8" name="Earnings ($)" />
                <Bar dataKey="students" fill="#82ca9d" name="Students" />
              </BarChart>
            ) : activeChart === "line" ? (
              <LineChart data={earningsData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="earnings"
                  stroke="#8884d8"
                  strokeWidth={2}
                  name="Earnings ($)"
                />
                <Line
                  type="monotone"
                  dataKey="students"
                  stroke="#82ca9d"
                  strokeWidth={2}
                  name="Students"
                />
              </LineChart>
            ) : (
              <AreaChart data={earningsData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="earnings"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.2}
                  name="Earnings ($)"
                />
                <Area
                  type="monotone"
                  dataKey="students"
                  stroke="#82ca9d"
                  fill="#82ca9d"
                  fillOpacity={0.2}
                  name="Students"
                />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Transactions Section */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h2 className="text-lg font-semibold">Transaction History</h2>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search transactions..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Filter className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
            <div className="relative" ref={filterSelectRef}>
              <button
                onClick={() => setShowFilterSelect(!showFilterSelect)}
                className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-sm w-full md:w-48 justify-between"
              >
                <span>
                  {filter === "all"
                    ? "All Transactions"
                    : filter === "paid"
                    ? "Paid"
                    : "Pending"}
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {showFilterSelect && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg">
                  {["all", "paid", "pending"].map((option) => (
                    <div
                      key={option}
                      onClick={() => {
                        setFilter(option);
                        setShowFilterSelect(false);
                      }}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                    >
                      {option === "all"
                        ? "All Transactions"
                        : option === "paid"
                        ? "Paid"
                        : "Pending"}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Transaction ID
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Date
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Course
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Amount
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Method
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((txn) => (
                  <tr key={txn.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {txn.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(txn.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {txn.course}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${txn.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          txn.status === "Paid"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {txn.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {txn.method}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-4 text-center text-sm text-gray-500"
                  >
                    No transactions found matching your criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payout Settings Section */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <h2 className="text-lg font-semibold mb-6">Payout Settings</h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-md font-medium mb-4">Payout Methods</h3>
            <div className="relative" ref={payoutMethodsRef}>
              <button
                onClick={() => setShowPayoutMethods(!showPayoutMethods)}
                className="flex items-center justify-between w-full px-4 py-3 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <div>
                  <p className="font-medium text-left">{selectedMethod.name}</p>
                  <p className="text-sm text-gray-500 text-left">
                    {selectedMethod.details}
                  </p>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-5 w-5 text-gray-400 transition-transform ${
                    showPayoutMethods ? "rotate-180" : ""
                  }`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {showPayoutMethods && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
                  {payoutMethods.map((method) => (
                    <div
                      key={method.id}
                      onClick={() => {
                        setSelectedMethod(method);
                        setShowPayoutMethods(false);
                      }}
                      className={`px-4 py-3 cursor-pointer hover:bg-gray-50 ${
                        selectedMethod.id === method.id ? "bg-blue-50" : ""
                      }`}
                    >
                      <p className="font-medium">{method.name}</p>
                      <p className="text-sm text-gray-500">{method.details}</p>
                    </div>
                  ))}
                  <div className="border-t border-gray-200">
                    <button
                      onClick={() => {
                        setEditingMethod(selectedMethod.id);
                        setShowPayoutMethods(false);
                      }}
                      className="w-full px-4 py-2 text-left text-[#4F46E5] hover:bg-blue-50 rounded-b-md"
                    >
                      Edit Selected Method
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Edit Form (shown when editing) */}
            {editingMethod && (
              <div className="mt-4 p-4 border border-gray-200 rounded-md bg-gray-50">
                <h4 className="font-medium mb-3">
                  Edit {selectedMethod.name} Details
                </h4>
                <input
                  type="text"
                  defaultValue={selectedMethod.details}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={
                    selectedMethod.id === "bank"
                      ? "Enter bank account details"
                      : "Enter PayPal email"
                  }
                />
                <div className="flex justify-end gap-2 mt-3">
                  <button
                    onClick={() => setEditingMethod(null)}
                    className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      // Here you would typically save to your backend
                      toast.success(
                        `${selectedMethod.name} details updated successfully`
                      );
                      setEditingMethod(null);
                    }}
                    className="px-3 py-1 bg-[#4F46E5] text-white rounded-md hover:bg-blue-700"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            )}
          </div>

          <div>
            <h3 className="text-md font-medium mb-4">Payout Threshold</h3>
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <div className="flex-1">
                <p className="text-sm text-gray-500 mb-2">
                  Minimum balance required before payout is processed
                </p>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={payoutThreshold}
                    onChange={(e) => setPayoutThreshold(Number(e.target.value))}
                    className="w-24 px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div className="relative" ref={currencySelectRef}>
                    <button
                      onClick={() => setShowCurrencySelect(!showCurrencySelect)}
                      className="flex items-center gap-1 px-2 py-1 border border-gray-300 rounded-md hover:bg-gray-50 text-sm"
                    >
                      {currency}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                    {showCurrencySelect && (
                      <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg">
                        {currencies.map((curr) => (
                          <div
                            key={curr}
                            onClick={() => {
                              setCurrency(curr);
                              setShowCurrencySelect(false);
                            }}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                          >
                            {curr}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <button
                onClick={handleSavePayoutThreshold}
                disabled={loading}
                className="px-4 py-2 bg-[#4F46E5] text-white rounded-md hover:bg-blue-700 text-sm disabled:opacity-70"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Save"
                )}
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-md font-medium mb-4">Payout Schedule</h3>
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <div className="flex-1">
                <p className="text-sm text-gray-500 mb-2">
                  How often you'd like to receive payouts
                </p>
                <div
                  className="relative"
                  // ref={scheduleSelectRef}
                >
                  <button
                    onClick={() => setShowScheduleSelect(!showScheduleSelect)}
                    className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-sm w-full md:w-48 justify-between"
                  >
                    <span>{schedule}</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  {showScheduleSelect && (
                    <div className="relative z-10 mt-1 w-full md:w-48 bg-white border border-gray-200 rounded-md shadow-lg">
                      {payoutSchedules.map((sched) => (
                        <div
                          key={sched}
                          onClick={() => {
                            setSchedule(sched);
                            setShowScheduleSelect(false);
                          }}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                        >
                          {sched}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={handleSavePayoutSchedule}
                disabled={loadingSched}
                className="px-4 py-2 bg-[#4F46E5] text-white rounded-md hover:bg-blue-700 text-sm disabled:opacity-70"
              >
                {loadingSched ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Save"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
