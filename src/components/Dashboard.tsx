import  { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { deleteUser } from "../redux/userSlice";
import Overview from "./Overview";
import { Link } from "react-router-dom";

// Define types for User and Redux state
interface User {
  id: number;
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

function Dashboard() {
  const dispatch = useDispatch();

  // Access users from Redux store
  const allUsers = useSelector((state: RootState) => state.users.allUsers);
  const [currIdx, setCurrIdx] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortBy, setSortBy] = useState<"name" | "status" | null>(null);

  const usersPerPage = 5;

  // Apply sorting first
  const sortedUsers = [...allUsers].sort((a, b) => {
    if (sortBy === "name") {
      return a.name.localeCompare(b.name);
    } else if (sortBy === "status") {
      return a.status.localeCompare(b.status);
    }
    return 0; // No sorting
  });

  // Apply filtering
  const filteredUsers = sortedUsers.filter((user) => {
    return (
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const indexOfLastUser = currIdx * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const handleClick = (user: User) => {
    alert(`
      Name: ${user.name}
      Email: ${user.email}
      Status: ${user.status}
      Region: ${user.region}
      Registered At: ${user.registeredAt}
    `);
  };

  const handleDelete = (user: User) => {
    dispatch(deleteUser(user.id)); // Dispatch Redux action to delete user

    // Adjust pagination if needed
    if (currentUsers.length === 1 && currIdx > 1) {
      setCurrIdx(currIdx - 1);
    }
  };

  const handlePrevClick = () => {
    if (currIdx > 1) setCurrIdx(currIdx - 1);
  };

  const handleNextClick = () => {
    if (currIdx < totalPages) setCurrIdx(currIdx + 1);
  };

  return (
    <>
      <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white text-center p-10">
        User Dashboard
      </h1>

      {/* Overview tag */}
      <Overview />

      <div className="flex justify-center w-full">
        <div className="w-3/4 bg-gray-800 p-6 rounded-xl">
          {/* Search bar and sorting buttons */}
          <div className="flex flex-col sm:flex-row w-full justify-between items-center p-4 bg-gray-700 rounded-t-xl space-y-3 sm:space-y-0">
            {/* Search Bar */}
            <input
              type="text"
              className="bg-gray-600 text-white p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-2/5 min-w-[200px]"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            {/* Sorting Buttons */}
            <div className="flex flex-wrap justify-center sm:justify-end space-x-2">
              <button
                onClick={() => setSortBy("name")}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-auto min-w-[120px]"
              >
                Sort by Name
              </button>
              <button
                onClick={() => setSortBy("status")}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-auto min-w-[120px]"
              >
                Sort by Status
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="text-sm text-left text-gray-500 bg-gray-800 w-full">
              <thead className="text-xs text-gray-400 uppercase bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-center">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="odd:bg-gray-800 even:bg-gray-700 border-b border-gray-600"
                  >
                    <td className="px-6 py-4 font-medium text-gray-100 whitespace-nowrap">
                      {user.name}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={
                          user.status === "active"
                            ? "text-green-500 font-semibold"
                            : "text-red-500 font-semibold"
                        }
                      >
                        {user.status === "active" ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-row justify-center items-center">
                        <button
                          onClick={() => handleClick(user)}
                          className="font-medium text-blue-400 hover:underline border rounded-lg p-2"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => handleDelete(user)}
                          className="font-medium text-red-400 hover:underline ml-2 border rounded-lg p-2"
                        >
                          Delete User
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="mt-4 flex flex-col sm:flex-row items-center justify-center sm:justify-between text-center space-y-2 sm:space-y-0">
            <button
              onClick={handlePrevClick}
              disabled={currIdx === 1}
              className="text-blue-400 hover:underline border p-2 rounded-lg px-4 w-auto min-w-[100px]"
            >
              Previous
            </button>

            <span className="mx-3 italic opacity-65 text-gray-400">
              Page {currIdx} of {totalPages}
            </span>

            <button
              onClick={handleNextClick}
              disabled={currIdx === totalPages}
              className="text-blue-400 hover:underline border p-2 rounded-lg px-4 w-auto min-w-[100px]"
            >
              Next
            </button>
          </div>

          {/* Go to Analytics Button */}
          <div className="flex justify-center mt-8">
            <Link
              to="/userchart"  // Link to UserChart component
              className="bg-blue-500 text-white px-6 py-3 rounded-lg text-xl font-semibold hover:bg-blue-600"
            >
              Go to Analytics
            </Link>
          </div>
        </div>
      </div>

      <hr className="mt-20 opacity-40" />
    </>
  );
}

export default Dashboard;
