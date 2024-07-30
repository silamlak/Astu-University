import axios from "axios";
import React from "react";
import { API_STUDENT } from "../Services/utility";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";

const RemainingPage = () => {
  const auth = useSelector((state) => state.auth.user);

  const checkinPage = async (d) => {
    try {
      const res = await axios.post(`${API_STUDENT}/student/remain/page`, {
        id: d,
      });
      return res.data;
    } catch (error) {
      console.error(error);
    }
  };

  const { data, isLoading } = useQuery({
    queryKey: ["remainingPage"],
    queryFn: () => checkinPage(auth._id),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg text-gray-700 dark:text-gray-300">
        Loading...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex justify-center items-center h-screen text-lg text-gray-700 dark:text-gray-300">
        No data available
      </div>
    );
  }

  const { remainingTime } = data;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 dark:bg-gray-900">
      <h1 className="text-3xl font-bold mb-4 text-gray-800 dark:text-gray-100">
        Remaining Time
      </h1>
      <div className="bg-white shadow-md rounded-lg p-6 dark:bg-gray-800 dark:text-gray-200">
        <div className="flex items-center gap-4 justify-center">
          <div className="flex items-center">
            <span className="text-lg font-medium text-gray-700 dark:text-gray-300">
              Years:
            </span>
            <span className="ml-2 text-lg text-gray-900 dark:text-gray-100">
              {remainingTime.years}
            </span>
          </div>
          <div className="flex items-center">
            <span className="text-lg font-medium text-gray-700 dark:text-gray-300">
              Months:
            </span>
            <span className="ml-2 text-lg text-gray-900 dark:text-gray-100">
              {remainingTime.months}
            </span>
          </div>
          <div className="flex items-center">
            <span className="text-lg font-medium text-gray-700 dark:text-gray-300">
              Days:
            </span>
            <span className="ml-2 text-lg text-gray-900 dark:text-gray-100">
              {remainingTime.days}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RemainingPage;
