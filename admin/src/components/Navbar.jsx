import React from "react";
import { useDispatch } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { logout } from "../api/features/auth";
import { FaSignOutAlt, FaHome } from "react-icons/fa";
import Logo from "../assets/images/algo.png";

const Navbar = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    dispatch(logout());
  };

  const getLinkClasses = (path) => {
    return location.pathname === path
      ? "block py-2 px-3 bg-indigo-500 rounded md:bg-transparent text-blue-500 md:p-0 dark:text-white md:dark:text-indigo-500"
      : "block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-indigo-500 md:p-0 dark:text-white md:dark:hover:text-indigo-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent";
  };

  return (
    <div className="sticky top-0">
      <nav className="bg-white border-gray-200 dark:bg-gray-900 shadow-lg transition-colors duration-200">
        <div className="flex flex-wrap items-center justify-between mx-auto p-4">
          <Link
            to="/"
            className="flex items-center space-x-3 rtl:space-x-reverse"
          >
            {/* <img src={Logo} alt="Logo" className="w-14 h-14" />
            <span className="text-xl font-semibold text-gray-900 dark:text-white">
              Home
            </span> */}
          </Link>
          <div className="hidden w-full md:block md:w-auto" id="navbar-default">
            <ul className="font-medium flex flex-col md:p-0 border-gray-100 rounded-lg md:flex-row">
              <li
                className="flex items-center py-1 cursor-pointer hover:text-slate-900 dark:hover:text-white"
                onClick={handleLogout}
              >
                <FaSignOutAlt className="mr-2" />
                Logout
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
