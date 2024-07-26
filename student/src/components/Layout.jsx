import React from "react";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";

const Layout = () => {
  return (
    <div className="dark:bg-gray-900 min-h-screen">
      <Toaster />
      <Navbar />
      <main className="overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;