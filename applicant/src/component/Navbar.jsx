import React from "react";
import { Link, useLocation } from "react-router-dom";
import { SUBTITLE, TITLE } from "../utils";
import Logo from "../assets/image/algo.png";

const Navbar = () => {
  const location = useLocation();

  const getLinkClasses = (path) => {
    return location.pathname === path
      ? "block py-2 px-2 max-md:px-0 rounded md:bg-transparent md:p-0 text-white hover:text-white"
      : "block py-2 px-3 text-slate-300 rounded hover:font-bb hover:text-gray-100 md:p-0 ";
  };

  return (
    <div className="sticky w-full top-0 z-50">
      <nav className="bg-blue-900 border-gray-200 dark:bg-gray-900 shadow-sm font-rb border-b-4 border-b-yellow-600">
        <div className="max-w-screen-2xl flex flex-wrap items-center justify-between mx-auto py-2 px-4">
          <Link
            to="/"
            className="flex items-center hover:text-white space-x-3 rtl:space-x-reverse text-white"
          >
            <img
              src={Logo}
              className="w-20 h-20 max-md:w-12 max-md:h-12 max-sm:w-8 max-sm:h-8"
            />
            <div className="flex flex-col">
              <p className="text-2xl max-md:text-lg max-sm:text-md font-titl">
                {TITLE}
              </p>
              <p className="text-lg max-md:text-md max-sm:text-sm font-titl">
                {SUBTITLE}
              </p>
            </div>
          </Link>
          <div className="hidden w-full md:block md:w-auto" id="navbar-default">
            <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-transparent md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0">
              <li>
                <Link to="/" className={getLinkClasses("/")}>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/apply" className={getLinkClasses("/apply")}>
                  Apply
                </Link>
              </li>
              <li>
                <Link to="/check" className={getLinkClasses("/check")}>
                  Check
                </Link>
              </li>
            </ul>
          </div>
          <div
            className="block sticky top-0 w-full md:hidden md:w-auto"
            id="navbar-default"
          >
            <ul className="font-medium flex md:p-0 rounded-lg bg-transparent md:flex-row md:space-x-8 rtl:space-x-reverse">
              <li>
                <Link to="/" className={getLinkClasses("/")}>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/apply" className={getLinkClasses("/apply")}>
                  Apply
                </Link>
              </li>
              <li>
                <Link to="/check" className={getLinkClasses("/check")}>
                  Check
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
