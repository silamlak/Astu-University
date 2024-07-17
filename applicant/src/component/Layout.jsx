import React from 'react'
import Navbar from './Navbar';
import { Outlet } from "react-router-dom";
import Footbar from './Footbar';

const Layout = () => {
  return (
    <div className="font-rb min-h-screen">
      <Navbar />
      <div>
        <div className="mx-autom bg-white">
          <Outlet />
        </div>
        <Footbar />
      </div>
    </div>
  );
}

export default Layout
