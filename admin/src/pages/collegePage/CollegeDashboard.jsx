import React from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { API } from "../../utility";
import Loading from "../../components/Loading";
import { FaArrowRightLong } from "react-icons/fa6";
import { Link } from "react-router-dom";

const CollegeDashboard = () => {
  const fetchData = async () => {
    try {
      const response = await axios.get(`${API}/college/application`);
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw new Error("Failed to fetch data");
    }
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["applicationsDash"],
    queryFn: fetchData,
  });

  const countStatuses = (data) => {
    let approved = 0;
    let rejected = 0;
    let pending = 0;

    data?.forEach((app) => {
      if (app.college_status === "approved") {
        approved++;
      } else if (app.college_status === "rejected") {
        rejected++;
      } else if (app.college_status === "pending") {
        pending++;
      }
    });

    return { approved, rejected, pending };
  };

  const { approved, rejected, pending } = data
    ? countStatuses(data)
    : { approved: 0, rejected: 0, pending: 0 };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-semibold mb-8 text-center text-gray-900 dark:text-white">
        College Dashboard
      </h1>
      {isLoading ? (
        <div className="flex justify-center">
          <Loading />
        </div>
      ) : isError ? (
        <p className="text-red-500 text-center">Error fetching data.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div className="bg-green-500 text-white p-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300 dark:bg-green-700">
            <p className="text-4xl font-semibold flex justify-center w-full">
              <span className="bg-green-600 py-2 px-3 rounded-lg shadow-lg dark:bg-green-800">
                {approved}
              </span>
            </p>
            <h2 className="text-lg font-bold mb-2 text-center my-1 text-gray-900 dark:text-white">
              Approved Applications
            </h2>
            <Link
              to="/application/list"
              className="bg-green-600 mt-8 w-fit p-2 rounded-md flex items-center gap-2 font-bold mb-2 justify-end dark:bg-green-800 dark:hover:bg-green-700"
            >
              <p>View</p>
              <FaArrowRightLong />
            </Link>
          </div>
          <div className="bg-red-500 text-white p-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300 dark:bg-red-700">
            <p className="text-4xl font-semibold flex justify-center w-full">
              <span className="bg-red-600 py-2 px-3 rounded-lg shadow-lg dark:bg-red-800">
                {rejected}
              </span>
            </p>
            <h2 className="text-lg font-bold mb-2 text-center my-1 text-gray-900 dark:text-white">
              Rejected Applications
            </h2>
            <Link
              to="/application/list"
              className="bg-red-600 mt-8 w-fit p-2 rounded-md flex items-center gap-2 font-bold mb-2 justify-end dark:bg-red-800 dark:hover:bg-red-700"
            >
              <p>View</p>
              <FaArrowRightLong />
            </Link>
          </div>
          <div className="bg-yellow-500 text-white p-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300 dark:bg-yellow-700">
            <p className="text-4xl font-semibold flex justify-center w-full">
              <span className="bg-yellow-600 py-2 px-3 rounded-lg shadow-lg dark:bg-yellow-800">
                {pending}
              </span>
            </p>
            <h2 className="text-lg font-bold mb-2 text-center my-1 text-gray-900 dark:text-white">
              Pending Applications
            </h2>
            <Link
              to="/application/list"
              className="bg-yellow-600 mt-8 w-fit p-2 rounded-md flex items-center gap-2 font-bold mb-2 justify-end dark:bg-yellow-800 dark:hover:bg-yellow-700"
            >
              <p>View</p>
              <FaArrowRightLong />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollegeDashboard;
