import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Apply from './Apply';
import Layout from './component/Layout';
import DashBoard from './pages/DashBoard';
import CheckPage from './pages/CheckPage';
import Confirmation from './pages/Confirmation';
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
          element: <Apply />,
        },
        {
          path: "/check",
          element: <CheckPage />,
        },
        {
          path: "/confirmation",
          element: <Confirmation />,
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
