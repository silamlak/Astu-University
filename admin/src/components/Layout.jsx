import React from 'react'
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { Outlet } from "react-router-dom";
import { useSelector } from 'react-redux';

const Layout = () => {
  const auth = useSelector((state) => state.auth.user);
console.log(auth)
  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex flex-grow">
        <Sidebar />
        <main className="flex-grow p-4 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout
