import React from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { FaUniversity, FaBuilding, FaListUl } from "react-icons/fa";
import { IoIosCreate } from "react-icons/io";
import { FiEdit } from "react-icons/fi";

import Logo from "../assets/images/algo.png";

const Sidebar = () => {
  // const auth = useSelector((state) => state.auth.user.role_based);
  const user = useSelector((state) => state.auth.user);
  const sidebarLinks = [
    {
      to: "/d/add/department",
      label: "Add Department",
      icon: <FaUniversity />,
    },
    {
      to: "/add/department/office",
      label: "Add Officer",
      icon: <FaBuilding />,
    },
    {
      to: "/application/list",
      label: "Application List",
      icon: <FaListUl />,
    },
    {
      to: `/edit-pro/${user.id}`,
      label: "Edit Profile",
      icon: <FiEdit />,
    },
    {
      to: `/create-user-aastu`,
      label: "Create Student",
      icon: <IoIosCreate />,
    },
  ];
  const sidebarLinksDepartment = [
    {
      to: "/d/application/list",
      label: "Application List",
      icon: <FaListUl />,
    },
    {
      to: `/edit-pro/${user.id}`,
      label: "Edit Profile",
      icon: <FiEdit />,
    },
  ];

  const navLists =
    user.role_based === "Department" ? sidebarLinksDepartment : sidebarLinks;

  return (
    <div className="sticky top w-64 font-bb bg-white border-gray-200 dark:bg-gray-900 border-r h-full p-4 md:w-20 md:p-2 lg:w-64 lg:p-4">
      <ul>
        <li className="mb-4">
          <NavLink
            to="/"
            className="flex items-center justify-center py-2 px-4 bg-slate-100 rounded text-blue-500 hover:bg-slate-100 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white"
          >
            <img src={Logo} className="mr-4 h-40 w-full" alt="Logo" />
            <span className="hidden md:inline lg:inline"></span>
          </NavLink>
        </li>
        {navLists.map((link, index) => (
          <li key={index} className="mb-4">
            <NavLink
              to={link.to}
              className={({ isActive }) =>
                isActive
                  ? "flex items-center py-2 px-4 bg-slate-100 rounded text-blue-500 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white"
                  : "flex items-center py-2 px-4 rounded hover:bg-slate-100 dark:hover:bg-gray-700 dark:text-white"
              }
              activeClassName="bg-slate-100 text-blue-500 dark:bg-gray-800 dark:text-white"
            >
              <span className="mr-4">{link.icon}</span>
              <span className="hidden md:inline lg:inline font-semibold">
                {link.label}
              </span>
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
