import { createBrowserRouter } from "react-router-dom";
import HomeLayout from "../Layout/HomeLayout";
import ErrorPage from "../Pages/ErrorPage";
import Stats from "../Pages/Stats";
import Home from "../Pages/Home";
import Login from "../Pages/Login";
import Register from "../Pages/Register";
import DashboardLayout from "../Layout/DashboardLayout";
import DashboardHome from "../Pages/DashboardHome";
import History from "../Pages/History";
import Profile from "../Pages/Profile";
import LinkStats from "../Pages/LinkStats";
import AdminLinks from "../Pages/AdminLinks";
import PrivateRoute from "./PrivateRoute"

export const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayout></HomeLayout>,
    children: [
      {
        path: "/",
        element: <Home></Home>,
      },
      {
        path: "/stats/:alias",
        element: <PrivateRoute>
          <Stats></Stats>
        </PrivateRoute>,
      },
      {
        path: "/register",
        element: <Register></Register>,
      },
      {
        path: "/login",
        element: <Login></Login>,
      },
      {
        path: "/register",
        element: <Register></Register>,
      },
      {
        path: "/login",
        element: <Login></Login>,
      }
    ]
  },
  {
    path: "/dashboard",
    element: <PrivateRoute>
      <DashboardLayout></DashboardLayout>
    </PrivateRoute>,
    children: [
      {
        path: "/dashboard",
        element: <DashboardHome></DashboardHome>,
      },
      {
        path: "/dashboard/history",
        element:<History></History>
      },
      {
        path: "/dashboard/profile",
        element: <Profile></Profile>
      },
      {
        path: "/dashboard/stats/:alias",
        element: <LinkStats></LinkStats>
      },
      {
        path: "admin/links",
        element: <AdminLinks></AdminLinks>
      }
    ]
  },

  {
    path: '*',
    element: <ErrorPage></ErrorPage>,
  }
])