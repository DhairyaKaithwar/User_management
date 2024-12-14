import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Register necessary chart components for Pie chart
ChartJS.register(ArcElement, Tooltip, Legend);

// Define types for user and Redux store
interface User {
  id: string;
  name: string;
  email: string;
  status: "active" | "inactive";
  region: string;
  registeredAt: string;
}

interface RootState {
  users: {
    allUsers: User[];
  };
}

const PieChart: React.FC = () => {
  // Access users state from Redux store
  const allUsers = useSelector((state: RootState) => state.users.allUsers);

  // State for filters
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string>("All");

  // Get unique regions for the filter dropdown
  const regions = ["All", ...new Set(allUsers.map((user) => user.region))];

  // Filter users based on date range and region
  const filteredUsers = allUsers.filter((user) => {
    const registrationDate = new Date(user.registeredAt);
    const inDateRange =
      (!startDate || registrationDate >= startDate) &&
      (!endDate || registrationDate <= endDate);
    const inRegion = selectedRegion === "All" || user.region === selectedRegion;
    return inDateRange && inRegion;
  });

  // Calculate active and inactive users based on filters
  const activeUsersCount = filteredUsers.filter((user) => user.status === "active").length;
  const inactiveUsersCount = filteredUsers.filter((user) => user.status === "inactive").length;

  // Data for Pie chart
  const data = {
    labels: ["Active Users", "Inactive Users"],
    datasets: [
      {
        data: [activeUsersCount, inactiveUsersCount],
        backgroundColor: ["#4caf50", "#f44336"],
        hoverBackgroundColor: ["#45a049", "#e53935"],
      },
    ],
  };

  // Pie chart options
  const options = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context: any) {
            return `${context.label}: ${context.raw} users`;
          },
        },
      },
    },
  };

  return (
    <div className="container mx-auto px-4">
      <h2 className="text-2xl text-left mt-12 mb-10 font-bold">
        User Status Distribution (Active vs Inactive)
      </h2>

      {/* Filters Section */}
      <div className="flex flex-col sm:flex-row sm:justify-between items-center bg-gray-100 p-4 rounded-lg shadow-md">
        {/* Date Range */}
        <div className="flex items-center space-x-4">
          <div>
            <label className="block text-gray-600 font-bold mb-1">Start Date</label>
            <DatePicker
              selected={startDate}
              onChange={(date: Date | null) => setStartDate(date)}
              isClearable
              placeholderText="Select Start Date"
              className="border rounded-lg p-2 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-gray-600 font-bold mb-1">End Date</label>
            <DatePicker
              selected={endDate}
              onChange={(date: Date | null) => setEndDate(date)}
              isClearable
              placeholderText="Select End Date"
              className="border rounded-lg p-2 focus:outline-none"
            />
          </div>
        </div>

        {/* Region Filter */}
        <div className="mt-4 sm:mt-0 text-gray-600">
          <label className="block text-gray-600 font-bold mb-1">Region</label>
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="border rounded-lg p-2 focus:outline-none"
          >
            {regions.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Pie Chart Section */}
      <div className="bg-white p-6 mt-8 rounded-lg shadow-lg">
        <Pie className="w-72 h-72 mx-auto" data={data} options={options} />
      </div>
    </div>
  );
};

export default PieChart;
