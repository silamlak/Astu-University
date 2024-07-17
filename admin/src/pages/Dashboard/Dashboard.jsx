import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const auth = useSelector((state) => state.auth.user);
  console.log(auth);

  return (
    <div className="font-bb min-h-screen p-4 bg-white dark:bg-gray-900 transition-colors">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white transition-colors">
        Dashboard
      </h2>
      <p className="text-gray-700 dark:text-gray-300 transition-colors">
        Welcome to the {auth.role_based} dashboard.
      </p>
    </div>
  );
};

export default Dashboard;
