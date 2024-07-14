import React from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const auth = useSelector((state) => state.auth.user.role_based)
  const sidebarLinks = [
    {
      to: "/d/add/department",
      label: "Add Department",
    },
    {
      to: "/add/department/office",
      label: "Add Department Office",
    },
    {
      to: "/application/list",
      label: "Application List",
    },
  ];
    const sidebarLinksDepartment = [
      {
        to: "/d/application/list",
        label: "Application List",
      },
    ];

    let navLists;

    if(auth === 'Department') {
      navLists = sidebarLinksDepartment
    }else{
      navLists = sidebarLinks
    }



  return (
    <div className="w-64 bg-white border-gray-200 dark:bg-gray-900 shadow-md text-white h-full p-4">
      <ul>
        {navLists.map((link, index) => (
          <li key={index} className="mb-4">
            <NavLink
              to={link.to}
              className={({ isActive }) =>
                isActive
                  ? "block py-2 px-4 bg-slate-100 rounded"
                  : "block py-2 px-4 hover:bg-slate-100 rounded"
              }
            >
              {link.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
