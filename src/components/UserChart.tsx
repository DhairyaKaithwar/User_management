import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ChartOptions } from "chart.js";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import PieChart from "./PieChart";
import BarGraph from "./BarGraph";

// Register necessary chart components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

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

const UserChart: React.FC = () => {
  const allUsers = useSelector((state: RootState) => state.users.allUsers);

  // State for date range and region filter
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string>("All");

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

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

  // Prepare the data for the chart
  const registrationsPerMonth = [];
  const currentDate = new Date();
  for (let i = 5; i >= 0; i--) {
    const month = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
    const monthString = `${months[month.getMonth()]} ${month.getFullYear()}`;
    registrationsPerMonth.push({
      month: monthString,
      count: filteredUsers.filter((user) => {
        const registrationDate = new Date(user.registeredAt);
        return (
          registrationDate.getFullYear() === month.getFullYear() &&
          registrationDate.getMonth() === month.getMonth()
        );
      }).length,
    });
  }

  // Chart.js data format
  const data = {
    labels: registrationsPerMonth.map((entry) => entry.month),
    datasets: [
      {
        label: "User Registrations",
        data: registrationsPerMonth.map((entry) => entry.count),
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  // Correct typing for options
  const options: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      tooltip: {
        callbacks: {
          label: (context: any) => `Registrations: ${context.raw}`,
        },
      },
    },
    scales: { y: { beginAtZero: true } },
  };

  return (
    <>
    <div className="container mx-auto px-4">
      <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-white text-center pt-14">
        User Analytics
      </h1>
      <h2 className="text-2xl text-left mt-20 mb-10 font-bold">User Registration Trend</h2>

      {/* Filters Section */}
      <div className="flex flex-col sm:flex-row sm:justify-between items-center bg-gray-100 p-4 rounded-lg shadow-md text-gray-400">
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
        <div className="mt-4 sm:mt-0">
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

      {/* Chart Section */}
      <div className="bg-white p-6 mt-8 rounded-lg shadow-lg">
        <Line data={data} options={options} />
      </div>
    </div>
    <PieChart />
    <BarGraph />
    </>
  );
};

export default UserChart;
