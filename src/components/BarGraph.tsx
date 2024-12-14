import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartOptions } from "chart.js";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Register necessary chart components for Bar chart
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Define the structure of User object and RootState for Redux store
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

function BarGraph() {
  // Access users state from Redux store
  const allUsers = useSelector((state: RootState) => state.users.allUsers);

  // State for filters
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string>("All");

  // Get unique regions for the region dropdown filter
  const regionsList = ["All", ...Array.from(new Set(allUsers.map((user) => String(user.region || "Unknown"))))];

  // Filter users based on date range and region
  const filteredUsers = allUsers.filter((user) => {
    const registrationDate = new Date(user.registeredAt);
    const inDateRange =
      (!startDate || registrationDate >= startDate) &&
      (!endDate || registrationDate <= endDate);
    const inRegion = selectedRegion === "All" || user.region === selectedRegion;
    return inDateRange && inRegion;
  });

  // Prepare region data for Bar chart after filtering
  const regionData: Record<string, number> = filteredUsers.reduce<Record<string, number>>((acc, user) => {
    const region = user.region || "Unknown";
    acc[region] = (acc[region] || 0) + 1;
    return acc;
  }, {});

  // Extract regions and the count of users per region
  const regions = Object.keys(regionData);
  const userCounts = Object.values(regionData);

  // Data for Bar chart
  const data = {
    labels: regions,
    datasets: [
      {
        label: "Users per Region",
        data: userCounts,
        backgroundColor: "#4caf50", // Green color for bars
        borderColor: "#388e3c", // Darker green for borders
        borderWidth: 1,
      },
    ],
  };

  // Bar chart options with correct typing
  const options: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "User Distribution by Region",
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            return `${context.label}: ${context.raw} users`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="container mx-auto px-4">
      <h2 className="text-left text-2xl font-bold mt-12 mb-6">User Distribution by Region</h2>

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
            {regionsList.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Bar Chart Section */}
      <div className="bg-white p-6 mt-8 rounded-lg shadow-lg">
        <Bar className="w-full h-full mx-auto" data={data} options={options} />
      </div>
    </div>
  );
}

export default BarGraph;
