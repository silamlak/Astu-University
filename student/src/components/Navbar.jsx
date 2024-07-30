import React, { useState } from "react";
import { GrDocumentUpdate } from "react-icons/gr";
import { CiMenuBurger } from "react-icons/ci";
import Logo from "../assets/algo.png";
import Switcher from "./Switcher";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../api/features/authSlice";

const Navbar = () => {
  const dispatch = useDispatch()
  const [toggleMenu, setToggleMenu] = useState(false);

  return (
    <nav className="w-full bg-slate-50 dark:bg-gray-900 shadow-md">
      <div className="max-w-[1600px] px-4 mx-auto">
        <div className="flex mx-auto justify-between">
          {/* Primary menu and logo */}
          <div className="flex items-center gap-16 my-2">
            {/* logo */}
            <div>
              <Link
                to="/"
                className="flex gap-1 font-bold text-gray-700 dark:text-white items-center"
              >
                <img src={Logo} className="w-16 h-16" alt="Logo" />
              </Link>
            </div>
            {/* primary */}
            <div className="hidden lg:flex gap-8">
              <Link
                to="/remaining-data"
                className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Remaining Year
              </Link>
              <Link
                to="/check-in"
                className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Check-In
              </Link>
            </div>
          </div>
          {/* secondary */}
          <div className="flex gap-6">
            <div className="flex items-center gap-6">
              <div className="hidden lg:flex items-center gap-2">
                <Switcher />
              </div>
              <button
                onClick={() => dispatch(logout())}
                className="hidden bg-slate-50 dark:bg-gray-900 text-gray-700 dark:text-gray-100 lg:flex items-center shadow-md"
              >
                Logout
              </button>
            </div>
            {/* Mobile navigation toggle */}
            <div className="lg:hidden flex items-center  bg-slate-50 dark:bg-gray-900">
              <button
                className="dark:bg-gray-900"
                onClick={() => setToggleMenu(!toggleMenu)}
              >
                <CiMenuBurger className="h-6 text-gray-700 dark:text-gray-100" />
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* mobile navigation */}
      <div
        className={`fixed z-40 w-full bg-gray-100 dark:bg-gray-800 overflow-hidden flex flex-col lg:hidden gap-12 origin-top duration-700 ${
          !toggleMenu ? "h-0" : "h-full"
        }`}
      >
        <div className="px-8">
          <div className="flex flex-col gap-8 font-bold tracking-wider">
            <Link
              to="/remaining-data"
              className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Remaining Year
            </Link>
            <Link
              to="/check-in"
              className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Check-In
            </Link>
            <div className="flex gap-2 items-center text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
              <Switcher />
            </div>
            <button
              onClick={() => dispatch(logout())}
              className="bg-slate-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white shadow-md"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
