import React from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { FaUniversity, FaBuilding, FaListUl } from "react-icons/fa";
import Logo from '../assets/images/algo.png'
const Sidebar = () => {
  const auth = useSelector((state) => state.auth.user.role_based);
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
  ];
  const sidebarLinksDepartment = [
    {
      to: "/d/application/list",
      label: "Application List",
      icon: <FaListUl />,
    },
  ];

  const navLists =
    auth === "Department" ? sidebarLinksDepartment : sidebarLinks;

  return (
    <div className="sticky top w-64 font-bb bg-white border-gray-200 dark:bg-gray-900 border-r h-full p-4 md:w-20 md:p-2 lg:w-64 lg:p-4">
      <ul>
        <li className="mb-4">
          <NavLink
            to='/'
            className="flex items-center justify-center py-2 px-4 bg-slate-100 rounded text-blue-500 hover:bg-slate-100 "
          >
            <img src={Logo} className="mr-4 h-40 w-full"/>
            <span className="hidden md:inline lg:inline"></span>
          </NavLink>
        </li>
        {navLists.map((link, index) => (
          <li key={index} className="mb-4">
            <NavLink
              to={link.to}
              className={({ isActive }) =>
                isActive
                  ? "flex items-center py-2 px-4 bg-slate-100 rounded text-blue-500"
                  : "flex items-center py-2 px-4 hover:bg-slate-100 rounded"
              }
            >
              <span className="mr-4">{link.icon}</span>
              <span className="hidden md:inline lg:inline font-semibold">{link.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
