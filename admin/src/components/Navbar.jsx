import React from "react";
import { useDispatch } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { logout } from "../api/features/auth";

const Navbar = () => {
      const location = useLocation();
      const dispatch = useDispatch()

      const handleLogout = async () => {
        dispatch(logout())
      }

      const getLinkClasses = (path) => {
        return location.pathname === path
          ? "block py-2 px-3 bg-indigo-500 rounded md:bg-transparent text፟-blue-500 md:p-0 dark:text-white md:dark:text-indigo-500"
          : "block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-indigo-500 md:p-0 dark:text-white md:dark:hover:text-indigo-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent";
      };

  return (
    <div className="sticky top-0">
      <nav className="bg-white border-gray-200 dark:bg-gray-900 shadow-sm">
        <div className=" flex flex-wrap items-center justify-between mx-auto p-4">
          <Link
            to="/"
            className="flex items-center space-x-3 rtl:space-x-reverse"
          >
            ASTU
          </Link>
          <div className="hidden w-full md:block md:w-auto" id="navbar-default">
            <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
              {/* <li>
                <Link to="/" className={getLinkClasses("/")}>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/apply" className={getLinkClasses("/apply")}>
                  Apply
                </Link>
              </li> */}
              <li>
                <button onClick={handleLogout} className={getLinkClasses("/check")}>
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
