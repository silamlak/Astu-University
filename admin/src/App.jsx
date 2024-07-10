import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Dashboard from './pages/Dashboard/Dashboard'
import Signin from './pages/Signin'
import ProtectedRoute from './components/ProtectedRoute'
import PublicRoute from './components/PublicRoute'
import AddDepartmentOffice from './pages/AddDepartmentOffice'
import AddDepartment from './pages/AddDepartment'
import ApplicationTable from './pages/ApplicationTable'

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <ProtectedRoute element={Dashboard} allowedRoles={["Department"]} />
      ),
    },
    {
      path: "/add/department/office",
      element: (
        <ProtectedRoute
          element={AddDepartmentOffice}
          allowedRoles={["Department"]}
        />
      ),
    },
    {
      path: "/application/list",
      element: (
        <ProtectedRoute
          element={ApplicationTable}
          allowedRoles={["Department"]}
        />
      ),
    },
    {
      path: "/add/department",
      element: (
        <ProtectedRoute element={AddDepartment} allowedRoles={["Department"]} />
      ),
    },
    {
      path: "/signin",
      element: <PublicRoute element={Signin} />,
    },
  ]);

  return (
    <RouterProvider router={router} />
  );
}

export default App
