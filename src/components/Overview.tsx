import React from "react";
import { useSelector } from "react-redux";

// Define types for Redux state
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
    deletedUsers: User[];
  };
}

function Overview() {
  // Access users state from Redux store
  const allUsers = useSelector((state: RootState) => state.users.allUsers);
  const deletedUsers = useSelector((state: RootState) => state.users.deletedUsers);

  // Calculate active and deleted user counts
  const activeNumbers = allUsers.reduce((count, curr) => {
    if (curr.status === "active") {
      return count + 1;
    }
    return count;
  }, 0);

  const deletedCount = deletedUsers.length;

  return (
    <>
      <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-white text-center pt-14">
        Overview
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-6 mb-7">
        {/* Total Users Card */}
        <div className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Total Users
          </h5>
          <p className="font-normal text-gray-700 dark:text-gray-400">
            {allUsers?.length || 0}
          </p>
        </div>

        {/* Active Users Card */}
        <div className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Active Users
          </h5>
          <p className="font-normal text-gray-700 dark:text-gray-400">
            {activeNumbers || 0}
          </p>
        </div>

        {/* Deleted Users Card */}
        <div className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Deleted Users
          </h5>
          <p className="font-normal text-gray-700 dark:text-gray-400">
            {deletedCount || 0}
          </p>
        </div>
      </div>
    </>
  );
}

export default Overview;
