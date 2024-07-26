import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Dashboard from "./pages/Dashboard/Dashboard";
import Signin from "./pages/Signin";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import AddDepartmentOffice from "./pages/collegePage/AddDepartmentOffice";
import AddDepartment from "./pages/collegePage/AddDepartment";
import ApplicationTable from "./pages/collegePage/ApplicationTable";
import ApplicationListPage from "./pages/DepartmentPages/ApplicationListPage";
import DepartmentDashboard from "./pages/DepartmentPages/DepartmentDashboard";
import Layout from "./components/Layout";
import CreateStudent from "./pages/collegePage/CreateStudent";
import EditProfile from "./pages/EditProfile";
import { useSelector } from "react-redux";
import CollegeDashboard from "./pages/collegePage/CollegeDashboard";

const App = () => {
  const auth = useSelector((state) => state.auth.user);
  console.log(auth);
  let userDashboard;
  let allowed;
  if (auth?.role_based === "College") {
    userDashboard = CollegeDashboard;
    allowed = "College";
  } else {
    userDashboard = DepartmentDashboard;
    allowed = "Department";
  }
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
            <ProtectedRoute element={userDashboard} allowedRoles={[allowed]} />
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
        {
          path: "/create-user-aastu",
          element: (
            <ProtectedRoute
              element={CreateStudent}
              allowedRoles={["College"]}
            />
          ),
        },
        {
          path: "/edit-pro/:id",
          element: (
            <ProtectedRoute
              element={EditProfile}
              allowedRoles={["College", "Department"]}
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
