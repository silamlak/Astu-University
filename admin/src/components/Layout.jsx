import React from 'react'
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { Outlet } from "react-router-dom";
import { useSelector } from 'react-redux';
import { Toaster } from "react-hot-toast";

const Layout = () => {
  const auth = useSelector((state) => state.auth.user);
console.log(auth)
  return (
    <div className="flex h-screen">
      <Toaster />
      <Sidebar />
      <div className="flex flex-col flex-grow">
        <Navbar />
        <main className="flex-grow overflow-auto bg-slate-50 dark:bg-gray-900">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout
