import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Dashboard from './Dashboard';
import Layout from './component/Layout';
import DashBoard from './pages/DashBoard';
import CheckPage from './pages/CheckPage';
const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <DashBoard />,
        },
        {
          path: "/apply",
          element: <Dashboard />,
        },
        {
          path: "/check",
          element: <CheckPage />,
        },
        // Add more routes as needed
      ],
    },
  ]);
  return (
    <RouterProvider router={router}/>
  );
}

export default App
