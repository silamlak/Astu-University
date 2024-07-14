import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Dashboard from "./pages/Dashboard/Dashboard";
import Signin from "./pages/Signin";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import AddDepartmentOffice from "./pages/AddDepartmentOffice";
import AddDepartment from "./pages/AddDepartment";
import ApplicationTable from "./pages/ApplicationTable";
import ApplicationListPage from "./pages/DepartmentPages/ApplicationListPage";
import Layout from "./components/Layout";

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <ProtectedRoute
          element={Layout}
          allowedRoles={["Department", "College"]}
        />
      ),
      children: [
        {
          path: "/",
          element: (
            <ProtectedRoute
              element={Dashboard}
              allowedRoles={["College", "Department"]}
            />
          ),
        },
        {
          path: "/add/department/office",
          element: (
            <ProtectedRoute
              element={AddDepartmentOffice}
              allowedRoles={["College"]}
            />
          ),
        },
        {
          path: "/application/list",
          element: (
            <ProtectedRoute
              element={ApplicationTable}
              allowedRoles={["College"]}
            />
          ),
        },
        {
          path: "/d/application/list",
          element: (
            <ProtectedRoute
              element={ApplicationListPage}
              allowedRoles={["Department"]}
            />
          ),
        },
        {
          path: "/d/add/department",
          element: (
            <ProtectedRoute
              element={AddDepartment}
              allowedRoles={["College"]}
            />
          ),
        },
      ],
    },
    {
      path: "/signin",
      element: <PublicRoute element={Signin} />,
    },
  ]);

  return <RouterProvider router={router} />;
};

export default App;
