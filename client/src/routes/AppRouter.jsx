import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";

import Login from "../pages/auth/Login.jsx";
import Register from "../pages/auth/Register.jsx";
import Dashboard from "../pages/user/Dashboard.jsx";
import Manager from "../pages/manager/Manager.jsx";
import Navbar from "../component/Navbar.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";

// Layout with Navbar - 
const AppLayout = () => (
  <>
    <Navbar />
    <Outlet />
  </>
);

const router = createBrowserRouter([
  // Public routes - no navbar
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },

  // Authenticated routes - navbar shown
  {
    element: <AppLayout />,
    children: [
      // User only
      {
        path: "/dashboard",
        element: (
          <ProtectedRoute allowedRole="user">
            <Dashboard />
          </ProtectedRoute>
        ),
      },

      // Manager only
      {
        path: "/manager",
        element: (
          <ProtectedRoute allowedRole="manager">
            <Manager />
          </ProtectedRoute>
        ),
      },
    ],
  },

  // Fallback
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    path: "*",
    element: <Navigate to="/login" replace />,
  },
]);

export default router;