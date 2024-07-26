import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/Layout";
import Signin from "./pages/Signin";
import Checkin from "./pages/Checkin";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      ),
      children: [
        {
          path: "/",
          element: <Dashboard />,
        },
        {
          path: "/check-in",
          element: <Checkin />,
        },
      ],
    },
    {
      path: "/signin",
      element: (
        <PublicRoute>
          <Signin />
        </PublicRoute>
      ),
    },
  ]);
  return <RouterProvider router={router} />;
};

export default App;
